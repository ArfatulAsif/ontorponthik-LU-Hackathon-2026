import { NativeModules } from "react-native";
import { decodeBase64 } from "tweetnacl-util";

import { parseMeshBeacon } from "../mesh/meshBeacon";
import { DD_MESH_SERVICE_UUID, uuidMatches } from "../mesh/meshConstants";

const PRUNE_MS = 90000;
/** Auto GATT retry spacing (matches periodic cycle). */
const GATT_THROTTLE_MS = 16000;
/** Restart BLE scan + nudge candidate syncs every ~17s. */
const SCAN_CYCLE_MS = 17000;
const MAX_PEER_ENTRIES = 100;

/**
 * Scan for Digital Delta peers (advertised service UUID, mesh beacon, or `DDMesh*` name),
 * connect periodically, and run {@link BleMeshService#exchangeGossipOnDevice}.
 */
export class MeshRadarService {
  /**
   * @param {{
   *   bleMesh: import("./SyncEngine").BleMeshService | null,
   *   localLedger: import("../database/LocalLedger").LocalLedger,
   *   getUserIdentity: () => object | null,
   *   roleLabel: (role: number) => string,
   *   onUpdate: (state: MeshRadarUiState) => void,
   * }} opts
   */
  constructor(opts) {
    this.bleMesh = opts.bleMesh;
    this.localLedger = opts.localLedger;
    this.getUserIdentity = opts.getUserIdentity;
    this.roleLabel = opts.roleLabel;
    this.onUpdate = opts.onUpdate;
    this.manager = opts.bleMesh?.getManager?.() ?? null;
    /** @type {Map<string, PeerEntry>} */
    this.peers = new Map();
    this.connecting = new Set();
    /** @type {Map<string, number>} */
    this.lastGattAttempt = new Map();
    this.stopped = false;
    this.scanning = false;
    this.blePoweredOn = false;
    /** @type {ReturnType<import('react-native-ble-plx').BleManager['onStateChange']> | null} */
    this.stateSubscription = null;
    this.pruneTimer = null;
    /** @type {ReturnType<typeof setInterval> | null} */
    this.scanCycleTimer = null;
    /** @type {string[]} */
    this.announcements = [];
    this.sessionAnnounced = new Set();
  }

  async start() {
    this.stopped = false;
    if (!NativeModules.BlePlx || !this.manager) {
      this.emit({
        nativeBle: false,
        blePoweredOn: false,
        scanning: false,
        peers: [],
        statusMessage:
          "Mesh radar needs a dev/production build with BLE (Expo Go has no react-native-ble-plx).",
      });
      return;
    }

    const { State } = require("react-native-ble-plx");
    const s = await this.manager.state();
    this.blePoweredOn = s === State.PoweredOn;

    if (!this.blePoweredOn) {
      this.emit({
        nativeBle: true,
        blePoweredOn: false,
        scanning: false,
        peers: [],
        statusMessage: `Bluetooth is ${String(s)}. Turn it on to scan for nearby nodes.`,
      });
      this.stateSubscription?.remove();
      this.stateSubscription = this.manager.onStateChange((newState) => {
        if (newState === State.PoweredOn && !this.stopped) {
          this.stateSubscription?.remove();
          this.stateSubscription = null;
          void this.start();
        }
      });
      return;
    }

    await this.beginScan();
  }

  async beginScan() {
    if (this.stopped || !this.manager) return;

    this.stateSubscription?.remove();
    this.stateSubscription = null;

    if (this.pruneTimer) {
      clearInterval(this.pruneTimer);
      this.pruneTimer = null;
    }
    if (this.scanCycleTimer) {
      clearInterval(this.scanCycleTimer);
      this.scanCycleTimer = null;
    }

    try {
      await this.manager.stopDeviceScan();
    } catch {
      /* ignore */
    }

    this.manager.startDeviceScan(
      null,
      { allowDuplicates: true },
      (error, device) => {
        if (this.stopped || error || !device) return;
        this.onDeviceFound(device);
      }
    );
    this.scanning = true;
    this.emit({
      nativeBle: true,
      blePoweredOn: true,
      scanning: true,
      peers: this.peersArray(),
      statusMessage:
        "Listing nearby BLE devices. Digital Delta peers (signature) auto-sync; others: tap Sync to try.",
    });

    this.pruneTimer = setInterval(() => this.pruneAndEmit(), 4000);
    this.scanCycleTimer = setInterval(() => {
      if (this.stopped) return;
      void this.runScanRefreshCycle();
    }, SCAN_CYCLE_MS);
  }

  stop() {
    this.stopped = true;
    if (this.pruneTimer) {
      clearInterval(this.pruneTimer);
      this.pruneTimer = null;
    }
    if (this.scanCycleTimer) {
      clearInterval(this.scanCycleTimer);
      this.scanCycleTimer = null;
    }
    this.stateSubscription?.remove();
    this.stateSubscription = null;
    try {
      this.manager?.stopDeviceScan();
    } catch {
      /* ignore */
    }
    this.scanning = false;
  }

  /**
   * @param {import('react-native-ble-plx').Device} device
   */
  isCandidate(device) {
    const uuids = device.serviceUUIDs;
    if (uuids?.length) {
      if (uuids.some((u) => uuidMatches(u, DD_MESH_SERVICE_UUID))) return true;
    }
    if (device.manufacturerData) {
      try {
        const raw = new Uint8Array(decodeBase64(device.manufacturerData));
        if (parseMeshBeacon(raw)) return true;
      } catch {
        /* ignore */
      }
    }
    const ln = device.localName || device.name;
    if (ln && String(ln).startsWith("DDMesh")) return true;
    return false;
  }

  /**
   * @param {import('react-native-ble-plx').Device} device
   */
  onDeviceFound(device) {
    const id = device.id;
    if (!id) return;

    const now = Date.now();
    const candidate = this.isCandidate(device);
    const bleLabel = device.name || device.localName || null;

    let beacon = null;
    if (device.manufacturerData) {
      try {
        const raw = new Uint8Array(decodeBase64(device.manufacturerData));
        beacon = parseMeshBeacon(raw);
      } catch {
        beacon = null;
      }
    }

    const prev = this.peers.get(id);
    const displayFromBle = bleLabel || prev?.bleLabel || null;
    const entry = {
      deviceId: id,
      rssi: device.rssi ?? prev?.rssi ?? null,
      lastSeen: now,
      beacon,
      displayName:
        beacon?.displayName ??
        prev?.displayName ??
        (displayFromBle || null),
      role: beacon?.role ?? prev?.role ?? null,
      gattSynced: prev?.gattSynced ?? false,
      lastError: prev?.lastError ?? null,
      isCandidate: candidate,
      bleLabel: displayFromBle,
    };
    this.peers.set(id, entry);
    this.evictPeersIfNeeded(MAX_PEER_ENTRIES);

    if (beacon && !this.sessionAnnounced.has(`beacon:${id}`)) {
      this.sessionAnnounced.add(`beacon:${id}`);
      this.pushAnnouncement(
        `${entry.displayName || "A peer"} (${this.roleLabel(
          entry.role ?? 0
        )}) is in range (beacon).`
      );
    }

    this.emit({
      nativeBle: true,
      blePoweredOn: this.blePoweredOn,
      scanning: this.scanning,
      peers: this.peersArray(),
      statusMessage:
        "Listing nearby BLE devices. Digital Delta peers (signature) auto-sync; others: tap Sync to try.",
    });

    if (candidate) this.maybeScheduleGatt(id);
  }

  evictPeersIfNeeded(max) {
    if (this.peers.size <= max) return;
    const sorted = Array.from(this.peers.entries())
      .filter(([id]) => !this.connecting.has(id))
      .sort((a, b) => a[1].lastSeen - b[1].lastSeen);
    while (this.peers.size > max && sorted.length) {
      const [evictId] = sorted.shift();
      if (!this.peers.has(evictId)) continue;
      this.peers.delete(evictId);
    }
  }

  async runScanRefreshCycle() {
    if (this.stopped || !this.manager) return;
    try {
      await this.manager.stopDeviceScan();
    } catch {
      /* ignore */
    }
    this.manager.startDeviceScan(
      null,
      { allowDuplicates: true },
      (error, device) => {
        if (this.stopped || error || !device) return;
        this.onDeviceFound(device);
      }
    );
    for (const [id, p] of this.peers) {
      if (p.isCandidate) {
        this.lastGattAttempt.delete(id);
        this.maybeScheduleGatt(id);
      }
    }
    this.emit({
      nativeBle: true,
      blePoweredOn: this.blePoweredOn,
      scanning: this.scanning,
      peers: this.peersArray(),
      statusMessage:
        "Scan refreshed (~17s). Nearby list updates; Digital Delta peers retry sync.",
    });
  }

  /**
   * User tapped "Sync" — try GATT gossip even if device is not a signature match.
   * @param {string} deviceId
   */
  requestManualSync(deviceId) {
    if (this.stopped || !this.manager || !this.bleMesh) return;
    if (this.connecting.has(deviceId)) return;
    void this.runGattSync(deviceId, { manual: true });
  }

  /** @param {string} line */
  pushAnnouncement(line) {
    this.announcements = [...this.announcements.slice(-15), line];
  }

  /** @param {string} deviceId */
  maybeScheduleGatt(deviceId) {
    const now = Date.now();
    const last = this.lastGattAttempt.get(deviceId) ?? 0;
    if (now - last < GATT_THROTTLE_MS) return;
    this.lastGattAttempt.set(deviceId, now);
    if (this.connecting.has(deviceId) || !this.bleMesh) return;
    queueMicrotask(() => {
      void this.runGattSync(deviceId, {});
    });
  }

  /**
   * @param {string} deviceId
   * @param {{ manual?: boolean }} opt
   */
  async runGattSync(deviceId, opt = {}) {
    if (this.stopped || !this.manager || !this.bleMesh) return;
    if (this.connecting.has(deviceId)) return;
    if (opt.manual) {
      this.lastGattAttempt.set(deviceId, Date.now());
    }
    this.connecting.add(deviceId);
    this.emitConnecting();
    try {
      const connected = await this.manager.connectToDevice(deviceId, {
        timeout: 12000,
      });
      const result = await this.bleMesh.exchangeGossipOnDevice(connected);
      const entry = this.peers.get(deviceId);
      if (entry) {
        entry.gattSynced = !!result.ok;
        entry.lastError = result.ok ? null : result.reason ?? "sync_failed";
        if (result.ok && result.incomingResults?.length) {
          const me = this.getUserIdentity()?.nodeId;
          for (const r of result.incomingResults) {
            if (!r.nodeId || r.nodeId === me) continue;
            const row = await this.localLedger.getIdentityRow(r.nodeId);
            if (row) {
              entry.displayName = row.display_name || entry.displayName;
              entry.role = row.role ?? entry.role;
              const key = `id:${r.nodeId}`;
              if (!this.sessionAnnounced.has(key)) {
                this.sessionAnnounced.add(key);
                this.pushAnnouncement(
                  `${row.display_name || r.nodeId} (${this.roleLabel(
                    row.role
                  )}) is in your range now.`
                );
              }
            }
          }
        }
        this.peers.set(deviceId, entry);
      }
    } catch (e) {
      const entry = this.peers.get(deviceId);
      if (entry) {
        entry.lastError = e?.message ? String(e.message) : String(e);
        entry.gattSynced = false;
        this.peers.set(deviceId, entry);
      }
    } finally {
      try {
        await this.manager.cancelDeviceConnection(deviceId);
      } catch {
        /* ignore */
      }
      this.connecting.delete(deviceId);
      this.emit({
        nativeBle: true,
        blePoweredOn: this.blePoweredOn,
        scanning: this.scanning,
        peers: this.peersArray(),
        statusMessage:
          "Listing nearby BLE devices. Digital Delta peers (signature) auto-sync; others: tap Sync to try.",
      });
    }
  }

  pruneAndEmit() {
    const now = Date.now();
    for (const [id, p] of this.peers) {
      if (now - p.lastSeen > PRUNE_MS) this.peers.delete(id);
    }
    this.emit({
      nativeBle: true,
      blePoweredOn: this.blePoweredOn,
      scanning: this.scanning,
      peers: this.peersArray(),
      statusMessage:
        "Listing nearby BLE devices. Digital Delta peers (signature) auto-sync; others: tap Sync to try.",
    });
  }

  peersArray() {
    return Array.from(this.peers.values())
      .filter((p) => Date.now() - p.lastSeen < PRUNE_MS + 2000)
      .sort((a, b) => {
        const ca = a.isCandidate ? 1 : 0;
        const cb = b.isCandidate ? 1 : 0;
        if (cb !== ca) return cb - ca;
        return (b.rssi ?? -999) - (a.rssi ?? -999);
      })
      .map((p) => ({
        deviceId: p.deviceId,
        rssi: p.rssi,
        lastSeen: p.lastSeen,
        displayName: p.displayName,
        role: p.role,
        roleLabel: p.role != null ? this.roleLabel(p.role) : null,
        gattSynced: p.gattSynced,
        lastError: p.lastError,
        fromBeacon: !!p.beacon,
        isCandidate: p.isCandidate,
        bleLabel: p.bleLabel,
      }));
  }

  emitConnecting() {
    this.onUpdate({
      nativeBle: true,
      blePoweredOn: this.blePoweredOn,
      scanning: this.scanning,
      peers: this.peersArray(),
      statusMessage:
        "Listing nearby BLE devices. Digital Delta peers (signature) auto-sync; others: tap Sync to try.",
      announcements: [...this.announcements],
      connectingDeviceIds: Array.from(this.connecting),
    });
  }

  /**
   * @param {Omit<MeshRadarUiState, 'announcements' | 'connectingDeviceIds'> & { statusMessage?: string }} partial
   */
  emit(partial) {
    this.onUpdate({
      nativeBle: partial.nativeBle,
      blePoweredOn: partial.blePoweredOn,
      scanning: partial.scanning,
      peers: partial.peers ?? this.peersArray(),
      statusMessage: partial.statusMessage ?? "",
      announcements: [...this.announcements],
      connectingDeviceIds: Array.from(this.connecting),
    });
  }
}

/**
 * @typedef {object} PeerEntry
 * @property {string} deviceId
 * @property {number | null} rssi
 * @property {number} lastSeen
 * @property {ReturnType<typeof parseMeshBeacon>} beacon
 * @property {string | null} displayName
 * @property {number | null} role
 * @property {boolean} gattSynced
 * @property {string | null} lastError
 * @property {boolean} isCandidate
 * @property {string | null} bleLabel
 */

/**
 * @typedef {object} MeshRadarUiState
 * @property {boolean} nativeBle
 * @property {boolean} blePoweredOn
 * @property {boolean} scanning
 * @property {object[]} peers
 * @property {string} statusMessage
 * @property {string[]} announcements
 * @property {string[]} connectingDeviceIds
 */

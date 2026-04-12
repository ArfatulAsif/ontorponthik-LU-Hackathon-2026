/**
 * Gossip sync: framed `SyncEnvelope` batches + BLE hook.
 * Proto `SyncEnvelope` carries one `registration` at a time; multiple identities use length-prefixed frames.
 */

import { BleManager } from "react-native-ble-plx";

function loadProtoRoot() {
  return require("../proto/bundle.js");
}

/**
 * @param {Uint8Array} u8
 * @param {number} offset
 */
function readUInt32BE(u8, offset) {
  return (
    ((u8[offset] << 24) |
      (u8[offset + 1] << 16) |
      (u8[offset + 2] << 8) |
      u8[offset + 3]) >>>
    0
  );
}

/**
 * @param {Uint8Array} u8
 * @param {number} offset
 * @param {number} value
 */
function writeUInt32BE(u8, offset, value) {
  u8[offset] = (value >>> 24) & 0xff;
  u8[offset + 1] = (value >>> 16) & 0xff;
  u8[offset + 2] = (value >>> 8) & 0xff;
  u8[offset + 3] = value & 0xff;
}

/**
 * @param {Uint8Array[]} encodedEnvelopes
 * @returns {Uint8Array}
 */
function frameEncodedEnvelopes(encodedEnvelopes) {
  let total = 0;
  for (const buf of encodedEnvelopes) total += 4 + buf.length;
  const out = new Uint8Array(total);
  let o = 0;
  for (const buf of encodedEnvelopes) {
    writeUInt32BE(out, o, buf.length);
    o += 4;
    out.set(buf, o);
    o += buf.length;
  }
  return out;
}

export class SyncEngine {
  /**
   * @param {{ getUserIdentity: () => object | null, localLedger: import('../database/LocalLedger').LocalLedger }} deps
   */
  constructor({ getUserIdentity, localLedger }) {
    this.getUserIdentity = getUserIdentity;
    this.localLedger = localLedger;
  }

  /**
   * Local user + all known identities, each as its own `SyncEnvelope` (sender = us, payload = identity).
   * @returns {Promise<Uint8Array>}
   */
  async buildFramedGossipBatch() {
    const root = loadProtoRoot();
    const { SyncEnvelope } = root.digitaldelta;
    const local = this.getUserIdentity();
    if (!local) {
      throw new Error("Identity not initialized; call IdentityService.initialize first");
    }

    const known = await this.localLedger.listAllIdentitiesAsMessages();
    const byNode = new Map();
    for (const id of known) byNode.set(id.nodeId, id);
    byNode.set(local.nodeId, local);

    const encoded = [];
    for (const identity of byNode.values()) {
      const env = SyncEnvelope.create({
        senderNodeId: local.nodeId,
        senderPublicKey: local.publicKey,
        registration: identity,
      });
      encoded.push(new Uint8Array(SyncEnvelope.encode(env).finish()));
    }
    return frameEncodedEnvelopes(encoded);
  }

  /**
   * @param {object | null} bleDevice — `react-native-ble-plx` Device (optional for simulation)
   * @param {Uint8Array} payload
   */
  async simulateBleSend(bleDevice, payload) {
    const id = bleDevice?.id ?? "(no-device)";
    if (__DEV__) {
      // Production: write `payload` to your GATT characteristic here.
      console.log(
        `[DigitalDelta][BLE] Simulated TX ${payload.byteLength} bytes → peer ${id}`
      );
    }
  }

  /**
   * @param {object | null} bleDevice
   * @returns {Promise<Uint8Array>} framed bytes that would be sent
   */
  async sync(bleDevice) {
    const framed = await this.buildFramedGossipBatch();
    await this.simulateBleSend(bleDevice, framed);
    return framed;
  }

  /**
   * Decode framed batch (or a single raw `SyncEnvelope`) and merge identities.
   * @param {Uint8Array | ArrayBuffer | number[]} buffer
   * @returns {Promise<{ nodeId: string, written: boolean }[]>}
   */
  async handleIncomingSync(buffer) {
    const root = loadProtoRoot();
    const { SyncEnvelope } = root.digitaldelta;

    const u8 =
      buffer instanceof Uint8Array
        ? buffer
        : new Uint8Array(buffer instanceof ArrayBuffer ? buffer : buffer);

    /** @type {{ nodeId: string, written: boolean }[]} */
    const results = [];
    let offset = 0;

    while (offset + 4 <= u8.length) {
      const len = readUInt32BE(u8, offset);
      offset += 4;
      if (len < 0 || offset + len > u8.length) {
        offset -= 4;
        break;
      }
      const slice = u8.subarray(offset, offset + len);
      offset += len;
      let env;
      try {
        env = SyncEnvelope.decode(slice);
      } catch {
        continue;
      }
      if (env.registration) {
        const written = await this.localLedger.upsertIdentity(env.registration);
        results.push({ nodeId: env.registration.nodeId, written });
      }
    }

    if (results.length === 0 && u8.length) {
      try {
        const env = SyncEnvelope.decode(u8);
        if (env.registration) {
          const written = await this.localLedger.upsertIdentity(env.registration);
          results.push({ nodeId: env.registration.nodeId, written });
        }
      } catch {
        /* not a single-message buffer */
      }
    }

    return results;
  }
}

/**
 * Thin wrapper: call {@link BleMeshService#onPeerConnected} after `connectToDevice`.
 */
export class BleMeshService {
  /**
   * @param {{ syncEngine: SyncEngine, bleManager?: BleManager }} opts
   */
  constructor({ syncEngine, bleManager }) {
    this.syncEngine = syncEngine;
    this.bleManager = bleManager ?? new BleManager();
  }

  getManager() {
    return this.bleManager;
  }

  /**
   * @param {import('react-native-ble-plx').Device} device
   */
  async onPeerConnected(device) {
    await device.discoverAllServicesAndCharacteristics();
    return this.syncEngine.sync(device);
  }
}

/**
 * @param {{ getUserIdentity: () => object | null, localLedger: import('../database/LocalLedger').LocalLedger }} deps
 */
export function createBleMeshService(deps) {
  const syncEngine = new SyncEngine(deps);
  const bleMesh = new BleMeshService({ syncEngine });
  return { syncEngine, bleMesh };
}

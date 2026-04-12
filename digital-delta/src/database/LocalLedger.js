import { openDatabaseAsync } from "expo-sqlite";
import { decodeBase64, encodeBase64 } from "tweetnacl-util";

/**
 * @param {object | null | undefined} meta
 * @returns {{ creatorNodeId: string, signatureB64: string, clock: { counters: Record<string, number> }, timestamp: number }}
 */
function meshMetaToStorable(meta) {
  if (!meta || typeof meta !== "object") {
    return {
      creatorNodeId: "",
      signatureB64: "",
      clock: { counters: {} },
      timestamp: 0,
    };
  }
  const ts = meta.timestamp;
  const tsNum =
    ts && typeof ts === "object" && typeof ts.toNumber === "function"
      ? ts.toNumber()
      : Number(ts) || 0;
  return {
    creatorNodeId: meta.creatorNodeId || "",
    signatureB64:
      meta.signature && meta.signature.length
        ? encodeBase64(meta.signature)
        : "",
    clock: { counters: { ...(meta.clock?.counters || {}) } },
    timestamp: tsNum,
  };
}

/** @param {object | null} o */
function meshMetaFromStorable(o) {
  if (!o) return null;
  const root = require("../proto/bundle.js");
  const { MeshMetadata, VectorClock } = root.digitaldelta;
  return MeshMetadata.create({
    creatorNodeId: o.creatorNodeId || "",
    signature: o.signatureB64
      ? new Uint8Array(decodeBase64(o.signatureB64))
      : new Uint8Array(),
    clock: VectorClock.create({ counters: { ...(o.clock?.counters || {}) } }),
    timestamp: o.timestamp,
  });
}

const DB_NAME = "digital_delta_ledger.db";

/**
 * @param {Uint8Array|number[]|Buffer} bytes
 * @returns {string}
 */
function bytesToBase64(bytes) {
  if (!bytes || !bytes.length) return "";
  const u8 = bytes instanceof Uint8Array ? bytes : new Uint8Array(bytes);
  return encodeBase64(u8);
}

/**
 * @param {object|null|undefined} meta
 * @returns {Record<string, number>}
 */
function metaClockToMap(meta) {
  if (!meta || !meta.clock || !meta.clock.counters) return {};
  return { ...meta.clock.counters };
}

/**
 * @param {Record<string, number>} a
 * @param {Record<string, number>} b
 * @returns {boolean} true iff `a` strictly dominates `b`
 */
function vectorClockStrictlyNewer(a, b) {
  const keys = new Set([...Object.keys(a), ...Object.keys(b)]);
  let anyGreater = false;
  for (const k of keys) {
    const av = a[k] ?? 0;
    const bv = b[k] ?? 0;
    if (av < bv) return false;
    if (av > bv) anyGreater = true;
  }
  return anyGreater;
}

/**
 * Local ledger using `expo-sqlite` (works in Expo Go). `react-native-sqlite-storage` is not linked in Expo Go and can trigger native "null value to object" errors.
 */
export class LocalLedger {
  constructor() {
    /** @type {import('expo-sqlite').SQLiteDatabase | null} */
    this.db = null;
  }

  async init() {
    if (this.db) return;
    this.db = await openDatabaseAsync(DB_NAME);
    await this.db.execAsync(`
      CREATE TABLE IF NOT EXISTS KnownIdentities (
        node_id TEXT PRIMARY KEY NOT NULL,
        role INTEGER NOT NULL,
        public_key_base64 TEXT NOT NULL,
        display_name TEXT,
        meta_json TEXT
      );
    `);
  }

  /**
   * @param {string} nodeId
   * @returns {Promise<{ node_id: string, role: number, public_key_base64: string, display_name: string | null, meta_json: string | null } | null>}
   */
  async getIdentityRow(nodeId) {
    await this.init();
    const row = await this.db.getFirstAsync(
      `SELECT node_id, role, public_key_base64, display_name, meta_json FROM KnownIdentities WHERE node_id = ? LIMIT 1;`,
      [nodeId]
    );
    return row ?? null;
  }

  /**
   * @param {object} identity — decoded `digitaldelta.UserIdentity` protobuf message
   * @returns {Promise<boolean>} whether a row was written
   */
  async upsertIdentity(identity) {
    await this.init();
    const nodeId = identity.nodeId;
    if (!nodeId) return false;

    const publicKeyB64 = bytesToBase64(identity.publicKey);
    const incomingClock = metaClockToMap(identity.meta);
    const metaJson = identity.meta
      ? JSON.stringify(meshMetaToStorable(identity.meta))
      : null;

    const existing = await this.getIdentityRow(nodeId);
    if (existing) {
      let existingClock = {};
      if (existing.meta_json) {
        try {
          const parsed = JSON.parse(existing.meta_json);
          existingClock = parsed.clock?.counters ? { ...parsed.clock.counters } : {};
        } catch {
          existingClock = {};
        }
      }
      const hasExistingClock = Object.keys(existingClock).length > 0;
      const hasIncomingClock = Object.keys(incomingClock).length > 0;
      if (hasExistingClock && hasIncomingClock) {
        if (!vectorClockStrictlyNewer(incomingClock, existingClock)) {
          return false;
        }
      } else if (!hasIncomingClock && hasExistingClock) {
        return false;
      }
    }

    await this.db.runAsync(
      `INSERT OR REPLACE INTO KnownIdentities (node_id, role, public_key_base64, display_name, meta_json)
       VALUES (?, ?, ?, ?, ?);`,
      [
        nodeId,
        identity.role ?? 0,
        publicKeyB64,
        identity.displayName ?? "",
        metaJson,
      ]
    );
    return true;
  }

  /**
   * @returns {Promise<object[]>} `digitaldelta.UserIdentity` protobuf messages
   */
  async listAllIdentitiesAsMessages() {
    await this.init();
    const root = require("../proto/bundle.js");
    const { UserIdentity } = root.digitaldelta;

    const rows = await this.db.getAllAsync(
      `SELECT node_id, role, public_key_base64, display_name, meta_json FROM KnownIdentities;`
    );
    const out = [];
    for (const row of rows) {
      let metaStorable = null;
      if (row.meta_json) {
        try {
          metaStorable = JSON.parse(row.meta_json);
        } catch {
          metaStorable = null;
        }
      }
      const pk = row.public_key_base64
        ? new Uint8Array(decodeBase64(row.public_key_base64))
        : new Uint8Array();
      out.push(
        UserIdentity.create({
          nodeId: row.node_id,
          role: row.role,
          displayName: row.display_name || "",
          publicKey: pk,
          meta: meshMetaFromStorable(metaStorable),
        })
      );
    }
    return out;
  }
}

export const localLedger = new LocalLedger();

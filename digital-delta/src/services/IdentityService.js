import nacl from "tweetnacl";
import { decodeBase64, encodeBase64 } from "tweetnacl-util";

import { localLedger } from "../database/LocalLedger";
import {
  readIdentitySecretBase64,
  resolveIdentityStorageBackend,
  writeIdentitySecretBase64,
} from "./identitySecureStorage";

/** Pick one value — matches `digitaldelta.Role` (excluding ROLE_UNSPECIFIED). */
export const SELECTABLE_ROLES = [
  { value: 1, label: "Field Volunteer" },
  { value: 2, label: "Supply Manager" },
  { value: 3, label: "Drone Operator" },
  { value: 4, label: "Camp Commander" },
  { value: 5, label: "Sync Admin" },
];

/** @type {{ keyPair: { publicKey: Uint8Array, secretKey: Uint8Array }, userIdentity: object | null, nodeId: string, publicKeyBase64: string, storageBackend: string } | null} */
let identityState = null;

function loadProtoRoot() {
  return require("../proto/bundle.js");
}

export function getIdentityState() {
  return identityState;
}

/** @returns {object | null} `digitaldelta.UserIdentity` */
export function getUserIdentity() {
  return identityState?.userIdentity ?? null;
}

export function getPublicKeyBytes() {
  return identityState ? new Uint8Array(identityState.keyPair.publicKey) : null;
}

/**
 * Load or generate Ed25519 keypair and persist secret; sets `identityState` (without final `userIdentity` until profile is saved).
 * @param {{ onLog?: (line: string) => void }} options
 * @returns {Promise<{ wasNewKey: boolean }>}
 */
export async function ensureDeviceKeypair(options = {}) {
  const { onLog } = options;
  const log =
    typeof onLog === "function"
      ? onLog
      : (line) => console.log(`[IdentityService] ${line}`);

  if (identityState?.keyPair) {
    log("Device keypair already loaded in memory.");
    return { wasNewKey: false };
  }

  const root = loadProtoRoot();
  const dd = root.digitaldelta;
  if (!dd) {
    throw new Error("Protobuf bundle missing digitaldelta namespace");
  }

  const storageBackend = resolveIdentityStorageBackend(log);
  const secretB64 = await readIdentitySecretBase64(storageBackend, log);
  let keyPair;
  let wasNewKey = false;

  if (secretB64) {
    const sk = new Uint8Array(decodeBase64(secretB64));
    if (sk.length !== nacl.sign.secretKeyLength) {
      throw new Error("Stored Ed25519 secret key has invalid length");
    }
    keyPair = nacl.sign.keyPair.fromSecretKey(sk);
    log("Loaded existing Ed25519 secret from secure storage.");
  } else {
    keyPair = nacl.sign.keyPair();
    wasNewKey = true;
    log("Generated new Ed25519 keypair.");
    await writeIdentitySecretBase64(
      storageBackend,
      encodeBase64(keyPair.secretKey),
      log
    );
    log("Private key saved (never shown in UI).");
  }

  const publicKey = keyPair.publicKey;
  const nodeId = encodeBase64(publicKey);
  const publicKeyBase64 = encodeBase64(publicKey);

  identityState = {
    keyPair,
    userIdentity: identityState?.userIdentity ?? null,
    nodeId,
    publicKeyBase64,
    storageBackend,
  };

  log(`node_id (public key Base64): ${publicKeyBase64}`);

  return { wasNewKey };
}

/**
 * @returns {Promise<{ displayName: string, role: number } | null>}
 */
export async function loadSavedProfileIfAny() {
  if (!identityState?.nodeId) return null;
  await localLedger.init();
  const row = await localLedger.getIdentityRow(identityState.nodeId);
  if (!row) return null;
  const name = (row.display_name || "").trim();
  const role = row.role ?? 0;
  if (!name || role < 1) return null;
  return { displayName: name, role };
}

/**
 * Load this device’s `UserIdentity` message from the ledger into `identityState` (after keypair exists).
 * @returns {Promise<object | null>}
 */
export async function hydrateIdentityFromLedger() {
  if (!identityState?.nodeId) return null;
  await localLedger.init();
  const rows = await localLedger.listAllIdentitiesAsMessages();
  const self = rows.find((m) => m.nodeId === identityState.nodeId);
  if (!self) return null;
  identityState = { ...identityState, userIdentity: self };
  return self;
}

/**
 * Build `digitaldelta.UserIdentity` with `role`, `displayName`, `publicKey`, `meta` and upsert ledger.
 * @param {{ displayName: string, role: number, onLog?: (s: string) => void }} options
 */
export async function saveUserProfileToProto(options) {
  const { displayName, role, onLog } = options;
  const log =
    typeof onLog === "function"
      ? onLog
      : (line) => console.log(`[IdentityService] ${line}`);

  if (!identityState?.keyPair) {
    throw new Error("No device keypair; run ensureDeviceKeypair first");
  }
  const trimmed = (displayName || "").trim();
  if (!trimmed) {
    throw new Error("Display name is required");
  }
  if (typeof role !== "number" || role < 1 || role > 5) {
    throw new Error("Select a valid role");
  }

  const root = loadProtoRoot();
  const { UserIdentity, MeshMetadata, VectorClock } = root.digitaldelta;
  const { nodeId, keyPair } = identityState;
  const publicKey = keyPair.publicKey;

  await localLedger.init();
  const row = await localLedger.getIdentityRow(nodeId);
  let counter = 1;
  if (row?.meta_json) {
    try {
      const stored = JSON.parse(row.meta_json);
      const c = stored.clock?.counters?.[nodeId];
      if (typeof c === "number" && c >= 1) counter = c + 1;
    } catch {
      counter = 1;
    }
  }

  const clock = VectorClock.create({
    counters: { [nodeId]: counter },
  });
  const meta = MeshMetadata.create({
    creatorNodeId: nodeId,
    signature: new Uint8Array(0),
    clock,
    timestamp: Date.now(),
  });

  const userIdentity = UserIdentity.create({
    nodeId,
    role,
    displayName: trimmed,
    publicKey,
    meta,
  });

  log("Upserting UserIdentity to KnownIdentities (protobuf fields: nodeId, role, displayName, publicKey, meta)…");
  await localLedger.upsertIdentity(userIdentity);

  identityState = {
    ...identityState,
    userIdentity,
  };

  return userIdentity;
}

/**
 * @deprecated Use `ensureDeviceKeypair` + `saveUserProfileToProto` from the setup flow.
 */
export async function initializeIdentity(options = {}) {
  const { displayName = "Digital Delta Node", role, onLog } = options;
  await ensureDeviceKeypair({ onLog });
  const r =
    typeof role === "number" ? role : loadProtoRoot().digitaldelta.Role?.FIELD_VOLUNTEER ?? 1;
  await saveUserProfileToProto({ displayName, role: r, onLog });
  return getIdentityState();
}

export const IdentityService = {
  initialize: initializeIdentity,
  ensureDeviceKeypair,
  saveUserProfileToProto,
  loadSavedProfileIfAny,
  hydrateIdentityFromLedger,
  getState: getIdentityState,
  getUserIdentity,
  getPublicKeyBytes,
  SELECTABLE_ROLES,
};

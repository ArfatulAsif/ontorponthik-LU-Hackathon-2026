import nacl from "tweetnacl";
import { decodeBase64, encodeBase64 } from "tweetnacl-util";

import { localLedger } from "../database/LocalLedger";
import {
  readIdentitySecretBase64,
  resolveIdentityStorageBackend,
  writeIdentitySecretBase64,
} from "./identitySecureStorage";

/** @type {{ keyPair: { publicKey: Uint8Array, secretKey: Uint8Array }, userIdentity: object, nodeId: string, publicKeyBase64: string, storageBackend: string } | null} */
let identityState = null;

function loadProtoRoot() {
  return require("../proto/bundle.js");
}

/**
 * @param {object} options
 * @param {string} [options.displayName]
 * @param {number} [options.role] — `digitaldelta.Role` numeric value
 * @param {(line: string) => void} [options.onLog] — UI / console log callback
 */
export async function initializeIdentity(options = {}) {
  if (identityState) return identityState;

  const { displayName = "Digital Delta Node", role, onLog } = options;
  const log =
    typeof onLog === "function"
      ? onLog
      : (line) => {
          console.log(`[IdentityService] ${line}`);
        };

  log("initializeIdentity() starting…");
  const root = loadProtoRoot();
  const dd = root.digitaldelta;
  if (!dd) {
    throw new Error("Protobuf bundle missing digitaldelta namespace");
  }
  const { UserIdentity, MeshMetadata, VectorClock, Role } = dd;
  log("Protobuf root loaded (UserIdentity / MeshMetadata / VectorClock).");

  const storageBackend = resolveIdentityStorageBackend(log);
  const secretB64 = await readIdentitySecretBase64(storageBackend, log);
  let keyPair;

  if (secretB64) {
    const sk = new Uint8Array(decodeBase64(secretB64));
    if (sk.length !== nacl.sign.secretKeyLength) {
      log(
        `Error: stored secret length ${sk.length}, expected ${nacl.sign.secretKeyLength}`
      );
      throw new Error("Stored Ed25519 secret key has invalid length");
    }
    keyPair = nacl.sign.keyPair.fromSecretKey(sk);
    log("Loaded existing Ed25519 keypair (public key logged below).");
  } else {
    keyPair = nacl.sign.keyPair();
    log("Generated new Ed25519 keypair.");
    await writeIdentitySecretBase64(
      storageBackend,
      encodeBase64(keyPair.secretKey),
      log
    );
    log("(Private key is never shown in the UI — only in secure storage.)");
  }

  const publicKey = keyPair.publicKey;
  const nodeId = encodeBase64(publicKey);
  const publicKeyBase64 = encodeBase64(publicKey);
  log(`node_id (public key Base64): ${publicKeyBase64}`);
  log(`Public key length: ${publicKey.length} bytes`);

  const roleValue =
    typeof role === "number" ? role : Role?.FIELD_VOLUNTEER ?? 1;
  log(`Role: ${roleValue} (proto enum)`);

  const clock = VectorClock.create({
    counters: { [nodeId]: 1 },
  });
  const meta = MeshMetadata.create({
    creatorNodeId: nodeId,
    signature: new Uint8Array(0),
    clock,
    timestamp: Date.now(),
  });

  const userIdentity = UserIdentity.create({
    nodeId,
    role: roleValue,
    displayName,
    publicKey,
    meta,
  });

  log("LocalLedger.init() …");
  await localLedger.init();
  log("KnownIdentities: upsertIdentity() …");
  await localLedger.upsertIdentity(userIdentity);
  log("Identity layer ready ✓");

  identityState = {
    keyPair,
    userIdentity,
    nodeId,
    publicKeyBase64,
    storageBackend,
  };

  return identityState;
}

/** @returns {{ keyPair: { publicKey: Uint8Array, secretKey: Uint8Array }, userIdentity: object, nodeId: string, publicKeyBase64: string, storageBackend: string } | null} */
export function getIdentityState() {
  return identityState;
}

/** @returns {object | null} `digitaldelta.UserIdentity` message */
export function getUserIdentity() {
  return identityState?.userIdentity ?? null;
}

/** @returns {Uint8Array | null} raw Ed25519 public key (32 bytes) */
export function getPublicKeyBytes() {
  return identityState ? new Uint8Array(identityState.keyPair.publicKey) : null;
}

export const IdentityService = {
  initialize: initializeIdentity,
  getState: getIdentityState,
  getUserIdentity,
  getPublicKeyBytes,
};

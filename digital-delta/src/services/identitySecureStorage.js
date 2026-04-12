import * as SecureStore from "expo-secure-store";
import { NativeModules, Platform } from "react-native";
import * as Keychain from "react-native-keychain";

const KEYCHAIN_SERVICE = "com.digitaldelta.identity";
const KEYCHAIN_USER = "device_ed25519_secret";
const SECURE_STORE_KEY = "digital_delta_ed25519_secret_b64";

/** @returns {boolean} */
export function isReactNativeKeychainNativeAvailable() {
  return !!NativeModules.RNKeychainManager;
}

/**
 * @param {(msg: string) => void} onLog
 * @returns {'keychain' | 'expo-secure-store'}
 */
export function resolveIdentityStorageBackend(onLog) {
  if (isReactNativeKeychainNativeAvailable()) {
    onLog("Storage: react-native-keychain (native RNKeychainManager OK)");
    return "keychain";
  }
  onLog(
    "Storage: expo-secure-store — RNKeychainManager is null (common in Expo Go / web / without prebuild)"
  );
  if (Platform.OS === "web") {
    onLog("Warning: secure storage is limited on web.");
  }
  return "expo-secure-store";
}

/**
 * @param {'keychain' | 'expo-secure-store'} backend
 * @param {(msg: string) => void} onLog
 * @returns {Promise<string | null>} Base64-encoded 64-byte signing secret
 */
export async function readIdentitySecretBase64(backend, onLog) {
  if (backend === "keychain") {
    const creds = await Keychain.getGenericPassword({ service: KEYCHAIN_SERVICE });
    if (creds?.password) {
      onLog(
        `Keychain: found existing credentials (username=${creds.username ?? "?"})`
      );
      return creds.password;
    }
    onLog("Keychain: no stored secret — will generate a new key.");
    return null;
  }

  try {
    const v = await SecureStore.getItemAsync(SECURE_STORE_KEY);
    if (v) {
      onLog("expo-secure-store: loaded existing secret.");
    } else {
      onLog("expo-secure-store: no secret stored — will generate a new key.");
    }
    return v;
  } catch (e) {
    onLog(`expo-secure-store read error: ${e?.message ?? e}`);
    throw e;
  }
}

/**
 * @param {'keychain' | 'expo-secure-store'} backend
 * @param {string} secretKeyBase64
 * @param {(msg: string) => void} onLog
 */
export async function writeIdentitySecretBase64(backend, secretKeyBase64, onLog) {
  if (backend === "keychain") {
    const stored = await Keychain.setGenericPassword(
      KEYCHAIN_USER,
      secretKeyBase64,
      { service: KEYCHAIN_SERVICE }
    );
    if (stored === false) {
      throw new Error("Keychain refused to store private key");
    }
    onLog("Keychain: saved new private key (Base64).");
    return;
  }

  try {
    await SecureStore.setItemAsync(SECURE_STORE_KEY, secretKeyBase64);
    onLog("expo-secure-store: saved new private key (Base64).");
  } catch (e) {
    onLog(`expo-secure-store write error: ${e?.message ?? e}`);
    throw e;
  }
}

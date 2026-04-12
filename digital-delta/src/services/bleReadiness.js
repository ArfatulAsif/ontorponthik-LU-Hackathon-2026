/**
 * Bluetooth readiness. `react-native-ble-plx` must exist as `NativeModules.BlePlx`
 * (development/production build). Expo Go does not ship this native module — `BleManager`
 * would call `BlePlx.createClient` and crash with "Cannot read property 'createClient' of null".
 */

import { NativeModules } from "react-native";

/** @type {import("react-native-ble-plx").BleManager | null} */
let manager = null;

/** @returns {boolean} */
export function isBleNativeModuleAvailable() {
  return !!NativeModules.BlePlx;
}

export function getBleManager() {
  if (!NativeModules.BlePlx) {
    return null;
  }
  const { BleManager } = require("react-native-ble-plx");
  if (!manager) {
    manager = new BleManager();
  }
  return manager;
}

/**
 * @returns {Promise<{
 *   ok: boolean,
 *   poweredOn: boolean,
 *   state: string | null,
 *   error: string | null,
 *   nativeMissing?: boolean
 * }>}
 */
export async function getBluetoothReadiness() {
  if (!NativeModules.BlePlx) {
    return {
      ok: false,
      poweredOn: false,
      state: null,
      error:
        "BLE native module is not in this app (Expo Go cannot load react-native-ble-plx). Build a development client or release app to verify Bluetooth here.",
      nativeMissing: true,
    };
  }

  try {
    const { State } = require("react-native-ble-plx");
    const m = getBleManager();
    if (!m) {
      return {
        ok: false,
        poweredOn: false,
        state: null,
        error: "BleManager could not be created.",
        nativeMissing: true,
      };
    }
    const s = await m.state();
    const poweredOn = s === State.PoweredOn;
    return { ok: true, poweredOn, state: String(s), error: null };
  } catch (e) {
    const msg = e?.message ? String(e.message) : String(e);
    return {
      ok: false,
      poweredOn: false,
      state: null,
      error: msg,
    };
  }
}

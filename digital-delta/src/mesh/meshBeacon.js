/**
 * Optional BLE manufacturer data so peers appear in scan without connecting.
 * Format: [0xDD, 0xD1, role uint8, ...utf8 displayName]
 */

/**
 * @param {Uint8Array} raw
 * @returns {{ role: number, displayName: string } | null}
 */
export function parseMeshBeacon(raw) {
  if (!raw || raw.length < 4) return null;
  if (raw[0] !== 0xdd || raw[1] !== 0xd1) return null;
  const role = raw[2];
  const nameBytes = raw.subarray(3);
  let displayName = "";
  try {
    displayName = new TextDecoder("utf-8", { fatal: false }).decode(nameBytes);
    displayName = displayName.replace(/\0+$/, "").trim();
  } catch {
    displayName = "";
  }
  if (!displayName) return { role, displayName: "Unknown" };
  return { role, displayName };
}

/**
 * @param {number} role
 * @param {string} displayName
 * @returns {Uint8Array}
 */
export function encodeMeshBeacon(role, displayName) {
  const enc = new TextEncoder();
  const name = enc.encode((displayName || "Node").slice(0, 40));
  const out = new Uint8Array(3 + name.length);
  out[0] = 0xdd;
  out[1] = 0xd1;
  out[2] = role & 0xff;
  out.set(name, 3);
  return out;
}

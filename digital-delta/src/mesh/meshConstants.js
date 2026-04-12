/** GATT: same app must expose this service + characteristic (dev client / native build). */
export const DD_MESH_SERVICE_UUID = "18dd0000-0000-1000-8000-00805f9b34fb";
export const DD_MESH_GOSSIP_CHAR_UUID = "18dd0001-0000-1000-8000-00805f9b34fb";

/** Optional scan beacon (manufacturer data): 0xDD 0xD1 | role | UTF-8 name… */
export const MESH_BEACON_MAGIC = [0xdd, 0xd1];

export function normalizeUuid(u) {
  return String(u || "")
    .replace(/-/g, "")
    .toLowerCase();
}

export function uuidMatches(u, expected) {
  return normalizeUuid(u) === normalizeUuid(expected);
}

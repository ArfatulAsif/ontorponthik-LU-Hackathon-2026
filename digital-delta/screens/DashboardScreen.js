import { useEffect, useMemo, useRef, useState } from "react";
import {
  Platform,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  View,
} from "react-native";
import { StatusBar } from "expo-status-bar";
import { localLedger } from "../src/database/LocalLedger";
import { MeshRadarService } from "../src/services/MeshRadarService";
import {
  SELECTABLE_ROLES,
  getIdentityState,
  getUserIdentity,
} from "../src/services/IdentityService";
import { createBleMeshService } from "../src/services/SyncEngine";
import { colors } from "../theme";

function roleLabel(roleValue) {
  const r = SELECTABLE_ROLES.find((x) => x.value === roleValue);
  return r ? r.label : `Role ${roleValue}`;
}

function shortDeviceId(id) {
  if (!id || typeof id !== "string") return "—";
  return id.length > 14 ? `${id.slice(0, 8)}…${id.slice(-4)}` : id;
}

export default function DashboardScreen() {
  const st = getIdentityState();
  const ui = getUserIdentity();

  const { bleMesh } = useMemo(
    () =>
      createBleMeshService({
        getUserIdentity,
        localLedger,
      }),
    []
  );

  const [radar, setRadar] = useState({
    nativeBle: false,
    blePoweredOn: false,
    scanning: false,
    peers: [],
    statusMessage: "",
    announcements: [],
    connectingDeviceIds: [],
  });

  const meshRef = useRef(null);

  useEffect(() => {
    const svc = new MeshRadarService({
      bleMesh,
      localLedger,
      getUserIdentity,
      roleLabel,
      onUpdate: setRadar,
    });
    meshRef.current = svc;
    void svc.start();
    return () => {
      meshRef.current = null;
      svc.stop();
    };
  }, [bleMesh]);

  return (
    <View style={styles.root}>
      <StatusBar style="light" />
      <ScrollView contentContainerStyle={styles.content}>
        <Text style={styles.title}>Dashboard</Text>
        <Text style={styles.sub}>Offline-first mesh (Digital Delta)</Text>

        <View style={styles.card}>
          <Text style={styles.cardTitle}>Device identity</Text>
          <Text style={styles.row}>
            <Text style={styles.k}>Display name</Text>
            {"\n"}
            <Text style={styles.v}>{ui?.displayName ?? "—"}</Text>
          </Text>
          <Text style={styles.row}>
            <Text style={styles.k}>Role (protobuf)</Text>
            {"\n"}
            <Text style={styles.v}>
              {ui?.role != null ? roleLabel(ui.role) : "—"} ({ui?.role ?? "—"})
            </Text>
          </Text>
          <Text style={styles.row}>
            <Text style={styles.k}>node_id</Text>
            {"\n"}
            <Text style={styles.vMono} selectable>
              {st?.nodeId ?? "—"}
            </Text>
          </Text>
          <Text style={styles.row}>
            <Text style={styles.k}>Secure storage</Text>
            {"\n"}
            <Text style={styles.v}>{st?.storageBackend ?? "—"}</Text>
          </Text>
        </View>

        <View style={[styles.card, styles.cardSpaced]}>
          <Text style={styles.cardTitle}>Mesh radar</Text>
          <Text style={styles.hint}>{radar.statusMessage}</Text>
          <Text style={styles.metaRow}>
            BLE module: {radar.nativeBle ? "yes" : "no"} · Powered on:{" "}
            {radar.blePoweredOn ? "yes" : "no"} · Scanning:{" "}
            {radar.scanning ? "yes" : "no"}
          </Text>

          {radar.announcements.length > 0 ? (
            <View style={styles.announceBox}>
              <Text style={styles.announceTitle}>Recent</Text>
              {radar.announcements.map((line, i) => (
                <Text key={`${i}-${line.slice(0, 12)}`} style={styles.announceLine}>
                  • {line}
                </Text>
              ))}
            </View>
          ) : null}

          <Text style={styles.peerSectionTitle}>
            Nearby BLE ({radar.peers.length})
          </Text>
          {radar.peers.length === 0 ? (
            <Text style={styles.emptyPeers}>
              No BLE advertisements seen yet. Keep both phones unlocked, Bluetooth
              on, location on (Android scan), and stay within a few metres. The
              list refreshes about every 17 seconds. For protobuf sync to
              succeed, the other phone must expose the Digital Delta GATT
              service (or you both use matching beacons); otherwise use Sync
              now only to test connectivity.
            </Text>
          ) : (
            radar.peers.map((p) => {
              const syncing = (radar.connectingDeviceIds || []).includes(
                p.deviceId
              );
              return (
                <View key={p.deviceId} style={styles.peerRow}>
                  <View style={styles.peerRowTop}>
                    <View style={styles.peerTitleCol}>
                      <Text style={styles.peerName}>
                        {p.displayName ?? p.bleLabel ?? "Unnamed device"}
                        {p.roleLabel ? ` · ${p.roleLabel}` : ""}
                      </Text>
                      {p.isCandidate ? (
                        <Text style={styles.badge}>Digital Delta signature</Text>
                      ) : null}
                    </View>
                    <Pressable
                      style={({ pressed }) => [
                        styles.syncBtn,
                        pressed && styles.syncBtnPressed,
                        syncing && styles.syncBtnDisabled,
                      ]}
                      disabled={syncing}
                      onPress={() =>
                        meshRef.current?.requestManualSync(p.deviceId)
                      }
                    >
                      <Text style={styles.syncBtnText}>
                        {syncing ? "Syncing…" : "Sync now"}
                      </Text>
                    </Pressable>
                  </View>
                  <Text style={styles.peerMeta}>
                    RSSI {p.rssi ?? "—"} ·{" "}
                    {p.gattSynced ? "synced" : "not synced yet"}
                    {p.fromBeacon ? " · beacon" : ""}
                    {p.isCandidate ? " · auto-retry" : ""}
                  </Text>
                  <Text style={styles.peerId} selectable>
                    {shortDeviceId(p.deviceId)}
                  </Text>
                  {p.lastError ? (
                    <Text style={styles.peerErr}>{p.lastError}</Text>
                  ) : null}
                </View>
              );
            })
          )}
        </View>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  root: {
    flex: 1,
    backgroundColor: colors.background,
  },
  content: {
    padding: 24,
    paddingTop: Platform.OS === "ios" ? 56 : 40,
  },
  title: {
    fontSize: 26,
    fontWeight: "700",
    color: colors.text,
  },
  sub: {
    marginTop: 6,
    fontSize: 15,
    color: colors.textMuted,
    marginBottom: 24,
  },
  card: {
    backgroundColor: colors.surface,
    borderRadius: 14,
    padding: 18,
    borderWidth: 1,
    borderColor: colors.inputBorder,
  },
  cardSpaced: {
    marginTop: 16,
  },
  cardTitle: {
    fontSize: 13,
    fontWeight: "700",
    color: colors.accentYellow,
    textTransform: "uppercase",
    letterSpacing: 0.8,
    marginBottom: 14,
  },
  hint: {
    fontSize: 14,
    color: colors.textMuted,
    marginBottom: 10,
    lineHeight: 20,
  },
  metaRow: {
    fontSize: 12,
    color: colors.textMuted,
    marginBottom: 14,
  },
  announceBox: {
    backgroundColor: colors.background,
    borderRadius: 10,
    padding: 12,
    marginBottom: 16,
    borderWidth: 1,
    borderColor: colors.inputBorder,
  },
  announceTitle: {
    fontSize: 11,
    fontWeight: "700",
    color: colors.accentYellow,
    marginBottom: 8,
    textTransform: "uppercase",
  },
  announceLine: {
    fontSize: 13,
    color: colors.text,
    marginBottom: 6,
    lineHeight: 18,
  },
  peerSectionTitle: {
    fontSize: 15,
    fontWeight: "700",
    color: colors.text,
    marginBottom: 10,
  },
  emptyPeers: {
    fontSize: 14,
    color: colors.textMuted,
    lineHeight: 20,
  },
  peerRow: {
    paddingVertical: 12,
    borderTopWidth: 1,
    borderTopColor: colors.inputBorder,
  },
  peerRowTop: {
    flexDirection: "row",
    alignItems: "flex-start",
    justifyContent: "space-between",
    gap: 12,
  },
  peerTitleCol: {
    flex: 1,
    minWidth: 0,
  },
  badge: {
    marginTop: 6,
    alignSelf: "flex-start",
    fontSize: 11,
    fontWeight: "700",
    color: colors.accentGreen,
    textTransform: "uppercase",
    letterSpacing: 0.5,
  },
  syncBtn: {
    backgroundColor: colors.primary,
    paddingVertical: 8,
    paddingHorizontal: 14,
    borderRadius: 10,
  },
  syncBtnPressed: {
    opacity: 0.85,
  },
  syncBtnDisabled: {
    opacity: 0.55,
  },
  syncBtnText: {
    color: "#fff",
    fontSize: 14,
    fontWeight: "700",
  },
  peerName: {
    fontSize: 16,
    fontWeight: "600",
    color: colors.text,
  },
  peerMeta: {
    fontSize: 13,
    color: colors.textMuted,
    marginTop: 4,
  },
  peerId: {
    fontSize: 11,
    color: colors.textMuted,
    marginTop: 4,
    fontFamily: Platform.select({
      ios: "Menlo",
      android: "monospace",
      default: "monospace",
    }),
  },
  peerErr: {
    fontSize: 12,
    color: "#f07178",
    marginTop: 4,
  },
  row: {
    marginBottom: 14,
  },
  k: {
    fontSize: 12,
    color: colors.textMuted,
    fontWeight: "600",
  },
  v: {
    fontSize: 16,
    color: colors.text,
    marginTop: 4,
  },
  vMono: {
    fontSize: 11,
    color: colors.text,
    marginTop: 4,
    fontFamily: Platform.select({
      ios: "Menlo",
      android: "monospace",
      default: "monospace",
    }),
  },
});

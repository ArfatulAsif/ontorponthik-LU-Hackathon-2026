import { useEffect, useState } from "react";
import { ActivityIndicator, StyleSheet, Text, View } from "react-native";
import LoginScreen from "./screens/LoginScreen";
import DashboardScreen from "./screens/DashboardScreen";
import BootLogPanel from "./src/components/BootLogPanel";
import { getIdentityState, initializeIdentity } from "./src/services/IdentityService";

function appendTimestamp(line) {
  const t = new Date();
  const ts = t.toTimeString().split(" ")[0];
  return `${ts}  ${line}`;
}

export default function App() {
  const [loggedIn, setLoggedIn] = useState(false);
  const [identityReady, setIdentityReady] = useState(false);
  const [bootError, setBootError] = useState(null);
  const [bootLogs, setBootLogs] = useState([]);
  const [identitySummary, setIdentitySummary] = useState(null);

  useEffect(() => {
    let cancelled = false;
    const pushLog = (line) => {
      const entry = appendTimestamp(line);
      setBootLogs((prev) => [...prev, entry]);
    };
    (async () => {
      try {
        await initializeIdentity({
          displayName: "Field Operator",
          onLog: pushLog,
        });
        if (cancelled) return;
        const st = getIdentityState();
        setIdentitySummary(
          st
            ? {
                nodeId: st.nodeId,
                publicKeyBase64: st.publicKeyBase64,
                storageBackend: st.storageBackend,
              }
            : null
        );
        setIdentityReady(true);
      } catch (err) {
        const msg = err?.message ? String(err.message) : String(err);
        pushLog(`Error: ${msg}`);
        if (!cancelled) setBootError(msg);
      }
    })();
    return () => {
      cancelled = true;
    };
  }, []);

  if (bootError) {
    return (
      <View style={styles.bootRoot}>
        <Text style={styles.bootTitle}>Could not start identity layer</Text>
        <Text style={styles.bootErr}>{bootError}</Text>
        <Text style={styles.bootHint}>
          If you see “getGenericPasswordForOptions of null”, the react-native-keychain native
          module is not loaded (normal in Expo Go). This app falls back to expo-secure-store. For
          real Keychain on device, use a dev client or a prebuild release.
        </Text>
        <BootLogPanel lines={bootLogs} />
      </View>
    );
  }

  if (!identityReady) {
    return (
      <View style={styles.bootRoot}>
        <ActivityIndicator size="large" color="#a8e6cf" />
        <Text style={styles.bootLoading}>Starting offline engine…</Text>
        <BootLogPanel lines={bootLogs} />
      </View>
    );
  }

  if (loggedIn) {
    return <DashboardScreen />;
  }

  return (
    <LoginScreen
      onLogin={() => setLoggedIn(true)}
      engineDebug={{
        bootLogs,
        ...identitySummary,
      }}
    />
  );
}

const styles = StyleSheet.create({
  bootRoot: {
    flex: 1,
    justifyContent: "center",
    padding: 20,
    backgroundColor: "#0f1419",
  },
  bootLoading: {
    marginTop: 16,
    textAlign: "center",
    color: "#ccc",
    fontSize: 15,
  },
  bootTitle: {
    color: "#fff",
    fontSize: 18,
    fontWeight: "700",
    marginBottom: 8,
  },
  bootErr: {
    color: "#ff8a80",
    marginBottom: 12,
    fontSize: 14,
  },
  bootHint: {
    color: "rgba(255,255,255,0.65)",
    fontSize: 13,
    lineHeight: 20,
    marginBottom: 8,
  },
});

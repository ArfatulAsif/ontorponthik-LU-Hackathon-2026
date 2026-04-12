import { useCallback, useEffect, useRef, useState } from "react";
import {
  ActivityIndicator,
  Alert,
  Dimensions,
  KeyboardAvoidingView,
  Platform,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  View,
} from "react-native";
import { StatusBar } from "expo-status-bar";
import BootLogPanel from "../src/components/BootLogPanel";
import { localLedger } from "../src/database/LocalLedger";
import {
  SELECTABLE_ROLES,
  ensureDeviceKeypair,
  hydrateIdentityFromLedger,
  loadSavedProfileIfAny,
  saveUserProfileToProto,
} from "../src/services/IdentityService";
import {
  getBluetoothReadiness,
  isBleNativeModuleAvailable,
} from "../src/services/bleReadiness";
import { colors } from "../theme";

const STEP_GAP_MS = 1000;
const WIN_H = Dimensions.get("window").height;

function sleep(ms) {
  return new Promise((r) => setTimeout(r, ms));
}

function appendTimestamp(line) {
  const t = new Date();
  const ts = t.toTimeString().split(" ")[0];
  return `${ts}  ${line}`;
}

/**
 * Flow: checks (PRNG → key → ledger) → Bluetooth (hardware or dev preview) → profile (role + name) → app.
 * @param {{ onComplete: () => void }} props
 */
export default function LoginScreen({ onComplete }) {
  const onCompleteRef = useRef(onComplete);
  onCompleteRef.current = onComplete;
  const bleNativeAvailable = isBleNativeModuleAvailable();
  const hasExistingProfile = useRef(false);

  const [checkItems, setCheckItems] = useState(() => [
    { id: "prng", label: "Secure random (PRNG) ready", status: "pending" },
    { id: "key", label: "Private key in secure storage", status: "pending" },
    { id: "ledger", label: "Local SQLite ledger opened", status: "pending" },
    {
      id: "bluetooth",
      label: bleNativeAvailable
        ? "Bluetooth adapter is on"
        : "Bluetooth (development preview — Expo Go)",
      status: "pending",
    },
    {
      id: "profile",
      label: "Profile saved (UserIdentity)",
      status: "pending",
    },
  ]);

  const [phase, setPhase] = useState(
    /** @type {'boot' | 'bluetooth' | 'profile' | 'error'} */ ("boot")
  );
  const [displayName, setDisplayName] = useState("");
  const [role, setRole] = useState(SELECTABLE_ROLES[0].value);
  const [profileError, setProfileError] = useState("");
  const [savingProfile, setSavingProfile] = useState(false);
  const [bootLogs, setBootLogs] = useState([]);
  const [showLog, setShowLog] = useState(false);
  const [btHint, setBtHint] = useState("");
  const cancelled = useRef(false);
  const bleAutoCheckStarted = useRef(false);

  const pushLog = useCallback((line) => {
    setBootLogs((prev) => [...prev, appendTimestamp(line)]);
  }, []);

  const setStepStatus = useCallback((id, status) => {
    setCheckItems((prev) =>
      prev.map((s) => (s.id === id ? { ...s, status } : s))
    );
  }, []);

  const finishBluetoothAndContinue = useCallback(async () => {
    setStepStatus("bluetooth", "done");
    await sleep(STEP_GAP_MS);
    if (cancelled.current) return;
    if (hasExistingProfile.current) {
      setStepStatus("profile", "done");
      onCompleteRef.current();
    } else {
      setPhase("profile");
    }
  }, [setStepStatus]);

  const runBluetoothStep = useCallback(async () => {
    if (!bleNativeAvailable) return;
    setStepStatus("bluetooth", "running");
    setBtHint("");
    await sleep(400);
    const r = await getBluetoothReadiness();
    if (cancelled.current) return;

    if (!r.ok) {
      setStepStatus("bluetooth", "error");
      setBtHint(
        r.error || "Bluetooth native module could not be queried."
      );
      return;
    }

    if (r.poweredOn) {
      pushLog(`Bluetooth state: ${r.state} (ready).`);
      await finishBluetoothAndContinue();
      return;
    }

    setStepStatus("bluetooth", "error");
    setBtHint(
      `Bluetooth is ${r.state ?? "off"}. Turn it on, then tap Check again.`
    );
    Alert.alert(
      "Bluetooth off",
      "Enable Bluetooth for mesh / offline sync, then tap Check again.",
      [{ text: "OK" }]
    );
  }, [
    bleNativeAvailable,
    finishBluetoothAndContinue,
    pushLog,
    setStepStatus,
  ]);

  /** Expo Go / no BlePlx: visible dev step — user taps Continue (not auto-skipped). */
  const onDevBluetoothContinue = useCallback(async () => {
    pushLog(
      "Bluetooth step: development preview (Expo Go has no native BLE). Use `npx expo run:android` or a dev client for a real adapter check."
    );
    setStepStatus("bluetooth", "running");
    await sleep(600);
    await finishBluetoothAndContinue();
  }, [finishBluetoothAndContinue, pushLog, setStepStatus]);

  useEffect(() => {
    cancelled.current = false;
    let alive = true;

    (async () => {
      try {
        setStepStatus("prng", "running");
        await sleep(STEP_GAP_MS);
        if (!alive) return;
        setStepStatus("prng", "done");
        await sleep(STEP_GAP_MS);

        setStepStatus("key", "running");
        await ensureDeviceKeypair({ onLog: pushLog });
        if (!alive) return;
        setStepStatus("key", "done");
        await sleep(STEP_GAP_MS);

        setStepStatus("ledger", "running");
        await localLedger.init();
        pushLog("LocalLedger.init() complete.");
        if (!alive) return;
        setStepStatus("ledger", "done");
        await sleep(STEP_GAP_MS);

        const saved = await loadSavedProfileIfAny();
        if (!alive) return;

        if (saved) {
          setDisplayName(saved.displayName);
          setRole(saved.role);
          await hydrateIdentityFromLedger();
          hasExistingProfile.current = true;
          pushLog("Existing profile found — will finish after Bluetooth step.");
        } else {
          hasExistingProfile.current = false;
        }

        await sleep(STEP_GAP_MS);
        if (!alive) return;
        setPhase("bluetooth");
      } catch (e) {
        const msg = e?.message ? String(e.message) : String(e);
        pushLog(`Error: ${msg}`);
        setPhase("error");
        Alert.alert("Setup failed", msg);
      }
    })();

    return () => {
      alive = false;
      cancelled.current = true;
    };
  }, [pushLog, setStepStatus]);

  useEffect(() => {
    if (phase !== "bluetooth" || !bleNativeAvailable) return;
    if (bleAutoCheckStarted.current) return;
    bleAutoCheckStarted.current = true;
    runBluetoothStep();
  }, [phase, bleNativeAvailable, runBluetoothStep]);

  const onSaveProfile = async () => {
    setProfileError("");
    const name = displayName.trim();
    if (!name) {
      setProfileError("Enter your display name.");
      return;
    }
    setSavingProfile(true);
    try {
      await saveUserProfileToProto({
        displayName: name,
        role,
        onLog: pushLog,
      });
      setStepStatus("profile", "done");
      await sleep(STEP_GAP_MS);
      onCompleteRef.current();
    } catch (e) {
      setProfileError(e?.message ? String(e.message) : String(e));
    } finally {
      setSavingProfile(false);
    }
  };

  const scrollCentered =
    phase === "boot" || phase === "bluetooth" || phase === "error";

  if (phase === "error") {
    return (
      <View style={styles.centerRoot}>
        <StatusBar style="light" />
        <Text style={styles.errorTitle}>Setup failed</Text>
        <BootLogPanel lines={bootLogs} title="Log" />
      </View>
    );
  }

  return (
    <KeyboardAvoidingView
      style={styles.root}
      behavior={Platform.OS === "ios" ? "padding" : undefined}
    >
      <StatusBar style="light" />
      <View style={styles.decorStripe} />
      <ScrollView
        style={styles.scroll}
        contentContainerStyle={[
          styles.scrollContent,
          scrollCentered && styles.scrollContentCentered,
          phase === "profile" && styles.scrollContentProfile,
        ]}
        keyboardShouldPersistTaps="handled"
      >
        <View style={styles.middleColumn}>
          <Text style={styles.sectionTitle}>Setup checks</Text>
          {checkItems.map((item) => (
            <View key={item.id} style={styles.checkRow}>
              <View style={styles.checkIconBox}>
                {item.status === "pending" && (
                  <Text style={styles.checkPending}>○</Text>
                )}
                {item.status === "running" && (
                  <ActivityIndicator size="small" color={colors.accentGreen} />
                )}
                {item.status === "done" && (
                  <Text style={styles.checkDone}>✓</Text>
                )}
                {item.status === "error" && (
                  <Text style={styles.checkErr}>!</Text>
                )}
              </View>
              <Text style={styles.checkLabel}>{item.label}</Text>
            </View>
          ))}

          {phase === "bluetooth" && !bleNativeAvailable ? (
            <View style={styles.devBtCard}>
              <Text style={styles.devBtTitle}>Development mode</Text>
              <Text style={styles.devBtBody}>
                Expo Go does not include the native Bluetooth module. You still
                run the full flow here; for a real adapter check, build a{" "}
                <Text style={styles.monoInline}>development client</Text> (
                <Text style={styles.monoInline}>npx expo run:android</Text> /{" "}
                <Text style={styles.monoInline}>run:ios</Text>
                ).
              </Text>
              <Pressable
                style={({ pressed }) => [
                  styles.primaryBtn,
                  pressed && styles.primaryBtnPressed,
                ]}
                onPress={onDevBluetoothContinue}
              >
                <Text style={styles.primaryBtnText}>
                  Continue to profile (after Bluetooth step)
                </Text>
              </Pressable>
            </View>
          ) : null}

          {bleNativeAvailable &&
          phase === "bluetooth" &&
          checkItems.find((c) => c.id === "bluetooth")?.status === "error" ? (
            <View style={styles.btActions}>
              {btHint ? <Text style={styles.btHint}>{btHint}</Text> : null}
              <Pressable
                style={({ pressed }) => [
                  styles.secondaryBtn,
                  pressed && styles.secondaryBtnPressed,
                ]}
                onPress={runBluetoothStep}
              >
                <Text style={styles.secondaryBtnText}>Check again</Text>
              </Pressable>
            </View>
          ) : null}

          {phase === "profile" ? (
            <View style={styles.profileBlock}>
              <Text style={styles.sectionTitle}>Your profile</Text>
              <Text style={styles.help}>
                Role and display name are stored in{" "}
                <Text style={styles.mono}>UserIdentity</Text> (protobuf) after
                Bluetooth is OK.
              </Text>

              <Text style={styles.label}>Display name</Text>
              <TextInput
                value={displayName}
                onChangeText={setDisplayName}
                placeholder="e.g. Alex Rivera"
                placeholderTextColor={colors.textMuted}
                style={styles.input}
              />

              <Text style={[styles.label, styles.labelSpaced]}>Role</Text>
              <View style={styles.roleGrid}>
                {SELECTABLE_ROLES.map((r) => {
                  const selected = role === r.value;
                  return (
                    <Pressable
                      key={r.value}
                      onPress={() => setRole(r.value)}
                      style={[
                        styles.roleChip,
                        selected && styles.roleChipSelected,
                      ]}
                    >
                      <Text
                        style={[
                          styles.roleChipText,
                          selected && styles.roleChipTextSelected,
                        ]}
                      >
                        {r.label}
                      </Text>
                    </Pressable>
                  );
                })}
              </View>

              {profileError ? (
                <Text style={styles.profileErr}>{profileError}</Text>
              ) : null}

              <Pressable
                style={({ pressed }) => [
                  styles.primaryBtn,
                  pressed && styles.primaryBtnPressed,
                  savingProfile && styles.primaryBtnDisabled,
                ]}
                onPress={onSaveProfile}
                disabled={savingProfile}
              >
                {savingProfile ? (
                  <ActivityIndicator color="#fff" />
                ) : (
                  <Text style={styles.primaryBtnText}>Save and continue</Text>
                )}
              </Pressable>
            </View>
          ) : null}

          <Pressable
            onPress={() => setShowLog((s) => !s)}
            style={styles.logToggle}
          >
            <Text style={styles.logToggleText}>
              {showLog ? "▼ Hide log" : "▶ Show log"}
            </Text>
          </Pressable>
          {showLog ? (
            <BootLogPanel lines={bootLogs} title="Operations log" />
          ) : null}
        </View>
      </ScrollView>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  root: {
    flex: 1,
    backgroundColor: colors.background,
  },
  centerRoot: {
    flex: 1,
    backgroundColor: colors.background,
    padding: 24,
    justifyContent: "center",
  },
  errorTitle: {
    color: "#ff8a80",
    fontSize: 18,
    fontWeight: "700",
    marginBottom: 16,
  },
  scroll: {
    flex: 1,
  },
  scrollContent: {
    paddingBottom: 40,
    paddingHorizontal: 16,
  },
  scrollContentCentered: {
    flexGrow: 1,
    minHeight: WIN_H * 0.85,
    justifyContent: "center",
  },
  scrollContentProfile: {
    flexGrow: 1,
    paddingTop: 12,
    justifyContent: "flex-start",
  },
  decorStripe: {
    position: "absolute",
    top: 0,
    left: 0,
    right: 0,
    height: 4,
    backgroundColor: colors.primary,
  },
  middleColumn: {
    width: "100%",
    maxWidth: 420,
    alignSelf: "center",
  },
  sectionTitle: {
    fontSize: 13,
    fontWeight: "700",
    color: colors.textMuted,
    textTransform: "uppercase",
    letterSpacing: 0.8,
    marginBottom: 12,
    textAlign: "center",
  },
  checkRow: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 12,
    paddingVertical: 4,
  },
  checkIconBox: {
    width: 28,
    alignItems: "center",
    marginRight: 12,
  },
  checkPending: {
    color: colors.textMuted,
    fontSize: 18,
  },
  checkDone: {
    color: colors.accentGreen,
    fontSize: 20,
    fontWeight: "700",
  },
  checkErr: {
    color: "#f87171",
    fontSize: 18,
    fontWeight: "700",
  },
  checkLabel: {
    flex: 1,
    fontSize: 15,
    color: colors.text,
    lineHeight: 20,
  },
  devBtCard: {
    marginTop: 20,
    padding: 16,
    borderRadius: 12,
    backgroundColor: colors.surface,
    borderWidth: 1,
    borderColor: colors.inputBorder,
  },
  devBtTitle: {
    fontSize: 15,
    fontWeight: "700",
    color: colors.accentYellow,
    marginBottom: 8,
  },
  devBtBody: {
    fontSize: 13,
    color: colors.textMuted,
    lineHeight: 20,
    marginBottom: 16,
  },
  monoInline: {
    fontFamily: Platform.select({
      ios: "Menlo",
      android: "monospace",
      default: "monospace",
    }),
    fontSize: 12,
    color: colors.text,
  },
  profileBlock: {
    marginTop: 24,
    paddingTop: 20,
    borderTopWidth: StyleSheet.hairlineWidth,
    borderTopColor: colors.inputBorder,
  },
  help: {
    fontSize: 13,
    color: colors.textMuted,
    lineHeight: 19,
    marginBottom: 16,
  },
  mono: {
    fontFamily: Platform.select({
      ios: "Menlo",
      android: "monospace",
      default: "monospace",
    }),
    fontSize: 12,
    color: colors.accentYellow,
  },
  label: {
    fontSize: 13,
    fontWeight: "600",
    color: colors.textMuted,
    textTransform: "uppercase",
    letterSpacing: 0.6,
  },
  labelSpaced: {
    marginTop: 16,
  },
  input: {
    marginTop: 8,
    backgroundColor: colors.surface,
    borderWidth: 1,
    borderColor: colors.inputBorder,
    borderRadius: 12,
    paddingHorizontal: 16,
    paddingVertical: Platform.OS === "ios" ? 14 : 12,
    fontSize: 16,
    color: colors.text,
  },
  roleGrid: {
    flexDirection: "row",
    flexWrap: "wrap",
    marginTop: 10,
  },
  roleChip: {
    marginRight: 8,
    marginBottom: 8,
    paddingVertical: 10,
    paddingHorizontal: 12,
    borderRadius: 10,
    backgroundColor: colors.surface,
    borderWidth: 1,
    borderColor: colors.inputBorder,
  },
  roleChipSelected: {
    borderColor: colors.accentGreen,
    backgroundColor: "rgba(47, 201, 78, 0.12)",
  },
  roleChipText: {
    fontSize: 13,
    color: colors.textMuted,
    fontWeight: "600",
  },
  roleChipTextSelected: {
    color: colors.accentGreen,
  },
  profileErr: {
    color: "#f87171",
    marginTop: 12,
    fontSize: 14,
  },
  primaryBtn: {
    marginTop: 22,
    backgroundColor: colors.primary,
    borderRadius: 12,
    paddingVertical: 16,
    alignItems: "center",
  },
  primaryBtnPressed: {
    opacity: 0.92,
  },
  primaryBtnDisabled: {
    opacity: 0.6,
  },
  primaryBtnText: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "700",
  },
  btActions: {
    marginTop: 16,
  },
  btHint: {
    color: "#fbbf24",
    fontSize: 14,
    lineHeight: 20,
    marginBottom: 12,
  },
  secondaryBtn: {
    backgroundColor: colors.surface,
    borderRadius: 12,
    paddingVertical: 14,
    alignItems: "center",
    borderWidth: 1,
    borderColor: colors.inputBorder,
  },
  secondaryBtnPressed: {
    opacity: 0.9,
  },
  secondaryBtnText: {
    color: colors.text,
    fontSize: 16,
    fontWeight: "600",
  },
  logToggle: {
    marginTop: 24,
    paddingVertical: 8,
  },
  logToggleText: {
    color: colors.textMuted,
    fontSize: 13,
    fontWeight: "600",
  },
});

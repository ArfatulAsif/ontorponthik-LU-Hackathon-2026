import { useState } from "react";
import {
  Image,
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
import { colors } from "../theme";

/**
 * @param {{ onLogin: () => void, engineDebug?: { bootLogs?: string[], nodeId?: string, publicKeyBase64?: string, storageBackend?: string } }} props
 */
export default function LoginScreen({ onLogin, engineDebug }) {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [showEngineLog, setShowEngineLog] = useState(true);

  return (
    <KeyboardAvoidingView
      style={styles.root}
      behavior={Platform.OS === "ios" ? "padding" : undefined}
    >
      <StatusBar style="light" />
      <View style={styles.decorStripe} />
      <ScrollView
        style={styles.scroll}
        contentContainerStyle={styles.scrollContent}
        keyboardShouldPersistTaps="handled"
      >
      <View style={styles.inner}>
        <View style={styles.logoWrap}>
          <Image source={require("../assets/icon.png")} style={styles.logo} />
          <Text style={styles.brand}>Digital Delta</Text>
          <Text style={styles.tagline}>Sign in to continue</Text>
        </View>

        <View style={styles.form}>
          <Text style={styles.label}>Username</Text>
          <TextInput
            value={username}
            onChangeText={setUsername}
            placeholder="Enter username"
            placeholderTextColor={colors.textMuted}
            autoCapitalize="none"
            autoCorrect={false}
            style={styles.input}
          />

          <Text style={[styles.label, styles.labelSpaced]}>Password</Text>
          <TextInput
            value={password}
            onChangeText={setPassword}
            placeholder="Enter password"
            placeholderTextColor={colors.textMuted}
            secureTextEntry
            style={styles.input}
          />

          <Pressable
            style={({ pressed }) => [
              styles.button,
              pressed && styles.buttonPressed,
            ]}
            onPress={() => onLogin()}
          >
            <Text style={styles.buttonText}>Log in</Text>
          </Pressable>
        </View>

        {engineDebug ? (
          <View style={styles.engineSection}>
            <Pressable
              onPress={() => setShowEngineLog((s) => !s)}
              style={styles.engineToggle}
            >
              <Text style={styles.engineToggleText}>
                {showEngineLog ? "▼ Hide engine log" : "▶ Show offline engine log"}
              </Text>
            </Pressable>
            {engineDebug.storageBackend ? (
              <Text style={styles.engineMeta}>
                Storage: {engineDebug.storageBackend}
                {"\n"}
                node_id: {engineDebug.nodeId ?? "—"}
                {"\n"}
                Public key (Base64): {engineDebug.publicKeyBase64 ?? "—"}
              </Text>
            ) : null}
            {showEngineLog ? (
              <BootLogPanel
                lines={engineDebug.bootLogs ?? []}
                title="Boot log (keys / storage)"
              />
            ) : null}
          </View>
        ) : null}
      </View>
      </ScrollView>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  scroll: {
    flex: 1,
  },
  scrollContent: {
    flexGrow: 1,
  },
  root: {
    flex: 1,
    backgroundColor: colors.background,
  },
  engineSection: {
    marginTop: 24,
    paddingHorizontal: 8,
    paddingBottom: 32,
  },
  engineToggle: {
    paddingVertical: 8,
  },
  engineToggleText: {
    color: colors.textMuted,
    fontSize: 13,
    fontWeight: "600",
  },
  engineMeta: {
    marginTop: 4,
    marginBottom: 8,
    fontFamily: Platform.select({ ios: "Menlo", android: "monospace", default: "monospace" }),
    fontSize: 10,
    lineHeight: 15,
    color: "rgba(255,255,255,0.55)",
  },
  decorStripe: {
    position: "absolute",
    top: 0,
    left: 0,
    right: 0,
    height: 4,
    backgroundColor: colors.primary,
  },
  inner: {
    flex: 1,
    paddingHorizontal: 28,
    paddingTop: Platform.OS === "ios" ? 56 : 40,
    justifyContent: "center",
  },
  logoWrap: {
    alignItems: "center",
    marginBottom: 40,
  },
  logo: {
    width: 88,
    height: 88,
    borderRadius: 20,
    marginBottom: 16,
  },
  brand: {
    fontSize: 28,
    fontWeight: "700",
    color: colors.text,
    letterSpacing: 0.5,
  },
  tagline: {
    marginTop: 8,
    fontSize: 15,
    color: colors.accentYellow,
    fontWeight: "500",
  },
  form: {
    width: "100%",
  },
  label: {
    fontSize: 13,
    fontWeight: "600",
    color: colors.textMuted,
    textTransform: "uppercase",
    letterSpacing: 0.6,
  },
  labelSpaced: {
    marginTop: 18,
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
  button: {
    marginTop: 28,
    backgroundColor: colors.primary,
    borderRadius: 12,
    paddingVertical: 16,
    alignItems: "center",
    shadowColor: colors.primary,
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.35,
    shadowRadius: 16,
    elevation: 6,
  },
  buttonPressed: {
    opacity: 0.92,
    transform: [{ scale: 0.99 }],
  },
  buttonText: {
    color: "#fff",
    fontSize: 17,
    fontWeight: "700",
    letterSpacing: 0.3,
  },
});

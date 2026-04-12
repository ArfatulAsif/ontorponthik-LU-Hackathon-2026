import React, { useState, useEffect, useRef } from "react";
import {
  KeyboardAvoidingView,
  Platform,
  Pressable,
  StyleSheet,
  Text,
  TextInput,
  View,
  Animated,
  Dimensions,
  Easing,
} from "react-native";
import { StatusBar } from "expo-status-bar";

const { width } = Dimensions.get("window");

const theme = {
  primary: "#F04E36",
  secondary: "#081F2E",
  accent: "#EAB308",
  success: "#2FC94E",
  background: "#F9FAFB",
  white: "#FFFFFF",
  gray: "#94A3B8",
};

export default function LoginScreen({ onLogin }) {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");

  // Entry Animation Refs
  const logoPop = useRef(new Animated.Value(0)).current;
  const fadeAnim = useRef(new Animated.Value(0)).current;
  const slideAnim = useRef(new Animated.Value(20)).current;
  const buttonScale = useRef(new Animated.Value(1)).current;

  // Continuous Animation Refs
  const radarScale = useRef(new Animated.Value(1)).current;
  const radarOpacity = useRef(new Animated.Value(0.1)).current;
  const logoFloat = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    // 1. Entry Animations
    Animated.stagger(150, [
      Animated.spring(logoPop, {
        toValue: 1,
        friction: 4,
        useNativeDriver: true,
      }),
      Animated.parallel([
        Animated.timing(fadeAnim, {
          toValue: 1,
          duration: 600,
          useNativeDriver: true,
        }),
        Animated.timing(slideAnim, {
          toValue: 0,
          duration: 600,
          useNativeDriver: true,
        }),
      ]),
    ]).start();

    // 2. Continuous Radar Pulse Loop
    Animated.loop(
      Animated.parallel([
        Animated.timing(radarScale, {
          toValue: 1.5,
          duration: 2500,
          easing: Easing.out(Easing.ease),
          useNativeDriver: true,
        }),
        Animated.sequence([
          Animated.timing(radarOpacity, {
            toValue: 0.4,
            duration: 1200,
            useNativeDriver: true,
          }),
          Animated.timing(radarOpacity, {
            toValue: 0,
            duration: 1300,
            useNativeDriver: true,
          }),
        ]),
      ]),
    ).start();

    // 3. Continuous Logo Float Loop
    Animated.loop(
      Animated.sequence([
        Animated.timing(logoFloat, {
          toValue: -6,
          duration: 2000,
          easing: Easing.inOut(Easing.ease),
          useNativeDriver: true,
        }),
        Animated.timing(logoFloat, {
          toValue: 0,
          duration: 2000,
          easing: Easing.inOut(Easing.ease),
          useNativeDriver: true,
        }),
      ]),
    ).start();
  }, []);

  const handlePressIn = () => {
    Animated.spring(buttonScale, {
      toValue: 0.95,
      useNativeDriver: true,
    }).start();
  };
  const handlePressOut = () => {
    Animated.spring(buttonScale, { toValue: 1, useNativeDriver: true }).start();
  };

  return (
    <KeyboardAvoidingView
      style={styles.root}
      behavior={Platform.OS === "ios" ? "padding" : "height"}
    >
      <StatusBar style="dark" />

      <View style={styles.gridOverlay} />

      <View style={styles.inner}>
        <View style={styles.header}>
          {/* Tactical Logo Icon with Continuous Floating & Pulse */}
          <View style={styles.logoWrapper}>
            <Animated.View
              style={[
                styles.logoContainer,
                {
                  transform: [{ scale: logoPop }, { translateY: logoFloat }],
                },
              ]}
            >
              <View style={styles.logoInner}>
                <Text style={styles.deltaChar}>Δ</Text>
              </View>
            </Animated.View>

            {/* Animated Radar Ring */}
            <Animated.View
              style={[
                styles.radarRing,
                {
                  opacity: radarOpacity,
                  transform: [{ scale: radarScale }],
                },
              ]}
            />
          </View>

          <Animated.Text style={[styles.brand, { opacity: fadeAnim }]}>
            Digital <Text style={{ color: theme.primary }}>Delta</Text>
          </Animated.Text>

          <Animated.View
            style={[
              styles.mottoContainer,
              { opacity: fadeAnim, transform: [{ translateY: slideAnim }] },
            ]}
          >
            <View style={styles.mottoDecor} />
            <Text style={styles.tagline}>
              Resilient Logistics & Mesh Triage{"\n"}
              <Text style={styles.taglineBold}>
                Engine for Disaster Response
              </Text>
            </Text>
            <View style={[styles.mottoDecor, { alignSelf: "flex-end" }]} />
          </Animated.View>
        </View>

        <Animated.View
          style={[
            styles.form,
            { opacity: fadeAnim, transform: [{ translateY: slideAnim }] },
          ]}
        >
          <View style={styles.inputGroup}>
            <Text style={styles.label}>Username</Text>
            <TextInput
              value={username}
              onChangeText={setUsername}
              placeholder="Enter credentials..."
              placeholderTextColor={theme.gray}
              autoCapitalize="none"
              style={styles.input}
            />
          </View>

          <View style={styles.inputGroup}>
            <Text style={styles.label}>Password</Text>
            <TextInput
              value={password}
              onChangeText={setPassword}
              placeholder="••••••••"
              placeholderTextColor={theme.gray}
              secureTextEntry
              style={styles.input}
            />
          </View>

          <Pressable
            onPressIn={handlePressIn}
            onPressOut={handlePressOut}
            onPress={onLogin}
          >
            <Animated.View
              style={[styles.button, { transform: [{ scale: buttonScale }] }]}
            >
              <Text style={styles.buttonText}>LOGIN</Text>
            </Animated.View>
          </Pressable>

          <Text style={styles.footerNote}>SECURE ENCRYPTED CHANNEL</Text>
        </Animated.View>
      </View>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  root: {
    flex: 1,
    backgroundColor: theme.background,
  },
  gridOverlay: {
    position: "absolute",
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    opacity: 0.03,
    backgroundColor: theme.secondary,
  },
  inner: {
    flex: 1,
    paddingHorizontal: 32,
    justifyContent: "center",
  },
  header: {
    alignItems: "center",
    marginBottom: 40,
  },
  logoWrapper: {
    justifyContent: "center",
    alignItems: "center",
    marginBottom: 20,
    height: 120,
    width: 120,
  },
  logoContainer: {
    width: 90,
    height: 90,
    backgroundColor: theme.secondary,
    borderRadius: 24,
    justifyContent: "center",
    alignItems: "center",
    shadowColor: theme.primary,
    shadowOffset: { width: 0, height: 10 },
    shadowOpacity: 0.3,
    shadowRadius: 20,
    elevation: 12,
    zIndex: 2,
  },
  logoInner: {
    width: 45,
    height: 45,
    borderWidth: 2,
    borderColor: "rgba(255,255,255,0.15)",
    borderRadius: 12,
    justifyContent: "center",
    alignItems: "center",
  },
  deltaChar: {
    color: "#FFF",
    fontSize: 36,
    fontWeight: "300",
    marginTop: -4,
  },
  radarRing: {
    position: "absolute",
    width: 90,
    height: 90,
    borderRadius: 45,
    borderWidth: 2,
    borderColor: theme.primary,
    zIndex: 1,
  },
  brand: {
    fontSize: 34,
    fontWeight: "900",
    color: theme.secondary,
    letterSpacing: -1,
  },
  mottoContainer: {
    marginTop: 12,
    width: "100%",
    alignItems: "center",
  },
  mottoDecor: {
    width: 40,
    height: 3,
    backgroundColor: theme.accent,
    borderRadius: 2,
    marginVertical: 8,
  },
  tagline: {
    fontSize: 13,
    color: theme.secondary,
    textAlign: "center",
    fontWeight: "500",
    lineHeight: 18,
    letterSpacing: 0.5,
    textTransform: "uppercase",
  },
  taglineBold: {
    color: theme.primary,
    fontWeight: "800",
  },
  form: {
    width: "100%",
  },
  inputGroup: {
    marginBottom: 18,
  },
  label: {
    fontSize: 11,
    fontWeight: "800",
    color: theme.gray,
    marginBottom: 8,
    textTransform: "uppercase",
    letterSpacing: 1,
  },
  input: {
    backgroundColor: theme.white,
    borderRadius: 16,
    paddingHorizontal: 18,
    paddingVertical: Platform.OS === "ios" ? 16 : 14,
    fontSize: 16,
    color: theme.secondary,
    borderWidth: 1.5,
    borderColor: "#EDF2F7",
  },
  button: {
    backgroundColor: theme.primary,
    borderRadius: 18,
    height: 64,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    marginTop: 10,
    shadowColor: theme.primary,
    shadowOffset: { width: 0, height: 10 },
    shadowOpacity: 0.4,
    shadowRadius: 15,
    elevation: 8,
  },
  buttonText: {
    color: theme.white,
    fontSize: 15,
    fontWeight: "800",
    letterSpacing: 1,
  },
  footerNote: {
    textAlign: "center",
    marginTop: 30,
    fontSize: 10,
    fontWeight: "700",
    color: theme.gray,
    letterSpacing: 2,
  },
});

import React, { useState, useRef } from "react";
import {
  StyleSheet,
  View,
  Pressable,
  Text,
  Animated,
  Dimensions,
  Easing,
  PanResponder,
} from "react-native";
import { useNavigation } from "@react-navigation/native";
import { LinearGradient } from "expo-linear-gradient";
import { MaterialCommunityIcons } from "@expo/vector-icons";
import DashboardScreen from "./DashboardScreen";

const { width, height } = Dimensions.get("window");

const theme = {
  primary: "#F04E36",
  primaryLight: "#FF7E6B",
  primaryDark: "#D63A25",
  secondary: "#081F2E",
  accent: "#EAB308",
  background: "#F9FAFB",
  white: "#FFFFFF",
  gray: "#94A3B8",
  glass: "rgba(8, 31, 46, 0.96)",
};

export default function HomeScreen() {
  const navigation = useNavigation();
  const [isSidebarOpen, setSidebarOpen] = useState(false);

  // Animation Refs
  const sidebarTranslateX = useRef(new Animated.Value(-width)).current;
  const fadeAnim = useRef(new Animated.Value(0)).current;

  // Swipe Gesture Handling (Closes sidebar on left swipe)
  const panResponder = useRef(
    PanResponder.create({
      onMoveShouldSetPanResponder: (_, gestureState) => gestureState.dx < -20,
      onPanResponderMove: (_, gestureState) => {
        if (gestureState.dx < 0) {
          sidebarTranslateX.setValue(gestureState.dx);
        }
      },
      onPanResponderRelease: (_, gestureState) => {
        if (gestureState.dx < -width / 4) {
          toggleSidebar(false);
        } else {
          Animated.spring(sidebarTranslateX, {
            toValue: 0,
            useNativeDriver: true,
          }).start();
        }
      },
    }),
  ).current;

  const toggleSidebar = (open) => {
    if (open) setSidebarOpen(true);

    Animated.parallel([
      Animated.timing(sidebarTranslateX, {
        toValue: open ? 0 : -width,
        duration: 400,
        easing: Easing.bezier(0.25, 1, 0.5, 1),
        useNativeDriver: true,
      }),
      Animated.timing(fadeAnim, {
        toValue: open ? 1 : 0,
        duration: 300,
        useNativeDriver: true,
      }),
    ]).start(() => {
      if (!open) setSidebarOpen(false);
    });
  };

  return (
    <View style={styles.root}>
      <DashboardScreen />

      {/* Header Area */}
      <View style={styles.header}>
        <Pressable style={styles.menuBtn} onPress={() => toggleSidebar(true)}>
          <View style={styles.menuIconBar} />
          <View style={[styles.menuIconBar, { width: 14 }]} />
          <View style={styles.menuIconBar} />
        </Pressable>
      </View>

      {/* Aesthetic Scan FAB */}
      <View style={styles.fabContainer}>
        <Pressable
          style={({ pressed }) => [
            styles.scanFab,
            pressed && { transform: [{ scale: 0.94 }] },
          ]}
          onPress={() => navigation.navigate("QRScan")}
        >
          <LinearGradient
            colors={[theme.primaryLight, theme.primary, theme.primaryDark]}
            style={styles.gradient}
          >
            <View style={styles.innerGlow} />
            <MaterialCommunityIcons
              name="qrcode-scan"
              size={30}
              color={theme.white}
            />
          </LinearGradient>
        </Pressable>
      </View>

      {/* Full Screen Glass Sidebar */}
      {isSidebarOpen && (
        <View style={styles.overlayContainer}>
          <Animated.View
            {...panResponder.panHandlers}
            style={[
              styles.sidebar,
              {
                opacity: fadeAnim,
                transform: [{ translateX: sidebarTranslateX }],
              },
            ]}
          >
            <Pressable
              onPress={() => toggleSidebar(false)}
              style={styles.closeBtn}
            >
              <MaterialCommunityIcons
                name="close"
                size={24}
                color={theme.white}
              />
            </Pressable>

            <View style={styles.sidebarContent}>
              <View style={styles.sidebarHeader}>
                <View style={styles.miniLogo}>
                  <Text style={styles.deltaChar}>Δ</Text>
                </View>
                <Text style={styles.sidebarTitle}>
                  Digital <Text style={{ color: theme.primary }}>Delta</Text>
                </Text>
                <View style={styles.statusBadge}>
                  <View style={styles.statusDot} />
                  <Text style={styles.statusText}>LOGISTICS NODE ACTIVE</Text>
                </View>
              </View>

              <View style={styles.navSection}>
                <SidebarItem
                  label="Duty Management"
                  icon="clipboard-text-outline"
                />
                <SidebarItem
                  label="Network Mesh"
                  icon="transit-connection-variant"
                />
                <SidebarItem label="Inventory" icon="package-variant-closed" />
                <SidebarItem label="System Settings" icon="cog-outline" />
              </View>

              <View style={styles.sidebarFooter}>
                <Text style={styles.versionText}>SECURE ENCRYPTED CHANNEL</Text>
                <View style={styles.footerLine} />
              </View>
            </View>
          </Animated.View>
        </View>
      )}
    </View>
  );
}

const SidebarItem = ({ label, icon }) => (
  <Pressable
    style={({ pressed }) => [
      styles.sidebarItem,
      pressed && styles.sidebarItemPressed,
    ]}
  >
    <View style={styles.itemIconContainer}>
      <MaterialCommunityIcons name={icon} size={22} color={theme.white} />
    </View>
    <Text style={styles.sidebarItemText}>{label}</Text>
  </Pressable>
);

const styles = StyleSheet.create({
  root: { flex: 1, backgroundColor: theme.secondary },

  header: {
    position: "absolute",
    top: 50,
    left: 20,
    zIndex: 10,
  },
  menuBtn: {
    width: 50,
    height: 50,
    backgroundColor: theme.white,
    borderRadius: 15,
    justifyContent: "center",
    alignItems: "center",
    elevation: 8,
    shadowColor: "#000",
    shadowOpacity: 0.15,
    shadowRadius: 10,
  },
  menuIconBar: {
    width: 20,
    height: 2.5,
    backgroundColor: theme.secondary,
    marginVertical: 2,
    borderRadius: 5,
  },

  // FAB Styling
  fabContainer: {
    position: "absolute",
    bottom: 40,
    width: "100%",
    alignItems: "center",
  },
  scanFab: {
    width: 78,
    height: 78,
    borderRadius: 39,
    elevation: 15,
    shadowColor: theme.primary,
    shadowOpacity: 0.5,
    shadowRadius: 15,
    shadowOffset: { width: 0, height: 8 },
  },
  gradient: {
    flex: 1,
    borderRadius: 39,
    justifyContent: "center",
    alignItems: "center",
    borderWidth: 1.5,
    borderColor: "rgba(255,255,255,0.2)",
    overflow: "hidden",
  },
  innerGlow: {
    position: "absolute",
    top: 0,
    width: "100%",
    height: "50%",
    backgroundColor: "rgba(255,255,255,0.12)",
  },

  // Sidebar Styling
  overlayContainer: {
    ...StyleSheet.absoluteFillObject,
    zIndex: 100,
  },
  sidebar: {
    position: "absolute",
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    width: "100%",
    height: "100%",
    backgroundColor: theme.glass,
    paddingTop: 60,
    paddingHorizontal: 30,
  },
  closeBtn: {
    position: "absolute",
    top: 55,
    right: 25,
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: "rgba(255,255,255,0.1)",
    justifyContent: "center",
    alignItems: "center",
    borderWidth: 1,
    borderColor: "rgba(255,255,255,0.1)",
  },
  sidebarContent: { flex: 1 },
  sidebarHeader: { marginBottom: 40, marginTop: 20 },
  miniLogo: {
    width: 50,
    height: 50,
    backgroundColor: theme.primary,
    borderRadius: 12,
    justifyContent: "center",
    alignItems: "center",
    marginBottom: 20,
  },
  deltaChar: { color: theme.white, fontSize: 24, fontWeight: "300" },
  sidebarTitle: {
    color: theme.white,
    fontSize: 32,
    fontWeight: "900",
    letterSpacing: -1,
  },
  statusBadge: { flexDirection: "row", alignItems: "center", marginTop: 12 },
  statusDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: "#2FC94E",
    marginRight: 8,
  },
  statusText: {
    fontSize: 10,
    color: theme.gray,
    fontWeight: "800",
    letterSpacing: 1.5,
  },

  navSection: { flex: 1 },
  sidebarItem: {
    flexDirection: "row",
    alignItems: "center",
    paddingVertical: 18,
    borderBottomWidth: 1,
    borderBottomColor: "rgba(255,255,255,0.05)",
  },
  sidebarItemPressed: { backgroundColor: "rgba(255,255,255,0.05)" },
  itemIconContainer: {
    width: 42,
    height: 42,
    borderRadius: 12,
    backgroundColor: "rgba(255,255,255,0.08)",
    justifyContent: "center",
    alignItems: "center",
    marginRight: 16,
  },
  sidebarItemText: { color: theme.white, fontSize: 16, fontWeight: "500" },

  sidebarFooter: { marginBottom: 40 },
  versionText: {
    fontSize: 10,
    color: theme.gray,
    fontWeight: "700",
    letterSpacing: 2,
    textAlign: "center",
  },
  footerLine: {
    height: 2,
    backgroundColor: theme.primary,
    width: 30,
    alignSelf: "center",
    marginTop: 12,
    borderRadius: 1,
  },
});

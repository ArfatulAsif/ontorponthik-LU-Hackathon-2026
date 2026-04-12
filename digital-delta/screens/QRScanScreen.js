import React, { useState, useEffect, useRef } from "react";
import {
  StyleSheet,
  View,
  Text,
  Pressable,
  ScrollView,
  Platform,
  Animated,
  Easing,
} from "react-native";
import { useNavigation } from "@react-navigation/native";
import { CameraView, useCameraPermissions } from "expo-camera";
import { StatusBar } from "expo-status-bar";
import { LinearGradient } from "expo-linear-gradient";
import { MaterialCommunityIcons } from "@expo/vector-icons";

const theme = {
  primary: "#F04E36",
  primaryLight: "#FF7E6B",
  primaryDark: "#D63A25",
  secondary: "#081F2E",
  background: "#F9FAFB",
  white: "#FFFFFF",
  gray: "#94A3B8",
  inputBg: "#F1F5F9",
};

const NODES = [
  { id: "N2", name: "Osmani Airport Node", type: "supply_drop" },
  { id: "N3", name: "Sunamganj Sadar Camp", type: "relief_camp" },
  { id: "N4", name: "Companyganj Outpost", type: "relief_camp" },
  { id: "N7", name: "Gowainghat Camp", type: "relief_camp" },
  { id: "N8", name: "Jaintiapur Camp", type: "relief_camp" },
  { id: "N9", name: "Bishwanath Camp", type: "relief_camp" },
  { id: "N10", name: "Golapganj Camp", type: "relief_camp" },
  { id: "N11", name: "Derai Camp", type: "relief_camp" },
  { id: "N12", name: "Chhatak Camp", type: "relief_camp" },
  { id: "N13", name: "Zakiganj Camp", type: "relief_camp" },
];

export default function QRScanScreen() {
  const navigation = useNavigation();
  const [permission, requestPermission] = useCameraPermissions();
  const [selectedNode, setSelectedNode] = useState(null);
  const [dropdownOpen, setDropdownOpen] = useState(false);

  const scanLineAnim = useRef(new Animated.Value(0)).current;
  const fadeAnim = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    requestPermission();

    Animated.timing(fadeAnim, {
      toValue: 1,
      duration: 600,
      useNativeDriver: true,
    }).start();

    Animated.loop(
      Animated.sequence([
        Animated.timing(scanLineAnim, {
          toValue: 1,
          duration: 2000,
          easing: Easing.linear,
          useNativeDriver: true,
        }),
        Animated.timing(scanLineAnim, {
          toValue: 0,
          duration: 2000,
          easing: Easing.linear,
          useNativeDriver: true,
        }),
      ]),
    ).start();
  }, []);

  const handleProceed = () => {
    if (selectedNode) {
      navigation.navigate("RouteOptimization", { destination: selectedNode });
    }
  };

  if (!permission) return <View style={styles.root} />;
  if (!permission.granted) {
    return (
      <View style={styles.root}>
        <Text style={styles.label}>
          Camera permission is required to scan QR codes.
        </Text>
        <Pressable style={styles.okBtn} onPress={requestPermission}>
          <Text style={styles.okText}>GRANT PERMISSION</Text>
        </Pressable>
      </View>
    );
  }

  // Interpolate based on the wrapper height (320px)
  const translateY = scanLineAnim.interpolate({
    inputRange: [0, 1],
    outputRange: [10, 310],
  });

  return (
    <Animated.View style={[styles.root, { opacity: fadeAnim }]}>
      <StatusBar style="dark" />

      <View style={styles.header}>
        <Pressable onPress={() => navigation.goBack()} style={styles.backBtn}>
          <MaterialCommunityIcons
            name="chevron-left"
            size={28}
            color={theme.secondary}
          />
          <Text style={styles.backText}>BACK TO HUB</Text>
        </Pressable>
        <View style={styles.headerLine} />
      </View>

      <View style={styles.cameraWrapper}>
        <CameraView style={styles.camera} facing="back">
          <View style={styles.reticleContainer}>
            {/* Corner Accents - Now pinned to the wrapper edges */}
            <View style={[styles.corner, styles.topLeft]} />
            <View style={[styles.corner, styles.topRight]} />
            <View style={[styles.corner, styles.bottomLeft]} />
            <View style={[styles.corner, styles.bottomRight]} />

            {/* Full-width Animated Scan Line */}
            <Animated.View
              style={[styles.scanLine, { transform: [{ translateY }] }]}
            />
          </View>
        </CameraView>
        <View style={styles.cameraStatus}>
          <View style={styles.statusDot} />
          <Text style={styles.statusText}>SCANNER ACTIVE</Text>
        </View>
      </View>

      <View style={styles.bottomSection}>
        <Text style={styles.label}>DESTINATION NODE</Text>

        <Pressable
          style={[styles.dropdown, dropdownOpen && styles.dropdownActive]}
          onPress={() => setDropdownOpen(!dropdownOpen)}
        >
          <Text
            style={[
              styles.dropdownText,
              !selectedNode && { color: theme.gray },
            ]}
          >
            {selectedNode ? selectedNode.name : "SELECT RELIEF SHELTER"}
          </Text>
          <MaterialCommunityIcons
            name={dropdownOpen ? "chevron-up" : "chevron-down"}
            size={20}
            color={theme.secondary}
          />
        </Pressable>

        {dropdownOpen && (
          <View style={styles.listContainer}>
            <ScrollView
              nestedScrollEnabled
              showsVerticalScrollIndicator={false}
            >
              {NODES.map((node) => (
                <Pressable
                  key={node.id}
                  style={styles.listItem}
                  onPress={() => {
                    setSelectedNode(node);
                    setDropdownOpen(false);
                  }}
                >
                  <MaterialCommunityIcons
                    name="map-marker-radius"
                    size={18}
                    color={theme.primary}
                  />
                  <Text style={styles.listText}>{node.name}</Text>
                </Pressable>
              ))}
            </ScrollView>
          </View>
        )}

        <Pressable
          style={({ pressed }) => [
            styles.okBtn,
            !selectedNode && styles.okBtnDisabled,
            pressed && { transform: [{ scale: 0.98 }] },
          ]}
          onPress={handleProceed}
          disabled={!selectedNode}
        >
          <LinearGradient
            colors={
              !selectedNode
                ? [theme.gray, theme.gray]
                : [theme.primaryLight, theme.primary, theme.primaryDark]
            }
            style={styles.btnGradient}
          >
            <Text style={styles.okText}>CALCULATE OPTIMUM ROUTE</Text>
            <MaterialCommunityIcons
              name="navigation-variant"
              size={18}
              color={theme.white}
              style={{ marginLeft: 8 }}
            />
          </LinearGradient>
        </Pressable>
      </View>
    </Animated.View>
  );
}

const styles = StyleSheet.create({
  root: {
    flex: 1,
    backgroundColor: theme.background,
    paddingTop: Platform.OS === "ios" ? 60 : 40,
    paddingHorizontal: 25,
  },
  header: {
    marginBottom: 30,
  },
  backBtn: {
    flexDirection: "row",
    alignItems: "center",
    marginLeft: -8,
  },
  backText: {
    color: theme.secondary,
    fontSize: 12,
    fontWeight: "800",
    letterSpacing: 2,
  },
  headerLine: {
    height: 3,
    width: 40,
    backgroundColor: theme.primary,
    marginTop: 10,
    borderRadius: 2,
  },
  cameraWrapper: {
    height: 320,
    borderRadius: 24,
    overflow: "hidden",
    backgroundColor: "#000",
    elevation: 10,
    shadowColor: "#000",
    shadowOpacity: 0.2,
    shadowRadius: 15,
  },
  camera: { flex: 1 },
  reticleContainer: {
    flex: 1,
    padding: 20, // Padding from the camera edges
    position: "relative",
  },
  corner: {
    position: "absolute",
    width: 40,
    height: 40,
    borderColor: theme.primary,
  },
  topLeft: {
    top: 15,
    left: 15,
    borderTopWidth: 4,
    borderLeftWidth: 4,
    borderTopLeftRadius: 20,
  },
  topRight: {
    top: 15,
    right: 15,
    borderTopWidth: 4,
    borderRightWidth: 4,
    borderTopRightRadius: 20,
  },
  bottomLeft: {
    bottom: 15,
    left: 15,
    borderBottomWidth: 4,
    borderLeftWidth: 4,
    borderBottomLeftRadius: 20,
  },
  bottomRight: {
    bottom: 15,
    right: 15,
    borderBottomWidth: 4,
    borderRightWidth: 4,
    borderBottomRightRadius: 20,
  },
  scanLine: {
    width: "100%",
    height: 3,
    backgroundColor: theme.primary,
    shadowColor: theme.primary,
    shadowOpacity: 1,
    shadowRadius: 10,
    elevation: 10,
  },
  cameraStatus: {
    position: "absolute",
    bottom: 15,
    alignSelf: "center",
    backgroundColor: "rgba(8, 31, 46, 0.8)",
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 20,
    flexDirection: "row",
    alignItems: "center",
  },
  statusDot: {
    width: 6,
    height: 6,
    borderRadius: 3,
    backgroundColor: "#2FC94E",
    marginRight: 8,
  },
  statusText: {
    color: theme.white,
    fontSize: 9,
    fontWeight: "900",
    letterSpacing: 1,
  },
  bottomSection: { flex: 1, marginTop: 40 },
  label: {
    color: theme.gray,
    marginBottom: 12,
    fontSize: 11,
    fontWeight: "900",
    letterSpacing: 1.5,
  },
  dropdown: {
    backgroundColor: theme.white,
    padding: 18,
    borderRadius: 16,
    borderWidth: 1.5,
    borderColor: "#EDF2F7",
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  dropdownActive: { borderColor: theme.primary },
  dropdownText: { color: theme.secondary, fontSize: 15, fontWeight: "600" },
  listContainer: {
    backgroundColor: theme.white,
    maxHeight: 180,
    borderRadius: 16,
    marginTop: 8,
    borderWidth: 1.5,
    borderColor: "#EDF2F7",
    overflow: "hidden",
    elevation: 5,
    shadowColor: "#000",
    shadowOpacity: 0.05,
    shadowRadius: 10,
  },
  listItem: {
    padding: 18,
    borderBottomWidth: 1,
    borderBottomColor: "#F1F5F9",
    flexDirection: "row",
    alignItems: "center",
  },
  listText: { color: theme.secondary, marginLeft: 12, fontWeight: "500" },
  okBtn: {
    marginTop: 30,
    height: 64,
    borderRadius: 18,
    overflow: "hidden",
    elevation: 8,
    shadowColor: theme.primary,
    shadowOpacity: 0.3,
    shadowRadius: 12,
    shadowOffset: { width: 0, height: 6 },
  },
  btnGradient: {
    flex: 1,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
  },
  okBtnDisabled: { opacity: 0.5, elevation: 0 },
  okText: {
    color: theme.white,
    fontWeight: "800",
    letterSpacing: 1,
    fontSize: 14,
  },
});

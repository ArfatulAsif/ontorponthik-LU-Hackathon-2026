import { Platform, ScrollView, StyleSheet, Text, View } from "react-native";

/**
 * @param {{ lines: string[], title?: string }} props
 */
export default function BootLogPanel({ lines, title = "Engine log" }) {
  return (
    <View style={styles.wrap}>
      <Text style={styles.title}>{title}</Text>
      <ScrollView
        style={styles.scroll}
        contentContainerStyle={styles.scrollContent}
        nestedScrollEnabled
      >
        {lines.length === 0 ? (
          <Text style={styles.lineMuted}>No log lines yet…</Text>
        ) : (
          lines.map((line, i) => (
            <Text key={`${i}-${line.slice(0, 24)}`} style={styles.line}>
              {line}
            </Text>
          ))
        )}
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  wrap: {
    maxHeight: 220,
    marginTop: 12,
    borderWidth: StyleSheet.hairlineWidth,
    borderColor: "rgba(255,255,255,0.25)",
    borderRadius: 8,
    overflow: "hidden",
    backgroundColor: "rgba(0,0,0,0.35)",
  },
  title: {
    paddingHorizontal: 10,
    paddingVertical: 6,
    fontSize: 12,
    fontWeight: "600",
    color: "#a8e6cf",
    borderBottomWidth: StyleSheet.hairlineWidth,
    borderBottomColor: "rgba(255,255,255,0.15)",
  },
  scroll: {
    maxHeight: 180,
  },
  scrollContent: {
    padding: 10,
    paddingBottom: 14,
  },
  line: {
    fontFamily: Platform.select({ ios: "Menlo", android: "monospace", default: "monospace" }),
    fontSize: 11,
    lineHeight: 16,
    color: "#e8e8e8",
    marginBottom: 4,
  },
  lineMuted: {
    fontSize: 12,
    color: "rgba(255,255,255,0.45)",
  },
});

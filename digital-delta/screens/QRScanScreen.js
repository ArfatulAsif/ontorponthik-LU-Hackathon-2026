import React, { useState } from 'react';
import { StyleSheet, View, Text, Pressable, ScrollView, Platform } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { StatusBar } from 'expo-status-bar';
import { colors } from '../theme';

// 1. Import centralized nodes from the data folder
import { NODES } from '../data';

export default function QRScanScreen() {
  const navigation = useNavigation();
  const [selectedNode, setSelectedNode] = useState(null);
  const [dropdownOpen, setDropdownOpen] = useState(false);

  const handleProceed = () => {
    if (selectedNode) {
      navigation.navigate('RouteOptimization', { destination: selectedNode });
    }
  };

  // 2. Filter the nodes to only include relief camps and supply drops
  const filteredNodes = NODES.filter(
    node => node.type === 'relief_camp' || node.type === 'supply_drop'
  );

  return (
    <View style={styles.root}>
      <StatusBar style="light" />
      <Pressable onPress={() => navigation.goBack()} style={styles.backBtn}>
        <Text style={styles.backText}>← Back to Map</Text>
      </Pressable>

      {/* Dummy Camera View */}
      <View style={styles.cameraBox}>
        <View style={styles.scannerReticle}>
          <Text style={styles.cameraText}>CAMERA ACTIVE</Text>
        </View>
      </View>

      {/* Dropdown Section */}
      <View style={styles.bottomSection}>
        <Text style={styles.label}>Select Relief Shelter Destination:</Text>
        
        <Pressable style={styles.dropdown} onPress={() => setDropdownOpen(!dropdownOpen)}>
          <Text style={styles.dropdownText}>
            {selectedNode ? selectedNode.name : "-- Select Destination --"}
          </Text>
        </Pressable>

        {dropdownOpen && (
          <View style={styles.listContainer}>
            <ScrollView nestedScrollEnabled>
              {/* 3. Map over the filtered nodes instead of the hardcoded list */}
              {filteredNodes.map(node => (
                <Pressable 
                  key={node.id} 
                  style={styles.listItem}
                  onPress={() => {
                    setSelectedNode(node);
                    setDropdownOpen(false);
                  }}
                >
                  <Text style={styles.listText}>{node.name}</Text>
                </Pressable>
              ))}
            </ScrollView>
          </View>
        )}

        <Pressable 
          style={[styles.okBtn, !selectedNode && styles.okBtnDisabled]} 
          onPress={handleProceed}
          disabled={!selectedNode}
        >
          <Text style={styles.okText}>CALCULATE OPTIMUM ROUTE</Text>
        </Pressable>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  root: { flex: 1, backgroundColor: colors.background, paddingTop: Platform.OS === 'ios' ? 60 : 40, paddingHorizontal: 20 },
  backBtn: { marginBottom: 20 },
  backText: { color: colors.textMuted, fontSize: 16 },
  cameraBox: { height: 300, backgroundColor: '#000', borderRadius: 16, justifyContent: 'center', alignItems: 'center', borderWidth: 2, borderColor: colors.surface },
  scannerReticle: { width: 200, height: 200, borderWidth: 2, borderColor: colors.primary, borderStyle: 'dashed', justifyContent: 'center', alignItems: 'center' },
  cameraText: { color: colors.primary, fontWeight: 'bold' },
  bottomSection: { flex: 1, marginTop: 40 },
  label: { color: colors.textMuted, marginBottom: 10, fontSize: 14 },
  dropdown: { backgroundColor: colors.surface, padding: 16, borderRadius: 8, borderWidth: 1, borderColor: colors.inputBorder },
  dropdownText: { color: colors.text, fontSize: 16 },
  listContainer: { backgroundColor: colors.surface, maxHeight: 200, borderRadius: 8, marginTop: 5, borderWidth: 1, borderColor: colors.inputBorder },
  listItem: { padding: 16, borderBottomWidth: 1, borderBottomColor: colors.inputBorder },
  listText: { color: colors.text },
  okBtn: { backgroundColor: colors.primary, padding: 16, borderRadius: 8, alignItems: 'center', marginTop: 30 },
  okBtnDisabled: { opacity: 0.5 },
  okText: { color: '#fff', fontWeight: 'bold' }
});
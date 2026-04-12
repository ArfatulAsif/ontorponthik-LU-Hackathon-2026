import React, { useState } from 'react';
import { StyleSheet, View, Pressable, Text } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import DashboardScreen from './DashboardScreen';
import { colors } from '../theme';

export default function HomeScreen() {
  const navigation = useNavigation();
  const [isSidebarOpen, setSidebarOpen] = useState(false);

  return (
    <View style={styles.root}>
      {/* Background Map (Untouched) */}
      <DashboardScreen />

      {/* Floating Menu Button */}
      <Pressable style={styles.menuBtn} onPress={() => setSidebarOpen(true)}>
        <Text style={styles.menuIcon}>☰</Text>
      </Pressable>

      {/* Floating QR Footer */}
      <View style={styles.footer}>
        <Pressable 
          style={styles.qrButton} 
          onPress={() => navigation.navigate('QRScan')}
        >
          <Text style={styles.qrText}>[ 📷 Scan Supply QR ]</Text>
        </Pressable>
      </View>

      {/* Standard React Sidebar Overlay (No Babel/Moti required) */}
      {isSidebarOpen && (
        <View style={styles.overlayContainer}>
          <Pressable style={styles.overlayBg} onPress={() => setSidebarOpen(false)} />
          <View style={styles.sidebar}>
            <Text style={styles.sidebarTitle}>Digital Delta</Text>
            <Pressable style={styles.sidebarItem}>
              <Text style={styles.sidebarItemText}>User Duty Management</Text>
            </Pressable>
            <Pressable style={styles.sidebarItem}>
              <Text style={styles.sidebarItemText}>Settings</Text>
            </Pressable>
          </View>
        </View>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  root: { flex: 1 },
  menuBtn: { position: 'absolute', top: 50, left: 20, width: 48, height: 48, backgroundColor: colors.surface, borderRadius: 24, justifyContent: 'center', alignItems: 'center', elevation: 5 },
  menuIcon: { color: colors.text, fontSize: 24 },
  footer: { position: 'absolute', bottom: 40, width: '100%', alignItems: 'center' },
  qrButton: { backgroundColor: colors.primary, paddingVertical: 16, paddingHorizontal: 32, borderRadius: 30, elevation: 5 },
  qrText: { color: '#fff', fontSize: 16, fontWeight: '700' },
  overlayContainer: { ...StyleSheet.absoluteFillObject, zIndex: 10, flexDirection: 'row' },
  overlayBg: { flex: 1, backgroundColor: 'rgba(0,0,0,0.5)' },
  sidebar: { position: 'absolute', left: 0, width: 280, height: '100%', backgroundColor: colors.surface, paddingTop: 60, paddingHorizontal: 20 },
  sidebarTitle: { color: colors.text, fontSize: 22, fontWeight: 'bold', marginBottom: 40 },
  sidebarItem: { paddingVertical: 15, borderBottomWidth: 1, borderBottomColor: colors.inputBorder },
  sidebarItemText: { color: colors.textMuted, fontSize: 16 }
});
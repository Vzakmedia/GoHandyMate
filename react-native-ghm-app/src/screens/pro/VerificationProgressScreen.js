import React from 'react';
import {
  View, Text, StyleSheet, ScrollView, StatusBar, TouchableOpacity,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { Colors } from '../../theme/colors';
import { BorderRadius } from '../../theme/spacing';

const IDENTITY_ITEMS = [
  { icon: 'card-outline', label: 'Government ID', sub: "Driver's License or Passport", status: 'VERIFIED', statusColor: Colors.primaryDark, statusBg: Colors.primaryLight },
  { icon: 'camera-outline', label: 'Selfie Verification', sub: 'Face match with ID', status: 'VERIFIED', statusColor: Colors.primaryDark, statusBg: Colors.primaryLight },
];

const BACKGROUND_ITEMS = [
  { icon: 'document-outline', label: 'Criminal Record', sub: 'National database check', status: 'PENDING', statusColor: Colors.warning, statusBg: Colors.warningLight },
];

const LICENSE_ITEMS = [
  { icon: 'ribbon-outline', label: 'Trade License', sub: 'Required for specific jobs', status: 'REQUIRED', statusColor: '#B45309', statusBg: '#FEF3C7' },
  { icon: 'shield-outline', label: 'Liability Insurance', sub: null, status: null },
];

function SectionBlock({ iconName, iconBg, iconColor, title, items }) {
  return (
    <View style={styles.sectionCard}>
      <View style={styles.sectionHeader}>
        <View style={[styles.sectionIcon, { backgroundColor: iconBg }]}>
          <Ionicons name={iconName} size={18} color={iconColor} />
        </View>
        <Text style={styles.sectionTitle}>{title}</Text>
      </View>
      {items.map((item, i) => (
        <View key={item.label}>
          <TouchableOpacity style={styles.verificationRow}>
            <View style={styles.verRowIcon}>
              <Ionicons name={item.icon} size={18} color={Colors.primaryDark} />
            </View>
            <View style={styles.verRowInfo}>
              <Text style={styles.verRowLabel}>{item.label}</Text>
              {item.sub && <Text style={styles.verRowSub}>{item.sub}</Text>}
            </View>
            {item.status ? (
              <View style={[styles.statusBadge, { backgroundColor: item.statusBg }]}>
                <Text style={[styles.statusText, { color: item.statusColor }]}>{item.status}</Text>
              </View>
            ) : (
              <TouchableOpacity style={styles.addIconBtn}>
                <Ionicons name="add" size={18} color={Colors.textSecondary} />
              </TouchableOpacity>
            )}
            <Ionicons name="chevron-forward" size={16} color={Colors.textMuted} style={{ marginLeft: 6 }} />
          </TouchableOpacity>
          {i < items.length - 1 && <View style={styles.rowDivider} />}
        </View>
      ))}
    </View>
  );
}

export default function VerificationProgressScreen({ navigation }) {
  return (
    <SafeAreaView style={styles.safe}>
      <StatusBar barStyle="dark-content" backgroundColor={Colors.white} />

      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity style={styles.backBtn} onPress={() => navigation.goBack()}>
          <Ionicons name="chevron-back" size={22} color={Colors.textPrimary} />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Verification</Text>
        <TouchableOpacity style={styles.helpBtn}>
          <Ionicons name="help-circle-outline" size={22} color={Colors.textPrimary} />
        </TouchableOpacity>
      </View>

      <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={styles.scroll}>

        {/* Page Title */}
        <Text style={styles.pageTitle}>Documents & IDs</Text>
        <Text style={styles.pageSub}>Manage your identity, licenses, and background checks to build trust with customers.</Text>

        {/* Progress Card */}
        <View style={styles.progressCard}>
          <View style={styles.progressTopRow}>
            <Text style={styles.progressTitle}>Verification Progress</Text>
            <Text style={styles.progressPercent}>66%</Text>
          </View>
          <Text style={styles.progressSub}>You are 1 step away from becoming a verified Handymate.</Text>
          <View style={styles.progressTrack}>
            <View style={[styles.progressFill, { width: '66%' }]} />
          </View>
        </View>

        {/* Identity Verification */}
        <SectionBlock
          iconName="person-outline"
          iconBg={Colors.primaryLight}
          iconColor={Colors.primaryDark}
          title="Identity Verification"
          items={IDENTITY_ITEMS}
        />

        {/* Background Check */}
        <SectionBlock
          iconName="search-outline"
          iconBg={Colors.background}
          iconColor={Colors.textSecondary}
          title="Background Check"
          items={BACKGROUND_ITEMS}
        />

        {/* Licenses & Insurance */}
        <SectionBlock
          iconName="shield-outline"
          iconBg={Colors.warningLight}
          iconColor={Colors.warning}
          title="Licenses & Insurance"
          items={LICENSE_ITEMS}
        />

        <View style={{ height: 32 }} />
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: { flex: 1, backgroundColor: Colors.background },

  header: {
    flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between',
    backgroundColor: Colors.white, paddingHorizontal: 16, paddingVertical: 14,
    borderBottomWidth: 1, borderBottomColor: Colors.borderLight,
  },
  backBtn: { width: 36, height: 36, alignItems: 'center', justifyContent: 'center' },
  headerTitle: { fontSize: 17, fontWeight: '600', color: Colors.textPrimary },
  helpBtn: { width: 36, height: 36, alignItems: 'center', justifyContent: 'center' },

  scroll: { padding: 16 },

  pageTitle: { fontSize: 22, fontWeight: '700', color: Colors.textPrimary, marginBottom: 6 },
  pageSub: { fontSize: 13, color: Colors.textSecondary, lineHeight: 18, marginBottom: 16 },

  progressCard: {
    backgroundColor: Colors.primaryDark, borderRadius: BorderRadius.xl, padding: 18, marginBottom: 16,
  },
  progressTopRow: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 8 },
  progressTitle: { fontSize: 15, fontWeight: '700', color: Colors.white },
  progressPercent: { fontSize: 15, fontWeight: '700', color: Colors.white },
  progressSub: { fontSize: 12, color: 'rgba(255,255,255,0.8)', marginBottom: 14, lineHeight: 17 },
  progressTrack: { height: 6, backgroundColor: 'rgba(255,255,255,0.25)', borderRadius: 3 },
  progressFill: { height: 6, backgroundColor: Colors.white, borderRadius: 3 },

  sectionCard: {
    backgroundColor: Colors.white, borderRadius: BorderRadius.xl,
    borderWidth: 1, borderColor: Colors.border, overflow: 'hidden', marginBottom: 14,
  },
  sectionHeader: { flexDirection: 'row', alignItems: 'center', gap: 10, padding: 16, borderBottomWidth: 1, borderBottomColor: Colors.borderLight },
  sectionIcon: { width: 34, height: 34, borderRadius: 10, alignItems: 'center', justifyContent: 'center' },
  sectionTitle: { fontSize: 15, fontWeight: '700', color: Colors.textPrimary },

  verificationRow: { flexDirection: 'row', alignItems: 'center', paddingHorizontal: 16, paddingVertical: 14 },
  verRowIcon: {
    width: 36, height: 36, borderRadius: 8, backgroundColor: Colors.primaryLight,
    alignItems: 'center', justifyContent: 'center', marginRight: 12,
  },
  verRowInfo: { flex: 1 },
  verRowLabel: { fontSize: 14, fontWeight: '600', color: Colors.textPrimary },
  verRowSub: { fontSize: 12, color: Colors.textSecondary, marginTop: 2 },
  statusBadge: { paddingHorizontal: 10, paddingVertical: 4, borderRadius: BorderRadius.full },
  statusText: { fontSize: 10, fontWeight: '700', letterSpacing: 0.3 },
  addIconBtn: { paddingHorizontal: 4 },
  rowDivider: { height: 1, backgroundColor: Colors.borderLight, marginLeft: 64 },
});

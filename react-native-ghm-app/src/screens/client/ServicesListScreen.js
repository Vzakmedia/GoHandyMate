import React from 'react';
import {
  View, Text, StyleSheet, ScrollView, TouchableOpacity, StatusBar,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { Colors } from '../../theme/colors';
import { BorderRadius } from '../../theme/spacing';

const MOST_REQUESTED = [
  { icon: 'water-outline', label: 'General Plumbing', sub: 'Leaks, clogs, fixture replacements' },
  { icon: 'flash-outline', label: 'Electrical Help', sub: 'Outlets, switches, light fixtures' },
];

const ALL_SERVICES = [
  { icon: 'hammer-outline', label: 'General Handyman' },
  { icon: 'square-outline', label: 'Door & Window Repair' },
  { icon: 'layers-outline', label: 'Drywall Repair' },
  { icon: 'color-palette-outline', label: 'Painting & Touch-ups' },
  { icon: 'construct-outline', label: 'Carpentry' },
  { icon: 'settings-outline', label: 'Appliance Repair' },
];

export default function ServicesListScreen({ navigation, route }) {
  const category = route?.params?.category || 'Repairs & Maintenance';

  return (
    <SafeAreaView style={styles.safe}>
      <StatusBar barStyle="dark-content" backgroundColor={Colors.white} />

      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity style={styles.backBtn} onPress={() => navigation.goBack()}>
          <Ionicons name="chevron-back" size={22} color={Colors.textPrimary} />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>{category}</Text>
        <View style={{ width: 36 }} />
      </View>

      <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={styles.scroll}>
        <Text style={styles.pageTitle}>What needs fixing?</Text>
        <Text style={styles.pageSub}>
          Select a specific service below to find the right pro for your repair job.
        </Text>

        {/* Most Requested */}
        <Text style={styles.sectionLabel}>MOST REQUESTED</Text>
        <View style={styles.mostRequestedList}>
          {MOST_REQUESTED.map((item) => (
            <TouchableOpacity
              key={item.label}
              style={styles.featuredCard}
              onPress={() => navigation.navigate('ProvidersList', { service: item.label })}
            >
              <View style={styles.featuredIconWrap}>
                <Ionicons name={item.icon} size={22} color={Colors.warning} />
              </View>
              <View style={styles.featuredInfo}>
                <Text style={styles.featuredLabel}>{item.label}</Text>
                <Text style={styles.featuredSub}>{item.sub}</Text>
              </View>
              <Ionicons name="chevron-forward" size={18} color={Colors.textMuted} />
            </TouchableOpacity>
          ))}
        </View>

        {/* All Services */}
        <Text style={styles.sectionLabel}>ALL SERVICES IN CATEGORY</Text>
        <View style={styles.allServicesList}>
          {ALL_SERVICES.map((item, idx) => (
            <TouchableOpacity
              key={item.label}
              style={[styles.serviceRow, idx < ALL_SERVICES.length - 1 && styles.serviceRowBorder]}
              onPress={() => navigation.navigate('ProvidersList', { service: item.label })}
            >
              <View style={styles.serviceIconWrap}>
                <Ionicons name={item.icon} size={20} color={Colors.primaryDark} />
              </View>
              <Text style={styles.serviceLabel}>{item.label}</Text>
              <Ionicons name="chevron-forward" size={18} color={Colors.textMuted} />
            </TouchableOpacity>
          ))}
        </View>

        <View style={{ height: 32 }} />
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: { flex: 1, backgroundColor: Colors.white },

  header: {
    flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between',
    backgroundColor: Colors.white, paddingHorizontal: 12, paddingVertical: 12,
    borderBottomWidth: 1, borderBottomColor: Colors.borderLight,
  },
  backBtn: { width: 36, height: 36, alignItems: 'center', justifyContent: 'center' },
  headerTitle: { fontSize: 17, fontWeight: '700', color: Colors.textPrimary },

  scroll: { padding: 16 },

  pageTitle: { fontSize: 24, fontWeight: '800', color: Colors.textPrimary, marginBottom: 6 },
  pageSub: { fontSize: 13, color: Colors.textSecondary, lineHeight: 19, marginBottom: 22 },

  sectionLabel: { fontSize: 11, fontWeight: '700', color: Colors.textSecondary, letterSpacing: 0.8, marginBottom: 10 },

  mostRequestedList: { gap: 10, marginBottom: 26 },
  featuredCard: {
    flexDirection: 'row', alignItems: 'center',
    backgroundColor: Colors.white, borderRadius: BorderRadius.xl,
    borderWidth: 1, borderColor: Colors.border,
    padding: 16, gap: 14,
  },
  featuredIconWrap: {
    width: 44, height: 44, borderRadius: 12, backgroundColor: Colors.warningLight,
    alignItems: 'center', justifyContent: 'center',
  },
  featuredInfo: { flex: 1 },
  featuredLabel: { fontSize: 15, fontWeight: '700', color: Colors.textPrimary, marginBottom: 2 },
  featuredSub: { fontSize: 12, color: Colors.textSecondary, lineHeight: 17 },

  allServicesList: {
    backgroundColor: Colors.white, borderRadius: BorderRadius.xl,
    borderWidth: 1, borderColor: Colors.border, overflow: 'hidden',
    marginBottom: 16,
  },
  serviceRow: {
    flexDirection: 'row', alignItems: 'center',
    paddingHorizontal: 16, paddingVertical: 18, gap: 14,
  },
  serviceRowBorder: { borderBottomWidth: 1, borderBottomColor: Colors.borderLight },
  serviceIconWrap: {
    width: 40, height: 40, borderRadius: 20, backgroundColor: Colors.primaryLight,
    alignItems: 'center', justifyContent: 'center',
  },
  serviceLabel: { flex: 1, fontSize: 15, fontWeight: '600', color: Colors.textPrimary },
});

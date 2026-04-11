import React, { useState } from 'react';
import {
  View, Text, StyleSheet, ScrollView, StatusBar, TouchableOpacity, TextInput,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { Colors } from '../../theme/colors';
import { BorderRadius } from '../../theme/spacing';

const AREAS = [
  { id: 1, name: 'Downtown', sub: 'Primary service location', active: true },
  { id: 2, name: 'North Park', sub: 'Secondary location', active: true },
  { id: 3, name: 'Westside', sub: 'Occasional service', active: true },
];

export default function ServiceAreaScreen({ navigation }) {
  const [areas, setAreas] = useState(AREAS);
  const [search, setSearch] = useState('');
  const [sliderPos] = useState(0.7); // visual only

  const toggleArea = (id) => {
    setAreas(areas.map((a) => a.id === id ? { ...a, active: !a.active } : a));
  };

  return (
    <SafeAreaView style={styles.safe}>
      <StatusBar barStyle="dark-content" backgroundColor={Colors.white} />

      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity style={styles.backBtn} onPress={() => navigation.goBack()}>
          <Ionicons name="chevron-back" size={22} color={Colors.textPrimary} />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Service Area</Text>
        <View style={{ width: 36 }} />
      </View>

      <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={styles.scroll}>

        {/* Page Title */}
        <Text style={styles.pageTitle}>Service Area</Text>
        <Text style={styles.pageSub}>Define the locations where you provide services.</Text>

        {/* Map Placeholder */}
        <View style={styles.mapWrap}>
          <View style={styles.mapPlaceholder}>
            {/* Simulated map circles */}
            <View style={styles.mapCircle3} />
            <View style={styles.mapCircle2} />
            <View style={styles.mapCircle1} />
            <View style={styles.mapDot} />
            <TouchableOpacity style={styles.locateMeBtn}>
              <Ionicons name="locate-outline" size={14} color={Colors.primaryDark} />
              <Text style={styles.locateMeText}>Locate Me</Text>
            </TouchableOpacity>
            {/* Map attribution */}
            <Text style={styles.mapAttribution}>METROPOLIS PRIME</Text>
          </View>
        </View>

        {/* Add Area */}
        <View style={styles.card}>
          <Text style={styles.cardTitle}>Add Area or Zip Code</Text>
          <View style={styles.searchWrap}>
            <Ionicons name="search-outline" size={16} color={Colors.textMuted} style={{ marginRight: 8 }} />
            <TextInput
              style={styles.searchInput}
              placeholder="Search neighborhood or zip..."
              placeholderTextColor={Colors.textMuted}
              value={search}
              onChangeText={setSearch}
            />
          </View>
        </View>

        {/* Active Areas */}
        <View style={styles.card}>
          <View style={styles.activeTitleRow}>
            <Text style={styles.cardTitle}>Active Areas</Text>
            <Text style={styles.selectedCount}>{areas.filter((a) => a.active).length} selected</Text>
          </View>
          {areas.map((area, i) => (
            <View key={area.id}>
              <View style={styles.areaRow}>
                <View style={styles.areaIconWrap}>
                  <Ionicons name="location-outline" size={18} color={Colors.primaryDark} />
                </View>
                <View style={styles.areaInfo}>
                  <Text style={styles.areaName}>{area.name}</Text>
                  <Text style={styles.areaSub}>{area.sub}</Text>
                </View>
                <TouchableOpacity
                  style={[styles.areaToggle, area.active ? styles.areaToggleOff : styles.areaToggleOff]}
                  onPress={() => toggleArea(area.id)}
                >
                  <View style={[styles.areaToggleThumb, area.active && styles.areaToggleThumbActive]} />
                </TouchableOpacity>
              </View>
              {i < areas.length - 1 && <View style={styles.rowDivider} />}
            </View>
          ))}
        </View>

        {/* Service Radius */}
        <View style={styles.card}>
          <Text style={styles.cardTitle}>Service Radius</Text>
          <View style={styles.sliderWrap}>
            <View style={styles.sliderTrack}>
              <View style={[styles.sliderFill, { width: `${sliderPos * 100}%` }]} />
              <View style={[styles.sliderThumb, { left: `${sliderPos * 100 - 3}%` }]} />
            </View>
            <View style={styles.sliderLabels}>
              <Text style={styles.sliderLabel}>5 mi</Text>
              <Text style={styles.sliderLabel}>50 mi</Text>
            </View>
          </View>
        </View>

        {/* Save */}
        <TouchableOpacity style={styles.saveBtn} onPress={() => navigation.goBack()}>
          <Text style={styles.saveBtnText}>Save Changes</Text>
        </TouchableOpacity>

        <View style={{ height: 24 }} />
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

  scroll: { paddingHorizontal: 16, paddingTop: 20 },

  pageTitle: { fontSize: 24, fontWeight: '700', color: Colors.textPrimary, marginBottom: 6 },
  pageSub: { fontSize: 13, color: Colors.textSecondary, marginBottom: 16, lineHeight: 18 },

  mapWrap: { borderRadius: BorderRadius.xl, overflow: 'hidden', marginBottom: 14, borderWidth: 1, borderColor: Colors.border },
  mapPlaceholder: {
    height: 190, backgroundColor: '#B8D4E8',
    alignItems: 'center', justifyContent: 'center', position: 'relative',
  },
  mapCircle3: {
    position: 'absolute', width: 180, height: 180, borderRadius: 90,
    backgroundColor: 'rgba(100,160,220,0.25)', borderWidth: 1, borderColor: 'rgba(100,160,220,0.4)',
  },
  mapCircle2: {
    position: 'absolute', width: 110, height: 110, borderRadius: 55,
    backgroundColor: 'rgba(100,160,220,0.35)', borderWidth: 1, borderColor: 'rgba(100,160,220,0.5)',
  },
  mapCircle1: {
    position: 'absolute', width: 50, height: 50, borderRadius: 25,
    backgroundColor: 'rgba(80,140,200,0.5)', borderWidth: 1, borderColor: 'rgba(80,140,200,0.7)',
  },
  mapDot: {
    position: 'absolute', width: 10, height: 10, borderRadius: 5,
    backgroundColor: Colors.primaryDark,
  },
  locateMeBtn: {
    position: 'absolute', top: 12, right: 12,
    flexDirection: 'row', alignItems: 'center', gap: 5,
    backgroundColor: Colors.white, borderRadius: BorderRadius.full,
    paddingHorizontal: 12, paddingVertical: 7,
    borderWidth: 1, borderColor: Colors.border,
  },
  locateMeText: { fontSize: 12, fontWeight: '600', color: Colors.primaryDark },
  mapAttribution: { position: 'absolute', bottom: 6, fontSize: 9, color: 'rgba(0,0,0,0.4)', letterSpacing: 1 },

  card: {
    backgroundColor: Colors.white, borderRadius: BorderRadius.xl,
    padding: 16, borderWidth: 1, borderColor: Colors.border, marginBottom: 14,
  },
  cardTitle: { fontSize: 15, fontWeight: '700', color: Colors.textPrimary, marginBottom: 12 },

  searchWrap: {
    flexDirection: 'row', alignItems: 'center',
    borderRadius: BorderRadius.xl, borderWidth: 1, borderColor: Colors.border,
    paddingHorizontal: 12, height: 44,
  },
  searchInput: { flex: 1, fontSize: 14, color: Colors.textPrimary },

  activeTitleRow: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 12 },
  selectedCount: { fontSize: 12, color: Colors.textSecondary, fontWeight: '500' },

  areaRow: { flexDirection: 'row', alignItems: 'center', paddingVertical: 12 },
  areaIconWrap: {
    width: 36, height: 36, borderRadius: 10, backgroundColor: Colors.primaryLight,
    alignItems: 'center', justifyContent: 'center', marginRight: 12,
  },
  areaInfo: { flex: 1 },
  areaName: { fontSize: 14, fontWeight: '700', color: Colors.textPrimary, marginBottom: 2 },
  areaSub: { fontSize: 12, color: Colors.textSecondary },
  areaToggle: {
    width: 32, height: 32, borderRadius: 16, backgroundColor: Colors.errorLight,
    alignItems: 'center', justifyContent: 'center',
  },
  areaToggleOff: { backgroundColor: Colors.errorLight },
  areaToggleThumb: { width: 20, height: 20, borderRadius: 10, backgroundColor: Colors.error, opacity: 0.5 },
  areaToggleThumbActive: { opacity: 1 },
  rowDivider: { height: 1, backgroundColor: Colors.borderLight },

  sliderWrap: { paddingTop: 8 },
  sliderTrack: { height: 6, backgroundColor: Colors.borderLight, borderRadius: 3, position: 'relative', marginBottom: 12 },
  sliderFill: { position: 'absolute', height: 6, backgroundColor: Colors.primaryDark, borderRadius: 3 },
  sliderThumb: {
    position: 'absolute', width: 22, height: 22, borderRadius: 11,
    backgroundColor: Colors.white, borderWidth: 2, borderColor: Colors.primaryDark,
    top: -8, elevation: 4,
    shadowColor: '#000', shadowOffset: { width: 0, height: 2 }, shadowOpacity: 0.15, shadowRadius: 4,
  },
  sliderLabels: { flexDirection: 'row', justifyContent: 'space-between' },
  sliderLabel: { fontSize: 12, color: Colors.textSecondary },

  saveBtn: {
    backgroundColor: Colors.primaryDark, borderRadius: BorderRadius.xl,
    paddingVertical: 16, alignItems: 'center',
  },
  saveBtnText: { color: Colors.white, fontSize: 16, fontWeight: '700' },
});

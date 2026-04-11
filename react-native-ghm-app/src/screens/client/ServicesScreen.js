import React from 'react';
import {
  View, Text, StyleSheet, ScrollView, TouchableOpacity, StatusBar, TextInput,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { Colors } from '../../theme/colors';
import { BorderRadius } from '../../theme/spacing';

const POPULAR = [
  { icon: 'water-outline', label: 'Plumbing' },
  { icon: 'flash-outline', label: 'Electrical' },
  { icon: 'hammer-outline', label: 'Handyman' },
  { icon: 'sparkles-outline', label: 'Cleaning' },
  { icon: 'tv-outline', label: 'TV Mounting' },
  { icon: 'leaf-outline', label: 'Yard Work' },
];

const CATEGORIES = [
  { icon: 'construct-outline', label: 'Repairs & Maintenance', sub: 'Plumbing, electrical, general fixes' },
  { icon: 'cube-outline', label: 'Assembly & Installation', sub: 'Furniture, appliances, mounting' },
  { icon: 'car-outline', label: 'Moving & Heavy Lifting', sub: 'Packing, moving help, junk removal' },
  { icon: 'flower-outline', label: 'Outdoor & Landscaping', sub: 'Yard work, power washing, gutters' },
];

export default function ServicesScreen({ navigation }) {
  return (
    <SafeAreaView style={styles.safe}>
      <StatusBar barStyle="dark-content" backgroundColor={Colors.white} />

      <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={styles.scroll}>
        <Text style={styles.pageTitle}>Services</Text>

        {/* Search */}
        <View style={styles.searchWrap}>
          <Ionicons name="search-outline" size={16} color={Colors.textMuted} style={styles.searchIcon} />
          <TextInput
            style={styles.searchInput}
            placeholder="Search for a service..."
            placeholderTextColor={Colors.textMuted}
          />
        </View>

        {/* Popular Services */}
        <Text style={styles.sectionTitle}>Popular Services</Text>
        <View style={styles.popularGrid}>
          {POPULAR.map((item) => (
            <TouchableOpacity
              key={item.label}
              style={styles.popularCard}
              onPress={() => navigation.navigate('ServicesList', { category: item.label })}
            >
              <View style={styles.popularIconWrap}>
                <Ionicons name={item.icon} size={28} color={Colors.primaryDark} />
              </View>
              <Text style={styles.popularLabel}>{item.label}</Text>
            </TouchableOpacity>
          ))}
        </View>

        {/* Browse by Category */}
        <Text style={styles.sectionTitle}>Browse by Category</Text>
        <View style={styles.categoryList}>
          {CATEGORIES.map((cat, idx) => (
            <TouchableOpacity
              key={cat.label}
              style={[styles.categoryRow, idx < CATEGORIES.length - 1 && styles.categoryRowBorder]}
              onPress={() => navigation.navigate('ServicesList', { category: cat.label })}
            >
              <View style={styles.categoryIconWrap}>
                <Ionicons name={cat.icon} size={22} color={Colors.primaryDark} />
              </View>
              <View style={styles.categoryInfo}>
                <Text style={styles.categoryLabel}>{cat.label}</Text>
                <Text style={styles.categorySub}>{cat.sub}</Text>
              </View>
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
  scroll: { paddingHorizontal: 16 },

  pageTitle: { fontSize: 26, fontWeight: '800', color: Colors.textPrimary, marginTop: 14, marginBottom: 14 },

  searchWrap: {
    flexDirection: 'row', alignItems: 'center',
    backgroundColor: Colors.background, borderRadius: BorderRadius.xl,
    borderWidth: 1, borderColor: Colors.border,
    paddingHorizontal: 14, marginBottom: 22, height: 46,
  },
  searchIcon: { marginRight: 8 },
  searchInput: { flex: 1, fontSize: 14, color: Colors.textPrimary },

  sectionTitle: { fontSize: 18, fontWeight: '700', color: Colors.textPrimary, marginBottom: 14 },

  popularGrid: { flexDirection: 'row', flexWrap: 'wrap', gap: 12, marginBottom: 26 },
  popularCard: {
    width: '47%', backgroundColor: Colors.white,
    borderRadius: BorderRadius.xl, borderWidth: 1, borderColor: Colors.border,
    padding: 16, alignItems: 'center', gap: 10,
  },
  popularIconWrap: {
    width: 64, height: 64, borderRadius: 20, backgroundColor: Colors.primaryLight,
    alignItems: 'center', justifyContent: 'center',
  },
  popularLabel: { fontSize: 14, fontWeight: '600', color: Colors.textPrimary },

  categoryList: {
    backgroundColor: Colors.white, borderRadius: BorderRadius.xl,
    borderWidth: 1, borderColor: Colors.border, overflow: 'hidden',
  },
  categoryRow: {
    flexDirection: 'row', alignItems: 'center',
    paddingHorizontal: 16, paddingVertical: 16, gap: 14,
  },
  categoryRowBorder: { borderBottomWidth: 1, borderBottomColor: Colors.borderLight },
  categoryIconWrap: {
    width: 44, height: 44, borderRadius: 12, backgroundColor: Colors.primaryLight,
    alignItems: 'center', justifyContent: 'center',
  },
  categoryInfo: { flex: 1 },
  categoryLabel: { fontSize: 15, fontWeight: '700', color: Colors.textPrimary, marginBottom: 2 },
  categorySub: { fontSize: 12, color: Colors.textSecondary },
});

import React, { useState } from 'react';
import {
  View, Text, StyleSheet, FlatList, ScrollView, TouchableOpacity, StatusBar,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { Colors } from '../../theme/colors';
import { BorderRadius } from '../../theme/spacing';

const FILTERS = ['Closest', 'Rating', 'Price', 'Available'];

const PROS = [
  {
    id: 1, name: 'Mike Johnson', category: 'Handyman', reviews: 142, rating: 4.9, verified: true,
    desc: 'Specializes in minor leak repairs, faucet replacements, garbage disposal swaps, an...',
    arrival: 'Today, 1:30 PM', distance: '2.1 miles', rate: '$55',
  },
  {
    id: 2, name: 'David Smith', category: 'Handyman', reviews: 32, rating: 4.6, verified: true,
    desc: 'Quick and affordable fixture replacements, toilet repairs, showerhead installations, an...',
    arrival: 'Tomorrow, 9:00 AM', distance: '3.8 miles', rate: '$45',
  },
];

export default function ProvidersListScreen({ navigation, route }) {
  const [activeFilter, setActiveFilter] = useState('Closest');
  const service = route?.params?.service || 'Plumbing Services';

  return (
    <SafeAreaView style={styles.safe}>
      <StatusBar barStyle="dark-content" backgroundColor={Colors.white} />

      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity style={styles.navBtn} onPress={() => navigation.goBack()}>
          <Ionicons name="chevron-back" size={22} color={Colors.textPrimary} />
        </TouchableOpacity>
        <View style={styles.headerCenter}>
          <Text style={styles.headerTitle}>{service}</Text>
          <Text style={styles.headerSub}>12 handymen available</Text>
        </View>
        <TouchableOpacity style={styles.navBtn}>
          <Ionicons name="options-outline" size={22} color={Colors.textPrimary} />
        </TouchableOpacity>
      </View>

      {/* Filter Chips */}
      <ScrollView
        horizontal showsHorizontalScrollIndicator={false}
        contentContainerStyle={styles.filtersRow}
        style={styles.filtersWrap}
      >
        {FILTERS.map((f) => (
          <TouchableOpacity
            key={f}
            style={[styles.filterChip, activeFilter === f && styles.filterChipActive]}
            onPress={() => setActiveFilter(f)}
          >
            <Text style={[styles.filterText, activeFilter === f && styles.filterTextActive]}>{f}</Text>
            {(f === 'Closest' || f === 'Rating') && (
              <Ionicons
                name="chevron-down"
                size={13}
                color={activeFilter === f ? Colors.white : Colors.textSecondary}
                style={{ marginLeft: 2 }}
              />
            )}
          </TouchableOpacity>
        ))}
      </ScrollView>

      <FlatList
        data={PROS}
        keyExtractor={(item) => String(item.id)}
        contentContainerStyle={styles.list}
        showsVerticalScrollIndicator={false}
        ListHeaderComponent={
          <View style={styles.infoBanner}>
            <Ionicons name="construct-outline" size={16} color={Colors.textSecondary} />
            <View style={styles.infoBannerText}>
              <Text style={styles.infoBannerTitle}>Handyman results only</Text>
              <Text style={styles.infoBannerSub}>All contractor and company listings have been removed from this category view.</Text>
            </View>
          </View>
        }
        renderItem={({ item }) => (
          <View style={styles.proCard}>
            {/* Top row: avatar + info + rating */}
            <View style={styles.proTop}>
              <View style={styles.proAvatar}>
                <Text style={styles.proAvatarText}>{item.name.charAt(0)}</Text>
              </View>
              <View style={styles.proInfo}>
                <View style={styles.proNameRow}>
                  <Text style={styles.proName}>{item.name}</Text>
                  {item.verified && (
                    <Ionicons name="checkmark-circle" size={16} color={Colors.primaryDark} />
                  )}
                </View>
                <Text style={styles.proCategory}>{item.category}</Text>
                <Text style={styles.proReviews}>{item.reviews} reviews</Text>
                <View style={styles.verifiedBadge}>
                  <Ionicons name="shield-checkmark-outline" size={12} color={Colors.success} />
                  <Text style={styles.verifiedText}>Verified pro</Text>
                </View>
              </View>
              <View style={styles.ratingWrap}>
                <Ionicons name="star-outline" size={14} color={Colors.starGold} />
                <Text style={styles.ratingText}>{item.rating}</Text>
              </View>
            </View>

            <Text style={styles.proDesc}>{item.desc}</Text>

            {/* Arrival */}
            <View style={styles.arrivalBox}>
              <Ionicons name="time-outline" size={14} color={Colors.primaryDark} />
              <View>
                <Text style={styles.arrivalLabel}>
                  {item.arrival.includes('Today') ? 'Earliest arrival' : 'Next available slot'}
                </Text>
                <Text style={styles.arrivalValue}>{item.arrival} · {item.distance} away</Text>
              </View>
            </View>

            {/* Price + Book */}
            <View style={styles.proFooter}>
              <View>
                <Text style={styles.startingAt}>Starting at</Text>
                <Text style={styles.proRate}>{item.rate}<Text style={styles.perHr}>/hr</Text></Text>
              </View>
              <TouchableOpacity
                style={styles.bookBtn}
                onPress={() => navigation.navigate('ProviderDetails', { proName: item.name })}
              >
                <Text style={styles.bookBtnText}>Book Now</Text>
              </TouchableOpacity>
            </View>
          </View>
        )}
        ItemSeparatorComponent={() => <View style={{ height: 14 }} />}
      />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: { flex: 1, backgroundColor: Colors.background },

  header: {
    flexDirection: 'row', alignItems: 'center',
    backgroundColor: Colors.white, paddingHorizontal: 12, paddingVertical: 12,
    borderBottomWidth: 1, borderBottomColor: Colors.borderLight,
  },
  navBtn: { width: 36, height: 36, alignItems: 'center', justifyContent: 'center' },
  headerCenter: { flex: 1, alignItems: 'center' },
  headerTitle: { fontSize: 17, fontWeight: '700', color: Colors.textPrimary },
  headerSub: { fontSize: 12, color: Colors.textSecondary, marginTop: 1 },

  filtersWrap: { backgroundColor: Colors.white, borderBottomWidth: 1, borderBottomColor: Colors.borderLight },
  filtersRow: { paddingHorizontal: 16, paddingVertical: 12, gap: 10, alignItems: 'center' },
  filterChip: {
    flexDirection: 'row', alignItems: 'center',
    paddingHorizontal: 16, paddingVertical: 9,
    borderRadius: BorderRadius.full, borderWidth: 1.5, borderColor: Colors.border,
    backgroundColor: Colors.white, height: 38,
  },
  filterChipActive: { backgroundColor: Colors.primaryDark, borderColor: Colors.primaryDark },
  filterText: { fontSize: 13, fontWeight: '600', color: Colors.textPrimary },
  filterTextActive: { color: Colors.white },

  list: { padding: 16 },

  infoBanner: {
    flexDirection: 'row', alignItems: 'flex-start', gap: 10,
    backgroundColor: Colors.white, borderRadius: BorderRadius.xl,
    borderWidth: 1, borderColor: Colors.border, padding: 14, marginBottom: 14,
  },
  infoBannerText: { flex: 1 },
  infoBannerTitle: { fontSize: 14, fontWeight: '700', color: Colors.textPrimary, marginBottom: 3 },
  infoBannerSub: { fontSize: 12, color: Colors.textSecondary, lineHeight: 17 },

  proCard: {
    backgroundColor: Colors.white, borderRadius: BorderRadius.xl,
    borderWidth: 1, borderColor: Colors.border, padding: 16,
  },
  proTop: { flexDirection: 'row', gap: 12, marginBottom: 10 },
  proAvatar: {
    width: 52, height: 52, borderRadius: 26, backgroundColor: '#7B9FB5',
    alignItems: 'center', justifyContent: 'center', flexShrink: 0,
  },
  proAvatarText: { color: Colors.white, fontWeight: '700', fontSize: 18 },
  proInfo: { flex: 1 },
  proNameRow: { flexDirection: 'row', alignItems: 'center', gap: 4 },
  proName: { fontSize: 16, fontWeight: '700', color: Colors.textPrimary },
  proCategory: { fontSize: 13, color: Colors.textSecondary, marginTop: 1 },
  proReviews: { fontSize: 12, color: Colors.textSecondary, marginTop: 1 },
  verifiedBadge: {
    flexDirection: 'row', alignItems: 'center', gap: 4, marginTop: 5,
    backgroundColor: Colors.successLight, borderRadius: BorderRadius.full,
    paddingHorizontal: 8, paddingVertical: 3, alignSelf: 'flex-start',
  },
  verifiedText: { fontSize: 11, fontWeight: '600', color: Colors.success },
  ratingWrap: { flexDirection: 'row', alignItems: 'center', gap: 3 },
  ratingText: { fontSize: 14, fontWeight: '700', color: Colors.textPrimary },

  proDesc: { fontSize: 13, color: Colors.textSecondary, lineHeight: 18, marginBottom: 12 },

  arrivalBox: {
    flexDirection: 'row', alignItems: 'flex-start', gap: 8,
    backgroundColor: Colors.primaryLight, borderRadius: BorderRadius.md, padding: 10, marginBottom: 14,
  },
  arrivalLabel: { fontSize: 11, fontWeight: '600', color: Colors.primaryDark, marginBottom: 2 },
  arrivalValue: { fontSize: 12, color: Colors.primaryDark },

  proFooter: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' },
  startingAt: { fontSize: 11, color: Colors.textMuted },
  proRate: { fontSize: 20, fontWeight: '800', color: Colors.textPrimary },
  perHr: { fontSize: 13, fontWeight: '400', color: Colors.textSecondary },
  bookBtn: {
    backgroundColor: Colors.primaryDark, borderRadius: BorderRadius.xl,
    paddingHorizontal: 28, paddingVertical: 12,
  },
  bookBtnText: { color: Colors.white, fontWeight: '700', fontSize: 14 },
});

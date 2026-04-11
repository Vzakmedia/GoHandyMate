import React, { useState } from 'react';
import {
  View, Text, StyleSheet, ScrollView, TouchableOpacity, StatusBar, Dimensions,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { Colors } from '../../theme/colors';
import { BorderRadius } from '../../theme/spacing';

const { width } = Dimensions.get('window');

const COMMON_SERVICES = [
  { icon: 'water-outline', name: 'Leak Repair', sub: 'Faucets, pipes, under-sink' },
  { icon: 'funnel-outline', name: 'Drain Unclogging', sub: 'Sinks, showers, toilets' },
  { icon: 'flame-outline', name: 'Water Heater', sub: 'Inspection & quick fixes' },
];

const REVIEWS = [
  {
    initials: 'AM', name: 'Amanda M.', date: '2 days ago',
    text: '"Absolutely fantastic service. Showed up within 45 minutes of my emergency call for a burst pipe under the sink. Fixed it quickly and the price was exactly what was quoted. Highly recommend!"',
  },
];

export default function ProviderDetailsScreen({ navigation, route }) {
  const proName = route?.params?.proName || 'RapidFix Plumbing';
  const [saved, setSaved] = useState(false);

  return (
    <View style={styles.container}>
      <StatusBar barStyle="dark-content" backgroundColor={Colors.white} />

      {/* Fixed Header */}
      <SafeAreaView style={styles.headerWrap}>
        <View style={styles.header}>
          <TouchableOpacity style={styles.navBtn} onPress={() => navigation.goBack()}>
            <Ionicons name="chevron-back" size={22} color={Colors.textPrimary} />
          </TouchableOpacity>
          <Text style={styles.headerTitle}>Provider Details</Text>
          <TouchableOpacity style={styles.navBtn} onPress={() => setSaved((v) => !v)}>
            <Ionicons name={saved ? 'heart' : 'heart-outline'} size={22} color={saved ? Colors.error : Colors.textPrimary} />
          </TouchableOpacity>
        </View>
      </SafeAreaView>

      <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={styles.scroll}>
        {/* Banner */}
        <View style={styles.banner}>
          <View style={styles.bannerContent}>
            <Text style={styles.bannerSup}>PROFESSIONAL</Text>
            <Text style={styles.bannerTitle}>PLUMBING REPAIR{'\n'}SERVICE</Text>
            <Text style={styles.bannerTagline}>TRUSTED. SWIFT. SPOTLESS.</Text>
          </View>
          <View style={styles.bannerRating}>
            <Text style={styles.bannerRatingText}>4.9</Text>
          </View>
          <View style={styles.bannerAvatar}>
            <Text style={styles.bannerAvatarText}>{proName.charAt(0)}</Text>
          </View>
        </View>

        {/* Provider Info */}
        <View style={styles.infoSection}>
          <Text style={styles.proName}>{proName}</Text>
          <Text style={styles.proSub}>Handyman • 24/7 Emergency</Text>

          <View style={styles.badgesRow}>
            <View style={styles.badge}>
              <Ionicons name="shield-checkmark-outline" size={13} color={Colors.success} />
              <Text style={styles.badgeText}>Verified Pro</Text>
            </View>
            <View style={styles.badge}>
              <Ionicons name="location-outline" size={13} color={Colors.textSecondary} />
              <Text style={styles.badgeText}>Serves Austin Area</Text>
            </View>
            <View style={styles.badge}>
              <Ionicons name="briefcase-outline" size={13} color={Colors.textSecondary} />
              <Text style={styles.badgeText}>200+ Jobs</Text>
            </View>
          </View>

          {/* About */}
          <Text style={styles.sectionTitle}>About</Text>
          <Text style={styles.aboutText}>
            Specializing in fast-response leak repairs, clogged drains, and water heater issues across Austin. We pride ourselves on transparent pricing and leaving your home cleaner than we found it.
          </Text>

          {/* Common Services */}
          <Text style={styles.sectionTitle}>Common Services</Text>
          <View style={styles.servicesList}>
            {COMMON_SERVICES.map((s, idx) => (
              <TouchableOpacity
                key={s.name}
                style={[styles.serviceRow, idx < COMMON_SERVICES.length - 1 && styles.serviceRowBorder]}
                onPress={() => navigation.navigate('BookService', { proName, service: s.name })}
              >
                <View style={styles.serviceIconWrap}>
                  <Ionicons name={s.icon} size={20} color={Colors.primaryDark} />
                </View>
                <View style={styles.serviceInfo}>
                  <Text style={styles.serviceName}>{s.name}</Text>
                  <Text style={styles.serviceSub}>{s.sub}</Text>
                </View>
                <Ionicons name="chevron-forward" size={18} color={Colors.textMuted} />
              </TouchableOpacity>
            ))}
          </View>

          {/* Reviews */}
          <View style={styles.reviewsHeader}>
            <Text style={styles.sectionTitle}>Reviews (142)</Text>
            <TouchableOpacity onPress={() => navigation.navigate('ProvidersList', { filter: 'reviews' })}>
              <Text style={styles.seeAll}>See all</Text>
            </TouchableOpacity>
          </View>
          {REVIEWS.map((r) => (
            <View key={r.name} style={styles.reviewCard}>
              <View style={styles.reviewTop}>
                <View style={styles.reviewAvatar}>
                  <Text style={styles.reviewAvatarText}>{r.initials}</Text>
                </View>
                <View style={styles.reviewInfo}>
                  <Text style={styles.reviewName}>{r.name}</Text>
                  <Text style={styles.reviewDate}>{r.date}</Text>
                </View>
              </View>
              <Text style={styles.reviewText}>{r.text}</Text>
            </View>
          ))}
        </View>

        <View style={{ height: 90 }} />
      </ScrollView>

      {/* Bottom Action Bar */}
      <View style={styles.bottomBar}>
        <View>
          <Text style={styles.startingAt}>Starting at</Text>
          <View style={styles.priceRow}>
            <Text style={styles.price}>$59</Text>
            <Text style={styles.priceUnit}>/hr</Text>
          </View>
        </View>
        <TouchableOpacity
          style={styles.bookBtn}
          onPress={() => navigation.navigate('BookService', { proName })}
        >
          <Text style={styles.bookBtnText}>Book Now</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: Colors.white },

  headerWrap: { backgroundColor: Colors.white, borderBottomWidth: 1, borderBottomColor: Colors.borderLight },
  header: {
    flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between',
    paddingHorizontal: 12, paddingVertical: 10,
  },
  navBtn: { width: 36, height: 36, alignItems: 'center', justifyContent: 'center' },
  headerTitle: { fontSize: 17, fontWeight: '700', color: Colors.textPrimary },

  scroll: { paddingBottom: 16 },

  banner: {
    width: '100%', height: 220, backgroundColor: '#E8F0EE',
    justifyContent: 'center', paddingHorizontal: 20, position: 'relative',
    borderBottomWidth: 1, borderBottomColor: Colors.borderLight,
  },
  bannerContent: { flex: 1, justifyContent: 'center' },
  bannerSup: { fontSize: 11, fontWeight: '600', color: Colors.textSecondary, letterSpacing: 1, marginBottom: 4 },
  bannerTitle: { fontSize: 22, fontWeight: '900', color: Colors.textPrimary, lineHeight: 26 },
  bannerTagline: { fontSize: 11, color: Colors.textSecondary, marginTop: 8, letterSpacing: 0.5 },
  bannerRating: {
    position: 'absolute', right: 14, bottom: 50,
    backgroundColor: Colors.warning, borderRadius: BorderRadius.md,
    paddingHorizontal: 8, paddingVertical: 4,
  },
  bannerRatingText: { color: Colors.white, fontWeight: '800', fontSize: 14 },
  bannerAvatar: {
    position: 'absolute', left: 14, bottom: -24,
    width: 64, height: 64, borderRadius: 32, backgroundColor: '#7B9FB5',
    alignItems: 'center', justifyContent: 'center',
    borderWidth: 3, borderColor: Colors.white,
  },
  bannerAvatarText: { color: Colors.white, fontWeight: '800', fontSize: 22 },

  infoSection: { paddingHorizontal: 16, paddingTop: 36 },
  proName: { fontSize: 22, fontWeight: '800', color: Colors.textPrimary, marginBottom: 4 },
  proSub: { fontSize: 14, color: Colors.textSecondary, marginBottom: 14 },

  badgesRow: { flexDirection: 'row', flexWrap: 'wrap', gap: 8, marginBottom: 22 },
  badge: {
    flexDirection: 'row', alignItems: 'center', gap: 4,
    borderWidth: 1, borderColor: Colors.border, borderRadius: BorderRadius.full,
    paddingHorizontal: 10, paddingVertical: 5,
  },
  badgeText: { fontSize: 12, color: Colors.textSecondary, fontWeight: '500' },

  sectionTitle: { fontSize: 18, fontWeight: '700', color: Colors.textPrimary, marginBottom: 12, marginTop: 6 },

  aboutText: { fontSize: 14, color: Colors.textSecondary, lineHeight: 22, marginBottom: 20 },

  servicesList: {
    borderRadius: BorderRadius.xl, borderWidth: 1, borderColor: Colors.border,
    overflow: 'hidden', marginBottom: 22,
  },
  serviceRow: { flexDirection: 'row', alignItems: 'center', paddingHorizontal: 16, paddingVertical: 16, gap: 14 },
  serviceRowBorder: { borderBottomWidth: 1, borderBottomColor: Colors.borderLight },
  serviceIconWrap: {
    width: 40, height: 40, borderRadius: 20, backgroundColor: Colors.primaryLight,
    alignItems: 'center', justifyContent: 'center',
  },
  serviceInfo: { flex: 1 },
  serviceName: { fontSize: 15, fontWeight: '600', color: Colors.textPrimary, marginBottom: 2 },
  serviceSub: { fontSize: 12, color: Colors.textSecondary },

  reviewsHeader: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', marginBottom: 10 },
  seeAll: { fontSize: 14, color: Colors.primaryDark, fontWeight: '600' },
  reviewCard: {
    backgroundColor: Colors.background, borderRadius: BorderRadius.xl,
    borderWidth: 1, borderColor: Colors.border, padding: 14,
  },
  reviewTop: { flexDirection: 'row', alignItems: 'center', gap: 10, marginBottom: 10 },
  reviewAvatar: {
    width: 40, height: 40, borderRadius: 20, backgroundColor: '#E2E8F0',
    alignItems: 'center', justifyContent: 'center',
  },
  reviewAvatarText: { fontWeight: '700', fontSize: 14, color: Colors.textPrimary },
  reviewInfo: { flex: 1 },
  reviewName: { fontSize: 14, fontWeight: '700', color: Colors.textPrimary },
  reviewDate: { fontSize: 12, color: Colors.textMuted, marginTop: 1 },
  reviewText: { fontSize: 13, color: Colors.textSecondary, lineHeight: 20, fontStyle: 'italic' },

  bottomBar: {
    position: 'absolute', bottom: 0, left: 0, right: 0,
    flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between',
    backgroundColor: Colors.white, paddingHorizontal: 20, paddingVertical: 14,
    borderTopWidth: 1, borderTopColor: Colors.borderLight,
  },
  startingAt: { fontSize: 12, color: Colors.textMuted, marginBottom: 2 },
  priceRow: { flexDirection: 'row', alignItems: 'baseline', gap: 2 },
  price: { fontSize: 24, fontWeight: '900', color: Colors.primaryDark },
  priceUnit: { fontSize: 14, color: Colors.textSecondary },
  bookBtn: {
    backgroundColor: Colors.primaryDark, borderRadius: BorderRadius.xl,
    paddingHorizontal: 40, paddingVertical: 14,
  },
  bookBtnText: { color: Colors.white, fontWeight: '700', fontSize: 15 },
});

import React from 'react';
import {
  View, Text, StyleSheet, ScrollView, TouchableOpacity, StatusBar, Alert,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { Colors } from '../../theme/colors';
import { BorderRadius } from '../../theme/spacing';

const STEPS = [
  { num: 1, title: 'Copy the promo code', desc: 'Tap the copy button above to save the code to your clipboard.' },
  { num: 2, title: 'Find a Plumber', desc: 'Browse top-rated plumbing professionals in your area and select a service.' },
  { num: 3, title: 'Apply at checkout', desc: 'Paste the code PLUMB15 before you confirm your booking to get 15% off.' },
];

const PLUMBERS = [
  { name: 'Mike Johnson', sub: 'Expert Plumber', rating: 4.9, reviews: 120, rate: '$55/hr', verified: true },
  { name: 'RapidFix Plumbing', sub: 'Plumbing Service', rating: 4.9, reviews: 86, rate: '$59/hr', verified: true },
];

export default function OfferDetailsScreen({ navigation }) {
  return (
    <SafeAreaView style={styles.safe}>
      <StatusBar barStyle="dark-content" backgroundColor={Colors.white} />

      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity style={styles.backBtn} onPress={() => navigation.goBack()}>
          <Ionicons name="chevron-back" size={22} color={Colors.textPrimary} />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Offer Details</Text>
        <View style={{ width: 36 }} />
      </View>

      <ScrollView showsVerticalScrollIndicator={false}>
        {/* Hero */}
        <View style={styles.hero}>
          <View style={styles.limitedBadge}>
            <Ionicons name="flash" size={12} color={Colors.white} />
            <Text style={styles.limitedText}> LIMITED TIME DEAL</Text>
          </View>
          <Text style={styles.discount}>15% OFF</Text>
          <Text style={styles.heroSub}>Your first plumbing service booking this month.</Text>
        </View>

        {/* Promo Code */}
        <View style={styles.promoBox}>
          <Text style={styles.promoLabel}>PROMO CODE</Text>
          <View style={styles.promoRow}>
            <Text style={styles.promoCode}>PLUMB15</Text>
            <TouchableOpacity
              style={styles.copyBtn}
              onPress={() => Alert.alert('Code Copied!', 'PLUMB15 has been copied to your clipboard.')}
            >
              <Ionicons name="copy-outline" size={16} color={Colors.white} />
              <Text style={styles.copyText}>Copy</Text>
            </TouchableOpacity>
          </View>
        </View>

        <View style={styles.content}>
          {/* How to redeem */}
          <Text style={styles.sectionTitle}>How to redeem</Text>
          {STEPS.map((s) => (
            <View key={s.num} style={styles.stepRow}>
              <View style={styles.stepNum}><Text style={styles.stepNumText}>{s.num}</Text></View>
              <View style={styles.stepInfo}>
                <Text style={styles.stepTitle}>{s.title}</Text>
                <Text style={styles.stepDesc}>{s.desc}</Text>
              </View>
            </View>
          ))}

          {/* Terms */}
          <Text style={styles.termsLabel}>TERMS & CONDITIONS</Text>
          <Text style={styles.termsText}>Valid for first-time plumbing bookings only.</Text>

          {/* CTA */}
          <TouchableOpacity
            style={styles.ctaBtn}
            onPress={() => navigation.navigate('ServicesList', { category: 'Plumbing' })}
          >
            <Ionicons name="search-outline" size={18} color={Colors.white} />
            <Text style={styles.ctaBtnText}>Find Plumbing Services</Text>
          </TouchableOpacity>

          <Text style={styles.termsText} numberOfLines={2}>
            Cannot be combined with any other offers, discounts, or promotions.{'\n'}Subject to pro availability in your service area.
          </Text>

          {/* Top Plumbers */}
          <View style={styles.topHeader}>
            <Text style={styles.sectionTitle}>Top Plumbers to Book</Text>
            <TouchableOpacity onPress={() => navigation.navigate('ProvidersList')}>
              <Text style={styles.seeAll}>See all</Text>
            </TouchableOpacity>
          </View>
          <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.plumbersScroll}>
            {PLUMBERS.map((p) => (
              <TouchableOpacity
                key={p.name}
                style={styles.plumberCard}
                onPress={() => navigation.navigate('ProviderDetails', { proName: p.name })}
              >
                <View style={styles.plumberAvatar}>
                  <Text style={styles.plumberAvatarText}>{p.name.charAt(0)}</Text>
                </View>
                {p.verified && (
                  <View style={styles.verifiedBadge}>
                    <Ionicons name="shield-checkmark" size={11} color={Colors.success} />
                    <Text style={styles.verifiedText}> VERIFIED</Text>
                  </View>
                )}
                <Text style={styles.plumberName}>{p.name}</Text>
                <Text style={styles.plumberSub}>{p.sub}</Text>
                <View style={styles.ratingRow}>
                  <Ionicons name="star" size={12} color={Colors.starGold} />
                  <Text style={styles.ratingText}>{p.rating} ({p.reviews} reviews)</Text>
                </View>
                <Text style={styles.plumberRate}>{p.rate}</Text>
              </TouchableOpacity>
            ))}
          </ScrollView>
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
    paddingHorizontal: 12, paddingVertical: 12,
    borderBottomWidth: 1, borderBottomColor: Colors.borderLight,
  },
  backBtn: { width: 36, height: 36, alignItems: 'center', justifyContent: 'center' },
  headerTitle: { fontSize: 17, fontWeight: '700', color: Colors.textPrimary },

  hero: {
    backgroundColor: Colors.primaryDark, padding: 32, alignItems: 'center',
    paddingBottom: 40,
  },
  limitedBadge: {
    flexDirection: 'row', alignItems: 'center',
    backgroundColor: 'rgba(255,255,255,0.2)', borderRadius: BorderRadius.full,
    paddingHorizontal: 12, paddingVertical: 5, marginBottom: 12,
  },
  limitedText: { color: Colors.white, fontWeight: '700', fontSize: 11, letterSpacing: 0.5 },
  discount: { fontSize: 56, fontWeight: '800', color: Colors.white, lineHeight: 62 },
  heroSub: { color: 'rgba(255,255,255,0.8)', fontSize: 14, textAlign: 'center', marginTop: 8, lineHeight: 20 },

  promoBox: {
    margin: 16, borderRadius: BorderRadius.xl, padding: 16,
    borderWidth: 1.5, borderColor: Colors.border, borderStyle: 'dashed',
    backgroundColor: Colors.background,
  },
  promoLabel: { fontSize: 11, color: Colors.textSecondary, letterSpacing: 1, marginBottom: 8 },
  promoRow: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' },
  promoCode: { fontSize: 26, fontWeight: '800', color: Colors.textPrimary, letterSpacing: 2 },
  copyBtn: {
    flexDirection: 'row', alignItems: 'center', gap: 4,
    backgroundColor: Colors.primaryDark, paddingHorizontal: 14, paddingVertical: 8, borderRadius: BorderRadius.md,
  },
  copyText: { color: Colors.white, fontWeight: '700', fontSize: 13 },

  content: { paddingHorizontal: 16, paddingBottom: 16 },

  sectionTitle: { fontSize: 18, fontWeight: '700', color: Colors.textPrimary, marginBottom: 14, marginTop: 4 },

  stepRow: { flexDirection: 'row', alignItems: 'flex-start', gap: 14, marginBottom: 16 },
  stepNum: {
    width: 28, height: 28, borderRadius: 14, backgroundColor: Colors.primaryLight,
    alignItems: 'center', justifyContent: 'center', flexShrink: 0,
  },
  stepNumText: { color: Colors.primaryDark, fontWeight: '700', fontSize: 13 },
  stepInfo: { flex: 1 },
  stepTitle: { fontSize: 14, fontWeight: '700', color: Colors.textPrimary, marginBottom: 3 },
  stepDesc: { fontSize: 13, color: Colors.textSecondary, lineHeight: 18 },

  termsLabel: { fontSize: 11, fontWeight: '700', color: Colors.textSecondary, letterSpacing: 0.8, marginBottom: 8, marginTop: 8 },
  termsText: { fontSize: 13, color: Colors.textSecondary, lineHeight: 20, marginBottom: 16 },

  ctaBtn: {
    flexDirection: 'row', alignItems: 'center', justifyContent: 'center', gap: 8,
    backgroundColor: Colors.primaryDark, borderRadius: BorderRadius.xl,
    paddingVertical: 16, marginBottom: 16,
  },
  ctaBtnText: { color: Colors.white, fontSize: 15, fontWeight: '700' },

  topHeader: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', marginBottom: 12 },
  seeAll: { fontSize: 14, color: Colors.primaryDark, fontWeight: '600' },

  plumbersScroll: { marginBottom: 8 },
  plumberCard: {
    width: 160, backgroundColor: Colors.background, borderRadius: BorderRadius.xl,
    borderWidth: 1, borderColor: Colors.border, padding: 14, marginRight: 12,
  },
  plumberAvatar: {
    width: 48, height: 48, borderRadius: 24, backgroundColor: '#7B9FB5',
    alignItems: 'center', justifyContent: 'center', marginBottom: 8,
  },
  plumberAvatarText: { color: Colors.white, fontWeight: '700', fontSize: 18 },
  verifiedBadge: {
    flexDirection: 'row', alignItems: 'center',
    backgroundColor: Colors.successLight, borderRadius: BorderRadius.full,
    paddingHorizontal: 8, paddingVertical: 3, alignSelf: 'flex-start', marginBottom: 6,
  },
  verifiedText: { fontSize: 10, fontWeight: '700', color: Colors.success },
  plumberName: { fontSize: 14, fontWeight: '700', color: Colors.textPrimary, marginBottom: 2 },
  plumberSub: { fontSize: 12, color: Colors.textSecondary, marginBottom: 6 },
  ratingRow: { flexDirection: 'row', alignItems: 'center', gap: 4, marginBottom: 6 },
  ratingText: { fontSize: 11, color: Colors.textSecondary },
  plumberRate: { fontSize: 14, fontWeight: '700', color: Colors.textPrimary },
});

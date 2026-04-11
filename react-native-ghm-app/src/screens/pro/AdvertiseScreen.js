import React from 'react';
import {
  View, Text, StyleSheet, ScrollView, TouchableOpacity, StatusBar,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { Colors } from '../../theme/colors';
import { BorderRadius } from '../../theme/spacing';

const HOW_IT_WORKS = [
  { step: 1, title: 'Choose your plan', desc: 'Select a promotion tier that fits your business goals and budget.' },
  { step: 2, title: 'Get matched', desc: "We'll prioritize your profile for relevant jobs in your selected area." },
  { step: 3, title: 'Track results', desc: 'See how many extra views and bookings your boost generated on the dashboard.' },
];

export default function AdvertiseScreen({ navigation }) {
  return (
    <SafeAreaView style={styles.safe}>
      <StatusBar barStyle="dark-content" backgroundColor={Colors.white} />

      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity style={styles.backBtn} onPress={() => navigation.goBack()}>
          <Ionicons name="chevron-back" size={22} color={Colors.textPrimary} />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Advertise</Text>
        <View style={styles.avatarCircle}><Text style={styles.avatarText}>JT</Text></View>
      </View>

      <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={styles.scroll}>

        {/* Hero */}
        <Text style={styles.pageTitle}>Boost your profile</Text>
        <Text style={styles.pageSub}>
          Get your services in front of more customers in your area and increase your daily bookings.
        </Text>

        {/* Reach Banner */}
        <View style={styles.reachCard}>
          <View style={styles.reachIconWrap}>
            <Ionicons name="location-outline" size={20} color={Colors.primaryDark} />
          </View>
          <View>
            <Text style={styles.reachTitle}>Reach 2,500+ locals</Text>
            <Text style={styles.reachSub}>Customers searching for handymen within a 15-mile radius of your location.</Text>
          </View>
        </View>

        {/* Featured Pro Plan */}
        <View style={styles.featuredCard}>
          <View style={styles.popularBadge}>
            <Text style={styles.popularText}>POPULAR</Text>
          </View>
          <Text style={styles.planName}>Featured Pro</Text>
          <View style={styles.priceRow}>
            <Text style={styles.planPrice}>$29</Text>
            <Text style={styles.planPer}>/week</Text>
          </View>
          <Text style={styles.planDesc}>Perfect for keeping a steady stream of job requests coming your way.</Text>
          <View style={styles.featuresList}>
            <View style={styles.featureItem}>
              <Ionicons name="checkmark-circle-outline" size={18} color={Colors.primaryDark} />
              <Text style={styles.featureText}>Top 3 placement in search results</Text>
            </View>
            <View style={styles.featureItem}>
              <Ionicons name="checkmark-circle-outline" size={18} color={Colors.primaryDark} />
              <Text style={styles.featureText}>"Featured Pro" badge on your profile</Text>
            </View>
            <View style={styles.featureItem}>
              <Ionicons name="checkmark-circle-outline" size={18} color={Colors.primaryDark} />
              <Text style={styles.featureText}>Priority notifications for new jobs</Text>
            </View>
          </View>
          <TouchableOpacity style={styles.trialBtn}>
            <Text style={styles.trialBtnText}>Start 7-day free trial</Text>
          </TouchableOpacity>
        </View>

        {/* Local Boost Plan */}
        <View style={styles.planCard}>
          <Text style={styles.planName}>Local Boost</Text>
          <View style={styles.priceRow}>
            <Text style={styles.planPrice}>$12</Text>
            <Text style={styles.planPer}>/week</Text>
          </View>
          <Text style={styles.planDesc}>A light boost to get noticed by nearby customers looking for your specific skills.</Text>
          <View style={styles.featuresList}>
            <View style={styles.featureItem}>
              <Ionicons name="checkmark-circle-outline" size={18} color={Colors.textSecondary} />
              <Text style={styles.featureText}>Appears on the first page of search</Text>
            </View>
            <View style={styles.featureItem}>
              <Ionicons name="checkmark-circle-outline" size={18} color={Colors.textSecondary} />
              <Text style={styles.featureText}>Standard job notifications</Text>
            </View>
          </View>
          <TouchableOpacity style={styles.basicBtn}>
            <Text style={styles.basicBtnText}>Choose Basic</Text>
          </TouchableOpacity>
        </View>

        {/* Flash Boost */}
        <View style={styles.flashCard}>
          <View style={styles.flashLeft}>
            <View style={styles.flashIconWrap}>
              <Ionicons name="flash" size={20} color={Colors.white} />
            </View>
            <View>
              <Text style={styles.flashTitle}>24-Hour Flash Boost</Text>
              <Text style={styles.flashSub}>Need jobs today? Get instant visibility.</Text>
            </View>
          </View>
          <View style={styles.flashRight}>
            <Text style={styles.flashPrice}>$5.00</Text>
            <TouchableOpacity style={styles.buyBoostBtn}>
              <Text style={styles.buyBoostText}>Buy Boost</Text>
            </TouchableOpacity>
          </View>
        </View>

        {/* How it works */}
        <View style={styles.howCard}>
          <View style={styles.howHeader}>
            <View style={styles.howDot} />
            <Text style={styles.howTitle}>How advertising works</Text>
          </View>
          {HOW_IT_WORKS.map((item) => (
            <View key={item.step} style={styles.howItem}>
              <View style={styles.howStep}>
                <Text style={styles.howStepNum}>{item.step}</Text>
              </View>
              <View style={styles.howContent}>
                <Text style={styles.howItemTitle}>{item.title}</Text>
                <Text style={styles.howItemDesc}>{item.desc}</Text>
              </View>
            </View>
          ))}
        </View>

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
  avatarCircle: { width: 34, height: 34, borderRadius: 17, backgroundColor: Colors.primaryDark, alignItems: 'center', justifyContent: 'center' },
  avatarText: { color: Colors.white, fontSize: 12, fontWeight: '700' },

  scroll: { padding: 16 },

  pageTitle: { fontSize: 24, fontWeight: '800', color: Colors.textPrimary, marginBottom: 8 },
  pageSub: { fontSize: 13, color: Colors.textSecondary, lineHeight: 18, marginBottom: 16 },

  reachCard: {
    flexDirection: 'row', alignItems: 'flex-start', gap: 12,
    backgroundColor: Colors.white, borderRadius: BorderRadius.xl,
    padding: 16, borderWidth: 1, borderColor: Colors.border, marginBottom: 16,
  },
  reachIconWrap: { width: 36, height: 36, borderRadius: 10, backgroundColor: Colors.primaryLight, alignItems: 'center', justifyContent: 'center' },
  reachTitle: { fontSize: 14, fontWeight: '700', color: Colors.textPrimary, marginBottom: 4 },
  reachSub: { fontSize: 12, color: Colors.textSecondary, lineHeight: 17, flex: 1 },

  featuredCard: {
    backgroundColor: Colors.white, borderRadius: BorderRadius.xl,
    padding: 20, borderWidth: 2, borderColor: Colors.warning, marginBottom: 14, position: 'relative',
  },
  popularBadge: {
    position: 'absolute', top: -1, right: 16,
    backgroundColor: Colors.warning, borderRadius: BorderRadius.sm,
    paddingHorizontal: 10, paddingVertical: 4,
  },
  popularText: { fontSize: 10, fontWeight: '800', color: Colors.white, letterSpacing: 0.5 },

  planCard: {
    backgroundColor: Colors.white, borderRadius: BorderRadius.xl,
    padding: 20, borderWidth: 1, borderColor: Colors.border, marginBottom: 14,
  },
  planName: { fontSize: 18, fontWeight: '700', color: Colors.textPrimary, marginBottom: 4 },
  priceRow: { flexDirection: 'row', alignItems: 'flex-end', gap: 2, marginBottom: 10 },
  planPrice: { fontSize: 28, fontWeight: '800', color: Colors.textPrimary },
  planPer: { fontSize: 14, color: Colors.textSecondary, marginBottom: 4 },
  planDesc: { fontSize: 13, color: Colors.textSecondary, marginBottom: 14, lineHeight: 18 },
  featuresList: { gap: 10, marginBottom: 18 },
  featureItem: { flexDirection: 'row', alignItems: 'center', gap: 10 },
  featureText: { fontSize: 13, color: Colors.textPrimary },

  trialBtn: { backgroundColor: Colors.primaryDark, borderRadius: BorderRadius.xl, paddingVertical: 14, alignItems: 'center' },
  trialBtnText: { color: Colors.white, fontSize: 15, fontWeight: '700' },

  basicBtn: { backgroundColor: Colors.primaryLight, borderRadius: BorderRadius.xl, paddingVertical: 14, alignItems: 'center' },
  basicBtnText: { color: Colors.primaryDark, fontSize: 15, fontWeight: '700' },

  flashCard: {
    flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between',
    backgroundColor: Colors.white, borderRadius: BorderRadius.xl,
    padding: 16, borderWidth: 1, borderColor: Colors.border, marginBottom: 14,
  },
  flashLeft: { flexDirection: 'row', alignItems: 'center', gap: 12, flex: 1 },
  flashIconWrap: { width: 36, height: 36, borderRadius: 18, backgroundColor: Colors.primaryDark, alignItems: 'center', justifyContent: 'center' },
  flashTitle: { fontSize: 14, fontWeight: '700', color: Colors.textPrimary },
  flashSub: { fontSize: 12, color: Colors.textSecondary, marginTop: 2 },
  flashRight: { alignItems: 'flex-end', gap: 8 },
  flashPrice: { fontSize: 18, fontWeight: '800', color: Colors.textPrimary },
  buyBoostBtn: { backgroundColor: Colors.primaryDark, borderRadius: BorderRadius.full, paddingHorizontal: 16, paddingVertical: 8 },
  buyBoostText: { color: Colors.white, fontSize: 13, fontWeight: '600' },

  howCard: {
    backgroundColor: Colors.white, borderRadius: BorderRadius.xl,
    padding: 16, borderWidth: 1, borderColor: Colors.border,
  },
  howHeader: { flexDirection: 'row', alignItems: 'center', gap: 8, marginBottom: 16 },
  howDot: { width: 10, height: 10, borderRadius: 5, backgroundColor: Colors.warning },
  howTitle: { fontSize: 15, fontWeight: '700', color: Colors.textPrimary },
  howItem: { flexDirection: 'row', gap: 14, marginBottom: 14 },
  howStep: {
    width: 26, height: 26, borderRadius: 13, backgroundColor: Colors.borderLight,
    alignItems: 'center', justifyContent: 'center', flexShrink: 0,
  },
  howStepNum: { fontSize: 13, fontWeight: '700', color: Colors.textPrimary },
  howContent: { flex: 1 },
  howItemTitle: { fontSize: 14, fontWeight: '700', color: Colors.textPrimary, marginBottom: 4 },
  howItemDesc: { fontSize: 12, color: Colors.textSecondary, lineHeight: 17 },
});

import React, { useState, useEffect, useCallback, useMemo } from 'react';
import {
  View, Text, StyleSheet, ScrollView, TouchableOpacity,
  StatusBar, Image, ActivityIndicator, RefreshControl,
} from 'react-native';
import { Image as ExpoImage } from 'expo-image';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { Colors } from '../../theme/colors';
import { BorderRadius } from '../../theme/spacing';
import { useAuth } from '../../context/AuthContext';
import {
  getServiceCategories,
  getTopHandymen,
  getActivePromotions,
  initials,
  formatMoney,
} from '../../lib/api';

// Avatar bg colours for handymen without photos
const AVATAR_COLORS = ['#7B9FB5', '#A89BC9', '#7BA89E', '#C9997C', '#9BC9A8'];

// ── Memoized sub-components ──────────────────────────────────────────────────
const CategoryChip = React.memo(({ cat, onPress }) => (
  <TouchableOpacity style={styles.serviceChip} onPress={onPress}>
    <View style={styles.serviceIconWrap}>
      <Ionicons name={cat.icon || 'construct-outline'} size={22} color={Colors.primaryDark} />
    </View>
    <Text style={styles.serviceLabel} numberOfLines={1}>{cat.name}</Text>
    {cat.is_popular && <View style={styles.hotDot} />}
  </TouchableOpacity>
));

const ProCard = React.memo(({ pro, index, onPress }) => {
  const name = pro.profiles?.full_name ?? 'Pro';
  const service = pro.handyman_services?.[0]?.service_name
    ?? pro.handyman_services?.[0]?.service_categories?.name
    ?? 'Handyman';
  const avatarBg = AVATAR_COLORS[index % AVATAR_COLORS.length];
  return (
    <TouchableOpacity style={styles.proCard} onPress={onPress}>
      <View style={[styles.proAvatar, { backgroundColor: avatarBg }]}>
        {pro.profiles?.avatar_url ? (
          <ExpoImage
            source={{ uri: pro.profiles.avatar_url }}
            style={styles.proAvatarImg}
            contentFit="cover"
            transition={200}
            cachePolicy="memory-disk"
          />
        ) : (
          <Text style={styles.proAvatarText}>{initials(name)}</Text>
        )}
      </View>
      {pro.is_verified && (
        <View style={styles.verifiedBadge}>
          <Ionicons name="shield-checkmark" size={11} color={Colors.white} />
        </View>
      )}
      <Text style={styles.proName} numberOfLines={1}>{name}</Text>
      <Text style={styles.proService} numberOfLines={1}>{service}</Text>
      <View style={styles.proStats}>
        <Ionicons name="star" size={11} color={Colors.starGold} />
        <Text style={styles.proRating}>{pro.rating?.toFixed(1) ?? '0.0'}</Text>
        <Text style={styles.proReviews}>({pro.total_reviews ?? 0})</Text>
      </View>
      {pro.hourly_rate && (
        <Text style={styles.proRate}>{formatMoney(pro.hourly_rate)}/hr</Text>
      )}
    </TouchableOpacity>
  );
});

export default function HomeScreen({ navigation }) {
  const { user, profile } = useAuth();
  const [categories, setCategories] = useState([]);
  const [topPros, setTopPros] = useState([]);
  const [promotions, setPromotions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);

  const loadData = useCallback(async () => {
    try {
      const [cats, pros, promos] = await Promise.all([
        getServiceCategories(),
        getTopHandymen(6),
        getActivePromotions(),
      ]);
      setCategories(cats);
      setTopPros(pros);
      setPromotions(promos);
    } catch (err) {
      console.warn('HomeScreen load error:', err.message);
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  }, []);

  useEffect(() => { loadData(); }, [loadData]);

  const onRefresh = useCallback(() => { setRefreshing(true); loadData(); }, [loadData]);

  const firstName = profile?.full_name?.split(' ')[0] ?? 'there';
  const hour = new Date().getHours();
  const greeting = hour < 12 ? 'Good morning' : hour < 17 ? 'Good afternoon' : 'Good evening';

  // Stable slice — avoids recreating array every render
  const displayedCategories = useMemo(() => categories.slice(0, 8), [categories]);
  const avatarBg = useCallback((i) => AVATAR_COLORS[i % AVATAR_COLORS.length], []);

  return (
    <SafeAreaView style={styles.safe}>
      <StatusBar barStyle="dark-content" backgroundColor={Colors.white} />

      {/* Header */}
      <View style={styles.header}>
        <View style={styles.headerLeft}>
          <TouchableOpacity style={styles.locationPill}>
            <Text style={styles.locationText} numberOfLines={1}>
              {profile?.location_city ?? 'Set location'}
            </Text>
          </TouchableOpacity>
        </View>
        <View style={styles.logoCircle}>
          <Image
            source={require('../../../assets/logo.png')}
            style={styles.logoImg}
            resizeMode="contain"
          />
        </View>
        <View style={styles.headerRight}>
          <TouchableOpacity style={styles.bellCircle} onPress={() => navigation.navigate('Notifications')}>
            <Ionicons name="notifications-outline" size={20} color={Colors.textPrimary} />
            <View style={styles.bellDot} />
          </TouchableOpacity>
        </View>
      </View>

      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.scroll}
        refreshControl={<RefreshControl refreshing={refreshing} onRefresh={onRefresh} tintColor={Colors.primaryDark} />}
      >

        {/* Greeting */}
        <View style={styles.greetWrap}>
          <Text style={styles.greeting}>{greeting}, {firstName} 👋</Text>
          <Text style={styles.greetSub}>Let's get those home projects done.</Text>
        </View>

        {/* Search Bar */}
        <TouchableOpacity style={styles.searchBar} onPress={() => navigation.navigate('ServicesList')}>
          <Ionicons name="search-outline" size={18} color={Colors.textMuted} />
          <Text style={styles.searchPlaceholder}>Search for a service or pro...</Text>
          <View style={styles.filterBtn}>
            <Ionicons name="options-outline" size={16} color={Colors.textPrimary} />
          </View>
        </TouchableOpacity>

        {/* Service Categories */}
        <View style={styles.sectionHeader}>
          <Text style={styles.sectionTitle}>Services</Text>
          <TouchableOpacity onPress={() => navigation.navigate('Services')}>
            <Text style={styles.seeAll}>See All</Text>
          </TouchableOpacity>
        </View>

        {loading ? (
          <ActivityIndicator color={Colors.primaryDark} style={{ marginVertical: 20 }} />
        ) : (
          <View style={styles.servicesGrid}>
            {displayedCategories.map((cat) => (
              <CategoryChip key={cat.id} cat={cat} onPress={() => navigation.navigate('ProvidersList', { category: cat.name })} />
            ))}
          </View>
        )}

        {/* Active Promotions */}
        {promotions.length > 0 && (
          <>
            <View style={styles.sectionHeader}>
              <Text style={styles.sectionTitle}>Today's Deals</Text>
              <TouchableOpacity><Text style={styles.seeAll}>See All</Text></TouchableOpacity>
            </View>
            <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.promoRow}>
              {promotions.map((promo, i) => (
                <TouchableOpacity
                  key={promo.id}
                  style={[styles.promoCard, i % 2 === 0 ? styles.promoCardGreen : styles.promoCardBlue]}
                  onPress={() => navigation.navigate('OfferDetails', { promo })}
                >
                  <Text style={styles.promoCode}>{promo.code}</Text>
                  <Text style={styles.promoTitle}>{promo.title}</Text>
                  <Text style={styles.promoDesc} numberOfLines={2}>{promo.description}</Text>
                  <View style={styles.promoDiscount}>
                    <Text style={styles.promoDiscountText}>
                      {promo.discount_type === 'percent'
                        ? `${promo.discount_value}% OFF`
                        : `$${promo.discount_value} OFF`}
                    </Text>
                  </View>
                </TouchableOpacity>
              ))}
            </ScrollView>
          </>
        )}

        {/* Top Rated Pros */}
        <View style={styles.sectionHeader}>
          <Text style={styles.sectionTitle}>Top Rated Pros</Text>
          <TouchableOpacity onPress={() => navigation.navigate('ProvidersList', {})}>
            <Text style={styles.seeAll}>See All</Text>
          </TouchableOpacity>
        </View>

        {loading ? (
          <ActivityIndicator color={Colors.primaryDark} style={{ marginVertical: 20 }} />
        ) : topPros.length === 0 ? (
          <View style={styles.emptyProCard}>
            <Ionicons name="people-outline" size={32} color={Colors.textMuted} />
            <Text style={styles.emptyText}>No verified pros yet — check back soon!</Text>
          </View>
        ) : (
          <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.prosRow}>
            {topPros.map((pro, i) => (
              <ProCard
                key={pro.id}
                pro={pro}
                index={i}
                onPress={() => navigation.navigate('ProviderDetails', { handymanId: pro.id })}
              />
            ))}
          </ScrollView>
        )}

        <View style={{ height: 24 }} />
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: { flex: 1, backgroundColor: Colors.white },

  header: {
    flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between',
    backgroundColor: Colors.white, paddingHorizontal: 16, paddingVertical: 12,
    borderBottomWidth: 1, borderBottomColor: Colors.borderLight,
  },
  headerLeft: { flex: 1 },
  locationPill: {
    flexDirection: 'row', alignItems: 'center', gap: 4,
    backgroundColor: Colors.background, paddingHorizontal: 12, paddingVertical: 7,
    borderRadius: BorderRadius.full, alignSelf: 'flex-start',
    borderWidth: 1, borderColor: Colors.border,
  },
  locationText: { fontSize: 13, fontWeight: '600', color: Colors.textPrimary, maxWidth: 120 },
  logoCircle: { width: 38, height: 38, alignItems: 'center', justifyContent: 'center' },
  logoImg: { width: 34, height: 34 },
  headerRight: { flex: 1, alignItems: 'flex-end' },
  bellCircle: {
    width: 40, height: 40, borderRadius: 20, backgroundColor: Colors.background,
    alignItems: 'center', justifyContent: 'center', position: 'relative',
    borderWidth: 1, borderColor: Colors.border,
  },
  bellDot: {
    position: 'absolute', top: 7, right: 7,
    width: 8, height: 8, borderRadius: 4, backgroundColor: Colors.error,
    borderWidth: 1.5, borderColor: Colors.white,
  },

  scroll: { paddingBottom: 16 },

  greetWrap: { paddingHorizontal: 16, paddingTop: 16, paddingBottom: 12 },
  greeting: { fontSize: 22, fontWeight: '800', color: Colors.textPrimary, marginBottom: 4 },
  greetSub: { fontSize: 13, color: Colors.textSecondary },

  searchBar: {
    flexDirection: 'row', alignItems: 'center', gap: 10,
    backgroundColor: Colors.background, borderRadius: BorderRadius.xl,
    marginHorizontal: 16, marginBottom: 20, paddingHorizontal: 14, height: 48,
    borderWidth: 1, borderColor: Colors.border,
  },
  searchPlaceholder: { flex: 1, fontSize: 14, color: Colors.textMuted },
  filterBtn: {
    width: 32, height: 32, borderRadius: BorderRadius.md, backgroundColor: Colors.white,
    alignItems: 'center', justifyContent: 'center', borderWidth: 1, borderColor: Colors.border,
  },

  sectionHeader: {
    flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between',
    paddingHorizontal: 16, marginBottom: 12,
  },
  sectionTitle: { fontSize: 17, fontWeight: '800', color: Colors.textPrimary },
  seeAll: { fontSize: 13, fontWeight: '600', color: Colors.primaryDark },

  servicesGrid: {
    flexDirection: 'row', flexWrap: 'wrap', paddingHorizontal: 12, marginBottom: 24, gap: 8,
  },
  serviceChip: {
    width: '22%', alignItems: 'center', gap: 6, position: 'relative', paddingVertical: 4,
  },
  serviceIconWrap: {
    width: 54, height: 54, borderRadius: 16, backgroundColor: Colors.primaryLight,
    alignItems: 'center', justifyContent: 'center',
  },
  serviceLabel: { fontSize: 11, fontWeight: '600', color: Colors.textPrimary, textAlign: 'center' },
  hotDot: {
    position: 'absolute', top: 2, right: 6,
    width: 8, height: 8, borderRadius: 4, backgroundColor: Colors.error,
  },

  promoRow: { paddingHorizontal: 16, gap: 12, paddingBottom: 4, marginBottom: 24 },
  promoCard: {
    width: 220, borderRadius: BorderRadius.xl, padding: 16,
  },
  promoCardGreen: { backgroundColor: Colors.primaryDark },
  promoCardBlue: { backgroundColor: '#2563EB' },
  promoCode: { fontSize: 10, fontWeight: '800', color: 'rgba(255,255,255,0.7)', letterSpacing: 1, marginBottom: 4 },
  promoTitle: { fontSize: 15, fontWeight: '800', color: Colors.white, marginBottom: 6 },
  promoDesc: { fontSize: 12, color: 'rgba(255,255,255,0.8)', lineHeight: 17, marginBottom: 10 },
  promoDiscount: {
    alignSelf: 'flex-start', backgroundColor: 'rgba(255,255,255,0.2)',
    paddingHorizontal: 10, paddingVertical: 4, borderRadius: BorderRadius.full,
  },
  promoDiscountText: { fontSize: 12, fontWeight: '800', color: Colors.white },

  prosRow: { paddingHorizontal: 16, gap: 12, paddingBottom: 4 },
  proCard: {
    width: 140, backgroundColor: Colors.white, borderRadius: BorderRadius.xl,
    padding: 14, alignItems: 'center', borderWidth: 1, borderColor: Colors.border,
  },
  proAvatar: {
    width: 60, height: 60, borderRadius: 30, alignItems: 'center', justifyContent: 'center', marginBottom: 8,
  },
  proAvatarImg: { width: 60, height: 60, borderRadius: 30 },
  proAvatarText: { color: Colors.white, fontWeight: '700', fontSize: 18 },
  verifiedBadge: {
    position: 'absolute', top: 14, right: 14,
    width: 18, height: 18, borderRadius: 9, backgroundColor: Colors.primaryDark,
    alignItems: 'center', justifyContent: 'center',
  },
  proName: { fontSize: 13, fontWeight: '700', color: Colors.textPrimary, textAlign: 'center', marginBottom: 2 },
  proService: { fontSize: 11, color: Colors.textSecondary, textAlign: 'center', marginBottom: 4 },
  proStats: { flexDirection: 'row', alignItems: 'center', gap: 3, marginBottom: 2 },
  proRating: { fontSize: 12, fontWeight: '700', color: Colors.textPrimary },
  proReviews: { fontSize: 11, color: Colors.textSecondary },
  proRate: { fontSize: 12, fontWeight: '700', color: Colors.primaryDark, marginTop: 4 },

  emptyProCard: {
    marginHorizontal: 16, padding: 24, backgroundColor: Colors.background,
    borderRadius: BorderRadius.xl, alignItems: 'center', gap: 8,
  },
  emptyText: { fontSize: 13, color: Colors.textMuted, textAlign: 'center' },
});

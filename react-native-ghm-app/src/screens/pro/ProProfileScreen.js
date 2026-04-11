import React, { useState, useEffect, useCallback } from 'react';
import {
  View, Text, StyleSheet, ScrollView, TouchableOpacity, StatusBar,
  Image, ActivityIndicator, Alert, RefreshControl,
} from 'react-native';
import { Image as ExpoImage } from 'expo-image';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { Colors } from '../../theme/colors';
import { BorderRadius } from '../../theme/spacing';
import { useAuth } from '../../context/AuthContext';
import {
  getMyHandymanProfile,
  getHandymanStats,
  getAvailableBalance,
  initials,
  formatMoney,
} from '../../lib/api';

const BUSINESS_MENU = [
  { icon: 'grid-outline', label: 'Services & Skills', sub: 'Manage your offered services', screen: 'ServicesSkills' },
  { icon: 'location-outline', label: 'Service Area', sub: 'Set your working radius', screen: 'ServiceArea' },
  { icon: 'calendar-outline', label: 'Working Hours', sub: 'Mon-Fri, 8:00 AM - 6:00 PM', screen: 'WorkingHours' },
];

const ACCOUNT_MENU = [
  { icon: 'document-text-outline', label: 'Personal Information', sub: 'Update your name, phone, and email', screen: 'PersonalInfo' },
  { icon: 'shield-checkmark-outline', label: 'Verification & Documents', sub: 'ID, Licenses, and Background Check', screen: 'VerificationProgress' },
  { icon: 'card-outline', label: 'Payout Methods', sub: 'Manage bank accounts and cards', screen: 'PayoutMethods' },
];

export default function ProProfileScreen({ navigation }) {
  const { user, profile, signOut, refreshProfile } = useAuth();
  const [handyman, setHandyman] = useState(null);
  const [stats, setStats] = useState(null);
  const [balance, setBalance] = useState(0);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);

  const loadData = useCallback(async () => {
    if (!user?.id) return;
    try {
      const hm = await getMyHandymanProfile(user.id);
      setHandyman(hm);

      if (hm?.id) {
        const [s, bal] = await Promise.all([
          getHandymanStats(hm.id),
          getAvailableBalance(hm.id),
        ]);
        setStats(s);
        setBalance(bal);
      }
    } catch (err) {
      console.warn('ProProfile load error:', err.message);
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  }, [user?.id]);

  useEffect(() => { loadData(); }, [loadData]);

  const onRefresh = () => {
    setRefreshing(true);
    refreshProfile();
    loadData();
  };

  const handleSignOut = () => {
    Alert.alert('Sign Out', 'Are you sure you want to sign out?', [
      { text: 'Cancel', style: 'cancel' },
      {
        text: 'Sign Out', style: 'destructive',
        onPress: async () => {
          await signOut();
          navigation.replace('Login');
        },
      },
    ]);
  };

  const displayName = profile?.full_name || user?.email?.split('@')[0] || 'Pro';
  const avatarInitials = initials(displayName);
  const primaryService = handyman?.handyman_services?.[0]?.service_name ?? 'Professional Handyman';

  return (
    <SafeAreaView style={styles.safe}>
      <StatusBar barStyle="dark-content" backgroundColor={Colors.white} />

      {/* Header */}
      <View style={styles.header}>
        <Text style={styles.headerTitle}>Profile</Text>
        <TouchableOpacity style={styles.settingsBtn}>
          <Ionicons name="settings-outline" size={15} color={Colors.textPrimary} />
          <Text style={styles.settingsBtnText}>Settings</Text>
        </TouchableOpacity>
      </View>
      <View style={styles.headerSubRow}>
        <Text style={styles.headerSub}>Manage your account, services, and preferences.</Text>
      </View>

      {loading ? (
        <View style={styles.loadingWrap}>
          <ActivityIndicator size="large" color={Colors.primaryDark} />
        </View>
      ) : (
        <ScrollView
          showsVerticalScrollIndicator={false}
          contentContainerStyle={styles.scroll}
          refreshControl={
            <RefreshControl refreshing={refreshing} onRefresh={onRefresh} tintColor={Colors.primaryDark} />
          }
        >

          {/* Profile Card */}
          <View style={styles.profileCard}>
            <View style={styles.avatar}>
              {profile?.avatar_url ? (
                <ExpoImage
                  source={{ uri: profile.avatar_url }}
                  style={styles.avatarImg}
                  contentFit="cover"
                  transition={200}
                  cachePolicy="memory-disk"
                />
              ) : (
                <Text style={styles.avatarText}>{avatarInitials}</Text>
              )}
            </View>

            <Text style={styles.name}>{displayName}</Text>
            <Text style={styles.role}>{primaryService}</Text>

            {/* Available balance chip */}
            <View style={styles.balanceChip}>
              <Ionicons name="wallet-outline" size={14} color={Colors.primaryDark} />
              <Text style={styles.balanceText}>{formatMoney(balance)} available</Text>
            </View>

            <View style={styles.divider} />

            <View style={styles.statsRow}>
              <View style={styles.statItem}>
                <View style={styles.statValueRow}>
                  <Ionicons name="star" size={14} color={Colors.starGold} />
                  <Text style={styles.statNum}>
                    {stats?.avg_rating ? parseFloat(stats.avg_rating).toFixed(1) : '—'}
                  </Text>
                </View>
                <Text style={styles.statLabel}>Rating</Text>
              </View>
              <View style={styles.statDivider} />
              <View style={styles.statItem}>
                <Text style={styles.statNum}>{handyman?.total_jobs ?? 0}</Text>
                <Text style={styles.statLabel}>Jobs Done</Text>
              </View>
              <View style={styles.statDivider} />
              <View style={styles.statItem}>
                <Text style={styles.statNum}>
                  {handyman?.years_experience ?? 0} yr{handyman?.years_experience !== 1 ? 's' : ''}
                </Text>
                <Text style={styles.statLabel}>Experience</Text>
              </View>
            </View>
          </View>

          {/* Business Profile */}
          <View style={styles.section}>
            <View style={styles.sectionHeaderRow}>
              <View style={styles.sectionIcon}>
                <Ionicons name="briefcase-outline" size={18} color={Colors.primaryDark} />
              </View>
              <Text style={styles.sectionTitle}>Business Profile</Text>
            </View>

            <View style={styles.menuCard}>
              {BUSINESS_MENU.map((item, i) => (
                <TouchableOpacity
                  key={item.label}
                  style={[styles.menuItem, i < BUSINESS_MENU.length - 1 && styles.menuBorder]}
                  onPress={() => navigation.navigate(item.screen)}
                >
                  <View style={styles.menuIconWrap}>
                    <Ionicons name={item.icon} size={18} color={Colors.primaryDark} />
                  </View>
                  <View style={styles.menuText}>
                    <Text style={styles.menuLabel}>{item.label}</Text>
                    <Text style={styles.menuSub}>{item.sub}</Text>
                  </View>
                  <Ionicons name="chevron-forward" size={18} color={Colors.textMuted} />
                </TouchableOpacity>
              ))}
            </View>
          </View>

          {/* Account */}
          <View style={styles.section}>
            <View style={styles.sectionHeaderRow}>
              <View style={[styles.sectionIcon, { backgroundColor: Colors.background }]}>
                <Ionicons name="person-outline" size={18} color={Colors.textPrimary} />
              </View>
              <Text style={styles.sectionTitle}>Account</Text>
            </View>

            <View style={styles.menuCard}>
              {ACCOUNT_MENU.map((item, i) => (
                <TouchableOpacity
                  key={item.label}
                  style={[styles.menuItem, i < ACCOUNT_MENU.length - 1 && styles.menuBorder]}
                  onPress={() => navigation.navigate(item.screen)}
                >
                  <View style={styles.menuIconWrap}>
                    <Ionicons name={item.icon} size={18} color={Colors.primaryDark} />
                  </View>
                  <View style={styles.menuText}>
                    <Text style={styles.menuLabel}>{item.label}</Text>
                    <Text style={styles.menuSub}>{item.sub}</Text>
                  </View>
                  <Ionicons name="chevron-forward" size={18} color={Colors.textMuted} />
                </TouchableOpacity>
              ))}
            </View>
          </View>

          {/* Sign Out */}
          <TouchableOpacity style={styles.signOutBtn} onPress={handleSignOut}>
            <Text style={styles.signOutText}>Sign Out</Text>
          </TouchableOpacity>

          <View style={{ height: 24 }} />
        </ScrollView>
      )}
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: { flex: 1, backgroundColor: Colors.background },
  loadingWrap: { flex: 1, alignItems: 'center', justifyContent: 'center' },

  header: {
    flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between',
    backgroundColor: Colors.white, paddingHorizontal: 16, paddingTop: 14, paddingBottom: 4,
  },
  headerTitle: { fontSize: 24, fontWeight: '700', color: Colors.textPrimary },
  settingsBtn: {
    flexDirection: 'row', alignItems: 'center', gap: 5,
    borderWidth: 1, borderColor: Colors.border, borderRadius: BorderRadius.md,
    paddingHorizontal: 12, paddingVertical: 7,
  },
  settingsBtnText: { fontSize: 13, fontWeight: '600', color: Colors.textPrimary },
  headerSubRow: { backgroundColor: Colors.white, paddingHorizontal: 16, paddingBottom: 12 },
  headerSub: { fontSize: 12, color: Colors.textSecondary },

  scroll: { paddingHorizontal: 16, paddingTop: 16 },

  profileCard: {
    backgroundColor: Colors.white, borderRadius: BorderRadius.xl,
    padding: 20, alignItems: 'center',
    borderWidth: 1, borderColor: Colors.border, marginBottom: 16,
  },
  avatar: {
    width: 76, height: 76, borderRadius: 38, backgroundColor: Colors.primaryDark,
    alignItems: 'center', justifyContent: 'center', marginBottom: 12, overflow: 'hidden',
  },
  avatarImg: { width: 76, height: 76 },
  avatarText: { color: Colors.white, fontSize: 26, fontWeight: '700' },
  name: { fontSize: 20, fontWeight: '700', color: Colors.textPrimary, marginBottom: 4 },
  role: { fontSize: 13, color: Colors.textSecondary, marginBottom: 10 },
  balanceChip: {
    flexDirection: 'row', alignItems: 'center', gap: 6,
    backgroundColor: Colors.primaryLight, paddingHorizontal: 12, paddingVertical: 6,
    borderRadius: BorderRadius.full,
  },
  balanceText: { fontSize: 13, fontWeight: '700', color: Colors.primaryDark },

  divider: { width: '100%', height: 1, backgroundColor: Colors.borderLight, marginVertical: 16 },

  statsRow: { flexDirection: 'row', width: '100%', justifyContent: 'space-around' },
  statItem: { alignItems: 'center', gap: 4 },
  statValueRow: { flexDirection: 'row', alignItems: 'center', gap: 3 },
  statNum: { fontSize: 18, fontWeight: '700', color: Colors.textPrimary },
  statLabel: { fontSize: 11, color: Colors.textSecondary },
  statDivider: { width: 1, backgroundColor: Colors.borderLight, height: '100%' },

  section: { marginBottom: 16 },
  sectionHeaderRow: { flexDirection: 'row', alignItems: 'center', gap: 10, marginBottom: 10 },
  sectionIcon: {
    width: 34, height: 34, borderRadius: 10, backgroundColor: Colors.primaryLight,
    alignItems: 'center', justifyContent: 'center',
  },
  sectionTitle: { fontSize: 16, fontWeight: '700', color: Colors.textPrimary },

  menuCard: {
    backgroundColor: Colors.white, borderRadius: BorderRadius.xl,
    borderWidth: 1, borderColor: Colors.border, overflow: 'hidden',
  },
  menuItem: { flexDirection: 'row', alignItems: 'center', paddingHorizontal: 14, paddingVertical: 15 },
  menuBorder: { borderBottomWidth: 1, borderBottomColor: Colors.borderLight },
  menuIconWrap: {
    width: 36, height: 36, borderRadius: 10, backgroundColor: Colors.primaryLight,
    alignItems: 'center', justifyContent: 'center', marginRight: 12,
  },
  menuText: { flex: 1 },
  menuLabel: { fontSize: 14, fontWeight: '600', color: Colors.textPrimary, marginBottom: 2 },
  menuSub: { fontSize: 11, color: Colors.textSecondary },

  signOutBtn: {
    backgroundColor: '#FEE2E2', borderRadius: BorderRadius.xl,
    paddingVertical: 16, alignItems: 'center', marginBottom: 8,
  },
  signOutText: { fontSize: 15, fontWeight: '700', color: Colors.error },
});

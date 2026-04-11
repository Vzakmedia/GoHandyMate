import React, { useState, useEffect, useCallback } from 'react';
import {
  View, Text, StyleSheet, ScrollView, TouchableOpacity, StatusBar,
  Image, Alert, ActivityIndicator, RefreshControl,
} from 'react-native';
import { Image as ExpoImage } from 'expo-image';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { Colors } from '../../theme/colors';
import { FontSize, FontWeight } from '../../theme/typography';
import { BorderRadius, Spacing } from '../../theme/spacing';
import { useAuth } from '../../context/AuthContext';
import { getMyBookings, initials } from '../../lib/api';

const MENU_ITEMS_ACCOUNT = [
  { icon: 'person-outline', label: 'Personal Information', screen: 'PersonalInfo', iconColor: Colors.textPrimary, iconBg: '#FCF5E3' },
  { icon: 'location-outline', label: 'Saved Addresses', screen: 'SavedAddresses', iconColor: Colors.textPrimary, iconBg: '#F9F9F9' },
  { icon: 'card-outline', label: 'Payment Methods', screen: 'PaymentMethods', iconColor: Colors.textPrimary, iconBg: '#F9F9F9' },
  { icon: 'notifications-outline', label: 'Notifications', screen: 'Notifications', iconColor: Colors.textPrimary, iconBg: '#F9F9F9' },
];

const MENU_ITEMS_MORE = [
  { icon: 'briefcase-outline', label: 'Become a Pro', screen: 'BecomeAPro', iconColor: Colors.primaryDark, iconBg: '#E8F3EF' },
  { icon: 'help-circle-outline', label: 'Help Center & Support', screen: null, iconColor: Colors.textPrimary, iconBg: '#F9F9F9' },
  { icon: 'information-circle-outline', label: 'About GoHandyMate', screen: null, iconColor: Colors.textPrimary, iconBg: '#F9F9F9' },
];

export default function ProfileScreen({ navigation }) {
  const { user, profile, signOut, refreshProfile } = useAuth();
  const [bookingStats, setBookingStats] = useState({ completed: 0, reviews: 0 });
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);

  const loadStats = useCallback(async () => {
    if (!user?.id) return;
    try {
      const bookings = await getMyBookings(user.id);
      setBookingStats({
        completed: bookings.filter((b) => b.status === 'completed').length,
        reviews: 0, // Reviews count can be added later
      });
    } catch (err) {
      console.warn('ProfileScreen error:', err.message);
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  }, [user?.id]);

  useEffect(() => {
    loadStats();
  }, [loadStats]);

  const onRefresh = () => {
    setRefreshing(true);
    refreshProfile();
    loadStats();
  };

  const handleLogout = () => {
    Alert.alert('Log Out', 'Are you sure you want to log out?', [
      { text: 'Cancel', style: 'cancel' },
      {
        text: 'Log Out', style: 'destructive',
        onPress: async () => {
          await signOut();
          navigation.replace('Login');
        },
      },
    ]);
  };

  const displayName = profile?.full_name || user?.email?.split('@')[0] || 'User';
  const displayEmail = profile?.email || user?.email || '';
  const avatarInitials = initials(displayName);

  return (
    <SafeAreaView style={styles.safe}>
      <StatusBar barStyle="dark-content" backgroundColor="#FDFBF7" />

      {/* Header */}
      <View style={styles.header}>
        <View style={{ width: 24 }} />
        <Text style={styles.headerTitle}>Profile</Text>
        <TouchableOpacity onPress={() => navigation.navigate('Settings')}>
          <Ionicons name="settings-outline" size={24} color={Colors.textPrimary} />
        </TouchableOpacity>
      </View>

      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.scroll}
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={onRefresh} tintColor={Colors.primaryDark} />
        }
      >

        {/* User Info Header */}
        <View style={styles.userSection}>
          <View style={styles.avatarWrap}>
            {profile?.avatar_url ? (
              <ExpoImage
                source={{ uri: profile.avatar_url }}
                style={styles.avatar}
                contentFit="cover"
                transition={200}
                cachePolicy="memory-disk"
              />
            ) : (
              <View style={[styles.avatar, styles.avatarFallback]}>
                <Text style={styles.avatarFallbackText}>{avatarInitials}</Text>
              </View>
            )}
            <View style={styles.cameraIconWrap}>
              <Ionicons name="camera" size={12} color={Colors.white} />
            </View>
          </View>
          <Text style={styles.userName}>{displayName}</Text>
          <Text style={styles.userEmail}>{displayEmail}</Text>
          {profile?.is_verified && (
            <View style={styles.verifiedBadge}>
              <Ionicons name="shield-checkmark-outline" size={14} color={Colors.success} />
              <Text style={styles.verifiedText}> Verified Homeowner</Text>
            </View>
          )}
        </View>

        {/* Stats Row */}
        {loading ? (
          <ActivityIndicator color={Colors.primaryDark} style={{ marginBottom: Spacing.lg }} />
        ) : (
          <View style={styles.statsRow}>
            <View style={styles.statCard}>
              <View style={[styles.statIcon, { backgroundColor: '#FCF5E3' }]}>
                <Ionicons name="checkmark-circle-outline" size={20} color="#F59E0B" />
              </View>
              <Text style={styles.statNumber}>{bookingStats.completed}</Text>
              <Text style={styles.statLabel}>Bookings Done</Text>
            </View>
            <View style={{ width: Spacing.md }} />
            <View style={styles.statCard}>
              <View style={[styles.statIcon, { backgroundColor: '#E8F3EF' }]}>
                <Ionicons name="location-outline" size={20} color={Colors.primaryDark} />
              </View>
              <Text style={styles.statNumber}>{profile?.location_city ? '1' : '0'}</Text>
              <Text style={styles.statLabel}>Saved Addresses</Text>
            </View>
          </View>
        )}

        {/* Refer Banner */}
        <TouchableOpacity style={styles.referBanner}>
          <View style={{ flex: 1 }}>
            <Text style={styles.referTitle}>Refer & Earn $20</Text>
            <Text style={styles.referSub}>Give $20, Get $20 for every friend.</Text>
          </View>
          <View style={styles.referIconBg}>
            <Ionicons name="gift-outline" size={20} color={Colors.white} />
          </View>
        </TouchableOpacity>

        {/* Account Section */}
        <Text style={styles.sectionLabel}>ACCOUNT</Text>
        <View style={styles.menuCard}>
          {MENU_ITEMS_ACCOUNT.map((item, i) => (
            <React.Fragment key={item.label}>
              <TouchableOpacity
                style={styles.menuItem}
                onPress={() => item.screen && navigation.navigate(item.screen)}
              >
                <View style={[styles.menuIconBg, { backgroundColor: item.iconBg }]}>
                  <Ionicons name={item.icon} size={18} color={item.iconColor} />
                </View>
                <Text style={styles.menuLabel}>{item.label}</Text>
                <Ionicons name="chevron-forward" size={16} color={Colors.textMuted} />
              </TouchableOpacity>
              {i < MENU_ITEMS_ACCOUNT.length - 1 && <View style={styles.menuDivider} />}
            </React.Fragment>
          ))}
        </View>

        {/* More Section */}
        <Text style={styles.sectionLabel}>MORE</Text>
        <View style={styles.menuCard}>
          {MENU_ITEMS_MORE.map((item, i) => (
            <React.Fragment key={item.label}>
              <TouchableOpacity
                style={styles.menuItem}
                onPress={() => item.screen && navigation.navigate(item.screen)}
              >
                <View style={[styles.menuIconBg, { backgroundColor: item.iconBg }]}>
                  <Ionicons name={item.icon} size={18} color={item.iconColor} />
                </View>
                <Text style={styles.menuLabel}>{item.label}</Text>
                <Ionicons name="chevron-forward" size={16} color={Colors.textMuted} />
              </TouchableOpacity>
              {i < MENU_ITEMS_MORE.length - 1 && <View style={styles.menuDivider} />}
            </React.Fragment>
          ))}
        </View>

        {/* Log Out */}
        <TouchableOpacity style={styles.logoutCard} onPress={handleLogout}>
          <View style={[styles.menuIconBg, { backgroundColor: '#FEE2E2' }]}>
            <Ionicons name="log-out-outline" size={18} color={Colors.error} />
          </View>
          <Text style={styles.logoutText}>Log Out</Text>
        </TouchableOpacity>

        <Text style={styles.version}>Version 1.0.0</Text>
        <View style={{ height: 40 }} />
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: { flex: 1, backgroundColor: '#FDFBF7' },
  header: {
    flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between',
    paddingHorizontal: Spacing.xl, paddingVertical: 14, backgroundColor: '#FFFFFF',
  },
  headerTitle: { fontSize: FontSize.lg, fontWeight: FontWeight.bold, color: Colors.textPrimary },
  scroll: { paddingHorizontal: Spacing.xl, paddingBottom: 20 },

  userSection: { alignItems: 'center', marginTop: Spacing.xl, marginBottom: Spacing.lg },
  avatarWrap: { position: 'relative', marginBottom: Spacing.md },
  avatar: { width: 90, height: 90, borderRadius: 45, backgroundColor: Colors.borderLight },
  avatarFallback: { backgroundColor: Colors.primaryDark, alignItems: 'center', justifyContent: 'center' },
  avatarFallbackText: { color: Colors.white, fontSize: 30, fontWeight: '800' },
  cameraIconWrap: {
    position: 'absolute', bottom: 0, right: 0,
    width: 24, height: 24, borderRadius: 12,
    backgroundColor: Colors.primaryDark,
    alignItems: 'center', justifyContent: 'center',
    borderWidth: 2, borderColor: '#FDFBF7',
  },
  userName: { fontSize: FontSize['2xl'], fontWeight: FontWeight.bold, color: Colors.textPrimary, marginBottom: 2 },
  userEmail: { fontSize: FontSize.sm, color: Colors.textSecondary, marginBottom: Spacing.sm },
  verifiedBadge: {
    flexDirection: 'row', alignItems: 'center',
    backgroundColor: '#E8F3EF', paddingHorizontal: 12, paddingVertical: 6,
    borderRadius: BorderRadius.full,
  },
  verifiedText: { color: Colors.primaryDark, fontWeight: FontWeight.semibold, fontSize: FontSize.xs, marginLeft: 4 },

  statsRow: { flexDirection: 'row', marginBottom: Spacing.lg },
  statCard: {
    flex: 1, backgroundColor: Colors.white, borderRadius: BorderRadius.lg,
    padding: Spacing.md, alignItems: 'center',
    shadowColor: Colors.shadow, shadowOffset: { width: 0, height: 1 }, shadowOpacity: 0.1, shadowRadius: 3, elevation: 1,
    borderWidth: 1, borderColor: Colors.borderLight,
  },
  statIcon: { width: 40, height: 40, borderRadius: 20, alignItems: 'center', justifyContent: 'center', marginBottom: 6 },
  statNumber: { fontSize: FontSize.lg, fontWeight: FontWeight.bold, color: Colors.textPrimary },
  statLabel: { fontSize: FontSize.xs, color: Colors.textSecondary, marginTop: 2 },

  referBanner: {
    backgroundColor: Colors.primaryDark, borderRadius: BorderRadius.lg, padding: Spacing.lg,
    flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', marginBottom: Spacing.xl,
  },
  referTitle: { color: Colors.white, fontWeight: FontWeight.bold, fontSize: FontSize.md },
  referSub: { color: Colors.white + 'CC', fontSize: FontSize.sm, marginTop: 4 },
  referIconBg: { width: 40, height: 40, borderRadius: 20, backgroundColor: 'rgba(255,255,255,0.15)', alignItems: 'center', justifyContent: 'center' },

  sectionLabel: { fontSize: FontSize.xs, fontWeight: FontWeight.bold, color: Colors.textSecondary, letterSpacing: 0.5, marginBottom: Spacing.sm, marginTop: 4 },
  menuCard: {
    backgroundColor: Colors.white, borderRadius: BorderRadius.lg, marginBottom: Spacing.lg,
    borderWidth: 1, borderColor: Colors.borderLight,
  },
  menuItem: { flexDirection: 'row', alignItems: 'center', paddingHorizontal: Spacing.md, paddingVertical: 14 },
  menuIconBg: { width: 32, height: 32, borderRadius: 8, alignItems: 'center', justifyContent: 'center', marginRight: Spacing.md },
  menuDivider: { height: 1, backgroundColor: Colors.borderLight, marginLeft: 64 },
  menuLabel: { flex: 1, fontSize: FontSize.sm, color: Colors.textPrimary, fontWeight: FontWeight.semibold },

  logoutCard: {
    flexDirection: 'row', alignItems: 'center', backgroundColor: Colors.white, borderRadius: BorderRadius.lg,
    paddingHorizontal: Spacing.md, paddingVertical: 14, borderWidth: 1, borderColor: Colors.borderLight,
    marginBottom: Spacing.xl,
  },
  logoutText: { color: Colors.error, fontWeight: FontWeight.bold, fontSize: FontSize.sm },

  version: { textAlign: 'center', color: Colors.textSecondary, fontSize: FontSize.xs },
});

import React, { useState, useEffect, useCallback } from 'react';
import {
  View, Text, StyleSheet, ScrollView, TouchableOpacity, StatusBar,
  Image, ActivityIndicator, RefreshControl,
} from 'react-native';
import { Image as ExpoImage } from 'expo-image';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { Colors } from '../../theme/colors';
import { FontSize, FontWeight } from '../../theme/typography';
import { BorderRadius, Spacing } from '../../theme/spacing';
import { useAuth } from '../../context/AuthContext';
import {
  getMyHandymanProfile,
  getHandymanStats,
  getHandymanBookings,
  formatMoney,
  initials,
  timeAgo,
} from '../../lib/api';

const STATUS_LABEL = {
  pending: 'New Request',
  confirmed: 'Confirmed',
  on_the_way: 'On the Way',
  in_progress: 'In Progress',
  completed: 'Completed',
  cancelled: 'Cancelled',
};
const STATUS_COLOR = {
  pending: Colors.warning,
  confirmed: Colors.success,
  on_the_way: Colors.primaryDark,
  in_progress: Colors.primaryDark,
  completed: Colors.success,
  cancelled: Colors.error,
};

const AVATAR_COLORS = ['#7B9FB5', '#A89BC9', '#7BA89E', '#C9997C', '#9BC9A8'];

export default function ProDashboardScreen({ navigation }) {
  const { user, profile } = useAuth();

  const [handyman, setHandyman] = useState(null);
  const [stats, setStats] = useState(null);
  const [recentJobs, setRecentJobs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);

  const loadData = useCallback(async () => {
    if (!user?.id) return;
    try {
      const hm = await getMyHandymanProfile(user.id);
      setHandyman(hm);

      if (hm?.id) {
        const [s, jobs] = await Promise.all([
          getHandymanStats(hm.id),
          getHandymanBookings(hm.id),
        ]);
        setStats(s);
        setRecentJobs(jobs.slice(0, 5));
      }
    } catch (err) {
      console.warn('ProDashboard load error:', err.message);
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  }, [user?.id]);

  useEffect(() => { loadData(); }, [loadData]);

  const onRefresh = () => { setRefreshing(true); loadData(); };

  const firstName = profile?.full_name?.split(' ')[0] ?? 'Pro';
  const avatarInitials = initials(profile?.full_name ?? '');
  const isSubscribed = handyman?.subscription_status !== 'none';

  return (
    <SafeAreaView style={styles.safe}>
      <StatusBar barStyle="dark-content" backgroundColor={Colors.white} />

      {/* Top Header */}
      <View style={styles.topHeader}>
        <View style={styles.logoRow}>
          <Image
            source={require('../../../assets/logo.png')}
            style={styles.logoImg}
            resizeMode="contain"
          />
          <Text style={styles.logoText}>GoHandyMate</Text>
        </View>
        <View style={styles.headerRight}>
          <TouchableOpacity style={styles.iconBtn} onPress={() => navigation.navigate('Notifications')}>
            <Ionicons name="notifications-outline" size={22} color={Colors.textPrimary} />
          </TouchableOpacity>
          <TouchableOpacity
            style={styles.avatarCircle}
            onPress={() => navigation.navigate('ProProfile')}
          >
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
          </TouchableOpacity>
        </View>
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

          {/* Subscription Banner */}
          {!isSubscribed && (
            <View style={styles.noSubBanner}>
              <Ionicons name="alert-circle" size={14} color={Colors.error} />
              <Text style={styles.noSubText}>No active subscription</Text>
            </View>
          )}

          {/* Welcome */}
          <View style={styles.titleRow}>
            <Text style={styles.pageTitle}>Handyman dashboard</Text>
            <TouchableOpacity style={styles.advertiseBtn} onPress={() => navigation.navigate('Advertise')}>
              <Ionicons name="megaphone-outline" size={14} color={Colors.textPrimary} />
              <Text style={styles.advertiseBtnText}>Advertise</Text>
            </TouchableOpacity>
          </View>
          <Text style={styles.pageSubtitle}>
            Welcome back, {firstName}. Here's a snapshot of your jobs, earnings and customers.
          </Text>

          {/* Today's Performance Card */}
          <View style={styles.card}>
            <View style={styles.cardHeaderRow}>
              <View style={styles.cardTitleGroup}>
                <View style={styles.cardIconWrap}>
                  <Ionicons name="pulse" size={16} color={Colors.primaryDark} />
                </View>
                <View>
                  <Text style={styles.cardTitle}>Performance overview</Text>
                  <Text style={styles.cardSub}>Live view of jobs, earnings and rating.</Text>
                </View>
              </View>
              <View style={styles.realtimeBadge}>
                <Text style={styles.realtimeText}>Live</Text>
              </View>
            </View>

            {/* Earnings Split */}
            <View style={styles.earningsSplit}>
              <View style={styles.earningsLeft}>
                <Text style={styles.earningsLabel}>Total earnings</Text>
                <Text style={styles.earningsSmallLabel}>Cleared</Text>
                <Text style={styles.earningsAmount}>
                  {formatMoney(stats?.total_earnings ?? 0)}
                </Text>
                <Text style={styles.earningsNote}>
                  {stats?.completed_jobs ?? 0} jobs completed
                </Text>
              </View>
              <View style={styles.earningsRight}>
                <Text style={styles.earningsLabel}>Pending</Text>
                <Text style={styles.earningsSmallLabel}>Awaiting clearance</Text>
                <Text style={styles.earningsAmount}>
                  {formatMoney(stats?.pending_earnings ?? 0)}
                </Text>
                <Text style={styles.earningsNote}>
                  {stats?.pending_jobs ?? 0} active
                </Text>
              </View>
            </View>

            {/* Stats Row */}
            <View style={styles.statsGrid}>
              <View style={styles.statTile}>
                <Ionicons name="briefcase-outline" size={20} color={Colors.primaryDark} />
                <Text style={styles.statNum}>{stats?.completed_jobs ?? 0}</Text>
                <Text style={styles.statLbl}>Completed</Text>
              </View>
              <View style={styles.statTile}>
                <Ionicons name="time-outline" size={20} color={Colors.warning} />
                <Text style={styles.statNum}>{stats?.pending_jobs ?? 0}</Text>
                <Text style={styles.statLbl}>Active</Text>
              </View>
              <View style={styles.statTile}>
                <Ionicons name="star-outline" size={20} color={Colors.starGold} />
                <Text style={styles.statNum}>
                  {stats?.avg_rating ? parseFloat(stats.avg_rating).toFixed(1) : '—'}
                </Text>
                <Text style={styles.statLbl}>Rating</Text>
              </View>
              <View style={styles.statTile}>
                <Ionicons name="notifications-outline" size={20} color={Colors.error} />
                <Text style={styles.statNum}>{stats?.new_requests ?? 0}</Text>
                <Text style={styles.statLbl}>Requests</Text>
              </View>
            </View>
          </View>

          {/* Quick Actions */}
          <Text style={styles.sectionLabel}>Quick Actions</Text>
          <View style={styles.quickActions}>
            {[
              { icon: 'document-text-outline', label: 'Create Invoice', screen: 'CreateInvoice' },
              { icon: 'briefcase-outline', label: 'My Jobs', screen: 'MyJobs' },
              { icon: 'people-outline', label: 'Customers', screen: 'Customers' },
              { icon: 'cash-outline', label: 'Earnings', screen: 'Earnings' },
            ].map((action) => (
              <TouchableOpacity
                key={action.label}
                style={styles.quickBtn}
                onPress={() => navigation.navigate(action.screen)}
              >
                <View style={styles.quickIconWrap}>
                  <Ionicons name={action.icon} size={20} color={Colors.primaryDark} />
                </View>
                <Text style={styles.quickLabel}>{action.label}</Text>
              </TouchableOpacity>
            ))}
          </View>

          {/* Recent Jobs */}
          <View style={styles.sectionRow}>
            <Text style={styles.sectionLabel}>Recent Jobs</Text>
            <TouchableOpacity onPress={() => navigation.navigate('MyJobs')}>
              <Text style={styles.seeAll}>See All</Text>
            </TouchableOpacity>
          </View>

          {recentJobs.length === 0 ? (
            <View style={styles.emptyJobsCard}>
              <Ionicons name="briefcase-outline" size={32} color={Colors.textMuted} />
              <Text style={styles.emptyJobsText}>No jobs yet — your bookings will appear here</Text>
            </View>
          ) : (
            recentJobs.map((job, i) => {
              const customerName = job.profiles?.full_name ?? 'Customer';
              const statusColor = STATUS_COLOR[job.status] ?? Colors.textMuted;
              return (
                <TouchableOpacity
                  key={job.id}
                  style={styles.jobRow}
                  onPress={() => navigation.navigate('JobDetails', { bookingId: job.id })}
                >
                  <View style={[styles.jobAvatar, { backgroundColor: AVATAR_COLORS[i % AVATAR_COLORS.length] }]}>
                    <Text style={styles.jobAvatarText}>{initials(customerName)}</Text>
                  </View>
                  <View style={styles.jobInfo}>
                    <Text style={styles.jobName}>{customerName}</Text>
                    <Text style={styles.jobService}>{job.service_category}</Text>
                    <Text style={styles.jobDate}>
                      {job.scheduled_at
                        ? new Date(job.scheduled_at).toLocaleDateString('en-US', { month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit' })
                        : timeAgo(job.created_at)}
                    </Text>
                  </View>
                  <View style={styles.jobRight}>
                    <Text style={[styles.jobStatus, { color: statusColor }]}>
                      {STATUS_LABEL[job.status] ?? job.status}
                    </Text>
                    <Text style={styles.jobAmount}>{formatMoney(job.handyman_payout)}</Text>
                  </View>
                </TouchableOpacity>
              );
            })
          )}

          <View style={{ height: 24 }} />
        </ScrollView>
      )}
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: { flex: 1, backgroundColor: Colors.background },
  loadingWrap: { flex: 1, alignItems: 'center', justifyContent: 'center' },

  topHeader: {
    flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between',
    backgroundColor: Colors.white, paddingHorizontal: 16, paddingVertical: 12,
    borderBottomWidth: 1, borderBottomColor: Colors.borderLight,
  },
  logoRow: { flexDirection: 'row', alignItems: 'center', gap: 8 },
  logoImg: { width: 28, height: 28 },
  logoText: { fontSize: FontSize.md, fontWeight: FontWeight.bold, color: Colors.textPrimary },
  headerRight: { flexDirection: 'row', alignItems: 'center', gap: 10 },
  iconBtn: {
    width: 38, height: 38, borderRadius: 19, backgroundColor: Colors.background,
    alignItems: 'center', justifyContent: 'center', borderWidth: 1, borderColor: Colors.border,
  },
  avatarCircle: {
    width: 38, height: 38, borderRadius: 19, backgroundColor: Colors.primaryDark,
    alignItems: 'center', justifyContent: 'center', overflow: 'hidden',
  },
  avatarImg: { width: 38, height: 38 },
  avatarText: { color: Colors.white, fontWeight: FontWeight.bold, fontSize: 13 },

  scroll: { paddingHorizontal: 16, paddingTop: 16 },

  noSubBanner: {
    flexDirection: 'row', alignItems: 'center', gap: 6,
    backgroundColor: '#FEF2F2', borderRadius: BorderRadius.md,
    paddingHorizontal: 12, paddingVertical: 8, marginBottom: 14,
    borderWidth: 1, borderColor: '#FECACA',
  },
  noSubText: { fontSize: 13, fontWeight: '600', color: Colors.error },

  titleRow: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', marginBottom: 4 },
  pageTitle: { fontSize: FontSize.xl, fontWeight: FontWeight.bold, color: Colors.textPrimary },
  advertiseBtn: {
    flexDirection: 'row', alignItems: 'center', gap: 5,
    borderWidth: 1, borderColor: Colors.border, borderRadius: BorderRadius.md,
    paddingHorizontal: 10, paddingVertical: 6,
  },
  advertiseBtnText: { fontSize: 12, fontWeight: '600', color: Colors.textPrimary },
  pageSubtitle: { fontSize: 13, color: Colors.textSecondary, marginBottom: 16, lineHeight: 19 },

  card: {
    backgroundColor: Colors.white, borderRadius: BorderRadius.xl,
    borderWidth: 1, borderColor: Colors.border, padding: 16, marginBottom: 20,
  },
  cardHeaderRow: { flexDirection: 'row', alignItems: 'flex-start', justifyContent: 'space-between', marginBottom: 16 },
  cardTitleGroup: { flexDirection: 'row', alignItems: 'flex-start', gap: 10, flex: 1 },
  cardIconWrap: {
    width: 32, height: 32, borderRadius: 10, backgroundColor: Colors.primaryLight,
    alignItems: 'center', justifyContent: 'center',
  },
  cardTitle: { fontSize: FontSize.sm, fontWeight: FontWeight.bold, color: Colors.textPrimary },
  cardSub: { fontSize: 11, color: Colors.textSecondary, marginTop: 2 },
  realtimeBadge: {
    backgroundColor: Colors.primaryLight, paddingHorizontal: 8, paddingVertical: 4, borderRadius: BorderRadius.full,
  },
  realtimeText: { fontSize: 10, fontWeight: '700', color: Colors.primaryDark },

  earningsSplit: { flexDirection: 'row', gap: 12, marginBottom: 16 },
  earningsLeft: {
    flex: 1, backgroundColor: Colors.primaryLight, borderRadius: BorderRadius.lg, padding: 12,
  },
  earningsRight: {
    flex: 1, backgroundColor: Colors.background, borderRadius: BorderRadius.lg, padding: 12,
    borderWidth: 1, borderColor: Colors.borderLight,
  },
  earningsLabel: { fontSize: 11, fontWeight: '700', color: Colors.textSecondary, marginBottom: 2 },
  earningsSmallLabel: { fontSize: 10, color: Colors.textMuted, marginBottom: 6 },
  earningsAmount: { fontSize: 22, fontWeight: '800', color: Colors.textPrimary, marginBottom: 4 },
  earningsNote: { fontSize: 11, color: Colors.textSecondary },

  statsGrid: { flexDirection: 'row', gap: 8 },
  statTile: {
    flex: 1, backgroundColor: Colors.background, borderRadius: BorderRadius.lg, padding: 10,
    alignItems: 'center', gap: 4, borderWidth: 1, borderColor: Colors.borderLight,
  },
  statNum: { fontSize: 18, fontWeight: '800', color: Colors.textPrimary },
  statLbl: { fontSize: 10, color: Colors.textSecondary, textAlign: 'center' },

  sectionLabel: { fontSize: 15, fontWeight: FontWeight.bold, color: Colors.textPrimary, marginBottom: 12 },
  sectionRow: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 12 },
  seeAll: { fontSize: 13, fontWeight: '600', color: Colors.primaryDark },

  quickActions: { flexDirection: 'row', gap: 10, marginBottom: 24 },
  quickBtn: {
    flex: 1, backgroundColor: Colors.white, borderRadius: BorderRadius.xl,
    padding: 12, alignItems: 'center', borderWidth: 1, borderColor: Colors.border, gap: 6,
  },
  quickIconWrap: {
    width: 40, height: 40, borderRadius: 12, backgroundColor: Colors.primaryLight,
    alignItems: 'center', justifyContent: 'center',
  },
  quickLabel: { fontSize: 10, fontWeight: '600', color: Colors.textPrimary, textAlign: 'center' },

  emptyJobsCard: {
    backgroundColor: Colors.white, borderRadius: BorderRadius.xl, padding: 24,
    alignItems: 'center', gap: 8, borderWidth: 1, borderColor: Colors.borderLight, marginBottom: 16,
  },
  emptyJobsText: { fontSize: 13, color: Colors.textMuted, textAlign: 'center' },

  jobRow: {
    flexDirection: 'row', alignItems: 'center', gap: 12,
    backgroundColor: Colors.white, borderRadius: BorderRadius.xl, padding: 14,
    borderWidth: 1, borderColor: Colors.borderLight, marginBottom: 8,
  },
  jobAvatar: { width: 44, height: 44, borderRadius: 22, alignItems: 'center', justifyContent: 'center' },
  jobAvatarText: { color: Colors.white, fontWeight: '700', fontSize: 14 },
  jobInfo: { flex: 1 },
  jobName: { fontSize: 14, fontWeight: '700', color: Colors.textPrimary, marginBottom: 2 },
  jobService: { fontSize: 12, color: Colors.textSecondary, marginBottom: 2 },
  jobDate: { fontSize: 11, color: Colors.textMuted },
  jobRight: { alignItems: 'flex-end', gap: 4 },
  jobStatus: { fontSize: 11, fontWeight: '700' },
  jobAmount: { fontSize: 14, fontWeight: '800', color: Colors.textPrimary },
});

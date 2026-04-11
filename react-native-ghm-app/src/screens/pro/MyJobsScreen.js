import React, { useState, useEffect, useCallback, useMemo } from 'react';
import {
  View, Text, StyleSheet, FlatList, TouchableOpacity, StatusBar,
  TextInput, Alert, ActivityIndicator, RefreshControl,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { Colors } from '../../theme/colors';
import { FontSize, FontWeight } from '../../theme/typography';
import { BorderRadius, Spacing } from '../../theme/spacing';
import { useAuth } from '../../context/AuthContext';
import { getHandymanBookings, updateBookingStatus, formatMoney, initials, timeAgo } from '../../lib/api';
import { supabase } from '../../lib/supabase';

const TABS = [
  { key: 'active', label: 'ACTIVE', statuses: ['confirmed', 'on_the_way', 'in_progress'] },
  { key: 'requests', label: 'REQUESTS', statuses: ['pending'] },
  { key: 'completed', label: 'COMPLETED', statuses: ['completed'] },
  { key: 'cancelled', label: 'CANC.', statuses: ['cancelled'] },
];

const STATUS_CONFIG = {
  pending:     { bg: '#FEF3C7', text: '#B45309', label: 'NEW REQUEST' },
  confirmed:   { bg: '#D1FAE5', text: Colors.primaryDark, label: 'CONFIRMED' },
  on_the_way:  { bg: '#DBEAFE', text: '#1D4ED8', label: 'ON THE WAY' },
  in_progress: { bg: '#D1FAE5', text: Colors.primaryDark, label: 'IN PROGRESS' },
  completed:   { bg: '#F3F4F6', text: Colors.textSecondary, label: 'COMPLETED' },
  cancelled:   { bg: '#FEE2E2', text: Colors.error, label: 'CANCELLED' },
};

const NEXT_STATUS = {
  pending:     { label: 'Accept Job',    next: 'confirmed' },
  confirmed:   { label: 'On My Way',     next: 'on_the_way' },
  on_the_way:  { label: 'Start Job',     next: 'in_progress' },
  in_progress: { label: 'Complete Job',  next: 'completed' },
};

const AVATAR_COLORS = ['#E8A87C', '#7C9EB2', '#A89BC9', '#7CB87C', '#C9997C'];

// ─── Memoized card to prevent re-renders when sibling items change ─────────────
const JobCard = React.memo(({ item, index, navigation, onStatusUpdate }) => {
  const sc = STATUS_CONFIG[item.status] ?? STATUS_CONFIG.pending;
  const avatarColor = AVATAR_COLORS[index % AVATAR_COLORS.length];
  const customerName = item.profiles?.full_name ?? 'Customer';
  const abbr = initials(customerName);
  const scheduledDate = item.scheduled_at
    ? new Date(item.scheduled_at).toLocaleDateString('en-US', {
        weekday: 'short', month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit',
      })
    : timeAgo(item.created_at);

  const nextAction = NEXT_STATUS[item.status];

  return (
    <View style={styles.jobCard}>
      <View style={styles.jobTopRow}>
        <View style={[styles.statusBadge, { backgroundColor: sc.bg }]}>
          <Text style={[styles.statusText, { color: sc.text }]}>{sc.label}</Text>
        </View>
        <View style={styles.dateRow}>
          <Ionicons name="calendar-outline" size={12} color={Colors.textSecondary} />
          <Text style={styles.dateText}>{scheduledDate}</Text>
        </View>
      </View>

      <Text style={styles.jobTitle}>{item.service_category}</Text>

      <View style={styles.clientRow}>
        <View style={[styles.clientAvatar, { backgroundColor: avatarColor }]}>
          <Text style={styles.clientAvatarText}>{abbr}</Text>
        </View>
        <Text style={styles.clientName}>{customerName}</Text>
      </View>

      {item.notes ? (
        <View style={styles.notesRow}>
          <Ionicons name="document-text-outline" size={13} color={Colors.textSecondary} />
          <Text style={styles.notesText} numberOfLines={2}>{item.notes}</Text>
        </View>
      ) : null}

      <View style={styles.divider} />

      <View style={styles.bottomRow}>
        <Text style={styles.price}>{formatMoney(item.handyman_payout ?? item.total_amount)}</Text>
        <View style={{ flexDirection: 'row', gap: 8 }}>
          <TouchableOpacity
            style={styles.actionBtnOutline}
            onPress={() => navigation.navigate('JobDetails', { bookingId: item.id })}
          >
            <Text style={styles.actionTextOutline}>Details</Text>
          </TouchableOpacity>
          {nextAction && (
            <TouchableOpacity
              style={styles.actionBtnPrimary}
              onPress={() => onStatusUpdate(item.id, nextAction.next, nextAction.label)}
            >
              <Text style={styles.actionTextPrimary}>{nextAction.label}</Text>
            </TouchableOpacity>
          )}
          {item.status === 'pending' && (
            <TouchableOpacity
              style={styles.actionBtnDecline}
              onPress={() => onStatusUpdate(item.id, 'cancelled', 'Decline')}
            >
              <Text style={styles.actionTextDecline}>Decline</Text>
            </TouchableOpacity>
          )}
        </View>
      </View>
    </View>
  );
});

// ─── Main Screen ──────────────────────────────────────────────────────────────
export default function MyJobsScreen({ navigation }) {
  const { user } = useAuth();
  const [activeTab, setActiveTab] = useState('requests');
  const [allJobs, setAllJobs] = useState([]);
  const [handymanId, setHandymanId] = useState(null);
  const [search, setSearch] = useState('');
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);

  // ─── Load handyman row first, then bookings ─────────────────────────────────
  const loadJobs = useCallback(async () => {
    if (!user?.id) return;
    try {
      // 1. Get or re-use the handyman row
      let hmId = handymanId;
      if (!hmId) {
        const { data: hmRow, error: hmErr } = await supabase
          .from('handymen')
          .select('id')
          .eq('user_id', user.id)
          .single();
        if (hmErr || !hmRow) {
          setAllJobs([]);
          setLoading(false);
          setRefreshing(false);
          return;
        }
        hmId = hmRow.id;
        setHandymanId(hmId);
      }
      // 2. Fetch bookings
      const jobs = await getHandymanBookings(hmId);
      setAllJobs(jobs);
    } catch (err) {
      console.warn('MyJobsScreen error:', err.message);
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  }, [user?.id, handymanId]);

  useEffect(() => { loadJobs(); }, [loadJobs]);

  const onRefresh = useCallback(() => { setRefreshing(true); loadJobs(); }, [loadJobs]);

  // ─── Status update (optimistic) ─────────────────────────────────────────────
  const handleStatusUpdate = useCallback((bookingId, newStatus, actionLabel) => {
    Alert.alert(
      actionLabel,
      `Proceed with: ${actionLabel}?`,
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Confirm',
          onPress: async () => {
            // Optimistic
            setAllJobs(prev => prev.map(j => j.id === bookingId ? { ...j, status: newStatus } : j));
            try {
              await updateBookingStatus(bookingId, newStatus);
            } catch (err) {
              // Rollback
              Alert.alert('Error', 'Failed to update status.');
              setAllJobs(prev => prev.map(j => j.id === bookingId ? { ...j, status: j.status } : j));
            }
          },
        },
      ]
    );
  }, []);

  // ─── Derived state (memoized) ────────────────────────────────────────────────
  const activeStatuses = useMemo(
    () => TABS.find(t => t.key === activeTab)?.statuses ?? [],
    [activeTab]
  );

  const displayed = useMemo(() => {
    let jobs = allJobs.filter(j => activeStatuses.includes(j.status));
    if (search.trim()) {
      const q = search.toLowerCase();
      jobs = jobs.filter(j =>
        j.service_category?.toLowerCase().includes(q) ||
        j.profiles?.full_name?.toLowerCase().includes(q)
      );
    }
    return jobs;
  }, [allJobs, activeStatuses, search]);

  const tabCounts = useMemo(() =>
    TABS.reduce((acc, t) => {
      acc[t.key] = allJobs.filter(j => t.statuses.includes(j.status)).length;
      return acc;
    }, {}),
    [allJobs]
  );

  // Stable refs for FlatList
  const renderItem = useCallback(({ item, index }) => (
    <JobCard
      item={item}
      index={index}
      navigation={navigation}
      onStatusUpdate={handleStatusUpdate}
    />
  ), [navigation, handleStatusUpdate]);

  const keyExtractor = useCallback(item => item.id, []);

  return (
    <SafeAreaView style={styles.safe}>
      <StatusBar barStyle="dark-content" backgroundColor={Colors.white} />

      <View style={styles.header}>
        <Text style={styles.title}>My Jobs</Text>
        <TouchableOpacity style={styles.newQuoteBtn}>
          <Ionicons name="add" size={16} color={Colors.primaryDark} />
          <Text style={styles.newQuoteText}>New Quote</Text>
        </TouchableOpacity>
      </View>

      <View style={styles.searchWrap}>
        <Ionicons name="search-outline" size={16} color={Colors.textMuted} style={styles.searchIcon} />
        <TextInput
          style={styles.searchInput}
          placeholder="Search jobs, customers..."
          placeholderTextColor={Colors.textMuted}
          value={search}
          onChangeText={setSearch}
        />
      </View>

      <View style={styles.tabBar}>
        {TABS.map((t) => (
          <TouchableOpacity
            key={t.key}
            style={[styles.tab, activeTab === t.key && styles.tabActive]}
            onPress={() => setActiveTab(t.key)}
          >
            <Text style={[styles.tabText, activeTab === t.key && styles.tabTextActive]}>
              {t.label}{tabCounts[t.key] > 0 ? ` (${tabCounts[t.key]})` : ''}
            </Text>
          </TouchableOpacity>
        ))}
      </View>

      {loading ? (
        <View style={styles.loadingWrap}>
          <ActivityIndicator size="large" color={Colors.primaryDark} />
        </View>
      ) : (
        <FlatList
          data={displayed}
          keyExtractor={keyExtractor}
          renderItem={renderItem}
          contentContainerStyle={styles.list}
          showsVerticalScrollIndicator={false}
          // Performance
          initialNumToRender={8}
          maxToRenderPerBatch={5}
          windowSize={5}
          removeClippedSubviews={true}
          refreshControl={
            <RefreshControl refreshing={refreshing} onRefresh={onRefresh} tintColor={Colors.primaryDark} />
          }
          ListEmptyComponent={
            <View style={styles.empty}>
              <Ionicons name="briefcase-outline" size={44} color={Colors.textMuted} />
              <Text style={styles.emptyTitle}>No jobs here yet</Text>
              <Text style={styles.emptySub}>
                {activeTab === 'requests'
                  ? 'New booking requests will appear here'
                  : `Your ${activeTab} jobs will show here`}
              </Text>
            </View>
          }
        />
      )}
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: { flex: 1, backgroundColor: Colors.background },
  loadingWrap: { flex: 1, alignItems: 'center', justifyContent: 'center' },

  header: {
    flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between',
    backgroundColor: Colors.white, paddingHorizontal: 16, paddingVertical: 14,
    borderBottomWidth: 1, borderBottomColor: Colors.borderLight,
  },
  title: { fontSize: 22, fontWeight: '700', color: Colors.textPrimary },
  newQuoteBtn: {
    flexDirection: 'row', alignItems: 'center', gap: 4,
    borderWidth: 1, borderColor: Colors.primaryDark, borderRadius: BorderRadius.full,
    paddingHorizontal: 12, paddingVertical: 7,
  },
  newQuoteText: { fontSize: 13, fontWeight: '600', color: Colors.primaryDark },

  searchWrap: {
    flexDirection: 'row', alignItems: 'center',
    backgroundColor: Colors.white, marginHorizontal: 16, marginTop: 12, marginBottom: 4,
    borderRadius: BorderRadius.xl, borderWidth: 1, borderColor: Colors.border, paddingHorizontal: 12,
  },
  searchIcon: { marginRight: 8 },
  searchInput: { flex: 1, height: 42, fontSize: 14, color: Colors.textPrimary },

  tabBar: {
    flexDirection: 'row', backgroundColor: Colors.white,
    paddingHorizontal: 16, paddingBottom: 10, paddingTop: 8,
    gap: 6, borderBottomWidth: 1, borderBottomColor: Colors.borderLight,
  },
  tab: { paddingHorizontal: 12, paddingVertical: 7, borderRadius: BorderRadius.full },
  tabActive: { backgroundColor: Colors.primaryLight },
  tabText: { fontSize: 11, fontWeight: '600', color: Colors.textSecondary },
  tabTextActive: { color: Colors.primaryDark },

  list: { padding: 16, gap: 12 },

  jobCard: {
    backgroundColor: Colors.white, borderRadius: BorderRadius.xl,
    padding: 16, borderWidth: 1, borderColor: Colors.border,
  },
  jobTopRow: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 10 },
  statusBadge: { paddingHorizontal: 10, paddingVertical: 4, borderRadius: BorderRadius.full },
  statusText: { fontSize: 10, fontWeight: '700', letterSpacing: 0.3 },
  dateRow: { flexDirection: 'row', alignItems: 'center', gap: 4 },
  dateText: { fontSize: 12, color: Colors.textSecondary },
  jobTitle: { fontSize: 16, fontWeight: '700', color: Colors.textPrimary, marginBottom: 10 },
  clientRow: { flexDirection: 'row', alignItems: 'center', gap: 8, marginBottom: 8 },
  clientAvatar: { width: 24, height: 24, borderRadius: 12, alignItems: 'center', justifyContent: 'center' },
  clientAvatarText: { color: Colors.white, fontSize: 11, fontWeight: '700' },
  clientName: { fontSize: 13, color: Colors.textPrimary, fontWeight: '500' },
  notesRow: { flexDirection: 'row', alignItems: 'flex-start', gap: 4, marginBottom: 8 },
  notesText: { fontSize: 12, color: Colors.textSecondary, flex: 1, lineHeight: 17 },
  divider: { height: 1, backgroundColor: Colors.borderLight, marginBottom: 12 },
  bottomRow: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' },
  price: { fontSize: 18, fontWeight: '800', color: Colors.textPrimary },
  actionBtnPrimary: {
    backgroundColor: Colors.primaryDark, borderRadius: BorderRadius.full,
    paddingHorizontal: 14, paddingVertical: 9,
  },
  actionBtnOutline: {
    borderWidth: 1, borderColor: Colors.border, borderRadius: BorderRadius.full,
    paddingHorizontal: 14, paddingVertical: 9,
  },
  actionBtnDecline: {
    borderWidth: 1, borderColor: Colors.error, borderRadius: BorderRadius.full,
    paddingHorizontal: 14, paddingVertical: 9,
  },
  actionTextPrimary: { color: Colors.white, fontSize: 13, fontWeight: '600' },
  actionTextOutline: { color: Colors.textPrimary, fontSize: 13, fontWeight: '600' },
  actionTextDecline: { color: Colors.error, fontSize: 13, fontWeight: '600' },

  empty: { alignItems: 'center', paddingTop: 60, gap: 8 },
  emptyTitle: { fontSize: 16, fontWeight: '700', color: Colors.textPrimary },
  emptySub: { fontSize: 13, color: Colors.textMuted, textAlign: 'center', paddingHorizontal: 20 },
});

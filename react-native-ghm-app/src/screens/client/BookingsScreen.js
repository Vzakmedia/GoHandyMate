import React, { useState, useEffect, useCallback, useMemo } from 'react';
import {
  View, Text, StyleSheet, FlatList, TouchableOpacity, StatusBar,
  Alert, ActivityIndicator, RefreshControl,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { Colors } from '../../theme/colors';
import { BorderRadius } from '../../theme/spacing';
import { useAuth } from '../../context/AuthContext';
import { getMyBookings, updateBookingStatus, initials, timeAgo } from '../../lib/api';

const TABS = ['Upcoming', 'Completed', 'Cancelled'];

const STATUS_MAP = {
  Upcoming: ['pending', 'confirmed', 'on_the_way', 'in_progress'],
  Completed: ['completed'],
  Cancelled: ['cancelled'],
};

const STATUS_LABEL = {
  pending: 'Pending',
  confirmed: 'Confirmed',
  on_the_way: 'On the Way',
  in_progress: 'In Progress',
  completed: 'Completed',
  cancelled: 'Cancelled',
};

const STATUS_COLORS = {
  pending:     { color: Colors.textMuted,    bg: Colors.borderLight },
  confirmed:   { color: Colors.success,      bg: Colors.successLight },
  on_the_way:  { color: Colors.warning,      bg: Colors.warningLight },
  in_progress: { color: Colors.primaryDark,  bg: Colors.primaryLight },
  completed:   { color: Colors.success,      bg: Colors.successLight },
  cancelled:   { color: Colors.error,        bg: '#FEE2E2' },
};

const AVATAR_COLORS = ['#7B9FB5', '#A89BC9', '#7BA89E', '#C9997C', '#9BC9A8'];

// ── Fixed card height for getItemLayout ─────────────────────────────────
// card padding (32) + status row (22) + provider row (70) + divider (15) + actions (46) + separators
const CARD_HEIGHT = 210;
const SEPARATOR_HEIGHT = 12;
const ITEM_HEIGHT = CARD_HEIGHT + SEPARATOR_HEIGHT;

// ── Memoised card — won't re-render unless its own data changes ──────────
const BookingCard = React.memo(({ item, index, navigation, onCancel }) => {
  const statusStyle = STATUS_COLORS[item.status] ?? STATUS_COLORS.pending;
  const proName = item.handymen?.profiles?.full_name ?? 'Finding a pro...';
  const proInitials = initials(proName);
  const avatarBg = AVATAR_COLORS[index % AVATAR_COLORS.length];
  const canCancel = ['pending', 'confirmed'].includes(item.status);

  const scheduledDate = item.scheduled_at
    ? new Date(item.scheduled_at).toLocaleDateString('en-US', {
        weekday: 'short', month: 'short', day: 'numeric',
        hour: '2-digit', minute: '2-digit',
      })
    : 'TBD';

  return (
    <View style={styles.card}>
      {/* Status + Date row */}
      <View style={styles.cardTop}>
        <View style={[styles.statusBadge, { backgroundColor: statusStyle.bg }]}>
          <View style={[styles.statusDot, { backgroundColor: statusStyle.color }]} />
          <Text style={[styles.statusText, { color: statusStyle.color }]}>
            {STATUS_LABEL[item.status] ?? item.status}
          </Text>
        </View>
        <Text style={styles.dateText}>{scheduledDate}</Text>
      </View>

      {/* Provider row */}
      <View style={styles.providerRow}>
        <View style={[styles.avatar, { backgroundColor: avatarBg }]}>
          <Text style={styles.avatarText}>{proInitials}</Text>
        </View>
        <View style={styles.providerInfo}>
          <Text style={styles.providerName}>{proName}</Text>
          <Text style={styles.serviceText}>{item.service_category}</Text>
        </View>
        {item.handymen && (
          <TouchableOpacity
            style={styles.chatBtn}
            onPress={() => navigation.navigate('Chat', {
              proName,
              conversationId: item.conversation_id ?? null,
              otherUserId: item.handymen?.profiles?.id ?? null,
              phone: item.handymen?.profiles?.phone ?? null,
            })}
          >
            <Ionicons name="chatbubble-outline" size={18} color={Colors.primaryDark} />
          </TouchableOpacity>
        )}
      </View>

      <View style={styles.divider} />

      {/* Actions */}
      <View style={styles.actions}>
        {canCancel && (
          <TouchableOpacity
            style={styles.actionOutlineBtn}
            onPress={() => onCancel(item.id)}
          >
            <Text style={styles.actionOutlineText}>Cancel</Text>
          </TouchableOpacity>
        )}
        <TouchableOpacity
          style={[styles.actionPrimaryBtn, !canCancel && { flex: 1 }]}
          onPress={() => navigation.navigate('BookingDetails', { bookingId: item.id })}
        >
          <Text style={styles.actionPrimaryText}>View Details</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
});

// ── Main screen ──────────────────────────────────────────────────────────
export default function BookingsScreen({ navigation }) {
  const { user } = useAuth();
  const [activeTab, setActiveTab] = useState('Upcoming');
  const [allBookings, setAllBookings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);

  const loadBookings = useCallback(async () => {
    if (!user?.id) return;
    try {
      const data = await getMyBookings(user.id);
      setAllBookings(data);
    } catch (err) {
      console.warn('BookingsScreen error:', err.message);
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  }, [user?.id]);

  useEffect(() => { loadBookings(); }, [loadBookings]);

  const onRefresh = useCallback(() => { setRefreshing(true); loadBookings(); }, [loadBookings]);

  // Memoize filtered list — only recomputes when tab or bookings change
  const filteredBookings = useMemo(
    () => allBookings.filter((b) => STATUS_MAP[activeTab].includes(b.status)),
    [allBookings, activeTab]
  );

  // Memoize tab counts
  const tabCounts = useMemo(
    () => TABS.reduce((acc, tab) => {
      acc[tab] = allBookings.filter(b => STATUS_MAP[tab].includes(b.status)).length;
      return acc;
    }, {}),
    [allBookings]
  );

  const handleCancel = useCallback((bookingId) => {
    Alert.alert('Cancel Booking', 'Are you sure you want to cancel this booking?', [
      { text: 'No', style: 'cancel' },
      {
        text: 'Yes, Cancel', style: 'destructive',
        onPress: async () => {
          // Optimistic update
          setAllBookings(prev =>
            prev.map(b => b.id === bookingId ? { ...b, status: 'cancelled' } : b)
          );
          try {
            await updateBookingStatus(bookingId, 'cancelled');
          } catch {
            Alert.alert('Error', 'Could not cancel booking. Please try again.');
            loadBookings(); // rollback
          }
        },
      },
    ]);
  }, [loadBookings]);

  // Stable render function — won't be recreated between renders
  const renderBooking = useCallback(({ item, index }) => (
    <BookingCard
      item={item}
      index={index}
      navigation={navigation}
      onCancel={handleCancel}
    />
  ), [navigation, handleCancel]);

  const keyExtractor = useCallback(item => item.id, []);

  // getItemLayout avoids layout measurement for every item
  const getItemLayout = useCallback((_, index) => ({
    length: ITEM_HEIGHT,
    offset: ITEM_HEIGHT * index,
    index,
  }), []);

  return (
    <SafeAreaView style={styles.safe}>
      <StatusBar barStyle="dark-content" backgroundColor={Colors.white} />

      {/* Header */}
      <View style={styles.header}>
        <Text style={styles.title}>Bookings</Text>
        <Text style={styles.bookingCount}>{allBookings.length} total</Text>
      </View>

      {/* Tabs */}
      <View style={styles.tabBar}>
        {TABS.map((tab) => (
          <TouchableOpacity
            key={tab}
            style={[styles.tab, activeTab === tab && styles.tabActive]}
            onPress={() => setActiveTab(tab)}
          >
            <Text style={[styles.tabText, activeTab === tab && styles.tabTextActive]}>
              {tab}
            </Text>
            {tabCounts[tab] > 0 && (
              <View style={[styles.tabBadge, activeTab === tab && styles.tabBadgeActive]}>
                <Text style={[styles.tabBadgeText, activeTab === tab && styles.tabBadgeTextActive]}>
                  {tabCounts[tab]}
                </Text>
              </View>
            )}
          </TouchableOpacity>
        ))}
      </View>

      {loading ? (
        <View style={styles.loadingWrap}>
          <ActivityIndicator size="large" color={Colors.primaryDark} />
        </View>
      ) : (
        <FlatList
          data={filteredBookings}
          keyExtractor={keyExtractor}
          renderItem={renderBooking}
          getItemLayout={getItemLayout}
          contentContainerStyle={styles.list}
          showsVerticalScrollIndicator={false}
          // Performance
          initialNumToRender={6}
          maxToRenderPerBatch={4}
          windowSize={5}
          removeClippedSubviews={true}
          refreshControl={
            <RefreshControl refreshing={refreshing} onRefresh={onRefresh} tintColor={Colors.primaryDark} />
          }
          ItemSeparatorComponent={Separator}
          ListEmptyComponent={
            <View style={styles.emptyWrap}>
              <Ionicons name="calendar-outline" size={44} color={Colors.textMuted} />
              <Text style={styles.emptyTitle}>No {activeTab.toLowerCase()} bookings</Text>
              <Text style={styles.emptySubtitle}>
                {activeTab === 'Upcoming'
                  ? 'Book a service to get started'
                  : `Your ${activeTab.toLowerCase()} bookings will appear here`}
              </Text>
            </View>
          }
        />
      )}
    </SafeAreaView>
  );
}

// Static component ref — avoids inline lambda re-creation on each render
const Separator = () => <View style={{ height: SEPARATOR_HEIGHT }} />;

const styles = StyleSheet.create({
  safe: { flex: 1, backgroundColor: Colors.background },

  header: {
    flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between',
    backgroundColor: Colors.white, paddingHorizontal: 16, paddingVertical: 14,
    borderBottomWidth: 1, borderBottomColor: Colors.borderLight,
  },
  title: { fontSize: 24, fontWeight: '800', color: Colors.textPrimary },
  bookingCount: { fontSize: 13, color: Colors.textMuted, fontWeight: '500' },

  tabBar: {
    flexDirection: 'row', backgroundColor: Colors.white,
    borderBottomWidth: 1, borderBottomColor: Colors.borderLight,
  },
  tab: {
    flex: 1, paddingVertical: 12, alignItems: 'center', justifyContent: 'center',
    flexDirection: 'row', gap: 6,
    borderBottomWidth: 2, borderBottomColor: 'transparent',
  },
  tabActive: { borderBottomColor: Colors.primaryDark },
  tabText: { fontSize: 13, fontWeight: '500', color: Colors.textMuted },
  tabTextActive: { color: Colors.primaryDark, fontWeight: '700' },
  tabBadge: {
    minWidth: 18, height: 18, borderRadius: 9, backgroundColor: Colors.borderLight,
    alignItems: 'center', justifyContent: 'center', paddingHorizontal: 4,
  },
  tabBadgeActive: { backgroundColor: Colors.primaryDark },
  tabBadgeText: { fontSize: 10, fontWeight: '700', color: Colors.textMuted },
  tabBadgeTextActive: { color: Colors.white },

  loadingWrap: { flex: 1, alignItems: 'center', justifyContent: 'center' },
  list: { padding: 16 },

  emptyWrap: { alignItems: 'center', paddingTop: 60, gap: 8 },
  emptyTitle: { fontSize: 16, fontWeight: '700', color: Colors.textPrimary },
  emptySubtitle: { fontSize: 13, color: Colors.textMuted, textAlign: 'center' },

  card: {
    backgroundColor: Colors.white, borderRadius: BorderRadius.xl,
    borderWidth: 1, borderColor: Colors.border, padding: 16,
    height: CARD_HEIGHT,  // fixed height enables getItemLayout
  },
  cardTop: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', marginBottom: 14 },
  statusBadge: {
    flexDirection: 'row', alignItems: 'center', gap: 6,
    paddingHorizontal: 10, paddingVertical: 5, borderRadius: BorderRadius.full,
  },
  statusDot: { width: 7, height: 7, borderRadius: 4 },
  statusText: { fontSize: 12, fontWeight: '600' },
  dateText: { fontSize: 12, color: Colors.textSecondary },

  providerRow: { flexDirection: 'row', alignItems: 'center', gap: 12, marginBottom: 14 },
  avatar: { width: 46, height: 46, borderRadius: 23, alignItems: 'center', justifyContent: 'center' },
  avatarText: { color: Colors.white, fontWeight: '700', fontSize: 15 },
  providerInfo: { flex: 1 },
  providerName: { fontSize: 15, fontWeight: '700', color: Colors.textPrimary, marginBottom: 2 },
  serviceText: { fontSize: 13, color: Colors.textSecondary },
  chatBtn: {
    width: 36, height: 36, borderRadius: 18, backgroundColor: Colors.primaryLight,
    alignItems: 'center', justifyContent: 'center',
  },

  divider: { height: 1, backgroundColor: Colors.borderLight, marginBottom: 14 },

  actions: { flexDirection: 'row', gap: 10 },
  actionOutlineBtn: {
    flex: 1, paddingVertical: 11, borderRadius: BorderRadius.xl,
    alignItems: 'center', borderWidth: 1, borderColor: Colors.border,
  },
  actionOutlineText: { fontSize: 14, fontWeight: '600', color: Colors.textPrimary },
  actionPrimaryBtn: {
    flex: 1, paddingVertical: 11, borderRadius: BorderRadius.xl,
    alignItems: 'center', backgroundColor: Colors.primaryDark,
  },
  actionPrimaryText: { fontSize: 14, fontWeight: '600', color: Colors.white },
});

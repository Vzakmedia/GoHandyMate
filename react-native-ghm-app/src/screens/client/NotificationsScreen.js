import React, { useState, useEffect, useCallback } from 'react';
import {
  View, Text, StyleSheet, FlatList, TouchableOpacity, StatusBar,
  ActivityIndicator, RefreshControl,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { Colors } from '../../theme/colors';
import { FontSize, FontWeight } from '../../theme/typography';
import { BorderRadius, Spacing } from '../../theme/spacing';
import { useAuth } from '../../context/AuthContext';
import {
  getMyNotifications,
  markNotificationRead,
  markAllNotificationsRead,
  timeAgo,
} from '../../lib/api';

const TYPE_CONFIG = {
  booking: { icon: 'calendar-outline', color: Colors.primaryDark },
  message: { icon: 'chatbubble-outline', color: '#3B82F6' },
  payment: { icon: 'cash-outline', color: Colors.success },
  system:  { icon: 'information-circle-outline', color: Colors.textSecondary },
};

const TABS = ['All', 'Booking', 'Message', 'Payment'];

export default function NotificationsScreen({ navigation }) {
  const { user } = useAuth();
  const [activeTab, setActiveTab] = useState('All');
  const [notifications, setNotifications] = useState([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);

  const loadNotifications = useCallback(async () => {
    if (!user?.id) return;
    try {
      const data = await getMyNotifications(user.id);
      setNotifications(data);
    } catch (err) {
      console.warn('NotificationsScreen error:', err.message);
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  }, [user?.id]);

  useEffect(() => { loadNotifications(); }, [loadNotifications]);

  const onRefresh = () => { setRefreshing(true); loadNotifications(); };

  const handleMarkAllRead = async () => {
    if (!user?.id) return;
    await markAllNotificationsRead(user.id);
    setNotifications((prev) => prev.map((n) => ({ ...n, is_read: true })));
  };

  const handleTap = async (item) => {
    if (!item.is_read) {
      await markNotificationRead(item.id);
      setNotifications((prev) =>
        prev.map((n) => (n.id === item.id ? { ...n, is_read: true } : n))
      );
    }
    // Navigate based on type
    if (item.type === 'booking') navigation.navigate('BookingDetails');
    else if (item.type === 'message') navigation.navigate('Messages');
  };

  const filteredNotifications = activeTab === 'All'
    ? notifications
    : notifications.filter((n) => n.type === activeTab.toLowerCase());

  const unreadCount = notifications.filter((n) => !n.is_read).length;

  return (
    <SafeAreaView style={styles.safe}>
      <StatusBar barStyle="dark-content" backgroundColor="#FDFBF7" />

      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()} style={styles.headerBtn}>
          <Ionicons name="arrow-back" size={24} color={Colors.textPrimary} />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Notifications</Text>
        {unreadCount > 0 ? (
          <TouchableOpacity onPress={handleMarkAllRead}>
            <Text style={styles.markReadBtn}>Mark all read</Text>
          </TouchableOpacity>
        ) : (
          <View style={styles.headerBtnRight} />
        )}
      </View>

      {/* Tabs */}
      <View style={styles.tabContainer}>
        {TABS.map((tab) => (
          <TouchableOpacity
            key={tab}
            style={[styles.tab, activeTab === tab && styles.activeTab]}
            onPress={() => setActiveTab(tab)}
          >
            <Text style={[styles.tabText, activeTab === tab && styles.activeTabText]}>
              {tab}
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
          data={filteredNotifications}
          keyExtractor={(item) => item.id}
          contentContainerStyle={styles.list}
          showsVerticalScrollIndicator={false}
          refreshControl={
            <RefreshControl refreshing={refreshing} onRefresh={onRefresh} tintColor={Colors.primaryDark} />
          }
          ListEmptyComponent={
            <View style={styles.emptyWrap}>
              <Ionicons name="notifications-outline" size={44} color={Colors.textMuted} />
              <Text style={styles.emptyText}>No notifications yet</Text>
              <Text style={styles.emptySub}>We'll notify you when something important happens</Text>
            </View>
          }
          renderItem={({ item }) => {
            const config = TYPE_CONFIG[item.type] ?? TYPE_CONFIG.system;
            return (
              <TouchableOpacity
                style={[styles.row, !item.is_read && styles.unread]}
                onPress={() => handleTap(item)}
              >
                <View style={[styles.iconWrap, { borderColor: config.color }]}>
                  <Ionicons name={config.icon} size={20} color={config.color} />
                </View>
                <View style={styles.content}>
                  <View style={styles.topRow}>
                    <Text style={styles.title} numberOfLines={1}>{item.title}</Text>
                    <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                      <Text style={styles.time}>{timeAgo(item.created_at)}</Text>
                      {!item.is_read && <View style={styles.dot} />}
                    </View>
                  </View>
                  <Text style={styles.desc} numberOfLines={2}>{item.body}</Text>
                </View>
              </TouchableOpacity>
            );
          }}
          ItemSeparatorComponent={() => <View style={styles.sep} />}
        />
      )}
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: { flex: 1, backgroundColor: '#FDFBF7' },
  loadingWrap: { flex: 1, alignItems: 'center', justifyContent: 'center' },

  header: {
    flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between',
    paddingHorizontal: Spacing.xl, paddingVertical: 14, backgroundColor: '#FDFBF7',
  },
  headerBtn: { width: 40, alignItems: 'flex-start' },
  headerBtnRight: { width: 40 },
  headerTitle: { fontSize: FontSize.lg, fontWeight: FontWeight.bold, color: Colors.textPrimary },
  markReadBtn: { fontSize: 12, fontWeight: '600', color: Colors.primaryDark },

  tabContainer: {
    flexDirection: 'row', paddingHorizontal: Spacing.xl,
    borderBottomWidth: 1, borderBottomColor: Colors.borderLight,
  },
  tab: {
    marginRight: Spacing.lg, paddingVertical: Spacing.md,
    borderBottomWidth: 2, borderBottomColor: 'transparent',
  },
  activeTab: { borderBottomColor: Colors.primaryDark },
  tabText: { fontSize: FontSize.sm, color: Colors.textSecondary, fontWeight: 'bold' },
  activeTabText: { color: Colors.primaryDark, fontWeight: 'bold' },

  list: { paddingVertical: Spacing.sm },
  emptyWrap: { alignItems: 'center', paddingTop: 60, gap: 8 },
  emptyText: { fontSize: 16, fontWeight: '700', color: Colors.textPrimary },
  emptySub: { fontSize: 13, color: Colors.textMuted, textAlign: 'center', paddingHorizontal: 32 },

  row: { flexDirection: 'row', alignItems: 'flex-start', paddingHorizontal: Spacing.xl, paddingVertical: Spacing.lg },
  unread: { backgroundColor: 'rgba(45, 106, 79, 0.05)' },
  iconWrap: {
    width: 44, height: 44, borderRadius: 22,
    alignItems: 'center', justifyContent: 'center',
    marginRight: Spacing.md, flexShrink: 0,
    backgroundColor: Colors.white, borderWidth: 1,
  },
  content: { flex: 1 },
  topRow: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 4 },
  title: { fontWeight: 'bold', fontSize: FontSize.sm, color: Colors.textPrimary, flex: 1, marginRight: 8 },
  time: { fontSize: 10, color: Colors.textSecondary, fontWeight: 'bold' },
  desc: { fontSize: FontSize.sm, color: Colors.textSecondary, lineHeight: 20 },
  dot: { width: 8, height: 8, borderRadius: 4, backgroundColor: Colors.primaryDark, marginLeft: 6 },
  sep: {
    height: 1, backgroundColor: Colors.borderLight,
    marginLeft: Spacing.xl + 44 + Spacing.md, marginRight: Spacing.xl,
  },
});

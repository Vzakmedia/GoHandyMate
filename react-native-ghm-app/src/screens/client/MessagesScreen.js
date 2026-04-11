import React, { useState, useEffect, useCallback } from 'react';
import {
  View, Text, StyleSheet, FlatList, TouchableOpacity, StatusBar, TextInput,
  ActivityIndicator, RefreshControl,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { Colors } from '../../theme/colors';
import { BorderRadius } from '../../theme/spacing';
import { useAuth } from '../../context/AuthContext';
import { getMyConversations, initials, timeAgo } from '../../lib/api';

const AVATAR_COLORS = ['#7B9FB5', '#A89BC9', '#7BA89E', '#C9997C', '#9BC9A8'];

export default function MessagesScreen({ navigation }) {
  const { user } = useAuth();
  const [activeTab, setActiveTab] = useState('Personal');
  const [conversations, setConversations] = useState([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');

  const loadConversations = useCallback(async () => {
    if (!user?.id) return;
    try {
      const data = await getMyConversations(user.id);
      setConversations(data);
    } catch (err) {
      console.warn('MessagesScreen error:', err.message);
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  }, [user?.id]);

  useEffect(() => { loadConversations(); }, [loadConversations]);

  const onRefresh = () => { setRefreshing(true); loadConversations(); };

  const filteredConversations = conversations.filter((conv) => {
    const other = conv.customer?.id === user?.id ? conv.handyman : conv.customer;
    const name = other?.full_name ?? '';
    return name.toLowerCase().includes(searchQuery.toLowerCase());
  });

  const renderConversation = ({ item, index }) => {
    const isCustomer = item.customer?.id === user?.id;
    const other = isCustomer ? item.handyman : item.customer;
    const name = other?.full_name ?? 'Unknown';
    const abbr = initials(name);
    const bg = AVATAR_COLORS[index % AVATAR_COLORS.length];

    return (
      <TouchableOpacity
        style={styles.row}
        onPress={() => navigation.navigate('Chat', {
          conversationId: item.id,
          proName: name,
          otherUserId: other?.id,
        })}
      >
        <View style={[styles.avatar, { backgroundColor: bg }]}>
          <Text style={styles.avatarText}>{abbr}</Text>
        </View>
        <View style={styles.rowContent}>
          <View style={styles.rowTop}>
            <Text style={styles.rowName}>{name}</Text>
            <Text style={styles.rowTime}>
              {item.last_message_at ? timeAgo(item.last_message_at) : ''}
            </Text>
          </View>
          <Text style={styles.rowMsg} numberOfLines={1}>
            {item.last_message ?? 'No messages yet'}
          </Text>
        </View>
      </TouchableOpacity>
    );
  };

  // Community tab is still static (future feature)
  const COMMUNITY = [
    { id: 'c1', name: 'Austin DIY Network', msg: 'Tom: Anyone has a pressure w...', time: '10 min ago', unread: 3, iconName: 'people-outline', iconBg: '#DBEAFE', iconColor: '#3B82F6' },
    { id: 'c2', name: 'Tool Exchange 78704', msg: "Jessica: I'm returning the table saw...", time: '2 hours ago', unread: 0, iconName: 'hammer-outline', iconBg: '#FEF3C7', iconColor: Colors.warning },
    { id: 'c3', name: 'Local Gardening Tips', msg: "Mark: Frost coming up! Don't forget...", time: 'Yesterday', unread: 0, iconName: 'leaf-outline', iconBg: Colors.primaryLight, iconColor: Colors.primaryDark },
  ];

  return (
    <SafeAreaView style={styles.safe}>
      <StatusBar barStyle="dark-content" backgroundColor={Colors.white} />

      {/* Header */}
      <View style={styles.header}>
        <Text style={styles.title}>Messages</Text>
        <TouchableOpacity>
          <Ionicons name="create-outline" size={22} color={Colors.textPrimary} />
        </TouchableOpacity>
      </View>

      {/* Search */}
      <View style={styles.searchWrap}>
        <Ionicons name="search-outline" size={16} color={Colors.textMuted} style={{ marginRight: 8 }} />
        <TextInput
          style={styles.searchInput}
          placeholder="Search messages"
          placeholderTextColor={Colors.textMuted}
          value={searchQuery}
          onChangeText={setSearchQuery}
        />
      </View>

      {/* Tabs */}
      <View style={styles.tabBar}>
        {['Personal', 'Community'].map((tab) => (
          <TouchableOpacity
            key={tab}
            style={[styles.tab, activeTab === tab && styles.tabActive]}
            onPress={() => setActiveTab(tab)}
          >
            <Text style={[styles.tabText, activeTab === tab && styles.tabTextActive]}>{tab}</Text>
          </TouchableOpacity>
        ))}
      </View>

      {activeTab === 'Personal' ? (
        loading ? (
          <View style={styles.loadingWrap}>
            <ActivityIndicator color={Colors.primaryDark} />
          </View>
        ) : (
          <FlatList
            data={filteredConversations}
            keyExtractor={(item) => item.id}
            renderItem={renderConversation}
            ItemSeparatorComponent={() => <View style={styles.separator} />}
            showsVerticalScrollIndicator={false}
            refreshControl={
              <RefreshControl refreshing={refreshing} onRefresh={onRefresh} tintColor={Colors.primaryDark} />
            }
            ListEmptyComponent={
              <View style={styles.emptyWrap}>
                <Ionicons name="chatbubbles-outline" size={40} color={Colors.textMuted} />
                <Text style={styles.emptyText}>No conversations yet</Text>
                <Text style={styles.emptySub}>Messages with pros will appear here</Text>
              </View>
            }
          />
        )
      ) : (
        <FlatList
          data={COMMUNITY}
          keyExtractor={(item) => item.id}
          renderItem={({ item }) => (
            <TouchableOpacity
              style={styles.row}
              onPress={() => navigation.navigate('CommunityGroupChat', { groupName: item.name, members: '1,204 members' })}
            >
              <View style={[styles.avatar, { backgroundColor: item.iconBg }]}>
                <Ionicons name={item.iconName} size={22} color={item.iconColor} />
              </View>
              <View style={styles.rowContent}>
                <View style={styles.rowTop}>
                  <Text style={styles.rowName}>{item.name}</Text>
                  <Text style={styles.rowTime}>{item.time}</Text>
                </View>
                <Text style={styles.rowMsg} numberOfLines={1}>{item.msg}</Text>
              </View>
              {item.unread > 0 && (
                <View style={styles.badge}><Text style={styles.badgeText}>{item.unread}</Text></View>
              )}
            </TouchableOpacity>
          )}
          ItemSeparatorComponent={() => <View style={styles.separator} />}
          showsVerticalScrollIndicator={false}
        />
      )}
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: { flex: 1, backgroundColor: Colors.white },

  header: {
    flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between',
    paddingHorizontal: 16, paddingVertical: 14,
    borderBottomWidth: 1, borderBottomColor: Colors.borderLight,
  },
  title: { fontSize: 24, fontWeight: '800', color: Colors.textPrimary },

  searchWrap: {
    flexDirection: 'row', alignItems: 'center',
    backgroundColor: Colors.background, borderRadius: BorderRadius.xl,
    marginHorizontal: 16, marginVertical: 12, paddingHorizontal: 14, height: 42,
    borderWidth: 1, borderColor: Colors.border,
  },
  searchInput: { flex: 1, fontSize: 14, color: Colors.textPrimary },

  tabBar: { flexDirection: 'row', borderBottomWidth: 1, borderBottomColor: Colors.borderLight },
  tab: { flex: 1, paddingVertical: 12, alignItems: 'center', borderBottomWidth: 2, borderBottomColor: 'transparent' },
  tabActive: { borderBottomColor: Colors.primaryDark },
  tabText: { fontSize: 14, fontWeight: '500', color: Colors.textMuted },
  tabTextActive: { color: Colors.primaryDark, fontWeight: '700' },

  loadingWrap: { flex: 1, alignItems: 'center', justifyContent: 'center' },

  emptyWrap: { alignItems: 'center', paddingTop: 60, gap: 8 },
  emptyText: { fontSize: 16, fontWeight: '700', color: Colors.textPrimary },
  emptySub: { fontSize: 13, color: Colors.textMuted },

  row: { flexDirection: 'row', alignItems: 'center', paddingHorizontal: 16, paddingVertical: 14, gap: 12 },
  avatar: { width: 52, height: 52, borderRadius: 26, alignItems: 'center', justifyContent: 'center' },
  avatarText: { color: Colors.white, fontWeight: '700', fontSize: 16 },
  rowContent: { flex: 1 },
  rowTop: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 4 },
  rowName: { fontSize: 15, fontWeight: '700', color: Colors.textPrimary },
  rowTime: { fontSize: 12, color: Colors.textMuted },
  rowMsg: { fontSize: 13, color: Colors.textSecondary },
  badge: { width: 22, height: 22, borderRadius: 11, backgroundColor: Colors.primaryDark, alignItems: 'center', justifyContent: 'center' },
  badgeText: { color: Colors.white, fontSize: 11, fontWeight: '700' },
  separator: { height: 1, backgroundColor: Colors.borderLight, marginLeft: 80 },
});

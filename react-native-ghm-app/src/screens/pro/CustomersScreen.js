import React, { useState } from 'react';
import {
  View, Text, StyleSheet, FlatList, TouchableOpacity, StatusBar, TextInput,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { Colors } from '../../theme/colors';
import { BorderRadius } from '../../theme/spacing';

const CLIENT_TABS = ['ALL CLIENTS', 'RECENT', 'STARRED'];

const CLIENTS = [
  { id: 1, name: 'Sarah Jenkins', jobs: 4, area: 'Downtown', avatarColor: '#E8A87C', initials: 'SJ' },
  { id: 2, name: 'Marcus Johnson', jobs: 1, area: 'Westside Hills', avatarColor: '#7C9EB2', initials: 'MJ' },
  { id: 3, name: 'Linda Chen', jobs: 12, area: 'North Park', avatarColor: '#A89BC9', initials: 'LC' },
  { id: 4, name: 'Carlos Ruiz', jobs: null, area: 'East End', avatarColor: '#8B7355', initials: 'CR', isNew: true },
];

export default function CustomersScreen({ navigation }) {
  const openChat = (client) => navigation.navigate('ProChat', { clientName: client.name });
  const [activeTab, setActiveTab] = useState('ALL CLIENTS');
  const [search, setSearch] = useState('');

  return (
    <SafeAreaView style={styles.safe}>
      <StatusBar barStyle="dark-content" backgroundColor={Colors.white} />

      {/* Header */}
      <View style={styles.header}>
        <Text style={styles.title}>Customers</Text>
        <TouchableOpacity style={styles.newClientBtn}>
          <Ionicons name="person-add-outline" size={14} color={Colors.white} />
          <Text style={styles.newClientText}>New Client</Text>
        </TouchableOpacity>
      </View>

      <View style={styles.subHeader}>
        <Text style={styles.subtitle}>Manage your client relationships and quick contact information.</Text>

        {/* Search */}
        <View style={styles.searchWrap}>
          <Ionicons name="search-outline" size={16} color={Colors.textMuted} style={styles.searchIcon} />
          <TextInput
            style={styles.searchInput}
            placeholder="Search by name or location..."
            placeholderTextColor={Colors.textMuted}
            value={search}
            onChangeText={setSearch}
          />
        </View>

        {/* Tabs */}
        <View style={styles.tabBar}>
          {CLIENT_TABS.map((t) => (
            <TouchableOpacity
              key={t}
              style={[styles.tab, activeTab === t && styles.tabActive]}
              onPress={() => setActiveTab(t)}
            >
              {t === 'STARRED' && (
                <Ionicons
                  name="star-outline"
                  size={12}
                  color={activeTab === t ? Colors.primaryDark : Colors.textSecondary}
                  style={{ marginRight: 3 }}
                />
              )}
              <Text style={[styles.tabText, activeTab === t && styles.tabTextActive]}>{t}</Text>
            </TouchableOpacity>
          ))}
        </View>
      </View>

      <FlatList
        data={CLIENTS}
        keyExtractor={(item) => String(item.id)}
        contentContainerStyle={styles.list}
        showsVerticalScrollIndicator={false}
        ListHeaderComponent={
          <>
            {/* Stats Cards */}
            <View style={styles.statsRow}>
              <View style={styles.statCard}>
                <View style={styles.statIconWrap}>
                  <Ionicons name="people-outline" size={18} color={Colors.primaryDark} />
                </View>
                <View>
                  <Text style={styles.statNum}>42</Text>
                  <Text style={styles.statLabel}>Total Clients</Text>
                </View>
              </View>
              <View style={styles.statCard}>
                <View style={styles.statIconWrap}>
                  <Ionicons name="person-add-outline" size={18} color={Colors.primaryDark} />
                </View>
                <View>
                  <Text style={styles.statNum}>8</Text>
                  <Text style={styles.statLabel}>New this month</Text>
                </View>
              </View>
            </View>

            {/* Directory Header */}
            <View style={styles.directoryHeader}>
              <View style={styles.directoryLeft}>
                <Ionicons name="people-outline" size={18} color={Colors.textPrimary} />
                <Text style={styles.directoryTitle}>Client Directory</Text>
              </View>
              <View style={styles.azBadge}>
                <Text style={styles.azText}>A-Z</Text>
              </View>
            </View>
          </>
        }
        renderItem={({ item }) => (
          <TouchableOpacity style={styles.clientRow} onPress={() => openChat(item)}>
            <View style={[styles.avatar, { backgroundColor: item.avatarColor }]}>
              <Text style={styles.avatarText}>{item.initials}</Text>
            </View>
            <View style={styles.clientInfo}>
              <Text style={styles.clientName}>{item.name}</Text>
              <View style={styles.clientMeta}>
                {item.isNew ? (
                  <>
                    <Ionicons name="star-outline" size={11} color={Colors.textSecondary} />
                    <Text style={styles.clientMetaText}>New client</Text>
                  </>
                ) : (
                  <>
                    <Ionicons name="briefcase-outline" size={11} color={Colors.textSecondary} />
                    <Text style={styles.clientMetaText}>{item.jobs} {item.jobs === 1 ? 'job' : 'jobs'}</Text>
                  </>
                )}
                <Text style={styles.clientMetaDot}>•</Text>
                <Text style={styles.clientMetaText}>{item.area}</Text>
              </View>
            </View>
            <View style={styles.clientActions}>
              <TouchableOpacity style={styles.actionIcon} onPress={() => openChat(item)}>
                <Ionicons name="chatbubble-outline" size={17} color={Colors.textSecondary} />
              </TouchableOpacity>
              <TouchableOpacity style={styles.phoneIconWrap}>
                <Ionicons name="call-outline" size={17} color={Colors.primaryDark} />
              </TouchableOpacity>
            </View>
          </TouchableOpacity>
        )}
        ItemSeparatorComponent={() => <View style={styles.separator} />}
      />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: { flex: 1, backgroundColor: Colors.background },

  header: {
    flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between',
    backgroundColor: Colors.white, paddingHorizontal: 16, paddingVertical: 14,
  },
  title: { fontSize: 24, fontWeight: '700', color: Colors.textPrimary },
  newClientBtn: {
    flexDirection: 'row', alignItems: 'center', gap: 6,
    backgroundColor: Colors.primaryDark, borderRadius: BorderRadius.full,
    paddingHorizontal: 14, paddingVertical: 9,
  },
  newClientText: { fontSize: 13, fontWeight: '600', color: Colors.white },

  subHeader: { backgroundColor: Colors.white, paddingHorizontal: 16, paddingBottom: 0, borderBottomWidth: 1, borderBottomColor: Colors.borderLight },
  subtitle: { fontSize: 12, color: Colors.textSecondary, marginBottom: 12, lineHeight: 17 },

  searchWrap: {
    flexDirection: 'row', alignItems: 'center',
    borderRadius: BorderRadius.xl, borderWidth: 1, borderColor: Colors.border,
    paddingHorizontal: 12, marginBottom: 12,
  },
  searchIcon: { marginRight: 8 },
  searchInput: { flex: 1, height: 42, fontSize: 14, color: Colors.textPrimary },

  tabBar: { flexDirection: 'row', paddingBottom: 10, gap: 6 },
  tab: {
    flexDirection: 'row', alignItems: 'center',
    paddingHorizontal: 14, paddingVertical: 8,
    borderRadius: BorderRadius.full, borderWidth: 1, borderColor: Colors.border,
  },
  tabActive: { backgroundColor: Colors.primaryLight, borderColor: Colors.primaryDark },
  tabText: { fontSize: 11, fontWeight: '700', color: Colors.textSecondary },
  tabTextActive: { color: Colors.primaryDark },

  list: { padding: 16 },

  statsRow: { flexDirection: 'row', gap: 12, marginBottom: 16 },
  statCard: {
    flex: 1, flexDirection: 'row', alignItems: 'center', gap: 12,
    backgroundColor: Colors.white, borderRadius: BorderRadius.xl,
    padding: 14, borderWidth: 1, borderColor: Colors.border,
  },
  statIconWrap: {
    width: 36, height: 36, borderRadius: 18, backgroundColor: Colors.primaryLight,
    alignItems: 'center', justifyContent: 'center',
  },
  statNum: { fontSize: 20, fontWeight: '800', color: Colors.textPrimary },
  statLabel: { fontSize: 11, color: Colors.textSecondary, marginTop: 1 },

  directoryHeader: {
    flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between',
    backgroundColor: Colors.white, borderRadius: BorderRadius.xl, padding: 14,
    borderWidth: 1, borderColor: Colors.border, marginBottom: 0,
  },
  directoryLeft: { flexDirection: 'row', alignItems: 'center', gap: 10 },
  directoryTitle: { fontSize: 15, fontWeight: '700', color: Colors.textPrimary },
  azBadge: {
    backgroundColor: Colors.background, borderRadius: BorderRadius.md,
    paddingHorizontal: 8, paddingVertical: 4, borderWidth: 1, borderColor: Colors.border,
  },
  azText: { fontSize: 11, fontWeight: '700', color: Colors.textSecondary },

  clientRow: {
    flexDirection: 'row', alignItems: 'center',
    backgroundColor: Colors.white, paddingHorizontal: 14, paddingVertical: 14,
  },
  avatar: { width: 44, height: 44, borderRadius: 22, alignItems: 'center', justifyContent: 'center', marginRight: 12 },
  avatarText: { color: Colors.white, fontSize: 15, fontWeight: '700' },
  clientInfo: { flex: 1 },
  clientName: { fontSize: 15, fontWeight: '600', color: Colors.textPrimary, marginBottom: 4 },
  clientMeta: { flexDirection: 'row', alignItems: 'center', gap: 4 },
  clientMetaText: { fontSize: 12, color: Colors.textSecondary },
  clientMetaDot: { fontSize: 12, color: Colors.textMuted },

  clientActions: { flexDirection: 'row', alignItems: 'center', gap: 10 },
  actionIcon: { padding: 4 },
  phoneIconWrap: {
    width: 36, height: 36, borderRadius: 18, backgroundColor: Colors.primaryLight,
    alignItems: 'center', justifyContent: 'center',
  },

  separator: { height: 1, backgroundColor: Colors.borderLight, marginLeft: 70 },
});

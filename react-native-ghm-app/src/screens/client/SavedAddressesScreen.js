import React from 'react';
import {
  View, Text, StyleSheet, ScrollView, TouchableOpacity, StatusBar, Alert,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { Colors } from '../../theme/colors';
import { FontSize, FontWeight } from '../../theme/typography';
import { BorderRadius, Spacing } from '../../theme/spacing';

const ADDRESSES = [
  { id: 1, type: 'home', label: 'Home', tag: 'DEFAULT', address: '1234 Maplewood Drive', city: 'Austin, TX 78704' },
  { id: 2, type: 'business', label: 'Office', tag: null, address: '850 Congress Ave\nSuite 400', city: 'Austin, TX 78701' },
  { id: 3, type: 'business', label: 'Rental Property', tag: null, address: '4500 South Congress Ave\nUnit 210', city: 'Austin, TX 78745' },
];

const TYPE_ICONS = { home: 'home-outline', business: 'briefcase-outline', other: 'location-outline' };

export default function SavedAddressesScreen({ navigation }) {
  return (
    <SafeAreaView style={styles.safe}>
      <StatusBar barStyle="dark-content" backgroundColor="#FDFBF7" />
      
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()} style={styles.headerBtn}>
          <Ionicons name="arrow-back" size={24} color={Colors.textPrimary} />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Saved Addresses</Text>
        <View style={styles.headerBtnRight} />
      </View>

      <ScrollView contentContainerStyle={styles.scroll} showsVerticalScrollIndicator={false}>
        {ADDRESSES.map((addr) => (
          <View key={addr.id} style={styles.card}>
            <View style={styles.cardTopRow}>
              <View style={[styles.iconWrap, addr.type === 'home' ? { backgroundColor: '#E8F3EF' } : { backgroundColor: '#FDFBF7' }]}>
                <Ionicons name={TYPE_ICONS[addr.type] || 'location-outline'} size={20} color={Colors.textPrimary} />
              </View>
              <View style={styles.info}>
                <View style={styles.labelRow}>
                  <Text style={styles.label}>{addr.label}</Text>
                  {addr.tag && (
                    <View style={styles.defaultTag}>
                      <Text style={styles.defaultTagText}>{addr.tag}</Text>
                    </View>
                  )}
                </View>
                <Text style={styles.address}>{addr.address}</Text>
                <Text style={styles.city}>{addr.city}</Text>
                
                <View style={styles.actions}>
                  <TouchableOpacity
                    style={styles.actionBtn}
                    onPress={() => navigation.navigate('AddNewAddress', { address: addr })}
                  >
                    <Ionicons name="pencil-outline" size={16} color={Colors.textPrimary} />
                    <Text style={styles.actionEditText}>Edit</Text>
                  </TouchableOpacity>
                  {addr.tag !== 'DEFAULT' && (
                    <TouchableOpacity
                      style={[styles.actionBtn, { marginLeft: Spacing.lg }]}
                      onPress={() =>
                        Alert.alert('Remove Address', `Remove "${addr.label}"?`, [
                          { text: 'Cancel', style: 'cancel' },
                          { text: 'Remove', style: 'destructive', onPress: () => {} },
                        ])
                      }
                    >
                      <Ionicons name="trash-outline" size={16} color={Colors.error} />
                      <Text style={styles.actionRemoveText}>Remove</Text>
                    </TouchableOpacity>
                  )}
                </View>
              </View>
            </View>
          </View>
        ))}

      </ScrollView>

      {/* Add New Address Button */}
      <View style={styles.bottomBar}>
        <TouchableOpacity
          style={styles.addBtn}
          onPress={() => navigation.navigate('AddNewAddress')}
        >
          <Ionicons name="add" size={20} color={Colors.white} />
          <Text style={styles.addBtnText}>Add New Address</Text>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: { flex: 1, backgroundColor: '#FDFBF7' },
  header: {
    flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between',
    paddingHorizontal: Spacing.xl, paddingVertical: 14, backgroundColor: '#FFFFFF',
    borderBottomWidth: 1, borderBottomColor: Colors.borderLight,
  },
  headerBtn: { width: 40, alignItems: 'flex-start' },
  headerBtnRight: { width: 40 },
  headerTitle: { fontSize: FontSize.lg, fontWeight: FontWeight.bold, color: Colors.textPrimary },
  
  scroll: { padding: Spacing.xl, paddingBottom: 100 },
  card: {
    backgroundColor: Colors.white, borderRadius: BorderRadius.lg, padding: Spacing.lg,
    marginBottom: Spacing.md, borderWidth: 1, borderColor: Colors.borderLight,
  },
  cardTopRow: { flexDirection: 'row' },
  iconWrap: { width: 44, height: 44, borderRadius: 22, alignItems: 'center', justifyContent: 'center', marginRight: Spacing.md },
  info: { flex: 1 },
  labelRow: { flexDirection: 'row', alignItems: 'center', gap: 10, marginBottom: 8 },
  label: { fontWeight: 'bold', fontSize: FontSize.md, color: Colors.textPrimary },
  defaultTag: { backgroundColor: '#E8F3EF', paddingHorizontal: 8, paddingVertical: 4, borderRadius: BorderRadius.full },
  defaultTagText: { color: Colors.primaryDark, fontSize: 10, fontWeight: 'bold', letterSpacing: 0.5 },
  address: { color: Colors.textSecondary, fontSize: FontSize.sm, lineHeight: 20 },
  city: { color: Colors.textSecondary, fontSize: FontSize.sm, marginTop: 2, marginBottom: Spacing.md },
  
  actions: { flexDirection: 'row', alignItems: 'center' },
  actionBtn: { flexDirection: 'row', alignItems: 'center', gap: 6 },
  actionEditText: { color: Colors.textPrimary, fontSize: FontSize.sm, fontWeight: 'bold' },
  actionRemoveText: { color: Colors.error, fontSize: FontSize.sm, fontWeight: 'bold' },
  
  bottomBar: {
    padding: Spacing.xl, backgroundColor: '#FDFBF7',
    borderTopWidth: 1, borderTopColor: Colors.borderLight, // Optional: add border if needed
  },
  addBtn: {
    backgroundColor: Colors.primaryDark,
    flexDirection: 'row', alignItems: 'center', justifyContent: 'center',
    borderRadius: BorderRadius.lg, paddingVertical: 16, gap: 8
  },
  addBtnText: { color: Colors.white, fontWeight: 'bold', fontSize: FontSize.md },
});

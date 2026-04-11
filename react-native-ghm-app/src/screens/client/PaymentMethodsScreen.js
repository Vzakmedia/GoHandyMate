import React, { useState } from 'react';
import {
  View, Text, StyleSheet, ScrollView, TouchableOpacity, StatusBar, Switch, Alert,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { Colors } from '../../theme/colors';
import { FontSize, FontWeight } from '../../theme/typography';
import { BorderRadius, Spacing } from '../../theme/spacing';

const CARDS = [
  { id: 1, brand: 'VISA', last4: '4242', name: 'Alex Johnson', expiry: '12/25', isDefault: true },
  { id: 2, brand: 'MC', last4: '8812', name: 'Alex Johnson', expiry: '08/26', isDefault: false },
];

export default function PaymentMethodsScreen({ navigation }) {
  const [applePayEnabled, setApplePayEnabled] = useState(true);

  return (
    <SafeAreaView style={styles.safe}>
      <StatusBar barStyle="dark-content" backgroundColor="#FDFBF7" />
      
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()} style={styles.headerBtn}>
          <Ionicons name="arrow-back" size={24} color={Colors.textPrimary} />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Payment Methods</Text>
        <TouchableOpacity onPress={() => navigation.navigate('AddNewCard')} style={styles.headerBtnRight}>
          <Ionicons name="add" size={28} color={Colors.textPrimary} />
        </TouchableOpacity>
      </View>

      <ScrollView contentContainerStyle={styles.scroll} showsVerticalScrollIndicator={false}>

        {/* Digital Wallets */}
        <Text style={styles.sectionLabel}>DIGITAL WALLETS</Text>
        <View style={styles.walletCard}>
          <View style={styles.walletRow}>
            <View style={styles.appleIconWrapper}>
              <Ionicons name="logo-apple" size={20} color={Colors.white} />
            </View>
            <Text style={styles.walletName}>Apple Pay</Text>
            <Switch
              value={applePayEnabled}
              onValueChange={setApplePayEnabled}
              trackColor={{ false: '#D1D5DB', true: '#2D6A4F' }}
              thumbColor={Colors.white}
              ios_backgroundColor="#D1D5DB"
            />
          </View>
        </View>

        {/* Credit & Debit Cards */}
        <Text style={styles.sectionLabel}>CREDIT & DEBIT CARDS</Text>
        {CARDS.map((card) => (
          <View key={card.id} style={[styles.cardContainer, card.isDefault ? styles.defaultCard : null]}>
            {card.isDefault && (
              <View style={styles.defaultBadge}>
                <Text style={styles.defaultBadgeText}>DEFAULT</Text>
              </View>
            )}
            <View style={styles.cardTopRow}>
              {card.brand === 'VISA' ? (
                <View style={[styles.brandBox, { backgroundColor: '#1A1F71' }]}>
                  <Text style={[styles.brandText, { color: Colors.white }]}>VISA</Text>
                </View>
              ) : (
                <View style={[styles.brandBox, { backgroundColor: '#FF5F00', flexDirection: 'row', alignItems: 'center', justifyContent: 'center', width: 44, paddingHorizontal: 0 }]}>
                    <View style={{ width: 20, height: 20, borderRadius: 10, backgroundColor: '#EB001B', position: 'absolute', left: 6 }}/>
                    <View style={{ width: 20, height: 20, borderRadius: 10, backgroundColor: '#F79E1B', position: 'absolute', right: 6, opacity: 0.9 }}/>
                </View>
              )}
              <TouchableOpacity
                style={styles.menuDots}
                onPress={() =>
                  Alert.alert(`Card ending in ${card.last4}`, undefined, [
                    ...(!card.isDefault ? [{ text: 'Set as Default', onPress: () => {} }] : []),
                    { text: 'Remove Card', style: 'destructive', onPress: () => {} },
                    { text: 'Cancel', style: 'cancel' },
                  ])
                }
              >
                <Ionicons name="ellipsis-horizontal" size={20} color={Colors.textSecondary} />
              </TouchableOpacity>
            </View>
            
            <Text style={styles.cardNumber}>••••  ••••  ••••  <Text style={{ fontSize: FontSize.lg }}>{card.last4}</Text></Text>
            
            <View style={styles.cardMeta}>
              <View>
                <Text style={styles.cardMetaLabel}>CARDHOLDER NAME</Text>
                <Text style={styles.cardMetaValue}>{card.name}</Text>
              </View>
              <View style={styles.cardMetaRight}>
                <Text style={styles.cardMetaLabel}>EXPIRY</Text>
                <Text style={styles.cardMetaValue}>{card.expiry}</Text>
              </View>
            </View>
          </View>
        ))}

        {/* Add New Card */}
        <TouchableOpacity
          style={styles.addCardBtn}
          onPress={() => navigation.navigate('AddNewCard')}
        >
          <Ionicons name="add-circle-outline" size={20} color={Colors.primaryDark} />
          <Text style={styles.addCardText}>Add New Card</Text>
        </TouchableOpacity>
      </ScrollView>
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
  headerBtnRight: { width: 40, alignItems: 'flex-end' },
  headerTitle: { fontSize: FontSize.lg, fontWeight: FontWeight.bold, color: Colors.textPrimary },
  scroll: { paddingHorizontal: Spacing.xl, paddingBottom: 40 },
  
  sectionLabel: { fontSize: FontSize.xs, fontWeight: FontWeight.bold, color: Colors.textSecondary, letterSpacing: 0.5, marginBottom: Spacing.sm, marginTop: Spacing.xl },
  
  walletCard: { backgroundColor: Colors.white, borderRadius: BorderRadius.lg, padding: Spacing.md, marginBottom: Spacing.md, borderWidth: 1, borderColor: Colors.borderLight },
  walletRow: { flexDirection: 'row', alignItems: 'center' },
  appleIconWrapper: { width: 34, height: 34, borderRadius: 8, backgroundColor: '#000', alignItems: 'center', justifyContent: 'center', marginRight: Spacing.md },
  walletName: { flex: 1, fontSize: FontSize.md, fontWeight: FontWeight.semibold, color: Colors.textPrimary },
  
  cardContainer: {
    backgroundColor: Colors.white, borderRadius: BorderRadius.lg, padding: Spacing.lg,
    marginBottom: Spacing.md, borderWidth: 1, borderColor: '#D1D5DB', // light gray border for non-default
    position: 'relative', overflow: 'hidden'
  },
  defaultCard: { borderColor: Colors.primaryDark },
  defaultBadge: { 
    position: 'absolute', top: 0, right: 0, 
    backgroundColor: Colors.primaryDark, 
    paddingHorizontal: 12, paddingVertical: 6, 
    borderBottomLeftRadius: BorderRadius.lg 
  },
  defaultBadgeText: { color: Colors.white, fontSize: 10, fontWeight: 'bold', letterSpacing: 0.5 },
  
  cardTopRow: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: Spacing.lg },
  brandBox: { paddingHorizontal: 10, paddingVertical: 6, borderRadius: 4, height: 28, justifyContent: 'center' },
  brandText: { fontWeight: '900', fontSize: FontSize.xs, fontStyle: 'italic', letterSpacing: 0.5 },
  menuDots: { padding: 4, marginTop: -4 },
  
  cardNumber: { fontSize: 22, fontWeight: 'bold', color: Colors.textPrimary, letterSpacing: 1, marginBottom: Spacing.xl, marginTop: Spacing.sm },
  
  cardMeta: { flexDirection: 'row', justifyContent: 'space-between' },
  cardMetaRight: { alignItems: 'flex-end' },
  cardMetaLabel: { fontSize: 10, color: Colors.textSecondary, letterSpacing: 0.5, marginBottom: 4 },
  cardMetaValue: { fontSize: FontSize.sm, fontWeight: 'bold', color: Colors.textPrimary },
  
  addCardBtn: {
    flexDirection: 'row', alignItems: 'center', justifyContent: 'center', gap: 8,
    borderWidth: 1, borderColor: Colors.primaryDark, borderStyle: 'dashed',
    borderRadius: BorderRadius.lg, paddingVertical: 16, backgroundColor: 'rgba(45, 106, 79, 0.05)',
    marginTop: Spacing.sm
  },
  addCardText: { color: Colors.primaryDark, fontWeight: FontWeight.bold, fontSize: FontSize.sm },
});

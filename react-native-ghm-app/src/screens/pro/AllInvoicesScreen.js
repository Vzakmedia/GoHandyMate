import React from 'react';
import {
  View, Text, StyleSheet, FlatList, TouchableOpacity, StatusBar,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { Colors } from '../../theme/colors';
import { FontSize, FontWeight } from '../../theme/typography';
import { BorderRadius, Spacing } from '../../theme/spacing';
import { Header } from '../../components/Header';

const INVOICES = [
  { id: 'INV-0042', client: 'Alex Johnson', date: 'Mar 21', status: 'paid', amount: '$110.00' },
  { id: 'INV-0041', client: 'Sarah Chen', date: 'Mar 18', status: 'pending', amount: '$85.00' },
  { id: 'INV-0040', client: 'Tom Nguyen', date: 'Mar 15', status: 'paid', amount: '$150.00' },
  { id: 'INV-0039', client: 'Linda Park', date: 'Mar 10', status: 'overdue', amount: '$95.00' },
  { id: 'INV-0038', client: 'Marcus T.', date: 'Mar 02', status: 'paid', amount: '$240.00' },
];

const STATUS_MAP = {
  paid: { color: Colors.success, label: 'Paid', bg: Colors.successLight },
  pending: { color: Colors.warning, label: 'Pending', bg: Colors.warningLight },
  overdue: { color: Colors.error, label: 'Overdue', bg: Colors.errorLight },
};

export default function AllInvoicesScreen({ navigation }) {
  return (
    <SafeAreaView style={styles.safe}>
      <StatusBar barStyle="dark-content" backgroundColor={Colors.white} />
      <Header title="All Invoices" onBack={() => navigation.goBack()} rightIcon="add" onRightPress={() => navigation.navigate('CreateInvoice')} />

      <FlatList
        data={INVOICES}
        keyExtractor={(item) => item.id}
        contentContainerStyle={styles.list}
        renderItem={({ item }) => {
          const st = STATUS_MAP[item.status];
          return (
            <TouchableOpacity 
              style={styles.card}
              onPress={() => navigation.navigate('InvoiceDetails', { id: item.id })}
            >
              <View style={styles.topRow}>
                <Text style={styles.clientId}>{item.client} <Text style={styles.muted}>· #{item.id}</Text></Text>
                <Text style={styles.amount}>{item.amount}</Text>
              </View>
              <View style={styles.bottomRow}>
                <Text style={styles.date}>Sent: {item.date}</Text>
                <View style={[styles.badge, { backgroundColor: st.bg }]}>
                  <Text style={[styles.badgeText, { color: st.color }]}>{st.label}</Text>
                </View>
              </View>
            </TouchableOpacity>
          );
        }}
      />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: { flex: 1, backgroundColor: Colors.background },
  list: { padding: Spacing.base },
  card: { backgroundColor: Colors.white, borderRadius: BorderRadius.lg, padding: Spacing.md, marginBottom: Spacing.md, borderWidth: 1, borderColor: Colors.border },
  topRow: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 8 },
  clientId: { fontSize: FontSize.sm, fontWeight: FontWeight.bold, color: Colors.textPrimary },
  muted: { color: Colors.textMuted, fontWeight: 'normal' },
  amount: { fontSize: FontSize.md, fontWeight: FontWeight.bold, color: Colors.textPrimary },
  bottomRow: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' },
  date: { fontSize: FontSize.xs, color: Colors.textSecondary },
  badge: { paddingHorizontal: 8, paddingVertical: 3, borderRadius: BorderRadius.full },
  badgeText: { fontSize: FontSize.xs, fontWeight: FontWeight.bold, letterSpacing: 0.5 },
});

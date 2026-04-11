import React from 'react';
import {
  View, Text, StyleSheet, ScrollView, StatusBar, TouchableOpacity
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { Colors } from '../../theme/colors';
import { FontSize, FontWeight } from '../../theme/typography';
import { BorderRadius, Spacing } from '../../theme/spacing';
import { Header } from '../../components/Header';

export default function InvoiceDetailsScreen({ navigation }) {
  return (
    <SafeAreaView style={styles.safe}>
      <StatusBar barStyle="dark-content" backgroundColor={Colors.white} />
      <Header title="Invoice #INV-0042" onBack={() => navigation.goBack()} />

      <ScrollView contentContainerStyle={styles.scroll} showsVerticalScrollIndicator={false}>
        {/* Status */}
        <View style={styles.statusBox}>
          <View style={styles.statusBadge}>
            <Ionicons name="checkmark-circle" size={16} color={Colors.success} style={{ marginRight: 4 }} />
            <Text style={styles.statusText}>PAID ON MAR 21, 2026</Text>
          </View>
        </View>

        {/* Invoice Header */}
        <View style={styles.infoRow}>
          <View style={styles.infoCol}>
            <Text style={styles.label}>FROM</Text>
            <Text style={styles.mainText}>RapidFix Plumbing</Text>
            <Text style={styles.subText}>mike@rapidfix.com</Text>
          </View>
          <View style={[styles.infoCol, { alignItems: 'flex-end' }]}>
            <Text style={styles.label}>TO</Text>
            <Text style={styles.mainText}>Alex Johnson</Text>
            <Text style={styles.subText}>1234 Maplewood Dr</Text>
          </View>
        </View>

        {/* Amount */}
        <View style={styles.amountBox}>
          <Text style={styles.amountLabel}>Total Billed</Text>
          <Text style={styles.amountVal}>$110.00</Text>
        </View>

        {/* Line Items */}
        <Text style={styles.sectionTitle}>Line Items</Text>
        <View style={styles.table}>
          <View style={styles.tableHeader}>
            <Text style={[styles.th, { flex: 2 }]}>Description</Text>
            <Text style={[styles.th, { flex: 1, textAlign: 'center' }]}>Qty</Text>
            <Text style={[styles.th, { flex: 1, textAlign: 'right' }]}>Amount</Text>
          </View>
          
          <View style={styles.tr}>
            <Text style={[styles.td, { flex: 2 }]}>Leak Repair Labor (2 hrs)</Text>
            <Text style={[styles.td, { flex: 1, textAlign: 'center' }]}>1</Text>
            <Text style={[styles.td, { flex: 1, textAlign: 'right' }]}>$110.00</Text>
          </View>
          <View style={styles.tr}>
            <Text style={[styles.td, { flex: 2, color: Colors.textSecondary }]}>Platform Fee (5%)</Text>
            <Text style={[styles.td, { flex: 1, textAlign: 'center' }]}>-</Text>
            <Text style={[styles.td, { flex: 1, textAlign: 'right', color: Colors.error }]}>-$5.50</Text>
          </View>
        </View>

        <View style={styles.summaryRow}>
          <Text style={styles.summaryLabel}>Net Earnings</Text>
          <Text style={styles.summaryVal}>$104.50</Text>
        </View>

        {/* Actions */}
        <View style={styles.actionsBox}>
          <TouchableOpacity style={styles.actionBtn}>
            <Ionicons name="download-outline" size={20} color={Colors.primaryDark} />
            <Text style={styles.actionText}>Download PDF</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.actionBtn}>
            <Ionicons name="mail-outline" size={20} color={Colors.primaryDark} />
            <Text style={styles.actionText}>Resend Email</Text>
          </TouchableOpacity>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: { flex: 1, backgroundColor: Colors.white },
  scroll: { padding: Spacing.base, paddingBottom: 40 },
  statusBox: { alignItems: 'flex-start', marginBottom: Spacing.xl },
  statusBadge: { flexDirection: 'row', alignItems: 'center', backgroundColor: Colors.successLight, paddingHorizontal: 12, paddingVertical: 6, borderRadius: BorderRadius.full },
  statusText: { color: Colors.success, fontSize: FontSize.xs, fontWeight: FontWeight.bold, letterSpacing: 0.5 },
  infoRow: { flexDirection: 'row', justifyContent: 'space-between', marginBottom: Spacing.xl },
  infoCol: { flex: 1 },
  label: { fontSize: FontSize.xs, fontWeight: FontWeight.bold, color: Colors.textSecondary, letterSpacing: 1, marginBottom: 8 },
  mainText: { fontSize: FontSize.md, fontWeight: FontWeight.bold, color: Colors.textPrimary, marginBottom: 2 },
  subText: { fontSize: FontSize.sm, color: Colors.textSecondary, lineHeight: 18 },
  amountBox: { backgroundColor: Colors.background, borderRadius: BorderRadius.lg, padding: Spacing.xl, alignItems: 'center', marginBottom: Spacing.xl, borderWidth: 1, borderColor: Colors.border },
  amountLabel: { fontSize: FontSize.sm, color: Colors.textSecondary, marginBottom: 4 },
  amountVal: { fontSize: FontSize['4xl'], fontWeight: FontWeight.extrabold, color: Colors.primaryDark },
  sectionTitle: { fontSize: FontSize.md, fontWeight: FontWeight.bold, color: Colors.textPrimary, marginBottom: Spacing.sm },
  table: { borderWidth: 1, borderColor: Colors.border, borderRadius: BorderRadius.lg, overflow: 'hidden', marginBottom: Spacing.md },
  tableHeader: { flexDirection: 'row', backgroundColor: Colors.background, padding: Spacing.md, borderBottomWidth: 1, borderBottomColor: Colors.border },
  th: { fontSize: FontSize.xs, fontWeight: FontWeight.bold, color: Colors.textSecondary, textTransform: 'uppercase' },
  tr: { flexDirection: 'row', padding: Spacing.md, borderBottomWidth: 1, borderBottomColor: Colors.borderLight, backgroundColor: Colors.white },
  td: { fontSize: FontSize.sm, color: Colors.textPrimary },
  summaryRow: { flexDirection: 'row', justifyContent: 'flex-end', alignItems: 'center', marginTop: Spacing.sm, marginBottom: Spacing.xl },
  summaryLabel: { fontSize: FontSize.md, color: Colors.textSecondary, marginRight: Spacing.base },
  summaryVal: { fontSize: FontSize.xl, fontWeight: FontWeight.bold, color: Colors.success },
  actionsBox: { flexDirection: 'row', gap: Spacing.md },
  actionBtn: { flex: 1, flexDirection: 'row', alignItems: 'center', justifyContent: 'center', gap: 8, paddingVertical: 12, borderRadius: BorderRadius.md, borderWidth: 1.5, borderColor: Colors.border },
  actionText: { color: Colors.primaryDark, fontWeight: FontWeight.semibold, fontSize: FontSize.sm },
});

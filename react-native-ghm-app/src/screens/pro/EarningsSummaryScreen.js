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

const BREAKDOWN = [
  { label: 'Completed Jobs', val: '$2,850.00' },
  { label: 'Tips', val: '$325.00' },
  { label: 'Platform Fees (-10%)', val: '-$317.50', isNegative: true },
];

export default function EarningsSummaryScreen({ navigation }) {
  return (
    <SafeAreaView style={styles.safe}>
      <StatusBar barStyle="dark-content" backgroundColor={Colors.white} />
      <Header title="Earnings Summary" onBack={() => navigation.goBack()} />

      <ScrollView contentContainerStyle={styles.scroll} showsVerticalScrollIndicator={false}>
        {/* Date Selector placeholders */}
        <View style={styles.datePicker}>
          <TouchableOpacity style={styles.dateBtn}>
            <Ionicons name="chevron-back" size={20} color={Colors.textPrimary} />
          </TouchableOpacity>
          <Text style={styles.dateText}>March 2026</Text>
          <TouchableOpacity style={styles.dateBtn}>
            <Ionicons name="chevron-forward" size={20} color={Colors.textMuted} />
          </TouchableOpacity>
        </View>

        {/* Big Number */}
        <View style={styles.heroCard}>
          <Text style={styles.heroLabel}>Net Earnings</Text>
          <Text style={styles.heroVal}>$2,857.50</Text>
          <View style={styles.heroPill}>
            <Ionicons name="trending-up" size={14} color={Colors.white} style={{ marginRight: 4 }} />
            <Text style={styles.heroPillText}>+12% vs Feb</Text>
          </View>
        </View>

        {/* Stats Row */}
        <View style={styles.statsRow}>
          <View style={styles.statBox}>
            <Text style={styles.statLabel}>Jobs</Text>
            <Text style={styles.statVal}>28</Text>
          </View>
          <View style={styles.statBox}>
            <Text style={styles.statLabel}>Avg / Job</Text>
            <Text style={styles.statVal}>$102.05</Text>
          </View>
          <View style={styles.statBox}>
            <Text style={styles.statLabel}>Hours</Text>
            <Text style={styles.statVal}>42</Text>
          </View>
        </View>

        {/* Breakdown */}
        <Text style={styles.sectionTitle}>Breakdown</Text>
        <View style={styles.breakdownCard}>
          {BREAKDOWN.map((item, i) => (
            <View key={item.label} style={[styles.breakdownRow, i < BREAKDOWN.length - 1 && styles.borderB]}>
              <Text style={styles.bdLabel}>{item.label}</Text>
              <Text style={[styles.bdVal, item.isNegative && styles.bdNegative]}>{item.val}</Text>
            </View>
          ))}
          <View style={styles.totalRow}>
            <Text style={styles.totalLabel}>Total Net</Text>
            <Text style={styles.totalVal}>$2,857.50</Text>
          </View>
        </View>

        {/* Chart Placeholder */}
        <Text style={styles.sectionTitle}>Weekly Overview</Text>
        <View style={styles.chartPh}>
          <View style={styles.bars}>
            {[40, 60, 80, 50, 90, 30, 70].map((h, i) => (
              <View key={i} style={styles.barWrap}>
                <View style={[styles.bar, { height: `${h}%` }]} />
                <Text style={styles.barLabel}>{['M','T','W','T','F','S','S'][i]}</Text>
              </View>
            ))}
          </View>
        </View>

      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: { flex: 1, backgroundColor: Colors.background },
  scroll: { padding: Spacing.base, paddingBottom: 40 },
  datePicker: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', backgroundColor: Colors.white, padding: Spacing.sm, borderRadius: BorderRadius.md, borderWidth: 1, borderColor: Colors.border, marginBottom: Spacing.md },
  dateBtn: { padding: 4 },
  dateText: { fontSize: FontSize.md, fontWeight: FontWeight.bold, color: Colors.textPrimary },
  heroCard: { backgroundColor: Colors.primaryDark, borderRadius: BorderRadius.xl, padding: Spacing.xl, alignItems: 'center', marginBottom: Spacing.md },
  heroLabel: { color: Colors.white + '99', fontSize: FontSize.sm, fontWeight: FontWeight.semibold, textTransform: 'uppercase', letterSpacing: 1, marginBottom: 8 },
  heroVal: { color: Colors.white, fontSize: FontSize['4xl'], fontWeight: FontWeight.extrabold, marginBottom: 12 },
  heroPill: { flexDirection: 'row', alignItems: 'center', backgroundColor: Colors.success, paddingHorizontal: 10, paddingVertical: 4, borderRadius: BorderRadius.full },
  heroPillText: { color: Colors.white, fontSize: FontSize.xs, fontWeight: FontWeight.bold },
  statsRow: { flexDirection: 'row', gap: Spacing.sm, marginBottom: Spacing.xl },
  statBox: { flex: 1, backgroundColor: Colors.white, padding: Spacing.md, borderRadius: BorderRadius.lg, borderWidth: 1, borderColor: Colors.border, alignItems: 'center' },
  statLabel: { fontSize: FontSize.xs, color: Colors.textSecondary, marginBottom: 4 },
  statVal: { fontSize: FontSize.lg, fontWeight: FontWeight.bold, color: Colors.textPrimary },
  sectionTitle: { fontSize: FontSize.md, fontWeight: FontWeight.bold, color: Colors.textPrimary, marginBottom: Spacing.sm },
  breakdownCard: { backgroundColor: Colors.white, borderRadius: BorderRadius.lg, borderWidth: 1, borderColor: Colors.border, marginBottom: Spacing.xl },
  breakdownRow: { flexDirection: 'row', justifyContent: 'space-between', padding: Spacing.md },
  borderB: { borderBottomWidth: 1, borderBottomColor: Colors.borderLight },
  bdLabel: { fontSize: FontSize.sm, color: Colors.textSecondary },
  bdVal: { fontSize: FontSize.sm, fontWeight: FontWeight.semibold, color: Colors.textPrimary },
  bdNegative: { color: Colors.error },
  totalRow: { flexDirection: 'row', justifyContent: 'space-between', padding: Spacing.md, backgroundColor: Colors.surface, borderBottomLeftRadius: BorderRadius.lg, borderBottomRightRadius: BorderRadius.lg },
  totalLabel: { fontSize: FontSize.md, fontWeight: FontWeight.bold, color: Colors.textPrimary },
  totalVal: { fontSize: FontSize.md, fontWeight: FontWeight.bold, color: Colors.primaryDark },
  chartPh: { backgroundColor: Colors.white, borderRadius: BorderRadius.lg, borderWidth: 1, borderColor: Colors.border, padding: Spacing.base, height: 200 },
  bars: { flex: 1, flexDirection: 'row', justifyContent: 'space-around', alignItems: 'flex-end', paddingTop: Spacing.md },
  barWrap: { alignItems: 'center', height: '100%', justifyContent: 'flex-end' },
  bar: { width: 16, backgroundColor: Colors.primaryMedium, borderRadius: 4, marginBottom: 8 },
  barLabel: { fontSize: FontSize.xs, color: Colors.textSecondary },
});

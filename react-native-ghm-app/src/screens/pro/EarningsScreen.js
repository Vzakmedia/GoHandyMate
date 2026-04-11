import React, { useState } from 'react';
import {
  View, Text, StyleSheet, ScrollView, TouchableOpacity, StatusBar,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { Colors } from '../../theme/colors';
import { BorderRadius } from '../../theme/spacing';

const TABS = [
  { key: 'OVERVIEW', icon: 'grid-outline' },
  { key: 'PAYOUTS', icon: 'paper-plane-outline' },
  { key: 'INVOICES', icon: 'document-text-outline' },
  { key: 'TAXES', icon: 'calendar-outline' },
];

const INVOICES = [
  { id: 1, client: 'Sarah Jenkins', invNum: 'INV-0042', due: 'Due Oct 25', amount: '$800.00', status: 'UNPAID', statusColor: Colors.textSecondary, statusBg: Colors.background },
  { id: 2, client: 'Michael Chen', invNum: 'INV-0041', due: 'Due Oct 12', amount: '$450.00', status: 'OVERDUE', statusColor: Colors.error, statusBg: Colors.errorLight },
  { id: 3, client: 'Emily Davis', invNum: 'INV-0040', due: 'Paid Oct 10', amount: '$320.00', status: 'PAID', statusColor: Colors.success, statusBg: Colors.successLight },
  { id: 4, client: 'Robert Wilson', invNum: 'INV-0039', due: 'Paid Oct 05', amount: '$1,150.00', status: 'PAID', statusColor: Colors.success, statusBg: Colors.successLight },
];

const DEDUCTIONS = [
  { icon: 'car-outline', label: 'Mileage (a ct.)', sub: '120 miles • Oct 31', amount: '$70.50' },
  { icon: 'construct-outline', label: 'Home Depot', sub: 'Materials • Oct 15', amount: '$145.20' },
  { icon: 'phone-portrait-outline', label: 'AT&T Mobile', sub: 'Phone Bill • Oct 05', amount: '$85.00' },
];

const PAYOUT_HISTORY = [
  { icon: 'sync-outline', iconBg: Colors.warningLight, iconColor: Colors.warning, label: 'Transfer to Chase', date: 'Today, 9:00 AM', amount: '$450.00', status: '' },
  { icon: 'checkmark-circle', iconBg: Colors.successLight, iconColor: Colors.success, label: 'Transfer to Chase', date: 'Oct 16, 2023', amount: '$820.50', status: 'Completed' },
  { icon: 'checkmark-circle', iconBg: Colors.successLight, iconColor: Colors.success, label: 'Transfer to Chase', date: 'Oct 9, 2023', amount: '$340.00', status: 'Completed' },
];

export default function EarningsScreen({ navigation }) {
  const [activeTab, setActiveTab] = useState('OVERVIEW');

  return (
    <SafeAreaView style={styles.safe}>
      <StatusBar barStyle="dark-content" backgroundColor={Colors.white} />

      {/* Header */}
      <View style={styles.header}>
        <Text style={styles.title}>Earnings</Text>
        <TouchableOpacity style={styles.statementBtn}>
          <Ionicons name="download-outline" size={14} color={Colors.textPrimary} />
          <Text style={styles.statementText}>Statement</Text>
        </TouchableOpacity>
      </View>
      <View style={styles.subHeaderWrap}>
        <Text style={styles.subtitle}>Track your income, view payment history, and manage your payouts.</Text>
      </View>

      {/* Tabs */}
      <View style={styles.tabScroll}>
        <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.tabBar}>
          {TABS.map((t) => (
            <TouchableOpacity
              key={t.key}
              style={[styles.tab, activeTab === t.key && styles.tabActive]}
              onPress={() => setActiveTab(t.key)}
            >
              <Text style={[styles.tabText, activeTab === t.key && styles.tabTextActive]}>{t.key}</Text>
            </TouchableOpacity>
          ))}
        </ScrollView>
      </View>

      <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={styles.scroll}>

        {/* OVERVIEW TAB */}
        {activeTab === 'OVERVIEW' && (
          <>
            <View style={styles.payoutCard}>
              <Text style={styles.payoutLabel}>Available for payout</Text>
              <Text style={styles.payoutAmount}>$ 0.00</Text>
              <TouchableOpacity style={styles.withdrawBtn}>
                <Text style={styles.withdrawText}>Withdraw funds</Text>
              </TouchableOpacity>
            </View>

            <View style={styles.card}>
              <View style={styles.overviewHeader}>
                <View style={styles.overviewLeft}>
                  <View style={styles.iconWrap}><Ionicons name="trending-up" size={16} color={Colors.primaryDark} /></View>
                  <View>
                    <Text style={styles.cardTitle}>Earnings overview</Text>
                    <Text style={styles.cardSub}>Your income over time</Text>
                  </View>
                </View>
                <View style={styles.monthBadge}><Text style={styles.monthText}>This Month</Text></View>
              </View>
              <View style={styles.statsGrid}>
                <View style={styles.statBox}><Text style={styles.statLabel}>Net earnings</Text><Text style={styles.statVal}>$0.00</Text></View>
                <View style={styles.statBox}><Text style={styles.statLabel}>Pending clearance</Text><Text style={styles.statVal}>$0.00</Text></View>
                <View style={styles.statBox}><Text style={styles.statLabel}>Expected this week</Text><Text style={styles.statVal}>$0.00</Text></View>
                <View style={styles.statBox}><Text style={styles.statLabel}>Total tips</Text><Text style={styles.statVal}>$0.00</Text></View>
              </View>
            </View>

            <View style={styles.card}>
              <View style={styles.transactionsHeader}>
                <View style={styles.transHeaderLeft}><Ionicons name="time-outline" size={16} color={Colors.textSecondary} /><Text style={styles.cardTitle}>Recent transactions</Text></View>
                <TouchableOpacity><Text style={styles.viewAllText}>View all</Text></TouchableOpacity>
              </View>
              <View style={styles.emptyState}>
                <View style={styles.emptyIconWrap}><Ionicons name="receipt-outline" size={28} color={Colors.textMuted} /></View>
                <Text style={styles.emptyTitle}>No transactions yet</Text>
                <Text style={styles.emptySub}>Completed jobs and payouts will appear here.</Text>
              </View>
            </View>

            <View style={styles.card}>
              <View style={styles.payoutMethodHeader}>
                <View style={[styles.iconWrap, { backgroundColor: '#FEF3C7' }]}><Ionicons name="business-outline" size={16} color={Colors.warning} /></View>
                <View><Text style={styles.cardTitle}>Payout method</Text><Text style={styles.cardSub}>Where your earnings are sent</Text></View>
              </View>
              <View style={styles.bankRow}>
                <View style={styles.bankLeft}>
                  <View style={styles.bankIconWrap}><Ionicons name="business-outline" size={18} color={Colors.textMuted} /></View>
                  <View><Text style={styles.bankTitle}>No bank account linked</Text><Text style={styles.bankSub}>Add an account to receive payouts</Text></View>
                </View>
                <TouchableOpacity style={styles.addBtn}>
                  <Ionicons name="add" size={14} color={Colors.primaryDark} />
                  <Text style={styles.addBtnText}>Add</Text>
                </TouchableOpacity>
              </View>
            </View>
          </>
        )}

        {/* PAYOUTS TAB */}
        {activeTab === 'PAYOUTS' && (
          <>
            <View style={styles.card}>
              <View style={styles.payoutMethodHeader}>
                <View style={[styles.iconWrap, { backgroundColor: '#FEF3C7' }]}><Ionicons name="business-outline" size={16} color={Colors.warning} /></View>
                <Text style={styles.cardTitle}>Payout methods</Text>
                <TouchableOpacity style={styles.addSmallBtn}>
                  <Ionicons name="add" size={14} color={Colors.primaryDark} />
                  <Text style={styles.addBtnText}>Add</Text>
                </TouchableOpacity>
              </View>
              <View style={styles.bankRowFull}>
                <View style={styles.bankLeft}>
                  <View style={[styles.bankIconWrap, { backgroundColor: Colors.background }]}>
                    <Ionicons name="business-outline" size={18} color={Colors.textSecondary} />
                  </View>
                  <View>
                    <Text style={styles.bankTitle}>Chase Bank ●●●● 4242</Text>
                    <Text style={styles.bankSub}>Checking account</Text>
                  </View>
                </View>
                <View style={styles.defaultBadge}><Text style={styles.defaultText}>DEFAULT</Text></View>
              </View>
            </View>

            <View style={styles.card}>
              <View style={styles.autoPayHeader}>
                <View style={[styles.iconWrap, { backgroundColor: Colors.primaryLight }]}><Ionicons name="settings-outline" size={16} color={Colors.primaryDark} /></View>
                <Text style={styles.cardTitle}>Auto-payout settings</Text>
              </View>
              <View style={styles.settingRow}>
                <Text style={styles.settingLabel}>Automatic payouts</Text>
                <View style={styles.toggleOn}><View style={styles.toggleThumb} /></View>
              </View>
              <View style={styles.settingDivider} />
              <TouchableOpacity style={styles.settingRow}>
                <Text style={styles.settingLabel}>Schedule</Text>
                <View style={styles.settingRight}>
                  <Text style={styles.settingValue}>Weekly on Mondays</Text>
                  <Ionicons name="chevron-forward" size={16} color={Colors.textMuted} />
                </View>
              </TouchableOpacity>
              <View style={styles.settingDivider} />
              <TouchableOpacity style={styles.settingRow}>
                <Text style={styles.settingLabel}>Minimum balance</Text>
                <View style={styles.settingRight}>
                  <Text style={styles.settingValue}>$50.00</Text>
                  <Ionicons name="chevron-forward" size={16} color={Colors.textMuted} />
                </View>
              </TouchableOpacity>
            </View>

            <View style={styles.card}>
              <View style={styles.transactionsHeader}>
                <View style={styles.transHeaderLeft}><Ionicons name="time-outline" size={16} color={Colors.textSecondary} /><Text style={styles.cardTitle}>Payout history</Text></View>
                <TouchableOpacity><Text style={styles.viewAllText}>View all</Text></TouchableOpacity>
              </View>
              {PAYOUT_HISTORY.map((item, i) => (
                <View key={i}>
                  <View style={styles.payoutHistoryRow}>
                    <View style={[styles.payHistIcon, { backgroundColor: item.iconBg }]}>
                      <Ionicons name={item.icon} size={18} color={item.iconColor} />
                    </View>
                    <View style={styles.payHistInfo}>
                      <Text style={styles.payHistLabel}>{item.label}</Text>
                      <Text style={styles.payHistDate}>{item.date}</Text>
                    </View>
                    <View style={{ alignItems: 'flex-end' }}>
                      <Text style={styles.payHistAmount}>{item.amount}</Text>
                      {item.status ? <Text style={styles.payHistStatus}>{item.status}</Text> : null}
                    </View>
                  </View>
                  {i < PAYOUT_HISTORY.length - 1 && <View style={styles.rowDivider} />}
                </View>
              ))}
            </View>
          </>
        )}

        {/* INVOICES TAB */}
        {activeTab === 'INVOICES' && (
          <>
            <TouchableOpacity style={styles.createInvoiceBtn} onPress={() => navigation.navigate('CreateInvoice')}>
              <Ionicons name="add" size={18} color={Colors.white} />
              <Text style={styles.createInvoiceText}>Create New Invoice</Text>
            </TouchableOpacity>

            <View style={styles.invoiceStatsRow}>
              <View style={styles.invoiceStatCard}>
                <Text style={styles.invoiceStatLabel}>Outstanding</Text>
                <Text style={styles.invoiceStatVal}>$1,250.00</Text>
              </View>
              <View style={styles.invoiceStatCard}>
                <Text style={styles.invoiceStatLabel}>Overdue</Text>
                <Text style={[styles.invoiceStatVal, { color: Colors.error }]}>$450.00</Text>
              </View>
            </View>

            <View style={styles.card}>
              <View style={styles.invoiceListHeader}>
                <Text style={styles.cardTitle}>Recent Invoices</Text>
                <TouchableOpacity style={styles.filterBtn}>
                  <Text style={styles.filterText}>Filter</Text>
                  <Ionicons name="filter-outline" size={14} color={Colors.textSecondary} />
                </TouchableOpacity>
              </View>
              {INVOICES.map((inv, i) => (
                <View key={inv.id}>
                  <TouchableOpacity style={styles.invoiceRow}>
                    <View style={styles.invoiceInfo}>
                      <Text style={styles.invoiceClient}>{inv.client}</Text>
                      <Text style={styles.invoiceMeta}>{inv.invNum} • {inv.due}</Text>
                    </View>
                    <View style={styles.invoiceRight}>
                      <Text style={styles.invoiceAmount}>{inv.amount}</Text>
                      <View style={[styles.invoiceStatus, { backgroundColor: inv.statusBg }]}>
                        <Text style={[styles.invoiceStatusText, { color: inv.statusColor }]}>{inv.status}</Text>
                      </View>
                    </View>
                  </TouchableOpacity>
                  {i < INVOICES.length - 1 && <View style={styles.rowDivider} />}
                </View>
              ))}
            </View>
          </>
        )}

        {/* TAXES TAB */}
        {activeTab === 'TAXES' && (
          <>
            <TouchableOpacity style={styles.createInvoiceBtn}>
              <Ionicons name="download-outline" size={18} color={Colors.white} />
              <Text style={styles.createInvoiceText}>Export Annual Tax Report</Text>
            </TouchableOpacity>

            <View style={styles.taxStatsRow}>
              <View style={styles.taxStatCard}>
                <Text style={styles.taxStatLabel}>Est. Taxes (YTD)</Text>
                <Text style={styles.taxStatVal}>$3,450.00</Text>
              </View>
              <View style={styles.taxStatCard}>
                <Text style={styles.taxStatLabel}>Taxable Income</Text>
                <Text style={styles.taxStatVal}>$15,200.00</Text>
              </View>
            </View>

            <View style={styles.card}>
              <View style={styles.invoiceListHeader}>
                <Text style={styles.cardTitle}>Recent Deductions</Text>
                <TouchableOpacity style={styles.filterBtn}>
                  <Text style={styles.filterText}>Add</Text>
                  <Ionicons name="add" size={14} color={Colors.textSecondary} />
                </TouchableOpacity>
              </View>
              {DEDUCTIONS.map((item, i) => (
                <View key={i}>
                  <View style={styles.deductionRow}>
                    <View style={[styles.deductionIcon, { backgroundColor: Colors.primaryLight }]}>
                      <Ionicons name={item.icon} size={18} color={Colors.primaryDark} />
                    </View>
                    <View style={styles.deductionInfo}>
                      <Text style={styles.deductionLabel}>{item.label}</Text>
                      <Text style={styles.deductionSub}>{item.sub}</Text>
                    </View>
                    <Text style={styles.deductionAmount}>{item.amount}</Text>
                  </View>
                  {i < DEDUCTIONS.length - 1 && <View style={styles.rowDivider} />}
                </View>
              ))}
            </View>

            <View style={styles.card}>
              <Text style={styles.cardTitle}>Tax Documents</Text>
              <View style={{ marginTop: 12, gap: 0 }}>
                <View style={styles.taxDocRow}>
                  <View style={styles.taxDocIcon}><Ionicons name="document-text" size={18} color={Colors.white} /></View>
                  <View style={styles.taxDocInfo}>
                    <Text style={styles.taxDocTitle}>2023 1099-K Form</Text>
                    <Text style={styles.taxDocSub}>Ready to download</Text>
                  </View>
                  <Ionicons name="download-outline" size={20} color={Colors.textSecondary} />
                </View>
                <View style={styles.rowDivider} />
                <View style={styles.taxDocRow}>
                  <View style={styles.taxDocIcon}><Ionicons name="document-text" size={18} color={Colors.white} /></View>
                  <View style={styles.taxDocInfo}>
                    <Text style={styles.taxDocTitle}>W-9 Form</Text>
                    <Text style={styles.taxDocSub}>Submitted • Jan 12</Text>
                  </View>
                  <Ionicons name="eye-outline" size={20} color={Colors.textSecondary} />
                </View>
              </View>
            </View>
          </>
        )}

        <View style={{ height: 32 }} />
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: { flex: 1, backgroundColor: Colors.background },

  header: {
    flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between',
    backgroundColor: Colors.white, paddingHorizontal: 16, paddingTop: 14, paddingBottom: 4,
  },
  title: { fontSize: 24, fontWeight: '700', color: Colors.textPrimary },
  statementBtn: {
    flexDirection: 'row', alignItems: 'center', gap: 5,
    borderWidth: 1, borderColor: Colors.border, borderRadius: BorderRadius.md,
    paddingHorizontal: 12, paddingVertical: 7,
  },
  statementText: { fontSize: 13, fontWeight: '600', color: Colors.textPrimary },
  subHeaderWrap: { backgroundColor: Colors.white, paddingHorizontal: 16, paddingBottom: 10 },
  subtitle: { fontSize: 12, color: Colors.textSecondary, lineHeight: 17 },

  tabScroll: { backgroundColor: Colors.white, borderBottomWidth: 1, borderBottomColor: Colors.borderLight },
  tabBar: { gap: 6, paddingHorizontal: 16, paddingVertical: 12 },
  tab: {
    paddingHorizontal: 14, paddingVertical: 7,
    borderRadius: BorderRadius.full, borderWidth: 1, borderColor: Colors.border,
  },
  tabActive: { backgroundColor: Colors.primaryLight, borderColor: Colors.primaryDark },
  tabText: { fontSize: 12, fontWeight: '600', color: Colors.textSecondary },
  tabTextActive: { color: Colors.primaryDark },

  scroll: { padding: 16 },

  payoutCard: {
    backgroundColor: Colors.primaryDark, borderRadius: BorderRadius.xl,
    padding: 24, alignItems: 'flex-start', marginBottom: 14,
  },
  payoutLabel: { fontSize: 12, color: 'rgba(255,255,255,0.75)', fontWeight: '500', marginBottom: 6 },
  payoutAmount: { fontSize: 36, fontWeight: '800', color: Colors.white, marginBottom: 20 },
  withdrawBtn: {
    width: '100%', backgroundColor: 'rgba(255,255,255,0.2)',
    borderRadius: BorderRadius.xl, paddingVertical: 13, alignItems: 'center',
  },
  withdrawText: { color: 'rgba(255,255,255,0.85)', fontSize: 15, fontWeight: '600' },

  card: {
    backgroundColor: Colors.white, borderRadius: BorderRadius.xl,
    padding: 16, borderWidth: 1, borderColor: Colors.border, marginBottom: 14,
  },

  overviewHeader: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', marginBottom: 14 },
  overviewLeft: { flexDirection: 'row', alignItems: 'center', gap: 10 },
  iconWrap: { width: 32, height: 32, borderRadius: 8, backgroundColor: Colors.primaryLight, alignItems: 'center', justifyContent: 'center' },
  cardTitle: { fontSize: 14, fontWeight: '700', color: Colors.textPrimary },
  cardSub: { fontSize: 11, color: Colors.textSecondary, marginTop: 1 },
  monthBadge: { backgroundColor: Colors.background, borderRadius: BorderRadius.full, paddingHorizontal: 10, paddingVertical: 5, borderWidth: 1, borderColor: Colors.border },
  monthText: { fontSize: 11, fontWeight: '600', color: Colors.textSecondary },

  statsGrid: { flexDirection: 'row', flexWrap: 'wrap', gap: 8 },
  statBox: { width: '47%', backgroundColor: Colors.background, borderRadius: BorderRadius.lg, padding: 12, borderWidth: 1, borderColor: Colors.border },
  statLabel: { fontSize: 11, color: Colors.textSecondary, marginBottom: 6 },
  statVal: { fontSize: 16, fontWeight: '700', color: Colors.textPrimary },

  transactionsHeader: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', marginBottom: 14 },
  transHeaderLeft: { flexDirection: 'row', alignItems: 'center', gap: 8 },
  viewAllText: { fontSize: 13, fontWeight: '600', color: Colors.primaryDark },

  emptyState: { alignItems: 'center', paddingVertical: 24, gap: 8 },
  emptyIconWrap: { width: 52, height: 52, borderRadius: 26, backgroundColor: Colors.background, alignItems: 'center', justifyContent: 'center', marginBottom: 4 },
  emptyTitle: { fontSize: 14, fontWeight: '600', color: Colors.textPrimary },
  emptySub: { fontSize: 12, color: Colors.textSecondary, textAlign: 'center', lineHeight: 17 },

  payoutMethodHeader: { flexDirection: 'row', alignItems: 'center', gap: 10, marginBottom: 14 },
  bankRow: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', backgroundColor: Colors.background, borderRadius: BorderRadius.lg, padding: 14, borderWidth: 1, borderColor: Colors.border },
  bankRowFull: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', backgroundColor: Colors.background, borderRadius: BorderRadius.lg, padding: 14, borderWidth: 1, borderColor: Colors.border },
  bankLeft: { flexDirection: 'row', alignItems: 'center', gap: 10, flex: 1 },
  bankIconWrap: { width: 36, height: 36, borderRadius: 8, backgroundColor: Colors.white, alignItems: 'center', justifyContent: 'center', borderWidth: 1, borderColor: Colors.border },
  bankTitle: { fontSize: 13, fontWeight: '600', color: Colors.textPrimary },
  bankSub: { fontSize: 11, color: Colors.textSecondary, marginTop: 2 },
  addBtn: { flexDirection: 'row', alignItems: 'center', gap: 4, borderWidth: 1.5, borderColor: Colors.primaryDark, borderRadius: BorderRadius.full, paddingHorizontal: 14, paddingVertical: 7 },
  addSmallBtn: { flexDirection: 'row', alignItems: 'center', gap: 4, borderWidth: 1, borderColor: Colors.primaryDark, borderRadius: BorderRadius.full, paddingHorizontal: 10, paddingVertical: 5, marginLeft: 'auto' },
  addBtnText: { fontSize: 13, fontWeight: '600', color: Colors.primaryDark },

  defaultBadge: { backgroundColor: Colors.primaryDark, borderRadius: BorderRadius.full, paddingHorizontal: 10, paddingVertical: 4 },
  defaultText: { fontSize: 10, fontWeight: '700', color: Colors.white, letterSpacing: 0.5 },

  autoPayHeader: { flexDirection: 'row', alignItems: 'center', gap: 10, marginBottom: 14 },
  settingRow: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', paddingVertical: 12 },
  settingLabel: { fontSize: 14, color: Colors.textPrimary },
  settingRight: { flexDirection: 'row', alignItems: 'center', gap: 6 },
  settingValue: { fontSize: 14, color: Colors.textSecondary },
  settingDivider: { height: 1, backgroundColor: Colors.borderLight },
  toggleOn: { width: 46, height: 26, borderRadius: 13, backgroundColor: Colors.primaryDark, justifyContent: 'center', alignItems: 'flex-end', paddingHorizontal: 3 },
  toggleThumb: { width: 20, height: 20, borderRadius: 10, backgroundColor: Colors.white },

  payoutHistoryRow: { flexDirection: 'row', alignItems: 'center', paddingVertical: 12 },
  payHistIcon: { width: 40, height: 40, borderRadius: 20, alignItems: 'center', justifyContent: 'center', marginRight: 12 },
  payHistInfo: { flex: 1 },
  payHistLabel: { fontSize: 14, fontWeight: '600', color: Colors.textPrimary },
  payHistDate: { fontSize: 12, color: Colors.textSecondary, marginTop: 2 },
  payHistAmount: { fontSize: 15, fontWeight: '700', color: Colors.textPrimary },
  payHistStatus: { fontSize: 11, color: Colors.textMuted, marginTop: 2 },
  rowDivider: { height: 1, backgroundColor: Colors.borderLight },

  createInvoiceBtn: { flexDirection: 'row', alignItems: 'center', justifyContent: 'center', backgroundColor: Colors.primaryDark, borderRadius: BorderRadius.xl, paddingVertical: 15, gap: 8, marginBottom: 14 },
  createInvoiceText: { color: Colors.white, fontSize: 15, fontWeight: '600' },

  invoiceStatsRow: { flexDirection: 'row', gap: 12, marginBottom: 14 },
  invoiceStatCard: { flex: 1, backgroundColor: Colors.white, borderRadius: BorderRadius.xl, padding: 14, borderWidth: 1, borderColor: Colors.border },
  invoiceStatLabel: { fontSize: 12, color: Colors.textSecondary, marginBottom: 6 },
  invoiceStatVal: { fontSize: 20, fontWeight: '800', color: Colors.textPrimary },

  invoiceListHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 4 },
  filterBtn: { flexDirection: 'row', alignItems: 'center', gap: 4 },
  filterText: { fontSize: 13, color: Colors.textSecondary },

  invoiceRow: { flexDirection: 'row', alignItems: 'center', paddingVertical: 13 },
  invoiceInfo: { flex: 1 },
  invoiceClient: { fontSize: 14, fontWeight: '600', color: Colors.textPrimary, marginBottom: 3 },
  invoiceMeta: { fontSize: 12, color: Colors.textSecondary },
  invoiceRight: { alignItems: 'flex-end', gap: 4 },
  invoiceAmount: { fontSize: 15, fontWeight: '700', color: Colors.textPrimary },
  invoiceStatus: { paddingHorizontal: 8, paddingVertical: 3, borderRadius: BorderRadius.full },
  invoiceStatusText: { fontSize: 10, fontWeight: '700', letterSpacing: 0.3 },

  taxStatsRow: { flexDirection: 'row', gap: 12, marginBottom: 14 },
  taxStatCard: { flex: 1, backgroundColor: Colors.white, borderRadius: BorderRadius.xl, padding: 14, borderWidth: 1, borderColor: Colors.border },
  taxStatLabel: { fontSize: 12, color: Colors.textSecondary, marginBottom: 6 },
  taxStatVal: { fontSize: 18, fontWeight: '800', color: Colors.textPrimary },

  deductionRow: { flexDirection: 'row', alignItems: 'center', paddingVertical: 12 },
  deductionIcon: { width: 40, height: 40, borderRadius: 10, alignItems: 'center', justifyContent: 'center', marginRight: 12 },
  deductionInfo: { flex: 1 },
  deductionLabel: { fontSize: 14, fontWeight: '600', color: Colors.textPrimary },
  deductionSub: { fontSize: 12, color: Colors.textSecondary, marginTop: 2 },
  deductionAmount: { fontSize: 14, fontWeight: '600', color: Colors.textMuted },

  taxDocRow: { flexDirection: 'row', alignItems: 'center', paddingVertical: 14 },
  taxDocIcon: { width: 40, height: 40, borderRadius: 8, backgroundColor: Colors.primaryDark, alignItems: 'center', justifyContent: 'center', marginRight: 12 },
  taxDocInfo: { flex: 1 },
  taxDocTitle: { fontSize: 14, fontWeight: '600', color: Colors.textPrimary },
  taxDocSub: { fontSize: 12, color: Colors.textSecondary, marginTop: 2 },
});

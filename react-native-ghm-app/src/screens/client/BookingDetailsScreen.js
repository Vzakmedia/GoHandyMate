import React from 'react';
import {
  View, Text, StyleSheet, ScrollView, TouchableOpacity, StatusBar, Image, Alert, Linking,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { Colors } from '../../theme/colors';
import { BorderRadius } from '../../theme/spacing';

const STEPS = [
  { key: 'confirmed', label: 'Confirmed', done: true },
  { key: 'onway', label: 'On Way', active: true },
  { key: 'arrived', label: 'Arrived', done: false },
];

const SERVICE_ROWS = [
  { icon: 'construct-outline', label: 'Service', value: 'Minor Leak Repair' },
  { icon: 'calendar-outline', label: 'Date & Time', value: 'Today, 2:00 PM' },
  { icon: 'location-outline', label: 'Location', value: '1234 Texas Ave, Austin, TX 78701' },
];

export default function BookingDetailsScreen({ navigation, route }) {
  return (
    <View style={styles.container}>
      <StatusBar barStyle="dark-content" backgroundColor={Colors.white} />

      {/* Top Status Bar */}
      <SafeAreaView style={styles.topBar}>
        <View style={styles.topBarInner}>
          <TouchableOpacity style={styles.locationPill}>
            <Ionicons name="location-outline" size={13} color={Colors.primaryDark} />
            <Text style={styles.locationText}>Austin, TX</Text>
            <Ionicons name="chevron-down" size={12} color={Colors.primaryDark} />
          </TouchableOpacity>
          <View style={styles.logoMark}>
            <Image source={require('../../../assets/logo.png')} style={{ width: 28, height: 28 }} resizeMode="contain" />
          </View>
          <TouchableOpacity style={styles.bellBtn} onPress={() => navigation.navigate('Notifications')}>
            <Ionicons name="notifications-outline" size={21} color={Colors.textPrimary} />
            <View style={styles.bellDot} />
          </TouchableOpacity>
        </View>

        {/* Header */}
        <View style={styles.header}>
          <TouchableOpacity style={styles.backBtn} onPress={() => navigation.goBack()}>
            <Ionicons name="arrow-back" size={22} color={Colors.textPrimary} />
          </TouchableOpacity>
          <Text style={styles.headerTitle}>Booking Details</Text>
          <View style={{ width: 36 }} />
        </View>
      </SafeAreaView>

      <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={styles.scroll}>

        {/* Status Card */}
        <View style={styles.statusCard}>
          <View style={styles.statusTop}>
            <View>
              <Text style={styles.statusTitle}>On the Way</Text>
              <Text style={styles.statusSub}>Arriving by 2:00 PM</Text>
            </View>
            <View style={styles.truckIcon}>
              <Ionicons name="car-outline" size={22} color={Colors.warning} />
            </View>
          </View>

          {/* Progress Steps */}
          <View style={styles.stepsRow}>
            {STEPS.map((step, idx) => (
              <React.Fragment key={step.key}>
                <View style={styles.stepItem}>
                  <View style={[
                    styles.stepCircle,
                    step.done && styles.stepCircleDone,
                    step.active && styles.stepCircleActive,
                  ]}>
                    {step.done ? (
                      <Ionicons name="checkmark" size={14} color={Colors.white} />
                    ) : (
                      <View style={[styles.stepInnerDot, step.active && styles.stepInnerDotActive]} />
                    )}
                  </View>
                  <Text style={[styles.stepLabel, (step.done || step.active) && styles.stepLabelActive]}>
                    {step.label}
                  </Text>
                </View>
                {idx < STEPS.length - 1 && (
                  <View style={[styles.stepLine, idx === 0 && styles.stepLineDone]} />
                )}
              </React.Fragment>
            ))}
          </View>
        </View>

        {/* Provider Card */}
        <View style={styles.providerCard}>
          <View style={styles.providerRow}>
            <View style={styles.providerAvatar}>
              <Text style={styles.providerAvatarText}>MJ</Text>
            </View>
            <View style={styles.providerInfo}>
              <Text style={styles.providerName}>Mike Johnson</Text>
              <Text style={styles.providerCategory}>Handyman</Text>
              <View style={styles.providerMeta}>
                <View style={styles.ratingRow}>
                  <Ionicons name="star" size={12} color={Colors.starGold} />
                  <Text style={styles.ratingText}>4.9 (142)</Text>
                </View>
                <Text style={styles.dot}>·</Text>
                <View style={styles.verifiedBadge}>
                  <Ionicons name="star-outline" size={11} color={Colors.warning} />
                  <Text style={styles.verifiedText}>VERIFIED</Text>
                </View>
              </View>
            </View>
          </View>
          <View style={styles.providerActions}>
            <TouchableOpacity style={styles.callBtn} onPress={() => Linking.openURL('tel:+15125550100')}>
              <Ionicons name="call-outline" size={17} color={Colors.textPrimary} />
              <Text style={styles.callBtnText}>Call</Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={styles.msgBtn}
              onPress={() => navigation.navigate('Chat', { proName: 'Mike Johnson' })}
            >
              <Ionicons name="chatbubble-outline" size={17} color={Colors.white} />
              <Text style={styles.msgBtnText}>Message</Text>
            </TouchableOpacity>
          </View>
        </View>

        {/* Service Details */}
        <Text style={styles.sectionTitle}>Service Details</Text>
        <View style={styles.detailsCard}>
          {SERVICE_ROWS.map((row, idx) => (
            <View key={row.label} style={[styles.detailRow, idx < SERVICE_ROWS.length - 1 && styles.detailRowBorder]}>
              <View style={styles.detailIconWrap}>
                <Ionicons name={row.icon} size={18} color={Colors.primaryDark} />
              </View>
              <View>
                <Text style={styles.detailLabel}>{row.label}</Text>
                <Text style={styles.detailValue}>{row.value}</Text>
              </View>
            </View>
          ))}
        </View>

        {/* Payment Details */}
        <Text style={styles.sectionTitle}>Payment Details</Text>
        <View style={styles.paymentCard}>
          <View style={styles.payRow}>
            <Text style={styles.payLabel}>Hourly Rate</Text>
            <Text style={styles.payValue}>$55/hr</Text>
          </View>
          <View style={styles.payRow}>
            <Text style={styles.payLabel}>Est. Duration</Text>
            <Text style={styles.payValue}>1 - 2 hours</Text>
          </View>
          <View style={[styles.payRow, { marginBottom: 0 }]}>
            <Text style={styles.payLabel}>Platform Fee</Text>
            <Text style={styles.payValue}>$5.00</Text>
          </View>
          <View style={styles.payNote}>
            <Ionicons name="information-circle-outline" size={15} color={Colors.textMuted} />
            <Text style={styles.payNoteText}>
              Final cost will be calculated automatically based on the actual hours worked once the job is completed.
            </Text>
          </View>
        </View>

        {/* Cancel */}
        <TouchableOpacity
          style={styles.cancelBtn}
          onPress={() =>
            Alert.alert('Cancel Booking', 'Are you sure you want to cancel this booking?', [
              { text: 'No', style: 'cancel' },
              { text: 'Yes, Cancel', style: 'destructive', onPress: () => navigation.goBack() },
            ])
          }
        >
          <Text style={styles.cancelBtnText}>Cancel Booking</Text>
        </TouchableOpacity>

        <View style={{ height: 32 }} />
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: Colors.background },

  topBar: { backgroundColor: Colors.white, borderBottomWidth: 1, borderBottomColor: Colors.borderLight },
  topBarInner: {
    flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between',
    paddingHorizontal: 16, paddingTop: 8, paddingBottom: 4,
  },
  locationPill: {
    flexDirection: 'row', alignItems: 'center', gap: 4,
    backgroundColor: Colors.primaryLight, borderRadius: BorderRadius.full,
    paddingHorizontal: 10, paddingVertical: 5,
  },
  locationText: { fontSize: 12, fontWeight: '700', color: Colors.primaryDark },
  logoMark: { width: 34, height: 34, borderRadius: 10, backgroundColor: Colors.background, alignItems: 'center', justifyContent: 'center', overflow: 'hidden' },
  bellBtn: { position: 'relative', padding: 4 },
  bellDot: { position: 'absolute', top: 4, right: 4, width: 7, height: 7, borderRadius: 4, backgroundColor: Colors.error, borderWidth: 1.5, borderColor: Colors.white },

  header: {
    flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between',
    paddingHorizontal: 12, paddingVertical: 10,
  },
  backBtn: { width: 36, height: 36, alignItems: 'center', justifyContent: 'center' },
  headerTitle: { fontSize: 17, fontWeight: '700', color: Colors.textPrimary },

  scroll: { padding: 16 },

  statusCard: {
    backgroundColor: Colors.white, borderRadius: BorderRadius.xl,
    borderWidth: 1, borderColor: Colors.border, padding: 16, marginBottom: 14,
  },
  statusTop: { flexDirection: 'row', alignItems: 'flex-start', justifyContent: 'space-between', marginBottom: 20 },
  statusTitle: { fontSize: 17, fontWeight: '800', color: Colors.warning, marginBottom: 3 },
  statusSub: { fontSize: 13, color: Colors.textSecondary },
  truckIcon: {
    width: 44, height: 44, borderRadius: 22, backgroundColor: Colors.warningLight,
    alignItems: 'center', justifyContent: 'center',
  },

  stepsRow: { flexDirection: 'row', alignItems: 'center' },
  stepItem: { alignItems: 'center', gap: 6 },
  stepCircle: {
    width: 30, height: 30, borderRadius: 15,
    backgroundColor: Colors.borderLight, borderWidth: 2, borderColor: Colors.border,
    alignItems: 'center', justifyContent: 'center',
  },
  stepCircleDone: { backgroundColor: Colors.primaryDark, borderColor: Colors.primaryDark },
  stepCircleActive: { backgroundColor: Colors.white, borderColor: Colors.warning, borderWidth: 2.5 },
  stepInnerDot: { width: 10, height: 10, borderRadius: 5, backgroundColor: Colors.border },
  stepInnerDotActive: { backgroundColor: Colors.warning },
  stepLabel: { fontSize: 11, fontWeight: '500', color: Colors.textMuted },
  stepLabelActive: { color: Colors.textPrimary, fontWeight: '700' },
  stepLine: { flex: 1, height: 2.5, backgroundColor: Colors.borderLight, marginBottom: 20 },
  stepLineDone: { backgroundColor: Colors.primaryDark },

  providerCard: {
    backgroundColor: Colors.white, borderRadius: BorderRadius.xl,
    borderWidth: 1, borderColor: Colors.border, padding: 16, marginBottom: 22,
  },
  providerRow: { flexDirection: 'row', alignItems: 'center', gap: 12, marginBottom: 16 },
  providerAvatar: {
    width: 56, height: 56, borderRadius: 28, backgroundColor: '#7B9FB5',
    alignItems: 'center', justifyContent: 'center',
  },
  providerAvatarText: { color: Colors.white, fontWeight: '700', fontSize: 18 },
  providerInfo: { flex: 1 },
  providerName: { fontSize: 17, fontWeight: '700', color: Colors.textPrimary, marginBottom: 2 },
  providerCategory: { fontSize: 13, color: Colors.textSecondary, marginBottom: 6 },
  providerMeta: { flexDirection: 'row', alignItems: 'center', gap: 6 },
  ratingRow: { flexDirection: 'row', alignItems: 'center', gap: 3 },
  ratingText: { fontSize: 13, fontWeight: '600', color: Colors.textPrimary },
  dot: { color: Colors.textMuted, fontSize: 14 },
  verifiedBadge: {
    flexDirection: 'row', alignItems: 'center', gap: 3,
    backgroundColor: Colors.warningLight, borderRadius: BorderRadius.full,
    paddingHorizontal: 7, paddingVertical: 3,
  },
  verifiedText: { fontSize: 10, fontWeight: '700', color: Colors.warning },
  providerActions: { flexDirection: 'row', gap: 10 },
  callBtn: {
    flex: 1, flexDirection: 'row', alignItems: 'center', justifyContent: 'center', gap: 6,
    borderWidth: 1.5, borderColor: Colors.border, borderRadius: BorderRadius.xl, paddingVertical: 11,
  },
  callBtnText: { fontSize: 14, fontWeight: '700', color: Colors.textPrimary },
  msgBtn: {
    flex: 1, flexDirection: 'row', alignItems: 'center', justifyContent: 'center', gap: 6,
    backgroundColor: Colors.primaryDark, borderRadius: BorderRadius.xl, paddingVertical: 11,
  },
  msgBtnText: { fontSize: 14, fontWeight: '700', color: Colors.white },

  sectionTitle: { fontSize: 18, fontWeight: '800', color: Colors.textPrimary, marginBottom: 12 },

  detailsCard: {
    backgroundColor: Colors.white, borderRadius: BorderRadius.xl,
    borderWidth: 1, borderColor: Colors.border, overflow: 'hidden', marginBottom: 22,
  },
  detailRow: { flexDirection: 'row', alignItems: 'center', gap: 14, padding: 16 },
  detailRowBorder: { borderBottomWidth: 1, borderBottomColor: Colors.borderLight },
  detailIconWrap: {
    width: 36, height: 36, borderRadius: 10, backgroundColor: Colors.primaryLight,
    alignItems: 'center', justifyContent: 'center',
  },
  detailLabel: { fontSize: 12, color: Colors.textMuted, marginBottom: 3 },
  detailValue: { fontSize: 14, fontWeight: '700', color: Colors.textPrimary },

  paymentCard: {
    backgroundColor: Colors.white, borderRadius: BorderRadius.xl,
    borderWidth: 1, borderColor: Colors.border, padding: 16, marginBottom: 22,
  },
  payRow: { flexDirection: 'row', justifyContent: 'space-between', marginBottom: 12 },
  payLabel: { fontSize: 14, color: Colors.textSecondary },
  payValue: { fontSize: 14, fontWeight: '600', color: Colors.textPrimary },
  payNote: {
    flexDirection: 'row', alignItems: 'flex-start', gap: 8,
    backgroundColor: Colors.warningLight, borderRadius: BorderRadius.md, padding: 12, marginTop: 12,
  },
  payNoteText: { flex: 1, fontSize: 12, color: '#92400E', lineHeight: 18 },

  cancelBtn: {
    borderWidth: 1.5, borderColor: Colors.error, borderRadius: BorderRadius.xl,
    paddingVertical: 16, alignItems: 'center',
  },
  cancelBtnText: { color: Colors.error, fontSize: 15, fontWeight: '700' },
});

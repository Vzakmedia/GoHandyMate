import React from 'react';
import {
  View, Text, StyleSheet, TouchableOpacity, StatusBar, ScrollView,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { Colors } from '../../theme/colors';
import { BorderRadius } from '../../theme/spacing';

const NEXT_STEPS = [
  { num: 1, title: 'Provider Confirmation', desc: 'The provider will review and confirm your booking shortly.' },
  { num: 2, title: 'Payment Authorized', desc: "Your card has been authorized but won't be charged until the job is done." },
];

export default function BookingConfirmedScreen({ navigation }) {
  return (
    <SafeAreaView style={styles.safe}>
      <StatusBar barStyle="dark-content" backgroundColor={Colors.white} />

      {/* Close Button */}
      <TouchableOpacity style={styles.closeBtn} onPress={() => navigation.navigate('ClientApp')}>
        <Ionicons name="close" size={22} color={Colors.textPrimary} />
      </TouchableOpacity>

      <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={styles.scroll}>
        {/* Checkmark */}
        <View style={styles.checkCircle}>
          <Ionicons name="checkmark" size={36} color={Colors.primaryDark} />
        </View>

        <Text style={styles.title}>Booking Confirmed!</Text>
        <Text style={styles.subtitle}>
          Your service has been successfully booked. RapidFix Plumbing has been notified.
        </Text>

        {/* Details Card */}
        <View style={styles.detailsCard}>
          <View style={styles.detailRow}>
            <Text style={styles.detailLabel}>Booking ID</Text>
            <Text style={styles.detailValueBold}>#GHM-89245</Text>
          </View>

          <View style={styles.cardDivider} />

          {/* Provider */}
          <View style={styles.providerRow}>
            <View style={styles.providerAvatar}>
              <Text style={styles.providerAvatarText}>RP</Text>
            </View>
            <View>
              <Text style={styles.providerName}>RapidFix Plumbing</Text>
              <Text style={styles.providerSub}>Plumbing Service</Text>
            </View>
          </View>

          <View style={styles.cardDivider} />

          {/* Date */}
          <View style={styles.infoRow}>
            <View style={styles.infoIconWrap}>
              <Ionicons name="calendar-outline" size={18} color={Colors.primaryDark} />
            </View>
            <View>
              <Text style={styles.infoMain}>Thu, Oct 12 at 10:00 AM</Text>
              <Text style={styles.infoSub}>Estimated 1-2 hours</Text>
            </View>
          </View>

          <View style={styles.cardDivider} />

          {/* Address */}
          <View style={styles.infoRow}>
            <View style={styles.infoIconWrap}>
              <Ionicons name="location-outline" size={18} color={Colors.primaryDark} />
            </View>
            <View>
              <Text style={styles.infoMain}>1234 Congress Ave, Apt 4B</Text>
              <Text style={styles.infoSub}>Austin, TX 78704</Text>
            </View>
          </View>
        </View>

        {/* What's Next */}
        <Text style={styles.whatsNextTitle}>What's Next?</Text>
        {NEXT_STEPS.map((step) => (
          <View key={step.num} style={styles.nextRow}>
            <View style={styles.nextNum}>
              <Text style={styles.nextNumText}>{step.num}</Text>
            </View>
            <View style={styles.nextInfo}>
              <Text style={styles.nextTitle}>{step.title}</Text>
              <Text style={styles.nextDesc}>{step.desc}</Text>
            </View>
          </View>
        ))}

        {/* Actions */}
        <TouchableOpacity style={styles.primaryBtn} onPress={() => navigation.navigate('BookingDetails')}>
          <Text style={styles.primaryBtnText}>View Booking Details</Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={styles.outlineBtn}
          onPress={() => navigation.navigate('ClientApp')}
        >
          <Text style={styles.outlineBtnText}>Back to Home</Text>
        </TouchableOpacity>

        <View style={{ height: 32 }} />
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: { flex: 1, backgroundColor: Colors.white },

  closeBtn: {
    position: 'absolute', top: 54, right: 16, zIndex: 10,
    width: 36, height: 36, alignItems: 'center', justifyContent: 'center',
  },

  scroll: { alignItems: 'center', paddingHorizontal: 20, paddingTop: 60 },

  checkCircle: {
    width: 90, height: 90, borderRadius: 45,
    backgroundColor: '#D1FAE5', alignItems: 'center', justifyContent: 'center', marginBottom: 20,
  },
  title: { fontSize: 24, fontWeight: '800', color: Colors.textPrimary, marginBottom: 10, textAlign: 'center' },
  subtitle: { fontSize: 14, color: Colors.textSecondary, textAlign: 'center', lineHeight: 20, marginBottom: 24 },

  detailsCard: {
    width: '100%', backgroundColor: Colors.background, borderRadius: BorderRadius.xl,
    borderWidth: 1, borderColor: Colors.border, padding: 16, marginBottom: 28,
  },
  detailRow: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', paddingVertical: 4 },
  detailLabel: { fontSize: 13, color: Colors.textSecondary },
  detailValueBold: { fontSize: 14, fontWeight: '800', color: Colors.textPrimary },
  cardDivider: { height: 1, backgroundColor: Colors.borderLight, marginVertical: 12 },

  providerRow: { flexDirection: 'row', alignItems: 'center', gap: 12 },
  providerAvatar: {
    width: 44, height: 44, borderRadius: 22, backgroundColor: '#7BA89E',
    alignItems: 'center', justifyContent: 'center',
  },
  providerAvatarText: { color: Colors.white, fontWeight: '700', fontSize: 15 },
  providerName: { fontSize: 15, fontWeight: '700', color: Colors.textPrimary, marginBottom: 2 },
  providerSub: { fontSize: 13, color: Colors.textSecondary },

  infoRow: { flexDirection: 'row', alignItems: 'center', gap: 12 },
  infoIconWrap: {
    width: 36, height: 36, borderRadius: 10, backgroundColor: Colors.primaryLight,
    alignItems: 'center', justifyContent: 'center',
  },
  infoMain: { fontSize: 14, fontWeight: '700', color: Colors.textPrimary, marginBottom: 2 },
  infoSub: { fontSize: 12, color: Colors.textSecondary },

  whatsNextTitle: { fontSize: 18, fontWeight: '700', color: Colors.textPrimary, alignSelf: 'flex-start', marginBottom: 16 },
  nextRow: { flexDirection: 'row', alignItems: 'flex-start', gap: 14, width: '100%', marginBottom: 16 },
  nextNum: {
    width: 30, height: 30, borderRadius: 15, borderWidth: 1, borderColor: Colors.border,
    alignItems: 'center', justifyContent: 'center', flexShrink: 0,
  },
  nextNumText: { fontSize: 13, fontWeight: '700', color: Colors.textPrimary },
  nextInfo: { flex: 1 },
  nextTitle: { fontSize: 14, fontWeight: '700', color: Colors.textPrimary, marginBottom: 4 },
  nextDesc: { fontSize: 13, color: Colors.textSecondary, lineHeight: 18 },

  primaryBtn: {
    width: '100%', backgroundColor: Colors.primaryDark, borderRadius: BorderRadius.xl,
    paddingVertical: 16, alignItems: 'center', marginTop: 8, marginBottom: 12,
  },
  primaryBtnText: { color: Colors.white, fontSize: 15, fontWeight: '700' },
  outlineBtn: {
    width: '100%', borderWidth: 1, borderColor: Colors.border, borderRadius: BorderRadius.xl,
    paddingVertical: 16, alignItems: 'center',
  },
  outlineBtnText: { color: Colors.primaryDark, fontSize: 15, fontWeight: '700' },
});

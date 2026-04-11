import React, { useState, useCallback } from 'react';
import {
  View, Text, StyleSheet, ScrollView, TouchableOpacity, StatusBar,
  Alert, ActivityIndicator,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { Colors } from '../../theme/colors';
import { BorderRadius } from '../../theme/spacing';
import { useAuth } from '../../context/AuthContext';
import { supabase } from '../../lib/supabase';
import { initials } from '../../lib/api';

export default function ReviewBookingScreen({ navigation, route }) {
  const { user } = useAuth();
  const {
    proName = 'RapidFix Plumbing',
    handymanId,
    handymanUserId,
    serviceCategory = 'General Handyman',
    hourlyRate,
    selectedDate,
    selectedTime,
    description = 'Please help with repair work.',
  } = route?.params ?? {};

  const [submitting, setSubmitting] = useState(false);

  const formattedDate = selectedDate
    ? new Date(selectedDate).toLocaleDateString('en-US', {
        weekday: 'short', month: 'short', day: 'numeric',
      }) + ` at ${selectedTime}`
    : 'TBD';

  // Build the scheduled_at ISO string
  const buildScheduledAt = () => {
    if (!selectedDate || !selectedTime) return null;
    const base = new Date(selectedDate);
    const [time, ampm] = selectedTime.split(' ');
    let [hours, minutes] = time.split(':').map(Number);
    if (ampm === 'PM' && hours !== 12) hours += 12;
    if (ampm === 'AM' && hours === 12) hours = 0;
    base.setHours(hours, minutes, 0, 0);
    return base.toISOString();
  };

  const handleConfirm = useCallback(async () => {
    if (!user?.id) {
      Alert.alert('Not Signed In', 'Please sign in to make a booking.');
      return;
    }

    setSubmitting(true);
    try {
      // 1. Create the booking row
      const { data: booking, error: bookingError } = await supabase
        .from('bookings')
        .insert({
          customer_id: user.id,
          handyman_id: handymanId ?? null,
          service_category: serviceCategory,
          status: 'pending',
          scheduled_at: buildScheduledAt(),
          notes: description,
          total_amount: hourlyRate ? parseFloat(hourlyRate) : null,
        })
        .select()
        .single();

      if (bookingError) throw bookingError;

      // 2. Create the conversation so chat works immediately
      if (handymanUserId) {
        const { error: convError } = await supabase
          .from('conversations')
          .insert({
            customer_id: user.id,
            handyman_user_id: handymanUserId,
            booking_id: booking.id,
          });
        // Non-fatal — booking still succeeded even if convo fails
        if (convError) console.warn('Conversation creation failed:', convError.message);
      }

      // 3. Navigate to confirmed screen
      navigation.replace('BookingConfirmed', {
        bookingId: booking.id,
        proName,
      });
    } catch (err) {
      Alert.alert('Booking Failed', err.message || 'Something went wrong. Please try again.');
    } finally {
      setSubmitting(false);
    }
  }, [user, handymanId, handymanUserId, serviceCategory, description, selectedDate, selectedTime, hourlyRate, proName, navigation]);

  const proInitials = initials(proName);
  const estimatedTotal = hourlyRate ? `$${(parseFloat(hourlyRate) + 4.5).toFixed(2)}+` : 'Price TBD';

  return (
    <SafeAreaView style={styles.safe}>
      <StatusBar barStyle="dark-content" backgroundColor={Colors.white} />

      <View style={styles.header}>
        <TouchableOpacity style={styles.backBtn} onPress={() => navigation.goBack()}>
          <Ionicons name="chevron-back" size={22} color={Colors.textPrimary} />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Review Booking</Text>
        <View style={{ width: 36 }} />
      </View>

      <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={styles.scroll}>

        {/* Service Provider */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Service Provider</Text>
          <View style={styles.providerRow}>
            <View style={styles.providerAvatar}>
              <Text style={styles.providerAvatarText}>{proInitials}</Text>
            </View>
            <View>
              <Text style={styles.providerName}>{proName}</Text>
              <Text style={styles.providerSub}>
                {serviceCategory}{hourlyRate ? ` • $${hourlyRate}/hr` : ''}
              </Text>
            </View>
          </View>
        </View>

        {/* Booking Details */}
        <View style={styles.section}>
          <View style={styles.sectionHeader}>
            <Text style={styles.sectionTitle}>Booking Details</Text>
            <TouchableOpacity onPress={() => navigation.goBack()}>
              <Text style={styles.editLink}>Edit</Text>
            </TouchableOpacity>
          </View>
          <View style={styles.detailRow}>
            <View style={styles.detailIconWrap}>
              <Ionicons name="calendar-outline" size={18} color={Colors.primaryDark} />
            </View>
            <View>
              <Text style={styles.detailLabel}>Date & Time</Text>
              <Text style={styles.detailMain}>{formattedDate}</Text>
              <Text style={styles.detailSub}>Estimated 1-2 hours</Text>
            </View>
          </View>
          <View style={[styles.detailRow, { marginTop: 14 }]}>
            <View style={styles.detailIconWrap}>
              <Ionicons name="location-outline" size={18} color={Colors.primaryDark} />
            </View>
            <View>
              <Text style={styles.detailLabel}>Service Location</Text>
              <Text style={styles.detailMain}>Home</Text>
              <Text style={styles.detailSub}>1234 Congress Ave, Apt 4B{'\n'}Austin, TX 78704</Text>
            </View>
          </View>
        </View>

        {/* Task Description */}
        <View style={styles.section}>
          <View style={styles.sectionHeader}>
            <Text style={styles.sectionTitle}>Task Description</Text>
            <TouchableOpacity onPress={() => navigation.goBack()}>
              <Text style={styles.editLink}>Edit</Text>
            </TouchableOpacity>
          </View>
          <View style={styles.descBox}>
            <Text style={styles.descText}>{description}</Text>
          </View>
        </View>

        {/* Payment Method */}
        <View style={styles.section}>
          <View style={styles.sectionHeader}>
            <Text style={styles.sectionTitle}>Payment Method</Text>
            <TouchableOpacity onPress={() => navigation.navigate('PaymentMethods')}>
              <Text style={styles.editLink}>Change</Text>
            </TouchableOpacity>
          </View>
          <TouchableOpacity style={styles.paymentRow} onPress={() => navigation.navigate('PaymentMethods')}>
            <View style={styles.cardIconWrap}>
              <Ionicons name="card-outline" size={20} color={Colors.textSecondary} />
            </View>
            <View style={styles.cardInfo}>
              <Text style={styles.cardName}>Visa ending in 4242</Text>
              <Text style={styles.cardExpiry}>Expires 12/25</Text>
            </View>
            <Ionicons name="chevron-forward" size={18} color={Colors.textMuted} />
          </TouchableOpacity>
        </View>

        {/* Confirm Button */}
        <TouchableOpacity
          style={[styles.confirmBtn, submitting && { opacity: 0.7 }]}
          onPress={handleConfirm}
          disabled={submitting}
        >
          {submitting ? (
            <ActivityIndicator color={Colors.white} />
          ) : (
            <>
              <Ionicons name="lock-closed-outline" size={18} color={Colors.white} />
              <Text style={styles.confirmBtnText}>Confirm & Book</Text>
            </>
          )}
        </TouchableOpacity>
        <Text style={styles.chargeNote}>You won't be charged until the job is completed.</Text>

        {/* Fee breakdown */}
        <View style={styles.feeRow}>
          <Text style={styles.feeLabel}>Trust & Safety Fee</Text>
          <Text style={styles.feeValue}>$4.50</Text>
        </View>
        <View style={styles.totalRow}>
          <View>
            <Text style={styles.totalLabel}>Estimated Total</Text>
            <Text style={styles.totalSub}>Final price depends on actual time worked.</Text>
          </View>
          <Text style={styles.totalValue}>{estimatedTotal}</Text>
        </View>

        <View style={{ height: 32 }} />
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: { flex: 1, backgroundColor: Colors.background },
  header: {
    flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between',
    backgroundColor: Colors.white, paddingHorizontal: 12, paddingVertical: 12,
    borderBottomWidth: 1, borderBottomColor: Colors.borderLight,
  },
  backBtn: { width: 36, height: 36, alignItems: 'center', justifyContent: 'center' },
  headerTitle: { fontSize: 17, fontWeight: '700', color: Colors.textPrimary },
  scroll: { padding: 16 },
  section: {
    backgroundColor: Colors.white, borderRadius: BorderRadius.xl,
    borderWidth: 1, borderColor: Colors.border, padding: 16, marginBottom: 14,
  },
  sectionHeader: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', marginBottom: 14 },
  sectionTitle: { fontSize: 16, fontWeight: '700', color: Colors.textPrimary },
  editLink: { fontSize: 14, color: Colors.primaryDark, fontWeight: '600' },
  providerRow: { flexDirection: 'row', alignItems: 'center', gap: 12 },
  providerAvatar: {
    width: 46, height: 46, borderRadius: 23, backgroundColor: '#7BA89E',
    alignItems: 'center', justifyContent: 'center',
  },
  providerAvatarText: { color: Colors.white, fontWeight: '700', fontSize: 16 },
  providerName: { fontSize: 15, fontWeight: '700', color: Colors.textPrimary, marginBottom: 2 },
  providerSub: { fontSize: 13, color: Colors.textSecondary },
  detailRow: { flexDirection: 'row', alignItems: 'flex-start', gap: 12 },
  detailIconWrap: {
    width: 36, height: 36, borderRadius: 10, backgroundColor: Colors.primaryLight,
    alignItems: 'center', justifyContent: 'center',
  },
  detailLabel: { fontSize: 12, color: Colors.textMuted, marginBottom: 2 },
  detailMain: { fontSize: 14, fontWeight: '700', color: Colors.textPrimary, marginBottom: 2 },
  detailSub: { fontSize: 13, color: Colors.textSecondary, lineHeight: 18 },
  descBox: {
    backgroundColor: Colors.background, borderRadius: BorderRadius.md,
    padding: 12, borderWidth: 1, borderColor: Colors.borderLight,
  },
  descText: { fontSize: 14, color: Colors.textPrimary, lineHeight: 20 },
  paymentRow: {
    flexDirection: 'row', alignItems: 'center', gap: 12,
    backgroundColor: Colors.background, borderRadius: BorderRadius.md, padding: 12,
    borderWidth: 1, borderColor: Colors.borderLight,
  },
  cardIconWrap: {
    width: 36, height: 36, borderRadius: 8, backgroundColor: Colors.white,
    alignItems: 'center', justifyContent: 'center', borderWidth: 1, borderColor: Colors.border,
  },
  cardInfo: { flex: 1 },
  cardName: { fontSize: 14, fontWeight: '600', color: Colors.textPrimary },
  cardExpiry: { fontSize: 12, color: Colors.textSecondary, marginTop: 1 },
  confirmBtn: {
    flexDirection: 'row', alignItems: 'center', justifyContent: 'center', gap: 8,
    backgroundColor: Colors.primaryDark, borderRadius: BorderRadius.xl,
    paddingVertical: 16, marginBottom: 10,
  },
  confirmBtnText: { color: Colors.white, fontSize: 16, fontWeight: '700' },
  chargeNote: { fontSize: 12, color: Colors.textMuted, textAlign: 'center', marginBottom: 20 },
  feeRow: { flexDirection: 'row', justifyContent: 'space-between', marginBottom: 10 },
  feeLabel: { fontSize: 14, color: Colors.textSecondary },
  feeValue: { fontSize: 14, color: Colors.textSecondary },
  totalRow: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'flex-start' },
  totalLabel: { fontSize: 16, fontWeight: '700', color: Colors.textPrimary, marginBottom: 2 },
  totalSub: { fontSize: 12, color: Colors.textMuted },
  totalValue: { fontSize: 22, fontWeight: '800', color: Colors.primaryDark },
});

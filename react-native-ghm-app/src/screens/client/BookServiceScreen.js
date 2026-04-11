import React, { useState, useCallback } from 'react';
import {
  View, Text, StyleSheet, ScrollView, TouchableOpacity, StatusBar,
  TextInput, Alert, ActivityIndicator,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { Colors } from '../../theme/colors';
import { BorderRadius } from '../../theme/spacing';
import { useAuth } from '../../context/AuthContext';
import { supabase } from '../../lib/supabase';

// Generate next 7 available dates from today
const generateDates = () => {
  const dates = [];
  const days = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
  for (let i = 0; i < 7; i++) {
    const d = new Date();
    d.setDate(d.getDate() + i);
    dates.push({ day: days[d.getDay()], date: d.getDate(), fullDate: d.toISOString() });
  }
  return dates;
};

const DATES = generateDates();
const TIMES = [
  '08:00 AM', '09:00 AM', '10:00 AM', '11:00 AM',
  '12:00 PM', '02:00 PM', '03:00 PM', '04:00 PM',
];

export default function BookServiceScreen({ navigation, route }) {
  const { user } = useAuth();
  const {
    proName = 'RapidFix Plumbing',
    handymanId,
    handymanUserId,
    serviceCategory = 'General Handyman',
    hourlyRate,
  } = route?.params ?? {};

  const [selectedDate, setSelectedDate] = useState(DATES[0]);
  const [selectedTime, setSelectedTime] = useState(TIMES[2]);
  const [description, setDescription] = useState('');
  const [submitting, setSubmitting] = useState(false);

  const handleReview = useCallback(() => {
    if (!description.trim()) {
      Alert.alert('Description Required', 'Please describe what you need help with.');
      return;
    }
    navigation.navigate('ReviewBooking', {
      proName,
      handymanId,
      handymanUserId,
      serviceCategory,
      hourlyRate,
      selectedDate: selectedDate.fullDate,
      selectedTime,
      description: description.trim(),
    });
  }, [description, selectedDate, selectedTime, navigation, proName, handymanId, handymanUserId, serviceCategory, hourlyRate]);

  return (
    <SafeAreaView style={styles.safe}>
      <StatusBar barStyle="dark-content" backgroundColor={Colors.white} />

      <View style={styles.header}>
        <TouchableOpacity style={styles.backBtn} onPress={() => navigation.goBack()}>
          <Ionicons name="chevron-back" size={22} color={Colors.textPrimary} />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Book Service</Text>
        <View style={{ width: 36 }} />
      </View>

      <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={styles.scroll}>
        {/* Provider Card */}
        <View style={styles.providerCard}>
          <View style={styles.providerAvatar}>
            <Text style={styles.providerAvatarText}>
              {proName.split(' ').map(w => w[0]).join('').slice(0, 2).toUpperCase()}
            </Text>
          </View>
          <View>
            <Text style={styles.providerName}>{proName}</Text>
            <Text style={styles.providerSub}>
              {serviceCategory}{hourlyRate ? ` • $${hourlyRate}/hr` : ''}
            </Text>
          </View>
        </View>

        {/* Description */}
        <Text style={styles.sectionTitle}>What do you need help with?</Text>
        <View style={styles.textareaWrap}>
          <TextInput
            style={styles.textarea}
            placeholder="Describe the issue (e.g., The pipe under my kitchen sink is leaking...)"
            placeholderTextColor={Colors.textMuted}
            value={description}
            onChangeText={setDescription}
            multiline
            textAlignVertical="top"
            maxLength={500}
          />
        </View>
        <Text style={styles.charCount}>{description.length}/500</Text>

        <TouchableOpacity style={styles.photosBtn}>
          <Ionicons name="camera-outline" size={16} color={Colors.primaryDark} />
          <Text style={styles.photosBtnText}>Add Photos (Optional)</Text>
        </TouchableOpacity>

        {/* Date Selector */}
        <View style={styles.dateHeader}>
          <Text style={styles.sectionTitle}>Select Date</Text>
        </View>
        <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.datesScroll}>
          {DATES.map((d) => (
            <TouchableOpacity
              key={d.fullDate}
              style={[styles.dateChip, selectedDate.date === d.date && styles.dateChipActive]}
              onPress={() => setSelectedDate(d)}
            >
              <Text style={[styles.dateDayText, selectedDate.date === d.date && styles.dateDayTextActive]}>{d.day}</Text>
              <Text style={[styles.dateDateText, selectedDate.date === d.date && styles.dateDateTextActive]}>{d.date}</Text>
            </TouchableOpacity>
          ))}
        </ScrollView>

        {/* Time Slots */}
        <Text style={styles.sectionTitle}>Available Times</Text>
        <View style={styles.timesGrid}>
          {TIMES.map((t) => (
            <TouchableOpacity
              key={t}
              style={[styles.timeChip, selectedTime === t && styles.timeChipActive]}
              onPress={() => setSelectedTime(t)}
            >
              <Text style={[styles.timeText, selectedTime === t && styles.timeTextActive]}>{t}</Text>
            </TouchableOpacity>
          ))}
        </View>

        {/* Review Button */}
        <TouchableOpacity
          style={[styles.reviewBtn, submitting && { opacity: 0.6 }]}
          onPress={handleReview}
          disabled={submitting}
        >
          {submitting
            ? <ActivityIndicator color={Colors.white} />
            : <Text style={styles.reviewBtnText}>Review Booking</Text>
          }
        </TouchableOpacity>

        {/* Address Card */}
        <View style={styles.addressCard}>
          <Ionicons name="location-outline" size={18} color={Colors.primaryDark} />
          <View>
            <Text style={styles.addressLabel}>Home</Text>
            <Text style={styles.addressSub}>1234 Congress Ave, Apt 4B{'\n'}Austin, TX 78704</Text>
          </View>
        </View>

        <View style={{ height: 32 }} />
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: { flex: 1, backgroundColor: Colors.white },
  header: {
    flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between',
    paddingHorizontal: 12, paddingVertical: 12,
    borderBottomWidth: 1, borderBottomColor: Colors.borderLight,
  },
  backBtn: { width: 36, height: 36, alignItems: 'center', justifyContent: 'center' },
  headerTitle: { fontSize: 17, fontWeight: '700', color: Colors.textPrimary },
  scroll: { padding: 16 },
  providerCard: {
    flexDirection: 'row', alignItems: 'center', gap: 12,
    backgroundColor: Colors.background, borderRadius: BorderRadius.xl,
    padding: 14, marginBottom: 22, borderWidth: 1, borderColor: Colors.border,
  },
  providerAvatar: {
    width: 46, height: 46, borderRadius: 23, backgroundColor: '#7BA89E',
    alignItems: 'center', justifyContent: 'center',
  },
  providerAvatarText: { color: Colors.white, fontWeight: '700', fontSize: 16 },
  providerName: { fontSize: 16, fontWeight: '700', color: Colors.textPrimary },
  providerSub: { fontSize: 13, color: Colors.textSecondary, marginTop: 2 },
  sectionTitle: { fontSize: 16, fontWeight: '700', color: Colors.textPrimary, marginBottom: 10 },
  textareaWrap: {
    backgroundColor: Colors.background, borderRadius: BorderRadius.xl,
    borderWidth: 1, borderColor: Colors.border, padding: 14, marginBottom: 4, minHeight: 100,
  },
  textarea: { fontSize: 14, color: Colors.textPrimary, lineHeight: 20 },
  charCount: { fontSize: 11, color: Colors.textMuted, textAlign: 'right', marginBottom: 10 },
  photosBtn: {
    flexDirection: 'row', alignItems: 'center', gap: 6,
    alignSelf: 'flex-start', borderWidth: 1, borderColor: Colors.primaryDark,
    borderRadius: BorderRadius.full, paddingHorizontal: 16, paddingVertical: 8, marginBottom: 22,
  },
  photosBtnText: { fontSize: 13, fontWeight: '600', color: Colors.primaryDark },
  dateHeader: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', marginBottom: 10 },
  datesScroll: { marginBottom: 22 },
  dateChip: {
    alignItems: 'center', paddingHorizontal: 18, paddingVertical: 12,
    borderRadius: BorderRadius.xl, borderWidth: 1, borderColor: Colors.border,
    marginRight: 10, minWidth: 56, backgroundColor: Colors.white,
  },
  dateChipActive: { backgroundColor: Colors.primaryDark, borderColor: Colors.primaryDark },
  dateDayText: { fontSize: 12, color: Colors.textSecondary, marginBottom: 4 },
  dateDayTextActive: { color: Colors.white },
  dateDateText: { fontSize: 18, fontWeight: '700', color: Colors.textPrimary },
  dateDateTextActive: { color: Colors.white },
  timesGrid: { flexDirection: 'row', flexWrap: 'wrap', gap: 10, marginBottom: 22 },
  timeChip: {
    width: '30%', paddingVertical: 13, borderRadius: BorderRadius.xl,
    borderWidth: 1, borderColor: Colors.border, alignItems: 'center', backgroundColor: Colors.white,
  },
  timeChipActive: { backgroundColor: Colors.primaryDark, borderColor: Colors.primaryDark },
  timeText: { fontSize: 13, fontWeight: '600', color: Colors.textPrimary },
  timeTextActive: { color: Colors.white },
  reviewBtn: {
    backgroundColor: Colors.primaryDark, borderRadius: BorderRadius.xl,
    paddingVertical: 16, alignItems: 'center', marginBottom: 16,
  },
  reviewBtnText: { color: Colors.white, fontSize: 16, fontWeight: '700' },
  addressCard: {
    flexDirection: 'row', alignItems: 'flex-start', gap: 10,
    backgroundColor: Colors.background, borderRadius: BorderRadius.xl,
    padding: 14, borderWidth: 1, borderColor: Colors.border,
  },
  addressLabel: { fontSize: 14, fontWeight: '700', color: Colors.textPrimary, marginBottom: 2 },
  addressSub: { fontSize: 13, color: Colors.textSecondary, lineHeight: 18 },
});

import React from 'react';
import {
  View, Text, StyleSheet, ScrollView, TouchableOpacity, StatusBar,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { Colors } from '../../theme/colors';
import { FontSize, FontWeight } from '../../theme/typography';
import { BorderRadius, Spacing } from '../../theme/spacing';
import { Header } from '../../components/Header';
import { Button } from '../../components/Button';

export default function JobDetailsScreen({ navigation, route }) {
  return (
    <SafeAreaView style={styles.safe}>
      <StatusBar barStyle="dark-content" backgroundColor={Colors.white} />
      <Header title="Job Details" onBack={() => navigation.goBack()} rightIcon="chatbubble-outline" onRightPress={() => {}} />
      <ScrollView contentContainerStyle={styles.scroll} showsVerticalScrollIndicator={false}>

        {/* Status Banner */}
        <View style={styles.activeBanner}>
          <View style={styles.dotBlink} />
          <Text style={styles.bannerText}>Job In Progress</Text>
        </View>

        {/* Client */}
        <View style={styles.card}>
          <Text style={styles.cardTitle}>CLIENT</Text>
          <View style={styles.clientRow}>
            <View style={styles.avatar}>
              <Text style={styles.avatarText}>AJ</Text>
            </View>
            <View style={styles.clientInfo}>
              <Text style={styles.clientName}>Alex Johnson</Text>
              <Text style={styles.clientEmail}>alex.johnson@example.com</Text>
              <Text style={styles.clientPhone}>+1 (555) 123-4567</Text>
            </View>
            <TouchableOpacity style={styles.callBtn}>
              <Ionicons name="call-outline" size={20} color={Colors.primaryDark} />
            </TouchableOpacity>
          </View>
        </View>

        {/* Service Details */}
        <View style={styles.card}>
          <Text style={styles.cardTitle}>SERVICE</Text>
          <Text style={styles.detailLabel}>Plumbing – Leak Repair</Text>
          <View style={styles.detailRow}>
            <Ionicons name="calendar-outline" size={16} color={Colors.textSecondary} />
            <Text style={styles.detailText}>Today, Monday March 24 · 2:00 PM</Text>
          </View>
          <View style={styles.detailRow}>
            <Ionicons name="location-outline" size={16} color={Colors.textSecondary} />
            <Text style={styles.detailText}>1234 Maplewood Drive, Austin, TX 78704</Text>
          </View>
          <View style={styles.detailRow}>
            <Ionicons name="cash-outline" size={16} color={Colors.textSecondary} />
            <Text style={styles.detailText}>$55/hr · Est. 2 hours</Text>
          </View>
        </View>

        {/* Notes */}
        <View style={styles.card}>
          <Text style={styles.cardTitle}>CLIENT NOTES</Text>
          <Text style={styles.notes}>Leak under kitchen sink, have been using a bucket for 3 days. Front door will be unlocked.</Text>
        </View>

        {/* Timeline */}
        <View style={styles.card}>
          <Text style={styles.cardTitle}>JOB TIMELINE</Text>
          {[
            { icon: 'checkmark-circle', color: Colors.success, label: 'Booking Confirmed', time: 'Mar 22, 10:00 AM' },
            { icon: 'checkmark-circle', color: Colors.success, label: 'Job Started', time: 'Today, 2:02 PM' },
            { icon: 'time', color: Colors.primaryDark, label: 'In Progress', time: 'Now' },
          ].map((step) => (
            <View key={step.label} style={styles.timelineRow}>
              <Ionicons name={step.icon} size={18} color={step.color} />
              <View style={styles.timelineInfo}>
                <Text style={styles.timelineLabel}>{step.label}</Text>
                <Text style={styles.timelineTime}>{step.time}</Text>
              </View>
            </View>
          ))}
        </View>

        {/* Actions */}
        <Button
          title="📄 Create Invoice"
          onPress={() => navigation.navigate('CreateInvoice')}
          style={styles.invoiceBtn}
        />
        <Button
          title="Mark as Completed ✓"
          onPress={() => navigation.goBack()}
          variant="outline"
        />
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: { flex: 1, backgroundColor: Colors.background },
  scroll: { padding: Spacing.base, paddingBottom: 40 },
  activeBanner: { flexDirection: 'row', alignItems: 'center', backgroundColor: Colors.primaryLight, borderRadius: BorderRadius.md, padding: Spacing.md, marginBottom: Spacing.md, gap: 8 },
  dotBlink: { width: 10, height: 10, borderRadius: 5, backgroundColor: Colors.primaryDark },
  bannerText: { color: Colors.primaryDark, fontWeight: FontWeight.semibold, fontSize: FontSize.sm },
  card: { backgroundColor: Colors.white, borderRadius: BorderRadius.lg, padding: Spacing.base, marginBottom: Spacing.md, borderWidth: 1, borderColor: Colors.border },
  cardTitle: { fontSize: FontSize.xs, fontWeight: FontWeight.semibold, color: Colors.textSecondary, letterSpacing: 1, marginBottom: Spacing.sm },
  clientRow: { flexDirection: 'row', alignItems: 'center' },
  avatar: { width: 48, height: 48, borderRadius: 24, backgroundColor: Colors.primaryMedium, alignItems: 'center', justifyContent: 'center', marginRight: Spacing.md },
  avatarText: { color: Colors.white, fontWeight: FontWeight.bold },
  clientInfo: { flex: 1 },
  clientName: { fontWeight: FontWeight.bold, fontSize: FontSize.md, color: Colors.textPrimary },
  clientEmail: { color: Colors.textSecondary, fontSize: FontSize.xs, marginTop: 2 },
  clientPhone: { color: Colors.textSecondary, fontSize: FontSize.xs },
  callBtn: { width: 40, height: 40, borderRadius: 20, borderWidth: 1.5, borderColor: Colors.border, alignItems: 'center', justifyContent: 'center' },
  detailLabel: { fontWeight: FontWeight.bold, fontSize: FontSize.md, color: Colors.textPrimary, marginBottom: Spacing.sm },
  detailRow: { flexDirection: 'row', alignItems: 'flex-start', gap: 8, marginBottom: 8 },
  detailText: { flex: 1, fontSize: FontSize.sm, color: Colors.textSecondary, lineHeight: 18 },
  notes: { fontSize: FontSize.sm, color: Colors.textSecondary, lineHeight: 20, fontStyle: 'italic' },
  timelineRow: { flexDirection: 'row', alignItems: 'center', gap: Spacing.sm, paddingVertical: 6 },
  timelineInfo: {},
  timelineLabel: { fontWeight: FontWeight.medium, fontSize: FontSize.sm, color: Colors.textPrimary },
  timelineTime: { fontSize: FontSize.xs, color: Colors.textMuted },
  invoiceBtn: { marginBottom: Spacing.sm },
});

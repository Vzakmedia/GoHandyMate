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

const DOCS = [
  { icon: 'id-card-outline', label: 'Government-Issued ID', hint: 'Driver license, passport, or state ID', required: true },
  { icon: 'shield-checkmark-outline', label: 'Insurance Certificate', hint: 'Proof of liability insurance', required: true },
  { icon: 'school-outline', label: 'Trade License / Certification', hint: 'License number or upload certificate', required: false },
];

export default function TrustSafetyScreen({ navigation }) {
  return (
    <SafeAreaView style={styles.safe}>
      <StatusBar barStyle="dark-content" backgroundColor={Colors.white} />
      <Header title="Become a Pro" onBack={() => navigation.goBack()} />
      <View style={styles.progress}>
        <View style={styles.progressTrack}>
          <View style={[styles.progressBar, { width: '100%' }]} />
        </View>
        <Text style={styles.progressText}>Step 3 of 3 – Trust & Safety</Text>
      </View>

      <ScrollView contentContainerStyle={styles.scroll} showsVerticalScrollIndicator={false}>
        <Text style={styles.title}>Verify your identity</Text>
        <Text style={styles.subtitle}>These steps protect both you and our clients. All documents are reviewed within 24 hours.</Text>

        {DOCS.map((doc) => (
          <TouchableOpacity key={doc.label} style={styles.docCard}>
            <View style={styles.docIconWrap}>
              <Ionicons name={doc.icon} size={24} color={Colors.primaryDark} />
            </View>
            <View style={styles.docInfo}>
              <View style={styles.docLabelRow}>
                <Text style={styles.docLabel}>{doc.label}</Text>
                {doc.required && (
                  <View style={styles.requiredTag}>
                    <Text style={styles.requiredText}>Required</Text>
                  </View>
                )}
              </View>
              <Text style={styles.docHint}>{doc.hint}</Text>
            </View>
            <View style={styles.uploadBtn}>
              <Ionicons name="cloud-upload-outline" size={18} color={Colors.primaryDark} />
            </View>
          </TouchableOpacity>
        ))}

        {/* Background Check */}
        <View style={styles.bgCheckCard}>
          <Ionicons name="document-text-outline" size={24} color={Colors.primaryDark} style={{ marginBottom: 8 }} />
          <Text style={styles.bgCheckTitle}>Background Check Authorization</Text>
          <Text style={styles.bgCheckText}>By submitting your application, you authorize GoHandyMate to conduct a background check for safety purposes. This typically takes 2-3 business days.</Text>
          <TouchableOpacity style={styles.consentBtn}>
            <Ionicons name="checkbox-outline" size={20} color={Colors.primaryDark} />
            <Text style={styles.consentText}>I authorize the background check</Text>
          </TouchableOpacity>
        </View>

        <Button
          title="Submit Application 🎉"
          onPress={() => navigation.replace('ProApp')}
          style={styles.submitBtn}
        />

        <Text style={styles.disclaimer}>
          By submitting, you agree to our{' '}
          <Text style={styles.link}>Terms for Service Providers</Text>.
        </Text>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: { flex: 1, backgroundColor: Colors.white },
  progress: { paddingHorizontal: Spacing.base, paddingVertical: Spacing.sm, borderBottomWidth: 1, borderBottomColor: Colors.borderLight },
  progressTrack: { height: 4, backgroundColor: Colors.borderLight, borderRadius: 2, marginBottom: 6, overflow: 'hidden' },
  progressBar: { height: 4, backgroundColor: Colors.primaryDark, borderRadius: 2 },
  progressText: { fontSize: FontSize.xs, color: Colors.textSecondary },
  scroll: { padding: Spacing.base, paddingBottom: 40 },
  title: { fontSize: FontSize['2xl'], fontWeight: FontWeight.bold, color: Colors.textPrimary, marginBottom: 8 },
  subtitle: { fontSize: FontSize.sm, color: Colors.textSecondary, marginBottom: Spacing.xl, lineHeight: 20 },
  docCard: {
    flexDirection: 'row', alignItems: 'center', backgroundColor: Colors.white, borderRadius: BorderRadius.lg,
    padding: Spacing.md, marginBottom: Spacing.md, borderWidth: 1, borderColor: Colors.border,
  },
  docIconWrap: { width: 48, height: 48, borderRadius: 14, backgroundColor: Colors.primaryLight, alignItems: 'center', justifyContent: 'center', marginRight: Spacing.md, flexShrink: 0 },
  docInfo: { flex: 1 },
  docLabelRow: { flexDirection: 'row', alignItems: 'center', gap: 8 },
  docLabel: { fontWeight: FontWeight.semibold, fontSize: FontSize.sm, color: Colors.textPrimary },
  requiredTag: { backgroundColor: Colors.errorLight, paddingHorizontal: 6, paddingVertical: 2, borderRadius: BorderRadius.sm },
  requiredText: { color: Colors.error, fontSize: FontSize.xs, fontWeight: FontWeight.semibold },
  docHint: { color: Colors.textSecondary, fontSize: FontSize.xs, marginTop: 3 },
  uploadBtn: { width: 36, height: 36, borderRadius: BorderRadius.md, backgroundColor: Colors.primaryLight, alignItems: 'center', justifyContent: 'center', marginLeft: Spacing.md },
  bgCheckCard: { backgroundColor: Colors.surface, borderRadius: BorderRadius.lg, padding: Spacing.base, marginBottom: Spacing.xl, borderWidth: 1, borderColor: Colors.primaryLight },
  bgCheckTitle: { fontWeight: FontWeight.bold, fontSize: FontSize.md, color: Colors.textPrimary, marginBottom: 6 },
  bgCheckText: { fontSize: FontSize.sm, color: Colors.textSecondary, lineHeight: 20, marginBottom: Spacing.md },
  consentBtn: { flexDirection: 'row', alignItems: 'center', gap: 6 },
  consentText: { color: Colors.primaryDark, fontWeight: FontWeight.medium, fontSize: FontSize.sm },
  submitBtn: { marginBottom: Spacing.md },
  disclaimer: { textAlign: 'center', color: Colors.textSecondary, fontSize: FontSize.xs, lineHeight: 18 },
  link: { color: Colors.primaryDark, fontWeight: FontWeight.medium },
});

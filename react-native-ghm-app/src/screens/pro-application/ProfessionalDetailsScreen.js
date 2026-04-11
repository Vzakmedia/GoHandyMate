import React, { useState } from 'react';
import {
  View, Text, StyleSheet, ScrollView, TouchableOpacity, StatusBar,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { Colors } from '../../theme/colors';
import { FontSize, FontWeight } from '../../theme/typography';
import { BorderRadius, Spacing } from '../../theme/spacing';
import { Header } from '../../components/Header';
import { Input } from '../../components/Input';
import { Button } from '../../components/Button';

const SERVICES = [
  'Plumbing', 'Electrical', 'HVAC', 'Cleaning', 'Lawn Care', 'Painting',
  'Handyman', 'Moving', 'Mounting', 'Pest Control',
];

export default function ProfessionalDetailsScreen({ navigation }) {
  const [selected, setSelected] = useState(['Plumbing']);
  const [exp, setExp] = useState('');
  const [bio, setBio] = useState('');
  const [rate, setRate] = useState('');

  const toggle = (s) => setSelected((prev) => prev.includes(s) ? prev.filter((x) => x !== s) : [...prev, s]);

  return (
    <SafeAreaView style={styles.safe}>
      <StatusBar barStyle="dark-content" backgroundColor={Colors.white} />
      <Header title="Become a Pro" onBack={() => navigation.goBack()} />
      <View style={styles.progress}>
        <View style={styles.progressTrack}>
          <View style={[styles.progressBar, { width: '66%' }]} />
        </View>
        <Text style={styles.progressText}>Step 2 of 3 – Professional Details</Text>
      </View>

      <ScrollView contentContainerStyle={styles.scroll} showsVerticalScrollIndicator={false}>
        <Text style={styles.title}>Your skills & experience</Text>
        <Text style={styles.subtitle}>Tell customers what you specialize in and why they should book you.</Text>

        <Text style={styles.fieldLabel}>Services You Offer</Text>
        <View style={styles.serviceGrid}>
          {SERVICES.map((s) => (
            <TouchableOpacity
              key={s}
              style={[styles.chip, selected.includes(s) && styles.chipActive]}
              onPress={() => toggle(s)}
            >
              <Text style={[styles.chipText, selected.includes(s) && styles.chipTextActive]}>{s}</Text>
            </TouchableOpacity>
          ))}
        </View>

        <Input label="Years of Experience" value={exp} onChangeText={setExp} placeholder="e.g. 5" keyboardType="number-pad" />
        <Input label="Bio / About You" value={bio} onChangeText={setBio} placeholder="Describe your background and what makes you great..." multiline numberOfLines={4} />
        <Input
          label="Hourly Rate (USD)"
          value={rate}
          onChangeText={setRate}
          placeholder="e.g. 55"
          keyboardType="number-pad"
          leftIcon={<Text style={{ color: Colors.textSecondary, fontSize: FontSize.md }}>$</Text>}
        />

        <Button
          title="Continue →"
          onPress={() => navigation.navigate('ProAppStep3')}
          style={styles.nextBtn}
        />
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
  fieldLabel: { fontSize: FontSize.sm, fontWeight: FontWeight.semibold, color: Colors.textSecondary, textTransform: 'uppercase', letterSpacing: 0.5, marginBottom: Spacing.sm },
  serviceGrid: { flexDirection: 'row', flexWrap: 'wrap', gap: Spacing.sm, marginBottom: Spacing.base },
  chip: { paddingHorizontal: 14, paddingVertical: 9, borderRadius: BorderRadius.full, borderWidth: 1.5, borderColor: Colors.border, backgroundColor: Colors.white },
  chipActive: { backgroundColor: Colors.primaryLight, borderColor: Colors.primaryDark },
  chipText: { fontSize: FontSize.sm, color: Colors.textPrimary, fontWeight: FontWeight.medium },
  chipTextActive: { color: Colors.primaryDark, fontWeight: FontWeight.semibold },
  nextBtn: { marginTop: Spacing.md },
});

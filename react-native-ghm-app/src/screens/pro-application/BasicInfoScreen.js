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

export default function BasicInfoScreen({ navigation }) {
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [phone, setPhone] = useState('');
  const [city, setCity] = useState('');

  return (
    <SafeAreaView style={styles.safe}>
      <StatusBar barStyle="dark-content" backgroundColor={Colors.white} />
      <Header title="Become a Pro" onBack={() => navigation.goBack()} />

      {/* Progress */}
      <View style={styles.progress}>
        <View style={styles.progressTrack}>
          <View style={[styles.progressBar, { width: '33%' }]} />
        </View>
        <Text style={styles.progressText}>Step 1 of 3 – Basic Info</Text>
      </View>

      <ScrollView contentContainerStyle={styles.scroll} showsVerticalScrollIndicator={false}>
        <Text style={styles.title}>Tell us about yourself</Text>
        <Text style={styles.subtitle}>Let's start with some basic information so we can set up your Pro profile.</Text>

        {/* Profile Photo */}
        <TouchableOpacity style={styles.photoUpload}>
          <View style={styles.photoIcon}>
            <Ionicons name="camera-outline" size={28} color={Colors.textSecondary} />
          </View>
          <Text style={styles.photoText}>Upload Profile Photo</Text>
          <Text style={styles.photoSub}>JPG, PNG up to 5MB</Text>
        </TouchableOpacity>

        <Input label="First Name" value={firstName} onChangeText={setFirstName} placeholder="e.g. John" />
        <Input label="Last Name" value={lastName} onChangeText={setLastName} placeholder="e.g. Smith" />
        <Input label="Phone Number" value={phone} onChangeText={setPhone} placeholder="+1 (555) 000-0000" keyboardType="phone-pad" />
        <Input label="City / Service Area" value={city} onChangeText={setCity} placeholder="e.g. Austin, TX" />

        <Button
          title="Continue →"
          onPress={() => navigation.navigate('ProAppStep2')}
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
  photoUpload: {
    alignItems: 'center', justifyContent: 'center', borderWidth: 2, borderColor: Colors.border,
    borderStyle: 'dashed', borderRadius: BorderRadius.xl, paddingVertical: Spacing['2xl'], marginBottom: Spacing.xl,
  },
  photoIcon: { width: 64, height: 64, borderRadius: 32, backgroundColor: Colors.background, alignItems: 'center', justifyContent: 'center', marginBottom: Spacing.sm },
  photoText: { fontWeight: FontWeight.semibold, color: Colors.textPrimary, fontSize: FontSize.md },
  photoSub: { color: Colors.textMuted, fontSize: FontSize.xs, marginTop: 4 },
  nextBtn: { marginTop: Spacing.md },
});

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

const BENEFITS = [
  { icon: 'cash-outline', title: 'Set your own rates', desc: 'You decide what you charge per hour.' },
  { icon: 'time-outline', title: 'Work your schedule', desc: 'Accept jobs when it suits you.' },
  { icon: 'star-outline', title: 'Build your reputation', desc: 'Earn reviews and grow your business.' },
  { icon: 'shield-checkmark-outline', title: "We've got your back", desc: 'Insured platform with dispute protection.' },
];

export default function BecomeAProScreen({ navigation }) {
  return (
    <SafeAreaView style={styles.safe}>
      <StatusBar barStyle="dark-content" backgroundColor={Colors.white} />
      <Header title="Become a Pro" onBack={() => navigation.goBack()} />
      <ScrollView contentContainerStyle={styles.scroll} showsVerticalScrollIndicator={false}>
        {/* Hero */}
        <View style={styles.hero}>
          <View style={styles.heroIcon}>
            <Ionicons name="briefcase" size={48} color={Colors.white} />
          </View>
          <Text style={styles.heroTitle}>Turn your skills into{'\n'}steady income</Text>
          <Text style={styles.heroSub}>Join thousands of local professionals growing their business with GoHandyMate.</Text>
        </View>

        {/* Why Pro */}
        <Text style={styles.sectionTitle}>Why join as a Pro?</Text>
        {BENEFITS.map((b) => (
          <View key={b.title} style={styles.benefitRow}>
            <View style={styles.benefitIcon}>
              <Ionicons name={b.icon} size={22} color={Colors.primaryDark} />
            </View>
            <View style={styles.benefitInfo}>
              <Text style={styles.benefitTitle}>{b.title}</Text>
              <Text style={styles.benefitDesc}>{b.desc}</Text>
            </View>
          </View>
        ))}

        <View style={styles.cta}>
          <Button title="Start Your Application →" onPress={() => navigation.navigate('ProAppStep1')} />
          <Text style={styles.existing}>Already applied? <Text style={styles.link}>Check your status</Text></Text>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: { flex: 1, backgroundColor: Colors.white },
  scroll: { paddingBottom: 40 },
  hero: { backgroundColor: Colors.primaryDark, padding: Spacing.xl, alignItems: 'center', paddingTop: Spacing['2xl'], paddingBottom: Spacing['2xl'] },
  heroIcon: { width: 96, height: 96, borderRadius: 48, backgroundColor: Colors.primaryMedium, alignItems: 'center', justifyContent: 'center', marginBottom: Spacing.base },
  heroTitle: { fontSize: FontSize['3xl'], fontWeight: FontWeight.bold, color: Colors.white, textAlign: 'center', marginBottom: Spacing.sm },
  heroSub: { fontSize: FontSize.base, color: Colors.white + 'BB', textAlign: 'center', lineHeight: 22 },
  sectionTitle: { fontSize: FontSize.xl, fontWeight: FontWeight.bold, color: Colors.textPrimary, margin: Spacing.base, marginBottom: Spacing.md },
  benefitRow: { flexDirection: 'row', alignItems: 'flex-start', paddingHorizontal: Spacing.base, marginBottom: Spacing.base },
  benefitIcon: { width: 48, height: 48, borderRadius: 14, backgroundColor: Colors.primaryLight, alignItems: 'center', justifyContent: 'center', marginRight: Spacing.md },
  benefitInfo: { flex: 1 },
  benefitTitle: { fontWeight: FontWeight.semibold, fontSize: FontSize.md, color: Colors.textPrimary, marginBottom: 3 },
  benefitDesc: { fontSize: FontSize.sm, color: Colors.textSecondary, lineHeight: 18 },
  cta: { padding: Spacing.base, paddingTop: Spacing.xl },
  existing: { textAlign: 'center', color: Colors.textSecondary, fontSize: FontSize.sm, marginTop: Spacing.md },
  link: { color: Colors.primaryDark, fontWeight: FontWeight.semibold },
});

import React, { useState } from 'react';
import {
  View, Text, StyleSheet, TouchableOpacity, StatusBar,
  ScrollView, Image,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { Colors } from '../../theme/colors';
import { BorderRadius } from '../../theme/spacing';

const ROLES = [
  {
    id: 'client',
    icon: 'home-outline',
    iconActive: 'home',
    title: "I'm a Homeowner",
    subtitle: 'Find and book trusted service professionals near you.',
    pills: ['Find Pros', 'Book Services', 'Track Jobs'],
    nextScreen: 'ClientOnboarding',
  },
  {
    id: 'pro',
    icon: 'briefcase-outline',
    iconActive: 'briefcase',
    title: "I'm a Professional",
    subtitle: 'Offer my services, manage jobs and grow my business.',
    pills: ['Earn Money', 'Manage Jobs', 'Get Reviews'],
    nextScreen: 'ProOnboarding',
  },
];

export default function RoleSelectionScreen({ navigation }) {
  const [selected, setSelected] = useState(null);

  const handleContinue = () => {
    if (!selected) return;
    const role = ROLES.find((r) => r.id === selected);
    navigation.navigate(role.nextScreen);
  };

  return (
    <View style={styles.container}>
      <StatusBar barStyle="light-content" backgroundColor={Colors.primaryDark} />

      {/* Decorative Header */}
      <SafeAreaView style={styles.headerSafe} edges={['top']}>
        <View style={styles.headerDecor}>
          <View style={styles.circle1} />
          <View style={styles.circle2} />

          <View style={styles.logoWrap}>
            <Image
              source={require('../../../assets/logo.png')}
              style={styles.logoImg}
              resizeMode="contain"
            />
          </View>
          <Text style={styles.appName}>GoHandyMate</Text>
          <Text style={styles.tagline}>Your trusted home services partner</Text>
        </View>
      </SafeAreaView>

      {/* Card */}
      <View style={styles.card}>
        <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={styles.cardScroll}>

          <Text style={styles.heading}>Welcome aboard!</Text>
          <Text style={styles.subheading}>
            Tell us how you'll be using GoHandyMate so we can personalise your experience.
          </Text>

          {/* Role Cards */}
          <View style={styles.cardsWrap}>
            {ROLES.map((role) => {
              const isSelected = selected === role.id;
              return (
                <TouchableOpacity
                  key={role.id}
                  style={[styles.roleCard, isSelected && styles.roleCardActive]}
                  onPress={() => setSelected(role.id)}
                  activeOpacity={0.85}
                >
                  {/* Check badge */}
                  <View style={[styles.checkBadge, isSelected && styles.checkBadgeActive]}>
                    <Ionicons
                      name={isSelected ? 'checkmark' : 'ellipse-outline'}
                      size={14}
                      color={isSelected ? Colors.white : Colors.border}
                    />
                  </View>

                  {/* Icon */}
                  <View style={[styles.roleIconWrap, isSelected && styles.roleIconWrapActive]}>
                    <Ionicons
                      name={isSelected ? role.iconActive : role.icon}
                      size={30}
                      color={isSelected ? Colors.white : Colors.primaryDark}
                    />
                  </View>

                  <Text style={[styles.roleTitle, isSelected && styles.roleTitleActive]}>
                    {role.title}
                  </Text>
                  <Text style={styles.roleSub}>{role.subtitle}</Text>

                  <View style={styles.pillsRow}>
                    {role.pills.map((p) => (
                      <View key={p} style={[styles.pill, isSelected && styles.pillActive]}>
                        <Text style={[styles.pillText, isSelected && styles.pillTextActive]}>{p}</Text>
                      </View>
                    ))}
                  </View>
                </TouchableOpacity>
              );
            })}
          </View>

          {/* Continue */}
          <TouchableOpacity
            style={[styles.ctaBtn, !selected && styles.ctaBtnDisabled]}
            onPress={handleContinue}
            activeOpacity={selected ? 0.87 : 1}
          >
            <Text style={styles.ctaBtnText}>Continue</Text>
            <Ionicons name="arrow-forward" size={18} color={Colors.white} />
          </TouchableOpacity>

          <Text style={styles.footerText}>
            Already have an account?{'  '}
            <Text style={styles.footerLink} onPress={() => navigation.navigate('Login')}>
              Sign In
            </Text>
          </Text>

        </ScrollView>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: Colors.primaryDark },

  // ── Decorative Header ──────────────────────────────────
  headerSafe: { backgroundColor: Colors.primaryDark },
  headerDecor: {
    alignItems: 'center',
    paddingTop: 20,
    paddingBottom: 28,
    overflow: 'hidden',
    position: 'relative',
  },
  circle1: {
    position: 'absolute',
    width: 260, height: 260, borderRadius: 130,
    backgroundColor: 'rgba(255,255,255,0.05)',
    top: -80, right: -60,
  },
  circle2: {
    position: 'absolute',
    width: 180, height: 180, borderRadius: 90,
    backgroundColor: 'rgba(255,255,255,0.04)',
    bottom: -40, left: -40,
  },
  logoWrap: {
    width: 90, height: 90, borderRadius: 24,
    backgroundColor: 'rgba(255,255,255,0.12)',
    alignItems: 'center', justifyContent: 'center',
    marginBottom: 14,
  },
  logoImg: { width: 68, height: 68 },
  appName: {
    fontSize: 26, fontWeight: '800', color: Colors.white,
    letterSpacing: 0.3, marginBottom: 6,
  },
  tagline: { fontSize: 13, color: 'rgba(255,255,255,0.65)', fontWeight: '400' },

  // ── Card ──────────────────────────────────────────────
  card: {
    flex: 1,
    backgroundColor: Colors.white,
    borderTopLeftRadius: 28,
    borderTopRightRadius: 28,
  },
  cardScroll: {
    padding: 24,
    paddingBottom: 40,
  },

  heading: { fontSize: 22, fontWeight: '800', color: Colors.textPrimary, marginBottom: 6 },
  subheading: { fontSize: 13, color: Colors.textSecondary, lineHeight: 19, marginBottom: 22 },

  // ── Role Cards ────────────────────────────────────────
  cardsWrap: { gap: 12, marginBottom: 24 },
  roleCard: {
    borderWidth: 1.5, borderColor: Colors.border,
    borderRadius: BorderRadius.xl,
    padding: 18,
    backgroundColor: Colors.white,
    position: 'relative',
  },
  roleCardActive: {
    borderColor: Colors.primaryDark,
    backgroundColor: '#F0F9F5',
  },

  checkBadge: {
    position: 'absolute', top: 14, right: 14,
    width: 24, height: 24, borderRadius: 12,
    backgroundColor: Colors.borderLight,
    alignItems: 'center', justifyContent: 'center',
  },
  checkBadgeActive: { backgroundColor: Colors.primaryDark },

  roleIconWrap: {
    width: 58, height: 58, borderRadius: 16,
    backgroundColor: Colors.primaryLight,
    alignItems: 'center', justifyContent: 'center',
    marginBottom: 12,
  },
  roleIconWrapActive: { backgroundColor: Colors.primaryDark },

  roleTitle: { fontSize: 17, fontWeight: '700', color: Colors.textPrimary, marginBottom: 4 },
  roleTitleActive: { color: Colors.primaryDark },
  roleSub: { fontSize: 13, color: Colors.textSecondary, lineHeight: 18, marginBottom: 12 },

  pillsRow: { flexDirection: 'row', gap: 6, flexWrap: 'wrap' },
  pill: {
    paddingHorizontal: 10, paddingVertical: 4,
    borderRadius: BorderRadius.full,
    backgroundColor: Colors.background,
    borderWidth: 1, borderColor: Colors.borderLight,
  },
  pillActive: { backgroundColor: Colors.primaryLight, borderColor: Colors.primaryDark },
  pillText: { fontSize: 11, fontWeight: '600', color: Colors.textSecondary },
  pillTextActive: { color: Colors.primaryDark },

  // ── CTA ───────────────────────────────────────────────
  ctaBtn: {
    flexDirection: 'row', alignItems: 'center', justifyContent: 'center', gap: 8,
    backgroundColor: Colors.primaryDark,
    borderRadius: BorderRadius.full,
    paddingVertical: 16,
    marginBottom: 16,
  },
  ctaBtnDisabled: { backgroundColor: Colors.textMuted },
  ctaBtnText: { color: Colors.white, fontSize: 16, fontWeight: '700' },

  footerText: { textAlign: 'center', fontSize: 13, color: Colors.textSecondary },
  footerLink: { color: Colors.primaryDark, fontWeight: '700' },
});

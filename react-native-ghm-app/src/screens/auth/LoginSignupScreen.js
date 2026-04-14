import React, { useState } from 'react';
import {
  View, Text, StyleSheet, TouchableOpacity, StatusBar,
  TextInput, KeyboardAvoidingView, Platform, ScrollView, Image, Alert, ActivityIndicator,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { Colors } from '../../theme/colors';
import { BorderRadius } from '../../theme/spacing';
import { useAuth } from '../../context/AuthContext';
import { supabase } from '../../lib/supabase';

export default function LoginSignupScreen({ navigation, route }) {
  const [mode, setMode] = useState('login');
  const [step, setStep] = useState('form'); // 'form' | 'otp'
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [otpCode, setOtpCode] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [rememberMe, setRememberMe] = useState(false);
  const [agreeTerms, setAgreeTerms] = useState(false);
  const [submitting, setSubmitting] = useState(false);

  const { signIn, signUp, profile } = useAuth();
  const role = route?.params?.role ?? 'client';

  // Determine destination from DB profile (authoritative) with fallback to route param
  const getDestination = (prof) => {
    const dbRole = prof?.user_role;
    if (dbRole === 'provider') return 'ProApp';
    if (dbRole === 'customer') return 'ClientApp';
    // Fallback to route param if no profile yet
    return role === 'pro' ? 'ProApp' : 'ClientApp';
  };

  const handleContinue = async () => {
    if (!email.trim() || !password.trim()) {
      Alert.alert('Missing fields', 'Please enter your email and password.');
      return;
    }
    if (mode === 'signup') {
      if (password !== confirmPassword) {
        Alert.alert('Password mismatch', 'Passwords do not match.');
        return;
      }
      if (!agreeTerms) {
        Alert.alert('Terms required', 'Please agree to the Terms & Privacy Policy.');
        return;
      }
    }
    try {
      setSubmitting(true);
      if (mode === 'login') {
        const data = await signIn(email.trim(), password);
        // After signIn, AuthContext loads the profile. Use getDestination with
        // the profile from context (now properly awaited) or fall back to route param.
        navigation.replace(getDestination(profile));
      } else {
        await signUp(email.trim(), password, role);
        setStep('otp');
        Alert.alert('Check your email', 'We sent a 6-digit verification code to ' + email.trim());
      }
    } catch (err) {
      Alert.alert('Error', err.message ?? 'Something went wrong. Please try again.');
    } finally {
      setSubmitting(false);
    }
  };

  const handleVerifyOtp = async () => {
    if (otpCode.length !== 6) {
      Alert.alert('Invalid code', 'Please enter the 6-digit code from your email.');
      return;
    }
    try {
      setSubmitting(true);
      const { error } = await supabase.auth.verifyOtp({ email: email.trim(), token: otpCode, type: 'signup' });
      if (error) {
        Alert.alert('Verification failed', error.message);
      } else {
        navigation.replace(destination);
      }
    } catch (err) {
      Alert.alert('Error', err.message ?? 'Something went wrong. Please try again.');
    } finally {
      setSubmitting(false);
    }
  };

  const handleResendOtp = async () => {
    try {
      await supabase.auth.resend({ type: 'signup', email: email.trim() });
      Alert.alert('Code resent', 'Check your inbox for a new code.');
    } catch (err) {
      Alert.alert('Error', 'Could not resend code. Please try again.');
    }
  };

  if (step === 'otp') {
    return (
      <View style={styles.container}>
        <StatusBar barStyle="light-content" backgroundColor={Colors.primaryDark} />
        <SafeAreaView style={styles.headerSafe} edges={['top']}>
          <View style={styles.headerDecor}>
            <View style={styles.circle1} />
            <View style={styles.circle2} />
            <View style={styles.logoWrap}>
              <Image source={require('../../../assets/logo.png')} style={styles.logoImg} resizeMode="contain" />
            </View>
            <Text style={styles.appName}>GoHandyMate</Text>
            <Text style={styles.tagline}>Your trusted home services partner</Text>
          </View>
        </SafeAreaView>
        <KeyboardAvoidingView style={styles.cardOuter} behavior={Platform.OS === 'ios' ? 'padding' : 'height'}>
          <ScrollView contentContainerStyle={styles.cardScroll} keyboardShouldPersistTaps="handled">
            <View style={styles.card}>
              <View style={{ alignItems: 'center', marginBottom: 24 }}>
                <Ionicons name="mail-open-outline" size={52} color={Colors.primaryDark} style={{ marginBottom: 12 }} />
                <Text style={styles.heading}>Verify your email</Text>
                <Text style={[styles.subheading, { textAlign: 'center' }]}>
                  Enter the 6-digit code sent to{'\n'}
                  <Text style={{ fontWeight: '700', color: Colors.textPrimary }}>{email.trim()}</Text>
                </Text>
              </View>
              <View style={[styles.inputWrap, { justifyContent: 'center' }]}>
                <TextInput
                  style={[styles.input, { textAlign: 'center', fontSize: 26, fontWeight: '800', letterSpacing: 12 }]}
                  placeholder="000000"
                  placeholderTextColor={Colors.textMuted}
                  keyboardType="number-pad"
                  maxLength={6}
                  value={otpCode}
                  onChangeText={(t) => setOtpCode(t.replace(/\D/g, ''))}
                  autoFocus
                />
              </View>
              <TouchableOpacity
                style={[styles.ctaBtn, (submitting || otpCode.length !== 6) && { opacity: 0.6 }, { marginTop: 20 }]}
                onPress={handleVerifyOtp}
                disabled={submitting || otpCode.length !== 6}
                activeOpacity={0.87}
              >
                {submitting
                  ? <ActivityIndicator color={Colors.white} />
                  : <Text style={styles.ctaBtnText}>Verify & Continue</Text>
                }
              </TouchableOpacity>
              <Text style={[styles.footerText, { marginTop: 20 }]}>
                Didn't receive a code?{'  '}
                <Text style={styles.footerLink} onPress={handleResendOtp}>Resend</Text>
              </Text>
              <Text style={[styles.footerText, { marginTop: 10 }]}>
                <Text style={styles.footerLink} onPress={() => { setStep('form'); setOtpCode(''); }}>
                  ← Back
                </Text>
              </Text>
            </View>
          </ScrollView>
        </KeyboardAvoidingView>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <StatusBar barStyle="light-content" backgroundColor={Colors.primaryDark} />

      {/* Decorative Header */}
      <SafeAreaView style={styles.headerSafe} edges={['top']}>
        <View style={styles.headerDecor}>
          {/* Subtle bg circles */}
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

      {/* Form Card */}
      <KeyboardAvoidingView
        style={styles.cardOuter}
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        keyboardVerticalOffset={0}
      >
        <ScrollView
          contentContainerStyle={styles.cardScroll}
          showsVerticalScrollIndicator={false}
          keyboardShouldPersistTaps="handled"
        >
          <View style={styles.card}>

            {/* Tab Toggle */}
            <View style={styles.tabRow}>
              <TouchableOpacity
                style={[styles.tab, mode === 'login' && styles.tabActive]}
                onPress={() => setMode('login')}
              >
                <Text style={[styles.tabText, mode === 'login' && styles.tabTextActive]}>Log In</Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={[styles.tab, mode === 'signup' && styles.tabActive]}
                onPress={() => setMode('signup')}
              >
                <Text style={[styles.tabText, mode === 'signup' && styles.tabTextActive]}>Sign Up</Text>
              </TouchableOpacity>
            </View>

            {/* Heading */}
            <Text style={styles.heading}>
              {mode === 'login' ? 'Welcome back!' : 'Create account'}
            </Text>
            <Text style={styles.subheading}>
              {mode === 'login'
                ? 'Sign in to manage your home services.'
                : "We're here to help you get the best home service experience."}
            </Text>

            {/* Email */}
            <View style={styles.inputWrap}>
              <Ionicons name="mail-outline" size={18} color={Colors.textMuted} style={styles.inputIcon} />
              <TextInput
                style={styles.input}
                placeholder="Email address"
                placeholderTextColor={Colors.textMuted}
                keyboardType="email-address"
                autoCapitalize="none"
                value={email}
                onChangeText={setEmail}
              />
            </View>

            {/* Password */}
            <View style={styles.inputWrap}>
              <Ionicons name="lock-closed-outline" size={18} color={Colors.textMuted} style={styles.inputIcon} />
              <TextInput
                style={styles.input}
                placeholder="Password"
                placeholderTextColor={Colors.textMuted}
                secureTextEntry={!showPassword}
                value={password}
                onChangeText={setPassword}
              />
              <TouchableOpacity onPress={() => setShowPassword(!showPassword)} style={styles.eyeBtn}>
                <Ionicons name={showPassword ? 'eye-outline' : 'eye-off-outline'} size={18} color={Colors.textMuted} />
              </TouchableOpacity>
            </View>

            {/* Confirm Password (signup only) */}
            {mode === 'signup' && (
              <View style={styles.inputWrap}>
                <Ionicons name="lock-closed-outline" size={18} color={Colors.textMuted} style={styles.inputIcon} />
                <TextInput
                  style={styles.input}
                  placeholder="Confirm password"
                  placeholderTextColor={Colors.textMuted}
                  secureTextEntry={!showConfirmPassword}
                  value={confirmPassword}
                  onChangeText={setConfirmPassword}
                />
                <TouchableOpacity onPress={() => setShowConfirmPassword(!showConfirmPassword)} style={styles.eyeBtn}>
                  <Ionicons name={showConfirmPassword ? 'eye-outline' : 'eye-off-outline'} size={18} color={Colors.textMuted} />
                </TouchableOpacity>
              </View>
            )}

            {/* Row: Remember me / Forgot password (login) | Terms (signup) */}
            {mode === 'login' ? (
              <View style={styles.extraRow}>
                <TouchableOpacity style={styles.checkRow} onPress={() => setRememberMe(!rememberMe)}>
                  <View style={[styles.checkbox, rememberMe && styles.checkboxActive]}>
                    {rememberMe && <Ionicons name="checkmark" size={11} color={Colors.white} />}
                  </View>
                  <Text style={styles.checkLabel}>Remember me</Text>
                </TouchableOpacity>
                <TouchableOpacity>
                  <Text style={styles.forgotText}>Forgot Password?</Text>
                </TouchableOpacity>
              </View>
            ) : (
              <TouchableOpacity style={[styles.checkRow, { marginBottom: 20 }]} onPress={() => setAgreeTerms(!agreeTerms)}>
                <View style={[styles.checkbox, agreeTerms && styles.checkboxActive]}>
                  {agreeTerms && <Ionicons name="checkmark" size={11} color={Colors.white} />}
                </View>
                <Text style={styles.checkLabel}>
                  Agree to{' '}
                  <Text style={styles.linkText}>Terms & Privacy</Text>
                </Text>
              </TouchableOpacity>
            )}

            {/* CTA Button */}
            <TouchableOpacity
              style={[styles.ctaBtn, submitting && { opacity: 0.7 }]}
              onPress={handleContinue}
              activeOpacity={0.87}
              disabled={submitting}
            >
              {submitting
                ? <ActivityIndicator color={Colors.white} />
                : <Text style={styles.ctaBtnText}>{mode === 'login' ? 'Log In' : 'Sign Up'}</Text>
              }
            </TouchableOpacity>

            {/* Divider */}
            <View style={styles.dividerRow}>
              <View style={styles.dividerLine} />
              <Text style={styles.dividerText}>or continue with</Text>
              <View style={styles.dividerLine} />
            </View>

            {/* Social Auth */}
            <View style={styles.socialRow}>
              <TouchableOpacity style={styles.socialBtn} onPress={handleContinue}>
                <Ionicons name="logo-google" size={20} color="#EA4335" />
                <Text style={styles.socialBtnText}>Google</Text>
              </TouchableOpacity>
              <TouchableOpacity style={styles.socialBtn} onPress={handleContinue}>
                <Ionicons name="logo-apple" size={20} color={Colors.textPrimary} />
                <Text style={styles.socialBtnText}>Apple</Text>
              </TouchableOpacity>
            </View>

            {/* Footer switch */}
            <Text style={styles.footerText}>
              {mode === 'login' ? "Don't have an account?  " : 'Already have an account?  '}
              <Text style={styles.footerLink} onPress={() => setMode(mode === 'login' ? 'signup' : 'login')}>
                {mode === 'login' ? 'Sign Up' : 'Log In'}
              </Text>
            </Text>

          </View>
        </ScrollView>
      </KeyboardAvoidingView>
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
    paddingBottom: 32,
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
    width: 90, height: 90,
    borderRadius: 24,
    backgroundColor: 'rgba(255,255,255,0.12)',
    alignItems: 'center', justifyContent: 'center',
    marginBottom: 14,
  },
  logoImg: { width: 68, height: 68 },
  appName: {
    fontSize: 26, fontWeight: '800', color: Colors.white,
    letterSpacing: 0.3, marginBottom: 6,
  },
  tagline: {
    fontSize: 13, color: 'rgba(255,255,255,0.65)',
    fontWeight: '400',
  },

  // ── Form Card ──────────────────────────────────────────
  cardOuter: { flex: 1 },
  cardScroll: { flexGrow: 1 },
  card: {
    flex: 1,
    backgroundColor: Colors.white,
    borderTopLeftRadius: 28,
    borderTopRightRadius: 28,
    padding: 24,
    paddingBottom: 40,
  },

  // ── Tabs ──────────────────────────────────────────────
  tabRow: {
    flexDirection: 'row',
    backgroundColor: Colors.background,
    borderRadius: BorderRadius.lg,
    padding: 4,
    marginBottom: 24,
  },
  tab: {
    flex: 1, paddingVertical: 10,
    borderRadius: BorderRadius.md,
    alignItems: 'center',
  },
  tabActive: {
    backgroundColor: Colors.primaryDark,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.12,
    shadowRadius: 4,
    elevation: 3,
  },
  tabText: { fontSize: 14, fontWeight: '600', color: Colors.textSecondary },
  tabTextActive: { color: Colors.white },

  // ── Heading ───────────────────────────────────────────
  heading: {
    fontSize: 22, fontWeight: '800', color: Colors.textPrimary, marginBottom: 6,
  },
  subheading: {
    fontSize: 13, color: Colors.textSecondary, lineHeight: 19, marginBottom: 22,
  },

  // ── Inputs ────────────────────────────────────────────
  inputWrap: {
    flexDirection: 'row', alignItems: 'center',
    borderWidth: 1.5, borderColor: Colors.border,
    borderRadius: BorderRadius.lg,
    paddingHorizontal: 14,
    backgroundColor: Colors.background,
    marginBottom: 14,
  },
  inputIcon: { marginRight: 10 },
  input: {
    flex: 1, height: 50,
    fontSize: 14, color: Colors.textPrimary,
  },
  eyeBtn: { padding: 4 },

  // ── Extra Row ─────────────────────────────────────────
  extraRow: {
    flexDirection: 'row', alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 22,
  },
  checkRow: { flexDirection: 'row', alignItems: 'center', gap: 8 },
  checkbox: {
    width: 18, height: 18, borderRadius: 5,
    borderWidth: 1.5, borderColor: Colors.border,
    alignItems: 'center', justifyContent: 'center',
    backgroundColor: Colors.white,
  },
  checkboxActive: { backgroundColor: Colors.primaryDark, borderColor: Colors.primaryDark },
  checkLabel: { fontSize: 13, color: Colors.textSecondary },
  forgotText: { fontSize: 13, color: Colors.primaryDark, fontWeight: '600' },
  linkText: { color: Colors.primaryDark, fontWeight: '600' },

  // ── CTA ───────────────────────────────────────────────
  ctaBtn: {
    backgroundColor: Colors.primaryDark,
    borderRadius: BorderRadius.full,
    paddingVertical: 16,
    alignItems: 'center',
    marginBottom: 20,
  },
  ctaBtnText: { color: Colors.white, fontSize: 16, fontWeight: '700' },

  // ── Divider ───────────────────────────────────────────
  dividerRow: {
    flexDirection: 'row', alignItems: 'center', marginBottom: 16,
  },
  dividerLine: { flex: 1, height: 1, backgroundColor: Colors.border },
  dividerText: {
    marginHorizontal: 12, fontSize: 12,
    color: Colors.textMuted,
  },

  // ── Social ────────────────────────────────────────────
  socialRow: { flexDirection: 'row', gap: 12, marginBottom: 24 },
  socialBtn: {
    flex: 1, flexDirection: 'row', alignItems: 'center', justifyContent: 'center',
    gap: 8, borderWidth: 1.5, borderColor: Colors.border,
    borderRadius: BorderRadius.lg, paddingVertical: 13,
    backgroundColor: Colors.white,
  },
  socialBtnText: { fontSize: 14, fontWeight: '600', color: Colors.textPrimary },

  // ── Footer ────────────────────────────────────────────
  footerText: { textAlign: 'center', fontSize: 13, color: Colors.textSecondary },
  footerLink: { color: Colors.primaryDark, fontWeight: '700' },
});

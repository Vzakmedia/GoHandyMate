import React, { useEffect, useRef } from 'react';
import {
  View, Text, StyleSheet, Animated, StatusBar, Dimensions, Image,
} from 'react-native';
import { Colors } from '../../theme/colors';
import { supabase } from '../../lib/supabase';

const { width, height } = Dimensions.get('window');

export default function SplashScreen({ navigation }) {
  const logoScale = useRef(new Animated.Value(0.6)).current;
  const logoOpacity = useRef(new Animated.Value(0)).current;
  const textOpacity = useRef(new Animated.Value(0)).current;
  const taglineOpacity = useRef(new Animated.Value(0)).current;
  const dot1 = useRef(new Animated.Value(0.3)).current;
  const dot2 = useRef(new Animated.Value(0.3)).current;
  const dot3 = useRef(new Animated.Value(0.3)).current;

  useEffect(() => {
    // Logo entrance
    Animated.parallel([
      Animated.spring(logoScale, { toValue: 1, tension: 60, friction: 8, useNativeDriver: true }),
      Animated.timing(logoOpacity, { toValue: 1, duration: 500, useNativeDriver: true }),
    ]).start(() => {
      // Text fade in
      Animated.stagger(150, [
        Animated.timing(textOpacity, { toValue: 1, duration: 400, useNativeDriver: true }),
        Animated.timing(taglineOpacity, { toValue: 1, duration: 400, useNativeDriver: true }),
      ]).start();
    });

    // Loading dots loop
    const dotLoop = Animated.loop(
      Animated.sequence([
        Animated.timing(dot1, { toValue: 1, duration: 300, useNativeDriver: true }),
        Animated.timing(dot2, { toValue: 1, duration: 300, useNativeDriver: true }),
        Animated.timing(dot3, { toValue: 1, duration: 300, useNativeDriver: true }),
        Animated.delay(200),
        Animated.parallel([
          Animated.timing(dot1, { toValue: 0.3, duration: 200, useNativeDriver: true }),
          Animated.timing(dot2, { toValue: 0.3, duration: 200, useNativeDriver: true }),
          Animated.timing(dot3, { toValue: 0.3, duration: 200, useNativeDriver: true }),
        ]),
      ])
    );
    dotLoop.start();

    // Navigate after 2.8s — go straight to app if session exists
    const timer = setTimeout(async () => {
      dotLoop.stop();
      const { data: { session } } = await supabase.auth.getSession();
      if (session) {
        // Fetch actual role from DB (source of truth) — user_metadata can be stale
        const { data: profile } = await supabase
          .from('profiles')
          .select('user_role')
          .eq('id', session.user.id)
          .maybeSingle();
        const role = profile?.user_role ?? session.user?.user_metadata?.user_role;
        navigation.replace(role === 'provider' ? 'ProApp' : 'ClientApp');
      } else {
        navigation.replace('RoleSelection');
      }
    }, 2800);

    return () => clearTimeout(timer);
  }, []);

  return (
    <View style={styles.container}>
      <StatusBar barStyle="light-content" backgroundColor={Colors.primaryDark} />

      {/* Background decoration circles */}
      <View style={styles.circleLarge} />
      <View style={styles.circleMedium} />

      {/* Center Content */}
      <View style={styles.center}>
        <Animated.View style={[styles.logoWrap, { transform: [{ scale: logoScale }], opacity: logoOpacity }]}>
          <Image
            source={require('../../../assets/logo.png')}
            style={styles.logoImage}
            resizeMode="contain"
          />
        </Animated.View>

        <Animated.Text style={[styles.appName, { opacity: textOpacity }]}>
          GoHandyMate
        </Animated.Text>

        <Animated.Text style={[styles.tagline, { opacity: taglineOpacity }]}>
          Your trusted home services partner
        </Animated.Text>
      </View>

      {/* Loading Dots */}
      <View style={styles.dotsRow}>
        <Animated.View style={[styles.dot, { opacity: dot1 }]} />
        <Animated.View style={[styles.dot, { opacity: dot2 }]} />
        <Animated.View style={[styles.dot, { opacity: dot3 }]} />
      </View>

      {/* Bottom tag */}
      <Text style={styles.bottomTag}>Made with care for homeowners & pros</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1, backgroundColor: Colors.primaryDark,
    alignItems: 'center', justifyContent: 'center',
  },

  // Background decoration
  circleLarge: {
    position: 'absolute', width: width * 1.2, height: width * 1.2,
    borderRadius: width * 0.6, backgroundColor: 'rgba(255,255,255,0.04)',
    top: -width * 0.3, left: -width * 0.1,
  },
  circleMedium: {
    position: 'absolute', width: width * 0.7, height: width * 0.7,
    borderRadius: width * 0.35, backgroundColor: 'rgba(255,255,255,0.05)',
    bottom: height * 0.05, right: -width * 0.15,
  },

  center: { alignItems: 'center', marginBottom: 60 },

  logoWrap: { marginBottom: 28 },
  logoImage: { width: 180, height: 180 },

  appName: {
    fontSize: 34, fontWeight: '800', color: Colors.white,
    letterSpacing: 0.5, marginBottom: 10,
  },
  tagline: {
    fontSize: 14, color: 'rgba(255,255,255,0.7)',
    fontWeight: '400', letterSpacing: 0.3,
  },

  dotsRow: { flexDirection: 'row', gap: 8, position: 'absolute', bottom: 80 },
  dot: { width: 8, height: 8, borderRadius: 4, backgroundColor: Colors.white },

  bottomTag: {
    position: 'absolute', bottom: 40,
    fontSize: 12, color: 'rgba(255,255,255,0.4)', fontWeight: '400',
  },
});

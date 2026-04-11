import React, { useRef, useState } from 'react';
import {
  View, Text, StyleSheet, TouchableOpacity, StatusBar,
  FlatList, Dimensions, Animated, ImageBackground,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { Colors } from '../../theme/colors';
import { BorderRadius } from '../../theme/spacing';

const { width, height } = Dimensions.get('window');

const SLIDES = [
  {
    id: '1',
    image: require('../../../assets/onboard-1.png'),
    title: 'Find trusted pros\nnear you',
    subtitle: 'Browse hundreds of verified home service professionals in your area, complete with reviews and ratings.',
    features: [
      { icon: 'shield-checkmark-outline', text: 'All pros are background-checked' },
      { icon: 'star-outline', text: 'Real reviews from real customers' },
    ],
  },
  {
    id: '2',
    image: require('../../../assets/onboard-2.png'),
    title: 'Book in minutes,\nnot hours',
    subtitle: 'Select your service, pick a time that works for you, and get instant confirmation from your pro.',
    features: [
      { icon: 'calendar-outline', text: 'Real-time availability & booking' },
      { icon: 'notifications-outline', text: 'Instant confirmation & reminders' },
    ],
  },
  {
    id: '3',
    image: require('../../../assets/onboard-3.png'),
    title: 'Stay connected\nwith your pro',
    subtitle: "Chat directly, track your pro's arrival in real time, and get updates throughout the job.",
    features: [
      { icon: 'chatbubble-outline', text: 'In-app messaging & updates' },
      { icon: 'location-outline', text: 'Live arrival tracking' },
    ],
  },
  {
    id: '4',
    image: require('../../../assets/onboard-4.png'),
    title: 'Pay securely,\nevery time',
    subtitle: 'Your payment is only released when the job is done. Multiple payment options, zero hassle.',
    features: [
      { icon: 'card-outline', text: 'Secure payment protection' },
      { icon: 'checkmark-circle-outline', text: 'Pay only when satisfied' },
    ],
  },
];

export default function ClientOnboardingScreen({ navigation }) {
  const [activeIndex, setActiveIndex] = useState(0);
  const flatListRef = useRef(null);
  const scrollX = useRef(new Animated.Value(0)).current;

  const goNext = () => {
    if (activeIndex < SLIDES.length - 1) {
      flatListRef.current?.scrollToIndex({ index: activeIndex + 1 });
    } else {
      navigation.navigate('Login', { role: 'client' });
    }
  };

  const isLast = activeIndex === SLIDES.length - 1;

  return (
    <View style={styles.container}>
      <StatusBar barStyle="light-content" translucent backgroundColor="transparent" />

      <Animated.FlatList
        ref={flatListRef}
        data={SLIDES}
        keyExtractor={(item) => item.id}
        horizontal
        pagingEnabled
        showsHorizontalScrollIndicator={false}
        onScroll={Animated.event(
          [{ nativeEvent: { contentOffset: { x: scrollX } } }],
          { useNativeDriver: false }
        )}
        onMomentumScrollEnd={(e) => {
          const idx = Math.round(e.nativeEvent.contentOffset.x / width);
          setActiveIndex(idx);
        }}
        renderItem={({ item }) => (
          <ImageBackground source={item.image} style={styles.slide} imageStyle={styles.slideImage}>
            <View style={styles.imageOverlay} />

            <TouchableOpacity style={styles.skipBtn} onPress={() => navigation.navigate('Login')}>
              <Text style={styles.skipText}>Skip</Text>
            </TouchableOpacity>

            <View style={styles.glassCard}>
              <Text style={styles.title}>{item.title}</Text>
              <Text style={styles.subtitle}>{item.subtitle}</Text>

              <View style={styles.featuresWrap}>
                {item.features.map((f) => (
                  <View key={f.text} style={styles.featureRow}>
                    <View style={styles.featureIconBox}>
                      <Ionicons name={f.icon} size={16} color={Colors.primaryDark} />
                    </View>
                    <Text style={styles.featureText}>{f.text}</Text>
                  </View>
                ))}
              </View>

              <View style={styles.bottomRow}>
                <View style={styles.dotsRow}>
                  {SLIDES.map((_, i) => {
                    const inputRange = [(i - 1) * width, i * width, (i + 1) * width];
                    const dotWidth = scrollX.interpolate({
                      inputRange, outputRange: [8, 28, 8], extrapolate: 'clamp',
                    });
                    const opacity = scrollX.interpolate({
                      inputRange, outputRange: [0.35, 1, 0.35], extrapolate: 'clamp',
                    });
                    return <Animated.View key={i} style={[styles.dot, { width: dotWidth, opacity }]} />;
                  })}
                </View>

                <TouchableOpacity style={styles.nextBtn} onPress={goNext}>
                  <Text style={styles.nextBtnText}>{isLast ? 'Get Started' : 'Next'}</Text>
                  <Ionicons name={isLast ? 'checkmark' : 'arrow-forward'} size={18} color={Colors.white} />
                </TouchableOpacity>
              </View>
            </View>
          </ImageBackground>
        )}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#000' },

  slide: { width, height },
  slideImage: { resizeMode: 'cover' },
  imageOverlay: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: 'rgba(0,0,0,0.22)',
  },

  skipBtn: {
    position: 'absolute', top: 56, right: 24,
    backgroundColor: 'rgba(255,255,255,0.22)',
    borderRadius: BorderRadius.full,
    paddingHorizontal: 16, paddingVertical: 7,
  },
  skipText: { color: Colors.white, fontSize: 14, fontWeight: '600' },

  glassCard: {
    position: 'absolute', bottom: 0, left: 0, right: 0,
    backgroundColor: 'rgba(255,255,255,0.88)',
    borderTopLeftRadius: 28, borderTopRightRadius: 28,
    padding: 28, paddingBottom: 44,
  },

  title: {
    fontSize: 32, fontWeight: '800', color: Colors.primaryDark,
    lineHeight: 40, marginBottom: 10, letterSpacing: -0.5,
  },
  subtitle: {
    fontSize: 15, color: Colors.textSecondary, lineHeight: 22, marginBottom: 20,
  },

  featuresWrap: { gap: 12, marginBottom: 28 },
  featureRow: { flexDirection: 'row', alignItems: 'center', gap: 14 },
  featureIconBox: {
    width: 34, height: 34, borderRadius: 10,
    backgroundColor: Colors.primaryLight,
    alignItems: 'center', justifyContent: 'center', flexShrink: 0,
  },
  featureText: { fontSize: 14, fontWeight: '500', color: Colors.textPrimary, flex: 1 },

  bottomRow: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' },
  dotsRow: { flexDirection: 'row', alignItems: 'center', gap: 6 },
  dot: { height: 8, borderRadius: 4, backgroundColor: Colors.primaryDark },

  nextBtn: {
    flexDirection: 'row', alignItems: 'center', gap: 8,
    backgroundColor: Colors.primaryDark,
    borderRadius: BorderRadius.full,
    paddingHorizontal: 24, paddingVertical: 14,
  },
  nextBtnText: { color: Colors.white, fontSize: 15, fontWeight: '700' },
});

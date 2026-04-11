import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { Colors } from '../theme/colors';
import { FontSize, FontWeight } from '../theme/typography';
import { BorderRadius } from '../theme/spacing';

export function Avatar({ name = '', size = 48, backgroundColor, textColor, imageUri }) {
  const initials = name
    .split(' ')
    .map((n) => n[0])
    .join('')
    .toUpperCase()
    .slice(0, 2);

  const bg = backgroundColor || Colors.primaryMedium;

  return (
    <View
      style={[
        styles.container,
        {
          width: size,
          height: size,
          borderRadius: size / 2,
          backgroundColor: bg,
        },
      ]}
    >
      <Text style={[styles.initials, { fontSize: size * 0.38, color: textColor || Colors.white }]}>
        {initials}
      </Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    alignItems: 'center',
    justifyContent: 'center',
    overflow: 'hidden',
  },
  initials: {
    fontWeight: FontWeight.semibold,
    letterSpacing: 0.5,
  },
});

import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { Colors } from '../theme/colors';
import { FontSize, FontWeight } from '../theme/typography';
import { BorderRadius, Spacing } from '../theme/spacing';

export function Badge({ label, variant = 'success', icon, small = false }) {
  const variantStyles = {
    success: { bg: Colors.successLight, text: Colors.success },
    primary: { bg: Colors.primaryLight, text: Colors.primaryDark },
    warning: { bg: Colors.warningLight, text: Colors.warning },
    error: { bg: Colors.errorLight, text: Colors.error },
    gray: { bg: Colors.background, text: Colors.textSecondary },
  };
  const vs = variantStyles[variant] || variantStyles.success;

  return (
    <View style={[styles.badge, { backgroundColor: vs.bg }, small && styles.small]}>
      {icon && <Ionicons name={icon} size={small ? 10 : 12} color={vs.text} style={{ marginRight: 3 }} />}
      <Text style={[styles.label, { color: vs.text }, small && styles.smallText]}>{label}</Text>
    </View>
  );
}

export function StarRating({ rating = 0, count, size = 14 }) {
  return (
    <View style={styles.row}>
      <Ionicons name="star" size={size} color={Colors.starGold} />
      <Text style={[styles.ratingText, { fontSize: size }]}>{rating.toFixed(1)}</Text>
      {count !== undefined && (
        <Text style={[styles.countText, { fontSize: size - 1 }]}> ({count})</Text>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  badge: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: BorderRadius.full,
  },
  small: {
    paddingHorizontal: 6,
    paddingVertical: 2,
  },
  label: {
    fontSize: FontSize.sm,
    fontWeight: FontWeight.medium,
  },
  smallText: {
    fontSize: FontSize.xs,
  },
  row: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  ratingText: {
    fontWeight: FontWeight.semibold,
    color: Colors.textPrimary,
    marginLeft: 3,
  },
  countText: {
    color: Colors.textSecondary,
  },
});

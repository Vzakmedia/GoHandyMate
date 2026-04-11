import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { Colors } from '../theme/colors';
import { FontSize, FontWeight } from '../theme/typography';
import { Spacing } from '../theme/spacing';

export function Header({ title, onBack, rightIcon, rightLabel, onRightPress, transparent = false }) {
  return (
    <View style={[styles.container, transparent && styles.transparent]}>
      {onBack ? (
        <TouchableOpacity onPress={onBack} style={styles.backBtn} hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}>
          <Ionicons name="chevron-back" size={24} color={Colors.textPrimary} />
        </TouchableOpacity>
      ) : (
        <View style={styles.placeholder} />
      )}
      <Text style={styles.title} numberOfLines={1}>{title}</Text>
      {(rightIcon || rightLabel) ? (
        <TouchableOpacity onPress={onRightPress} style={styles.rightBtn}>
          {rightIcon ? <Ionicons name={rightIcon} size={22} color={Colors.primaryDark} /> : null}
          {rightLabel ? <Text style={styles.rightLabel}>{rightLabel}</Text> : null}
        </TouchableOpacity>
      ) : (
        <View style={styles.placeholder} />
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: Spacing.base,
    paddingVertical: 12,
    backgroundColor: Colors.white,
    borderBottomWidth: 1,
    borderBottomColor: Colors.borderLight,
  },
  transparent: {
    backgroundColor: 'transparent',
    borderBottomWidth: 0,
  },
  title: {
    fontSize: FontSize.lg,
    fontWeight: FontWeight.semibold,
    color: Colors.textPrimary,
    flex: 1,
    textAlign: 'center',
  },
  backBtn: {
    width: 36,
    height: 36,
    alignItems: 'flex-start',
    justifyContent: 'center',
  },
  rightBtn: {
    width: 36,
    height: 36,
    alignItems: 'flex-end',
    justifyContent: 'center',
  },
  rightLabel: {
    color: Colors.primaryDark,
    fontWeight: FontWeight.medium,
    fontSize: FontSize.base,
  },
  placeholder: {
    width: 36,
  },
});

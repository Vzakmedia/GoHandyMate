import React from 'react';
import { TouchableOpacity, Text, StyleSheet, ActivityIndicator, View } from 'react-native';
import { Colors } from '../theme/colors';
import { FontSize, FontWeight } from '../theme/typography';
import { BorderRadius, Spacing } from '../theme/spacing';

export function Button({ title, onPress, variant = 'primary', loading = false, disabled = false, style, textStyle, leftIcon }) {
  const isOutline = variant === 'outline';
  const isGhost = variant === 'ghost';
  const isDestructive = variant === 'destructive';

  return (
    <TouchableOpacity
      onPress={onPress}
      disabled={disabled || loading}
      style={[
        styles.base,
        isOutline && styles.outline,
        isGhost && styles.ghost,
        isDestructive && styles.destructive,
        disabled && styles.disabled,
        style,
      ]}
      activeOpacity={0.8}
    >
      {loading ? (
        <ActivityIndicator color={isOutline ? Colors.primaryDark : Colors.white} size="small" />
      ) : (
        <View style={styles.row}>
          {leftIcon && <View style={styles.iconLeft}>{leftIcon}</View>}
          <Text style={[
            styles.text,
            isOutline && styles.textOutline,
            isGhost && styles.textGhost,
            isDestructive && styles.textDestructive,
            textStyle,
          ]}>
            {title}
          </Text>
        </View>
      )}
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  base: {
    backgroundColor: Colors.primaryDark,
    borderRadius: BorderRadius.lg,
    paddingVertical: 16,
    paddingHorizontal: Spacing.base,
    alignItems: 'center',
    justifyContent: 'center',
    minHeight: 52,
  },
  outline: {
    backgroundColor: 'transparent',
    borderWidth: 1.5,
    borderColor: Colors.primaryDark,
  },
  ghost: {
    backgroundColor: 'transparent',
  },
  destructive: {
    backgroundColor: Colors.error,
  },
  disabled: {
    opacity: 0.5,
  },
  text: {
    color: Colors.white,
    fontSize: FontSize.lg,
    fontWeight: FontWeight.semibold,
    letterSpacing: 0.3,
  },
  textOutline: {
    color: Colors.primaryDark,
  },
  textGhost: {
    color: Colors.primaryDark,
  },
  textDestructive: {
    color: Colors.white,
  },
  row: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  iconLeft: {
    marginRight: 8,
  },
});

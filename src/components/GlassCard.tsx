/**
 * GlassCard — Glassmorphism Card Component
 *
 * A translucent card with blur background, subtle border glow,
 * and press animation. The premium look of the app.
 */

import React from 'react';
import {
  StyleSheet,
  View,
  Pressable,
  ViewStyle,
  StyleProp,
} from 'react-native';
import { Colors, BorderRadius, Spacing, Shadows } from '../constants/theme';

interface GlassCardProps {
  children: React.ReactNode;
  /** Optional onPress handler for interactive cards */
  onPress?: () => void;
  /** Override container styles */
  style?: StyleProp<ViewStyle>;
  /** Card variant changes the border accent color */
  variant?: 'default' | 'today' | 'tomorrow' | 'festival';
  /** Whether to add a subtle glow effect */
  glow?: boolean;
}

export function GlassCard({
  children,
  onPress,
  style,
  variant = 'default',
  glow = false,
}: GlassCardProps) {
  const borderColor = {
    default: Colors.background.solidCardBorder,
    today: 'rgba(255, 107, 53, 0.3)',     // saffron glow
    tomorrow: 'rgba(0, 210, 255, 0.3)',   // teal glow
    festival: 'rgba(255, 215, 0, 0.3)',   // gold glow
  }[variant];

  const glowShadow = glow
    ? {
        shadowColor:
          variant === 'today'
            ? Colors.accent.saffron
            : variant === 'tomorrow'
            ? Colors.accent.teal
            : variant === 'festival'
            ? Colors.accent.gold
            : 'transparent',
        shadowOffset: { width: 0, height: 0 },
        shadowOpacity: 0.25,
        shadowRadius: 16,
        elevation: 8,
      }
    : {};

  const cardContent = (
    <View
      style={[
        styles.card,
        { borderColor },
        glowShadow,
        style,
      ]}
    >
      {children}
    </View>
  );

  if (onPress) {
    return (
      <Pressable
        onPress={onPress}
        style={({ pressed }) => [
          pressed && styles.pressed,
        ]}
      >
        {cardContent}
      </Pressable>
    );
  }

  return cardContent;
}

const styles = StyleSheet.create({
  card: {
    backgroundColor: Colors.background.solidCard,
    borderRadius: BorderRadius.xl,
    borderWidth: 1,
    borderColor: Colors.background.solidCardBorder,
    padding: Spacing.lg,
    ...Shadows.md,
  },
  pressed: {
    opacity: 0.85,
    transform: [{ scale: 0.98 }],
  },
});

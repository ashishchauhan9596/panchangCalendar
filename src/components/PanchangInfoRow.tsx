/**
 * PanchangInfoRow — Reusable Label+Value Row
 *
 * Displays a panchang element with label, value, and optional
 * progress indicator. Used throughout the app for consistent display.
 */

import React from 'react';
import { StyleSheet, View, Text, Pressable } from 'react-native';
import { Colors, Typography, Spacing } from '../constants/theme';

interface PanchangInfoRowProps {
  /** Row label (e.g., "Tithi", "Nakshatra") */
  label: string;
  /** Primary value (e.g., "Shukla Dwitiya") */
  value: string;
  /** Optional secondary info (e.g., "72% elapsed") */
  secondary?: string;
  /** Optional icon or emoji */
  icon?: string;
  /** Optional progress (0.0-1.0) */
  progress?: number;
  /** Progress bar accent color */
  progressColor?: string;
  /** Optional callback when the label is pressed */
  onPressLabel?: () => void;
}

export function PanchangInfoRow({
  label,
  value,
  secondary,
  icon,
  progress,
  progressColor = Colors.accent.saffron,
  onPressLabel,
}: PanchangInfoRowProps) {
  return (
    <View style={styles.container}>
      <Pressable
        style={styles.labelRow}
        onPress={onPressLabel}
        disabled={!onPressLabel}
      >
        {icon && <Text style={styles.icon}>{icon}</Text>}
        <View style={styles.labelTextContainer}>
          <Text style={[styles.label, onPressLabel && styles.interactiveLabel]}>
            {label}
          </Text>
          {onPressLabel && (
            <View style={styles.infoIconContainer}>
              <Text style={styles.infoIconText}>i</Text>
            </View>
          )}
        </View>
      </Pressable>
      <View style={styles.valueColumn}>
        <Text style={styles.value}>{value}</Text>
        {secondary && <Text style={styles.secondary}>{secondary}</Text>}
        {progress !== undefined && (
          <View style={styles.progressTrack}>
            <View
              style={[
                styles.progressFill,
                {
                  width: `${Math.round(progress * 100)}%`,
                  backgroundColor: progressColor,
                },
              ]}
            />
          </View>
        )}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    paddingVertical: Spacing.sm,
    borderBottomWidth: StyleSheet.hairlineWidth,
    borderBottomColor: Colors.glass.borderLight,
  },
  labelRow: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  icon: {
    fontSize: Typography.size.lg,
    marginRight: Spacing.sm,
  },
  label: {
    color: Colors.text.secondary,
    fontSize: Typography.size.md,
    fontWeight: Typography.weight.medium,
  },
  interactiveLabel: {
    color: Colors.text.primary,
  },
  labelTextContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  infoIconContainer: {
    backgroundColor: 'rgba(255, 142, 60, 0.15)',
    width: 16,
    height: 16,
    borderRadius: 8,
    justifyContent: 'center',
    alignItems: 'center',
    marginLeft: Spacing.xs,
  },
  infoIconText: {
    fontSize: 10,
    fontWeight: 'bold',
    color: Colors.accent.saffron,
  },
  valueColumn: {
    alignItems: 'flex-end',
    flex: 1.2,
  },
  value: {
    color: Colors.text.primary,
    fontSize: Typography.size.md,
    fontWeight: Typography.weight.semiBold,
    textAlign: 'right',
  },
  secondary: {
    color: Colors.text.tertiary,
    fontSize: Typography.size.sm,
    marginTop: 2,
  },
  progressTrack: {
    width: 80,
    height: 3,
    backgroundColor: 'rgba(255, 255, 255, 0.1)',
    borderRadius: 2,
    marginTop: 4,
    overflow: 'hidden',
  },
  progressFill: {
    height: '100%',
    borderRadius: 2,
  },
});

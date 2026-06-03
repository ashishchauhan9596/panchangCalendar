/**
 * FestivalChip — Festival Indicator Badge
 *
 * A small colored badge/chip that displays a festival name.
 * Color varies by festival category.
 */

import React from 'react';
import { StyleSheet, View, Text } from 'react-native';
import { Colors, Typography, Spacing, BorderRadius } from '../constants/theme';
import type { FestivalInfo } from '../engine/types';

interface FestivalChipProps {
  festival: FestivalInfo;
  /** Compact mode shows just a dot */
  compact?: boolean;
}

const CATEGORY_COLORS: Record<string, string> = {
  major_festival: Colors.festival.major,
  fast: Colors.festival.fast,
  auspicious: Colors.festival.auspicious,
  national: Colors.festival.national,
  swaminarayan: Colors.festival.swaminarayan,
};

export function FestivalChip({ festival, compact = false }: FestivalChipProps) {
  const color = CATEGORY_COLORS[festival.category] ?? Colors.accent.violet;

  if (compact) {
    return <View style={[styles.dot, { backgroundColor: color }]} />;
  }

  return (
    <View style={[styles.chip, { borderColor: color }]}>
      <View style={[styles.chipDot, { backgroundColor: color }]} />
      <Text style={[styles.chipText, { color }]} numberOfLines={1}>
        {festival.name}
      </Text>
    </View>
  );
}

/**
 * FestivalDots — Multiple dots for a calendar cell
 */
export function FestivalDots({ festivals }: { festivals: FestivalInfo[] }) {
  if (festivals.length === 0) return null;
  return (
    <View style={styles.dotsRow}>
      {festivals.slice(0, 3).map((f, i) => (
        <View
          key={f.id || i}
          style={[
            styles.calendarDot,
            { backgroundColor: CATEGORY_COLORS[f.category] ?? Colors.accent.violet },
          ]}
        />
      ))}
    </View>
  );
}

const styles = StyleSheet.create({
  dot: {
    width: 6,
    height: 6,
    borderRadius: 3,
  },
  chip: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: Spacing.sm,
    paddingVertical: Spacing.xxs,
    borderRadius: BorderRadius.full,
    borderWidth: 1,
    backgroundColor: 'rgba(255, 255, 255, 0.05)',
    marginRight: Spacing.xs,
    marginBottom: Spacing.xs,
  },
  chipDot: {
    width: 5,
    height: 5,
    borderRadius: 3,
    marginRight: Spacing.xs,
  },
  chipText: {
    fontSize: Typography.size.xs,
    fontWeight: Typography.weight.medium,
  },
  dotsRow: {
    flexDirection: 'row',
    justifyContent: 'center',
    gap: 2,
    marginTop: 2,
  },
  calendarDot: {
    width: 4,
    height: 4,
    borderRadius: 2,
  },
});

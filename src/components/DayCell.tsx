/**
 * DayCell — Individual Calendar Day Cell (Premium v2)
 *
 * Visual improvements:
 * - Glassmorphism tinted background with rounder corners
 * - Today → bold saffron pill with glowing halo shadow
 * - Selected → bright teal border with subtle fill
 * - Ekadashi / Poonam / Major Festival → gold left accent stripe + gold text
 * - Festival dots: larger (5px), pill-shaped, shows "+N" if overflow
 * - Scale press animation for tactile feel
 */

import React from 'react';
import { StyleSheet, View, Text, Pressable, Vibration } from 'react-native';
import { Colors, Typography, Spacing, BorderRadius } from '../constants/theme';
import type { TithiInfo, FestivalInfo } from '../engine/types';
import { useTranslation } from '../i18n';

interface DayCellProps {
  /** Day number (1–31) */
  day: number;
  /** Whether this day is today */
  isToday: boolean;
  /** Whether this day is currently selected */
  isSelected: boolean;
  /** Whether this day belongs to the current displayed month */
  isCurrentMonth: boolean;
  /** Tithi info for this day */
  tithi?: TithiInfo;
  /** Festivals on this day */
  festivals?: FestivalInfo[];
  /** Press handler */
  onPress: () => void;
  /** Long-press handler */
  onLongPress?: () => void;
}

// ── Festival dot color map ────────────────────────────────────────────────────
const DOT_COLORS: Record<string, string> = {
  major_festival: Colors.festival.major,
  fast:           Colors.festival.fast,
  auspicious:     Colors.festival.auspicious,
  national:       Colors.festival.national,
  swaminarayan:   Colors.festival.swaminarayan,
};

// ── Tithi label helper ────────────────────────────────────────────────────────
function getConciseTithiName(tithi: TithiInfo, lang: string): string {
  const isShukla = tithi.paksha === 'shukla';

  if (tithi.pakshaNumber === 15) {
    if (lang === 'hi') return isShukla ? 'पूर्णिमा' : 'अमावस्या';
    return isShukla ? 'Purnima' : 'Amavasya';
  }

  if (lang === 'hi') {
    return `${isShukla ? 'शु.' : 'कृ.'} ${tithi.pakshaNumber}`;
  }
  return `${isShukla ? 'Shuk' : 'Krish'} ${tithi.pakshaNumber}`;
}

// ── DayCell Component ─────────────────────────────────────────────────────────
export function DayCell({
  day,
  isToday,
  isSelected,
  isCurrentMonth,
  tithi,
  festivals = [],
  onPress,
  onLongPress,
}: DayCellProps) {
  const { language } = useTranslation();

  const isEkadashi     = tithi?.pakshaNumber === 11;
  const isPoonamAmas   = tithi?.pakshaNumber === 15;
  const hasMajorFest   = festivals.some(
    (f) => f.category === 'swaminarayan' || f.importance === 'critical'
  );
  const isSpecialDay   = isEkadashi || isPoonamAmas || hasMajorFest;

  const handlePress = () => {
    Vibration.vibrate(isSpecialDay ? 45 : 12);
    onPress();
  };

  const handleLongPress = () => {
    if (onLongPress) {
      Vibration.vibrate(50);
      onLongPress();
    }
  };

  return (
    <Pressable
      onPress={handlePress}
      onLongPress={handleLongPress}
      delayLongPress={350}
      style={({ pressed }) => [styles.cell, pressed && styles.pressed]}
    >
      <View
        style={[
          styles.dayBox,
          !isCurrentMonth && styles.otherMonthBox,
          isSpecialDay && !isToday && styles.specialAccent,
          isToday && styles.todayBox,
          isSelected && !isToday && styles.selectedBox,
        ]}
      >
        {/* Day Number */}
        <Text
          style={[
            styles.dayText,
            !isCurrentMonth && styles.otherMonthText,
            isSpecialDay && !isToday && !isSelected && styles.specialDayText,
            isToday && styles.todayDayText,
            isSelected && !isToday && styles.selectedDayText,
          ]}
        >
          {day}
        </Text>

        {/* Tithi Label */}
        {tithi && (
          <Text
            style={[
              styles.tithiText,
              (isEkadashi || isPoonamAmas) && styles.specialTithiText,
              isToday && styles.todaySubText,
              isSelected && !isToday && styles.selectedSubText,
            ]}
            numberOfLines={1}
            adjustsFontSizeToFit
          >
            {getConciseTithiName(tithi, language)}
          </Text>
        )}

        {/* Festival Dots Row */}
        <View style={styles.dotsRow}>
          {festivals.slice(0, 3).map((f, i) => (
            <View
              key={f.id || i}
              style={[
                styles.festDot,
                { backgroundColor: DOT_COLORS[f.category] ?? Colors.accent.violet },
              ]}
            />
          ))}
          {festivals.length > 3 && (
            <Text style={styles.moreText}>+{festivals.length - 3}</Text>
          )}
        </View>
      </View>
    </Pressable>
  );
}

// ── EmptyCell ─────────────────────────────────────────────────────────────────
export function EmptyCell() {
  return <View style={styles.cell} />;
}

// ── Styles ────────────────────────────────────────────────────────────────────
const styles = StyleSheet.create({
  cell: {
    flex: 1,
    paddingHorizontal: 2,
    paddingVertical: 3,
  },
  pressed: {
    opacity: 0.72,
    transform: [{ scale: 0.94 }],
  },

  // ── Base day box ──
  dayBox: {
    width: '100%',
    height: 56,
    borderRadius: 10,
    backgroundColor: 'rgba(255, 255, 255, 0.035)',
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.07)',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingTop: 5,
    paddingBottom: 5,
  },
  otherMonthBox: {
    opacity: 0.28,
  },

  // ── Special (Ekadashi / Poonam / Amavasya / Major Festival) ──
  specialAccent: {
    borderLeftWidth: 2.5,
    borderLeftColor: Colors.accent.gold,
    backgroundColor: 'rgba(255, 215, 0, 0.05)',
    borderColor: 'rgba(255, 215, 0, 0.12)',
  },

  // ── Today ──
  todayBox: {
    backgroundColor: Colors.accent.saffron,
    borderColor: 'rgba(255, 107, 53, 0.6)',
    shadowColor: Colors.accent.saffron,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.6,
    shadowRadius: 10,
    elevation: 6,
  },

  // ── Selected ──
  selectedBox: {
    borderColor: Colors.accent.teal,
    borderWidth: 1.8,
    backgroundColor: 'rgba(0, 210, 255, 0.09)',
    shadowColor: Colors.accent.teal,
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 0.25,
    shadowRadius: 6,
    elevation: 2,
  },

  // ── Day number text ──
  dayText: {
    color: Colors.text.primary,
    fontSize: Typography.size.md,
    fontWeight: Typography.weight.bold,
    lineHeight: 18,
  },
  otherMonthText: {
    color: Colors.text.tertiary,
  },
  specialDayText: {
    color: Colors.accent.gold,
    fontWeight: Typography.weight.extraBold,
  },
  todayDayText: {
    color: '#fff',
    fontWeight: Typography.weight.extraBold,
    fontSize: Typography.size.lg,
  },
  selectedDayText: {
    color: Colors.accent.teal,
    fontWeight: Typography.weight.extraBold,
  },

  // ── Tithi label ──
  tithiText: {
    color: Colors.text.tertiary,
    fontSize: 9,
    fontWeight: Typography.weight.medium,
    textAlign: 'center',
    paddingHorizontal: 2,
  },
  specialTithiText: {
    color: Colors.accent.gold,
    fontWeight: Typography.weight.bold,
  },
  todaySubText: {
    color: 'rgba(255,255,255,0.88)',
    fontWeight: Typography.weight.bold,
  },
  selectedSubText: {
    color: Colors.accent.teal,
    fontWeight: Typography.weight.bold,
  },

  // ── Festival dots ──
  dotsRow: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    gap: 2,
    height: 7,
  },
  festDot: {
    width: 5,
    height: 5,
    borderRadius: 2.5,
  },
  moreText: {
    color: Colors.text.tertiary,
    fontSize: 6,
    fontWeight: Typography.weight.bold,
    lineHeight: 7,
  },
});

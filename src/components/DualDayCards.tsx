/**
 * DualDayCards — Today + Tomorrow details
 */

import React from 'react';
import { StyleSheet, View, Text } from 'react-native';
import { GlassCard } from './GlassCard';
import { Colors, Typography, Spacing } from '../constants/theme';
import { formatTime12h, formatDateShort } from '../utils/dateUtils';
import { useTranslation } from '../i18n';
import type { PanchangData } from '../engine/types';

interface DualDayCardsProps {
  selectedData: PanchangData | null;
}

export function DualDayCards({ selectedData }: DualDayCardsProps) {
  const { t, tVal } = useTranslation();

  if (!selectedData) {
    return (
      <GlassCard style={styles.loadingCard}>
        <Text style={styles.loadingText}>{t('ui.computing')}</Text>
      </GlassCard>
    );
  }

  const { date, tithi, nakshatra, sunrise, sunset, hinduMonth, varaName } = selectedData;
  
  // Determine label (Today, Tomorrow, or Selected)
  const todayStr = new Date().toDateString();
  const targetStr = new Date(date).toDateString();
  let label = t('ui.selected').toUpperCase();
  if (todayStr === targetStr) {
    label = t('ui.today').toUpperCase();
  } else {
    const tomorrow = new Date();
    tomorrow.setDate(tomorrow.getDate() + 1);
    if (tomorrow.toDateString() === targetStr) {
      label = t('ui.tomorrow').toUpperCase();
    }
  }

  const samvatYear = hinduMonth?.samvat ?? 2082;
  const monthName = hinduMonth?.name ?? '';

  return (
    <GlassCard style={styles.container}>
      <View style={styles.row}>
        {/* Column 1: Date Info */}
        <View style={styles.columnLeft}>
          <Text style={styles.label}>{label}</Text>
          <Text style={styles.dateText}>{formatDateShort(date)}</Text>
          <Text style={styles.dayText}>{tVal(varaName)}</Text>
        </View>

        {/* Vertical Divider */}
        <View style={styles.divider} />

        {/* Column 2: Samvat & Panchang */}
        <View style={styles.columnMiddle}>
          <Text style={styles.samvatText}>{t('ui.samvat')} - {samvatYear}</Text>
          <Text style={styles.monthText} numberOfLines={1}>
            {tVal(monthName)} {tVal(tithi.paksha === 'shukla' ? 'Shukla' : 'Krishna')}
          </Text>
          <Text style={styles.tithiText} numberOfLines={1}>
            {tVal(tithi.name)}
          </Text>
          <Text style={styles.nakshatraText} numberOfLines={1}>
            ⭐ {tVal(nakshatra.name)}
          </Text>
        </View>

        {/* Vertical Divider */}
        <View style={styles.divider} />

        {/* Column 3: Sun Times */}
        <View style={styles.columnRight}>
          <View style={styles.sunRow}>
            <Text style={styles.sunIcon}>🌅</Text>
            <View>
              <Text style={styles.sunLabel}>{t('ui.sunrise')}</Text>
              <Text style={styles.sunTime}>{formatTime12h(sunrise)}</Text>
            </View>
          </View>
          <View style={styles.sunRow}>
            <Text style={styles.sunIcon}>🌇</Text>
            <View>
              <Text style={styles.sunLabel}>{t('ui.sunset')}</Text>
              <Text style={styles.sunTime}>{formatTime12h(sunset)}</Text>
            </View>
          </View>
        </View>
      </View>
    </GlassCard>
  );
}

const styles = StyleSheet.create({
  container: {
    marginHorizontal: Spacing.lg,
    marginTop: Spacing.sm,
    marginBottom: Spacing.md,
    paddingVertical: Spacing.lg,
    paddingHorizontal: Spacing.lg,
    minHeight: 110,
  },
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  columnLeft: {
    flex: 2.8,
    alignItems: 'center',
    justifyContent: 'center',
  },
  columnMiddle: {
    flex: 4.4,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 4,
  },
  columnRight: {
    flex: 2.8,
    alignItems: 'flex-start',
    justifyContent: 'center',
    paddingLeft: 6,
  },
  divider: {
    width: StyleSheet.hairlineWidth,
    height: 70,
    backgroundColor: 'rgba(255,255,255,0.08)',
  },
  label: {
    color: Colors.accent.saffron,
    fontSize: 10,
    fontWeight: '800',
    letterSpacing: 1,
    marginBottom: 2,
  },
  dateText: {
    color: Colors.text.primary,
    fontSize: 20,
    fontWeight: '800',
  },
  dayText: {
    color: Colors.text.secondary,
    fontSize: 11,
    fontWeight: '500',
    marginTop: 2,
  },
  samvatText: {
    color: Colors.accent.gold,
    fontSize: 12,
    fontWeight: '800',
    letterSpacing: 0.5,
    marginBottom: 3,
  },
  monthText: {
    color: Colors.text.secondary,
    fontSize: 12,
    fontWeight: '600',
    marginBottom: 1,
  },
  tithiText: {
    color: Colors.text.primary,
    fontSize: 14,
    fontWeight: '700',
    marginBottom: 2,
  },
  nakshatraText: {
    color: Colors.text.tertiary,
    fontSize: 10,
    fontWeight: '500',
  },
  sunRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginVertical: 5,
  },
  sunIcon: {
    fontSize: 20,
    marginRight: 8,
  },
  sunLabel: {
    color: Colors.text.tertiary,
    fontSize: 10,
    fontWeight: '700',
    textTransform: 'uppercase',
  },
  sunTime: {
    color: Colors.text.primary,
    fontSize: 13,
    fontWeight: '800',
  },
  loadingCard: {
    marginHorizontal: Spacing.lg,
    height: 110,
    justifyContent: 'center',
    alignItems: 'center',
  },
  loadingText: {
    color: Colors.text.tertiary,
    fontSize: 14,
  },
});

import React, { useState } from 'react';
import { StyleSheet, View, Text } from 'react-native';
import { GlassCard } from './GlassCard';
import { PanchangInfoRow } from './PanchangInfoRow';
import { GlossaryBottomSheet } from './GlossaryBottomSheet';
import { Colors, Typography, Spacing, BorderRadius } from '../constants/theme';
import { formatTime12h, formatTimeRange } from '../utils/dateUtils';
import { formatElapsed } from '../utils/formatUtils';
import { useTranslation } from '../i18n';
import type { PanchangData } from '../engine/types';

interface PanchangDetailCardProps {
  data: PanchangData;
}

export function PanchangDetailCard({ data }: PanchangDetailCardProps) {
  const [glossaryVisible, setGlossaryVisible] = useState(false);
  const [selectedTerm, setSelectedTerm] = useState<string | null>(null);
  const [termValue, setTermValue] = useState<string>('');
  const { t, tVal } = useTranslation();

  const handleTermPress = (termKey: string, currentValue: string) => {
    setSelectedTerm(termKey);
    setTermValue(currentValue);
    setGlossaryVisible(true);
  };

  return (
    <View style={styles.outerContainer}>
      {/* 1. Day Information Section */}
      <Text style={styles.sectionHeading}>📅 {t('ui.dayInfo')}</Text>
      <GlassCard style={styles.sectionCard}>
        <PanchangInfoRow
          icon="📅"
          label={t('ui.vara')}
          value={tVal(data.varaName)}
          onPressLabel={() => handleTermPress('vara', tVal(data.varaName))}
        />
        <PanchangInfoRow
          icon="🌅"
          label={t('ui.sunrise')}
          value={formatTime12h(data.sunrise)}
        />
        <PanchangInfoRow
          icon="🌇"
          label={t('ui.sunset')}
          value={formatTime12h(data.sunset)}
        />
      </GlassCard>

      {/* 2. Lunar Information Section */}
      <Text style={styles.sectionHeading}>🌙 {t('ui.lunarInfo')}</Text>
      <GlassCard style={styles.sectionCard}>
        <PanchangInfoRow
          icon="🌙"
          label={t('ui.tithi')}
          value={tVal(data.tithi.name)}
          secondary={formatElapsed(data.tithi.elapsed)}
          progress={data.tithi.elapsed}
          progressColor={Colors.accent.saffron}
          onPressLabel={() => handleTermPress('tithi', tVal(data.tithi.name))}
        />
        <PanchangInfoRow
          icon="⭐"
          label={t('ui.nakshatra')}
          value={tVal(data.nakshatra.name)}
          secondary={formatElapsed(data.nakshatra.elapsed)}
          progress={data.nakshatra.elapsed}
          progressColor={Colors.accent.teal}
          onPressLabel={() => handleTermPress('nakshatra', tVal(data.nakshatra.name))}
        />
        <PanchangInfoRow
          icon="☯️"
          label={t('ui.yoga')}
          value={tVal(data.yoga.name)}
          secondary={formatElapsed(data.yoga.elapsed)}
          progress={data.yoga.elapsed}
          progressColor={Colors.accent.violet}
          onPressLabel={() => handleTermPress('yoga', tVal(data.yoga.name))}
        />
        <PanchangInfoRow
          icon="◐"
          label={t('ui.karana')}
          value={tVal(data.karana.name)}
          secondary={formatElapsed(data.karana.elapsed)}
          progress={data.karana.elapsed}
          progressColor={Colors.accent.emerald}
          onPressLabel={() => handleTermPress('karana', tVal(data.karana.name))}
        />
      </GlassCard>

      {/* 3. Important Timings Section */}
      <Text style={styles.sectionHeading}>⏱️ {t('ui.importantTimings')}</Text>
      <GlassCard style={styles.sectionCard}>
        <PanchangInfoRow
          icon="⚠️"
          label={t('ui.rahuKaal')}
          value={formatTimeRange(data.rahuKaal.start, data.rahuKaal.end)}
          progressColor={Colors.accent.rose}
          onPressLabel={() =>
            handleTermPress('rahuKaal', formatTimeRange(data.rahuKaal.start, data.rahuKaal.end))
          }
        />
        <PanchangInfoRow
          icon="☀️"
          label={t('ui.abhijit')}
          value={formatTimeRange(data.abhijitMuhurat.start, data.abhijitMuhurat.end)}
          progressColor={Colors.accent.gold}
          onPressLabel={() =>
            handleTermPress(
              'abhijit',
              formatTimeRange(data.abhijitMuhurat.start, data.abhijitMuhurat.end)
            )
          }
        />
      </GlassCard>



      {/* Glossary Help Bottom Sheet */}
      <GlossaryBottomSheet
        visible={glossaryVisible}
        termKey={selectedTerm}
        currentValue={termValue}
        onClose={() => setGlossaryVisible(false)}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  outerContainer: {
    marginHorizontal: Spacing.lg,
    marginTop: Spacing.md,
  },
  sectionHeading: {
    color: Colors.text.secondary,
    fontSize: Typography.size.sm,
    fontWeight: Typography.weight.bold,
    letterSpacing: 0.8,
    textTransform: 'uppercase',
    marginTop: Spacing.lg,
    marginBottom: Spacing.xs,
    paddingLeft: 4,
  },
  sectionCard: {
    paddingVertical: Spacing.lg,
    paddingHorizontal: Spacing.lg,
    borderRadius: BorderRadius.lg,
    marginBottom: Spacing.sm,
  },
});

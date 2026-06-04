import React, { useEffect, useState } from 'react';
import { StyleSheet, View, Text, Pressable } from 'react-native';
import { GlassCard } from './GlassCard';
import { Colors, Typography, Spacing, BorderRadius } from '../constants/theme';
import { formatDateLong, formatTime12h, formatTimeRange } from '../utils/dateUtils';
import { useTranslation } from '../i18n';
import type { PanchangData } from '../engine/types';

interface TodaySummaryCardProps {
  data: PanchangData;
}

export function TodaySummaryCard({ data }: TodaySummaryCardProps) {
  const { t, tVal } = useTranslation();

  const [timeState, setTimeState] = useState({
    isDay: true,
    fraction: 0.5, // 0.0 to 1.0
  });

  const [showCurrentTime, setShowCurrentTime] = useState(false);
  const [currentTimeStr, setCurrentTimeStr] = useState('');

  // Live time ticker for interactive clock view
  useEffect(() => {
    const updateClock = () => {
      const now = new Date();
      setCurrentTimeStr(formatTime12h(now).replace(' ', ''));
    };
    updateClock();
    const clockInterval = setInterval(updateClock, 1000);
    return () => clearInterval(clockInterval);
  }, []);

  useEffect(() => {
    const calcPositions = () => {
      const now = new Date();
      // Map current local time onto the selected day's date
      const targetTime = new Date(
        data.date.getFullYear(),
        data.date.getMonth(),
        data.date.getDate(),
        now.getHours(),
        now.getMinutes(),
        now.getSeconds()
      ).getTime();

      const sunrise = new Date(data.sunrise).getTime();
      const sunset = new Date(data.sunset).getTime();

      if (targetTime >= sunrise && targetTime <= sunset) {
        const total = sunset - sunrise;
        const elapsed = targetTime - sunrise;
        setTimeState({
          isDay: true,
          fraction: elapsed / total,
        });
      } else {
        // Night
        let startNight = sunset;
        let endNight = sunrise + 24 * 60 * 60 * 1000;

        if (targetTime < sunrise) {
          // Pre-sunrise (early morning), night started the previous day
          startNight = sunset - 24 * 60 * 60 * 1000;
          endNight = sunrise;
        }

        const total = endNight - startNight;
        const elapsed = targetTime - startNight;
        setTimeState({
          isDay: false,
          fraction: Math.min(1, Math.max(0, elapsed / total)),
        });
      }
    };

    calcPositions();
    const interval = setInterval(calcPositions, 30000); // Update every 30 seconds
    return () => clearInterval(interval);
  }, [data]);

  // Semicircle dimensions: Sized down to Radius R = 32
  const R = 32;
  const angle = timeState.fraction * Math.PI; // 0 to PI

  // Center coordinates (cx, cy) inside a 80px width container
  const cx = 40;
  const cy = 40;

  // Polar equations mapping progress to x and y coordinates
  const x = cx - R * Math.cos(angle);
  const y = cy - R * Math.sin(angle);

  const icon = timeState.isDay ? '☀️' : '🌙';
  const activeGlowColor = timeState.isDay ? Colors.accent.saffron : '#7A9BBB';

  // Find major fasts/festivals
  const activeFasts = data.festivals.filter(
    (f) => f.category === 'fast' || f.category === 'swaminarayan' || f.importance === 'critical'
  );
  
  const hasFast = activeFasts.length > 0;
  
  // Format the Hindu Month and Paksha nicely
  const monthName = data.hinduMonth ? tVal(data.hinduMonth.name) : 'N/A';
  const pakshaName = data.tithi.paksha === 'shukla' 
    ? `${tVal('Shukla')} ${t('ui.paksha')}` 
    : `${tVal('Krishna')} ${t('ui.paksha')}`;
  const yearName = data.hinduMonth?.samvat ? `${t('ui.samvat')} ${data.hinduMonth.samvat}` : '';

  const handleToggleTime = () => {
    setShowCurrentTime(prev => !prev);
  };

  return (
    <GlassCard style={styles.card} variant={hasFast ? 'festival' : 'today'} glow={hasFast}>
      {/* Date & Day Header */}
      <View style={styles.header}>
        <Text style={styles.dateText}>{formatDateLong(data.date)}</Text>
        <Text style={styles.varaText}>{tVal(data.varaName)}</Text>
      </View>

      <View style={styles.divider} />

      {/* Grid Content: 3-column row */}
      <View style={styles.grid}>
        {/* Left Column: Hindu Month & Phase */}
        <View style={styles.leftColumn}>
          <Text style={styles.label}>{t('ui.monthAndYear')}</Text>
          <Text style={styles.valueText} numberOfLines={2} adjustsFontSizeToFit minimumFontScale={0.7}>{monthName} {yearName}</Text>
          <Text style={styles.subValueText} numberOfLines={1} adjustsFontSizeToFit minimumFontScale={0.7}>{pakshaName}</Text>
        </View>

        {/* Center Column: Small Celestial Dial */}
        <View style={styles.centerColumn}>
          {/* Dial Container - Clipped to exactly 40px height to hide bottom half */}
          <View style={styles.arcContainer}>
            {/* Background stars for night state */}
            {!timeState.isDay && (
              <>
                <Text style={[styles.bgStar, { left: 10, top: 8 }]}>✨</Text>
                <Text style={[styles.bgStar, { right: 10, top: 8, fontSize: 6 }]}>⭐</Text>
              </>
            )}

            {/* Inner Concentric Celestial Arc (Astrolabe Layer) */}
            <View style={styles.innerArcLine} />

            {/* Outer Celestial Arc */}
            <View
              style={[
                styles.arcLine,
                {
                  borderColor: timeState.isDay
                    ? 'rgba(255, 142, 60, 0.22)'
                    : 'rgba(165, 180, 252, 0.18)',
                },
              ]}
            />

            {/* Astronomical Dial Milestones / Ticks (25%, 50%, 75%) */}
            <View style={[styles.tickDot, { left: 17.4 - 2, top: 17.4 - 5 }]}>
              <Text style={styles.tickText}>•</Text>
            </View>
            <View style={[styles.tickDot, { left: 40 - 2, top: 8 - 5 }]}>
              <Text style={styles.tickText}>•</Text>
            </View>
            <View style={[styles.tickDot, { left: 62.6 - 2, top: 17.4 - 5 }]}>
              <Text style={styles.tickText}>•</Text>
            </View>

            {/* Sun/Moon Moving Icon (Pressable to toggle time) */}
            <Pressable
              onPress={handleToggleTime}
              style={[
                styles.iconContainer,
                {
                  left: x - 9, // Center the 18px circle
                  top: y - 9,
                  shadowColor: activeGlowColor,
                  borderColor: timeState.isDay
                    ? 'rgba(255, 142, 60, 0.4)'
                    : 'rgba(165, 180, 252, 0.3)',
                },
              ]}
            >
              <Text style={styles.timeIcon}>{icon}</Text>
            </Pressable>

            {/* Center Time Label (Pressable to toggle time) */}
            <Pressable onPress={handleToggleTime} style={styles.centerLabelContainer}>
              <Text style={styles.centerLabel}>
                {showCurrentTime ? t('ui.today') : (timeState.isDay ? t('ui.day') : t('ui.night'))}
              </Text>
              <Text style={styles.centerTimeText}>
                {showCurrentTime ? currentTimeStr : `${Math.round(timeState.fraction * 100)}%`}
              </Text>
            </Pressable>
          </View>

          {/* Time endpoints positioned outside the clipped container to prevent overlaps/clipping */}
          <View style={styles.arcOuterLabelRow}>
            <Text style={styles.arcTimeLabel}>{formatTime12h(data.sunrise).replace(' ', '')}</Text>
            <Text style={styles.arcTimeLabel}>{formatTime12h(data.sunset).replace(' ', '')}</Text>
          </View>
        </View>

        {/* Right Column: Active Tithi */}
        <View style={styles.rightColumn}>
          <Text style={[styles.label, { textAlign: 'right' }]}>{t('ui.activeTithi')}</Text>
          <Text style={[styles.tithiText, { textAlign: 'right' }]} numberOfLines={2} adjustsFontSizeToFit minimumFontScale={0.7}>{tVal(data.tithi.name)}</Text>
          <Text style={[styles.subValueText, { textAlign: 'right' }]} numberOfLines={1} adjustsFontSizeToFit minimumFontScale={0.7}>{Math.round(data.tithi.elapsed * 100)}% {t('ui.elapsed')}</Text>
        </View>
      </View>

      <View style={styles.divider} />

      {/* Rahu Kaal Warning Banner */}
      <View style={styles.rahuBanner}>
        <Text style={styles.rahuIcon}>⚠️</Text>
        <Text style={styles.rahuText}>
          {t('ui.rahuKaal')}: {formatTimeRange(data.rahuKaal.start, data.rahuKaal.end)}
        </Text>
      </View>

      {/* Fast / Festival Banner */}
      {hasFast && (
        <View style={styles.fastBanner}>
          <Text style={styles.fastIcon}>🕉️</Text>
          <Text style={styles.fastText} numberOfLines={2}>
            {activeFasts.map((f) => tVal(f.name)).join(', ')}
          </Text>
        </View>
      )}
    </GlassCard>
  );
}

const styles = StyleSheet.create({
  card: {
    marginHorizontal: Spacing.lg,
    marginTop: Spacing.md,
    marginBottom: Spacing.md,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingBottom: Spacing.sm,
  },
  dateText: {
    color: Colors.text.primary,
    fontSize: Typography.size.lg,
    fontWeight: Typography.weight.bold,
  },
  varaText: {
    color: Colors.accent.saffron,
    fontSize: Typography.size.md,
    fontWeight: Typography.weight.semiBold,
  },
  divider: {
    height: 1,
    backgroundColor: 'rgba(255, 255, 255, 0.08)',
    marginVertical: Spacing.sm,
  },
  grid: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: Spacing.sm,
  },
  leftColumn: {
    flex: 1.2,
    alignItems: 'flex-start',
  },
  centerColumn: {
    width: 90,
    alignItems: 'center',
    justifyContent: 'center',
  },
  rightColumn: {
    flex: 1.2,
    alignItems: 'flex-end',
  },
  label: {
    color: Colors.text.tertiary,
    fontSize: Typography.size.xs,
    textTransform: 'uppercase',
    letterSpacing: 0.5,
    marginBottom: 4,
  },
  valueText: {
    color: Colors.text.primary,
    fontSize: Typography.size.md,
    fontWeight: Typography.weight.semiBold,
  },
  tithiText: {
    color: Colors.accent.gold,
    fontSize: Typography.size.md,
    fontWeight: Typography.weight.bold,
  },
  subValueText: {
    color: Colors.text.secondary,
    fontSize: Typography.size.sm,
    marginTop: 2,
  },
  arcContainer: {
    width: 80,
    height: 40, // Perfectly clipped at the center height (cy=40)
    position: 'relative',
    overflow: 'hidden',
  },
  arcLine: {
    position: 'absolute',
    width: 64,
    height: 64,
    borderRadius: 32,
    borderWidth: 1.2,
    borderStyle: 'dashed',
    left: 8,
    top: 8,
  },
  innerArcLine: {
    position: 'absolute',
    width: 44,
    height: 44,
    borderRadius: 22,
    borderWidth: 0.8,
    borderStyle: 'dashed',
    borderColor: 'rgba(255, 255, 255, 0.08)',
    left: 18,
    top: 18,
  },
  arcOuterLabelRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    width: 90, // Positioned slightly wider to align under endpoints
    marginTop: 3,
  },
  arcTimeLabel: {
    color: Colors.text.tertiary,
    fontSize: 8,
    fontWeight: Typography.weight.bold,
  },
  iconContainer: {
    position: 'absolute',
    width: 18,
    height: 18,
    borderRadius: 9,
    backgroundColor: '#102030',
    justifyContent: 'center',
    alignItems: 'center',
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 0.8,
    shadowRadius: 4,
    elevation: 3,
    borderWidth: 1,
  },
  timeIcon: {
    fontSize: 10,
  },
  centerLabelContainer: {
    position: 'absolute',
    left: 0,
    right: 0,
    bottom: 1,
    alignItems: 'center',
  },
  centerLabel: {
    color: Colors.text.tertiary,
    fontSize: 7,
    textTransform: 'uppercase',
    letterSpacing: 0.5,
  },
  centerTimeText: {
    color: Colors.text.primary,
    fontSize: 9,
    fontWeight: Typography.weight.bold,
    marginTop: 0,
  },
  bgStar: {
    position: 'absolute',
    fontSize: 8,
    opacity: 0.35,
    color: '#FFF',
  },
  tickDot: {
    position: 'absolute',
    width: 4,
    height: 10,
    justifyContent: 'center',
    alignItems: 'center',
  },
  tickText: {
    color: 'rgba(255, 255, 255, 0.25)',
    fontSize: 7,
    fontWeight: 'bold',
  },
  rahuBanner: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: 'rgba(255, 75, 75, 0.08)',
    borderRadius: BorderRadius.md,
    paddingVertical: 6,
    paddingHorizontal: Spacing.md,
    alignSelf: 'center',
    marginTop: Spacing.xs,
    marginBottom: Spacing.xs,
    borderWidth: 1,
    borderColor: 'rgba(255, 75, 75, 0.15)',
  },
  rahuIcon: {
    fontSize: 12,
    marginRight: 6,
  },
  rahuText: {
    color: '#D97080',
    fontSize: Typography.size.xs,
    fontWeight: Typography.weight.bold,
  },
  fastBanner: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(255, 142, 60, 0.12)',
    borderRadius: BorderRadius.md,
    paddingVertical: Spacing.sm,
    paddingHorizontal: Spacing.md,
    marginVertical: Spacing.xs,
    borderWidth: 1,
    borderColor: 'rgba(255, 142, 60, 0.25)',
  },
  fastIcon: {
    fontSize: Typography.size.md,
    marginRight: Spacing.sm,
  },
  fastText: {
    color: Colors.accent.saffron,
    fontSize: Typography.size.sm,
    fontWeight: Typography.weight.bold,
    flex: 1,
  },
});

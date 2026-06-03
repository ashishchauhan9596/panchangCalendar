/**
 * MonthGrid — Calendar Month Grid
 *
 * Displays a full month calendar grid with weekday headers,
 * day cells, festival dots, and month navigation.
 */

import React, { useMemo } from 'react';
import { StyleSheet, View, Text, Pressable, PanResponder, Vibration } from 'react-native';
import { DayCell, EmptyCell } from './DayCell';
import { Colors, Typography, Spacing } from '../constants/theme';
import { getDaysInMonth, getFirstWeekdayOfMonth, isSameDay, isToday as checkIsToday } from '../utils/dateUtils';
import type { FestivalInfo, TithiInfo } from '../engine/types';

import { useTranslation } from '../i18n';

interface MonthGridProps {
  /** Year to display */
  year: number;
  /** Month to display (0-11) */
  month: number;
  /** Currently selected date */
  selectedDate: Date;
  /** Panchang data for each day of the month */
  daysData?: Record<number, { tithi: TithiInfo; festivals: FestivalInfo[] }>;
  /** Called when a day is pressed */
  onDayPress: (date: Date) => void;
  /** Called when a day is long-pressed */
  onDayLongPress?: (date: Date) => void;
  /** Called when navigating to previous month */
  onPrevMonth: () => void;
  /** Called when navigating to next month */
  onNextMonth: () => void;
  /** Called when the month/year header is tapped (Time Machine) */
  onMonthYearPress?: () => void;
}

export function MonthGrid({
  year,
  month,
  selectedDate,
  daysData = {},
  onDayPress,
  onDayLongPress,
  onPrevMonth,
  onNextMonth,
  onMonthYearPress,
}: MonthGridProps) {
  const { language } = useTranslation();

  const monthNames = useMemo(() => {
    return language === 'hi'
      ? ['जनवरी', 'फरवरी', 'मार्च', 'अप्रैल', 'मई', 'जून', 'जुलाई', 'अगस्त', 'सितम्बर', 'अक्टूबर', 'नवम्बर', 'दिसम्बर']
      : ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'];
  }, [language]);

  const weekdayHeaders = useMemo(() => {
    return language === 'hi'
      ? ['र', 'सो', 'मं', 'बु', 'गु', 'शु', 'श']
      : ['S', 'M', 'T', 'W', 'T', 'F', 'S'];
  }, [language]);

  // Swipe pan responder detection
  const panResponder = React.useRef(
    PanResponder.create({
      onStartShouldSetPanResponder: () => false,
      onMoveShouldSetPanResponder: (_, gestureState) => {
        // Detect horizontal swipe: significant dx and very low dy (to avoid hijacking scroll views)
        return Math.abs(gestureState.dx) > 35 && Math.abs(gestureState.dy) < 25;
      },
      onPanResponderRelease: (_, gestureState) => {
        if (gestureState.dx > 45) {
          Vibration.vibrate(15);
          onPrevMonth();
        } else if (gestureState.dx < -45) {
          Vibration.vibrate(15);
          onNextMonth();
        }
      },
    })
  ).current;
  const { daysInMonth, firstWeekday, weeks } = useMemo(() => {
    const totalDays = getDaysInMonth(year, month);
    const startDay = getFirstWeekdayOfMonth(year, month);

    // Build week rows
    const rows: (number | null)[][] = [];
    let currentRow: (number | null)[] = [];

    // Leading empty cells
    for (let i = 0; i < startDay; i++) {
      currentRow.push(null);
    }

    // Day cells
    for (let day = 1; day <= totalDays; day++) {
      currentRow.push(day);
      if (currentRow.length === 7) {
        rows.push(currentRow);
        currentRow = [];
      }
    }

    // Trailing empty cells
    if (currentRow.length > 0) {
      while (currentRow.length < 7) {
        currentRow.push(null);
      }
      rows.push(currentRow);
    }

    return { daysInMonth: totalDays, firstWeekday: startDay, weeks: rows };
  }, [year, month]);

  const handlePrev = () => {
    Vibration.vibrate(15);
    onPrevMonth();
  };

  const handleNext = () => {
    Vibration.vibrate(15);
    onNextMonth();
  };

  return (
    <View style={styles.container} {...panResponder.panHandlers}>
      {/* Month/Year Header with Navigation */}
      <View style={styles.header}>
        <Pressable
          onPress={handlePrev}
          style={({ pressed }) => [styles.navButton, pressed && styles.navButtonPressed]}
        >
          <Text style={styles.navArrow}>‹</Text>
        </Pressable>
        <Pressable
          onPress={onMonthYearPress}
          style={({ pressed }) => [styles.monthYearButton, pressed && styles.monthYearPressed]}
        >
          <Text style={styles.monthYear}>
            {monthNames[month]} {year}
          </Text>
          <Text style={styles.timeMachineHint}>🕰️</Text>
        </Pressable>
        <Pressable
          onPress={handleNext}
          style={({ pressed }) => [styles.navButton, pressed && styles.navButtonPressed]}
        >
          <Text style={styles.navArrow}>›</Text>
        </Pressable>
      </View>

      {/* Weekday Headers */}
      <View style={styles.weekdayRow}>
        {weekdayHeaders.map((day, i) => (
          <View key={i} style={styles.weekdayCell}>
            <Text
              style={[
                styles.weekdayText,
                i === 0 && styles.sundayText,
                i === 6 && styles.saturdayText,
              ]}
            >
              {day}
            </Text>
          </View>
        ))}
      </View>

      {/* Day Grid */}
      {weeks.map((week, weekIndex) => (
        <View key={weekIndex} style={styles.weekRow}>
          {week.map((day, dayIndex) => {
            if (day === null) {
              return <EmptyCell key={`empty-${dayIndex}`} />;
            }
            const date = new Date(Date.UTC(year, month, day, 6, 0, 0));
            const dayData = daysData[day];
            return (
              <DayCell
                key={day}
                day={day}
                isToday={checkIsToday(date)}
                isSelected={isSameDay(date, selectedDate)}
                isCurrentMonth={true}
                tithi={dayData?.tithi}
                festivals={dayData?.festivals || []}
                onPress={() => onDayPress(date)}
                onLongPress={() => onDayLongPress?.(date)}
              />
            );
          })}
        </View>
      ))}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    paddingHorizontal: Spacing.lg,
  },

  // ── Header ──
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: Spacing.md,
    paddingHorizontal: 4,
  },
  navButton: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: 'rgba(255, 255, 255, 0.08)',
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.10)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  navButtonPressed: {
    backgroundColor: 'rgba(255, 255, 255, 0.15)',
    transform: [{ scale: 0.92 }],
  },
  navArrow: {
    color: Colors.text.secondary,
    fontSize: 22,
    fontWeight: Typography.weight.bold,
    lineHeight: 24,
    marginTop: -1,
  },
  monthYearButton: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: Spacing.md,
    paddingVertical: 6,
    borderRadius: 10,
  },
  monthYearPressed: {
    backgroundColor: 'rgba(255, 255, 255, 0.07)',
    transform: [{ scale: 0.97 }],
  },
  monthYear: {
    color: Colors.text.primary,
    fontSize: Typography.size.xl,
    fontWeight: Typography.weight.bold,
    letterSpacing: 0.3,
  },
  timeMachineHint: {
    fontSize: 12,
    marginLeft: 6,
    opacity: 0.55,
  },

  // ── Weekday header row ──
  weekdayRow: {
    flexDirection: 'row',
    borderBottomWidth: 1,
    borderBottomColor: 'rgba(255, 255, 255, 0.07)',
    paddingBottom: 8,
    marginBottom: 4,
  },
  weekdayCell: {
    flex: 1,
    alignItems: 'center',
  },
  weekdayText: {
    color: Colors.text.tertiary,
    fontSize: 11,
    fontWeight: Typography.weight.bold,
    letterSpacing: 0.5,
    textTransform: 'uppercase',
  },
  sundayText: {
    color: '#D97080',
  },
  saturdayText: {
    color: '#7BBBD0',
  },

  // ── Week row ──
  weekRow: {
    flexDirection: 'row',
  },
});

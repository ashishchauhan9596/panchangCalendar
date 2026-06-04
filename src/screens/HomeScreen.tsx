/**
 * HomeScreen — Main Dashboard (Restored Classic Layout)
 *
 * Displays:
 * 1. Time-reactive LinearGradient backgrounds
 * 2. Today's Summary Card & Dual-day cards
 * 3. Monthly calendar grid directly visible on screen with week/festival haptics
 * 4. Detailed Panchang details (statically scrollable at bottom)
 */

import React, { useEffect, useState, useCallback, useMemo } from 'react';
import {
  StyleSheet,
  View,
  Text,
  ScrollView,
  StatusBar,
  Pressable,
  ActivityIndicator,
  Modal,
  Image,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { LinearGradient } from 'expo-linear-gradient';

import { TodaySummaryCard } from '../components/TodaySummaryCard';
import { DualDayCards } from '../components/DualDayCards';
import { MonthGrid } from '../components/MonthGrid';
import { PanchangDetailCard } from '../components/PanchangDetailCard';
import { YearPicker } from '../components/YearPicker';
import { CityPickerModal } from '../components/CityPickerModal';
import { GlassCard } from '../components/GlassCard';
import { FestivalChip } from '../components/FestivalChip';

import { Colors, Typography, Spacing, BorderRadius } from '../constants/theme';
import { usePanchangStore } from '../stores/panchangStore';
import { useCalendarStore } from '../stores/calendarStore';
import { useSettingsStore } from '../stores/settingsStore';
import { formatDateLong, formatTime12h, getTomorrow } from '../utils/dateUtils';
import { computePanchang } from '../engine/astronomicalEngine';
import { useTranslation } from '../i18n';

/**
 * Calculates time-reactive mesh background colors based on local time and Panchang state.
 */
function getAmbientTheme(
  date: Date,
  sunrise: Date,
  sunset: Date,
  rahuStart: Date,
  rahuEnd: Date
): { colors: readonly [string, string, string]; isRahu: boolean } {
  const now = new Date().getTime();
  const rahuStartMs = new Date(rahuStart).getTime();
  const rahuEndMs = new Date(rahuEnd).getTime();

  // A. Check if currently inside Rahu Kaal
  if (now >= rahuStartMs && now <= rahuEndMs) {
    return {
      colors: ['#070D12', '#0A1318', '#050A0E'] as const, // very dark — Rahu warning
      isRahu: true,
    };
  }

  const sunriseMs = new Date(sunrise).getTime();
  const sunsetMs = new Date(sunset).getTime();

  // B. Check if currently inside Brahma Muhurta (96 minutes before Sunrise)
  const brahmaStartMs = sunriseMs - 96 * 60 * 1000;
  if (now >= brahmaStartMs && now < sunriseMs) {
    return {
      colors: ['#0F1C2A', '#192F3F', '#C8855A'] as const, // pre-dawn — warm amber glow
      isRahu: false,
    };
  }

  // C. Day vs Night
  if (now >= sunriseMs && now < sunsetMs) {
    return {
      colors: ['#162434', '#1C3040', '#213848'] as const, // day — clear navy
      isRahu: false,
    };
  } else {
    return {
      colors: ['#0A1520', '#0E1C28', '#112030'] as const, // night — deep navy
      isRahu: false,
    };
  }
}

export function HomeScreen() {
  const {
    today,
    tomorrow,
    selectedDayData,
    loading,
    setToday,
    setTomorrow,
    setSelectedDayData,
    setLoading,
  } = usePanchangStore();

  const {
    viewYear,
    viewMonth,
    selectedDate,
    nextMonth,
    prevMonth,
    setSelectedDate,
  } = useCalendarStore();

  const { city, calendarSystem, language, setLanguage } = useSettingsStore();
  const { t, tVal } = useTranslation();

  // Dialog / Modal Visibility States
  const [yearPickerVisible, setYearPickerVisible] = useState(false);
  const [cityPickerVisible, setCityPickerVisible] = useState(false);

  // Quick Preview Modal on DayCell Long Press
  const [previewVisible, setPreviewVisible] = useState(false);
  const [previewData, setPreviewData] = useState<any>(null);

  const handleDayLongPress = useCallback(
    (date: Date) => {
      try {
        const data = computePanchang(date, city.lat, city.lng, calendarSystem);
        setPreviewData(data);
        setPreviewVisible(true);
      } catch (err) {
        console.error('Failed to compute preview:', err);
      }
    },
    [city, calendarSystem]
  );

  // Compute Panchang data for entire month to display dots on calendar grid
  const monthlyPanchangData = useMemo(() => {
    const result: Record<number, { tithi: any; festivals: any[] }> = {};
    const totalDays = new Date(viewYear, viewMonth + 1, 0).getDate();
    for (let day = 1; day <= totalDays; day++) {
      const date = new Date(Date.UTC(viewYear, viewMonth, day, 6, 0, 0));
      try {
        const panchang = computePanchang(date, city.lat, city.lng, calendarSystem);
        result[day] = {
          tithi: panchang.tithi,
          festivals: panchang.festivals,
        };
      } catch (err) {
        // ignore
      }
    }
    return result;
  }, [viewYear, viewMonth, city, calendarSystem]);

  // Load calculations on mount or city shift (inlined to avoid hooks-order dependency)
  useEffect(() => {
    let cancelled = false;
    setLoading(true);
    try {
      const todayDate = new Date();
      const tomorrowDate = getTomorrow();
      const todayData = computePanchang(todayDate, city.lat, city.lng, calendarSystem);
      const tomorrowData = computePanchang(tomorrowDate, city.lat, city.lng, calendarSystem);
      if (!cancelled) {
        setToday(todayData);
        setTomorrow(tomorrowData);
        setSelectedDayData(todayData);
      }
    } catch (err) {
      console.error('Failed to compute panchang:', err);
    } finally {
      if (!cancelled) setLoading(false);
    }
    return () => { cancelled = true; };
  }, [city, calendarSystem]);

  const handleDayPress = useCallback(
    (date: Date) => {
      setSelectedDate(date);
      try {
        const data = computePanchang(date, city.lat, city.lng, calendarSystem);
        setSelectedDayData(data);
      } catch (err) {
        console.error('Failed to compute panchang for selected date:', err);
      }
    },
    [city, calendarSystem, setSelectedDate, setSelectedDayData]
  );

  // Automatically update selectedDate and selectedDayData when viewed month or year changes
  useEffect(() => {
    // Keep the same day of the month if possible, otherwise clamp to the max day of the new month
    const targetDay = selectedDate.getDate();
    const maxDays = new Date(viewYear, viewMonth + 1, 0).getDate();
    const newDay = Math.min(targetDay, maxDays);
    const newDate = new Date(Date.UTC(viewYear, viewMonth, newDay, 6, 0, 0));

    // Only update if the selectedDate is actually in a different month/year than viewMonth/viewYear
    if (selectedDate.getFullYear() !== viewYear || selectedDate.getMonth() !== viewMonth) {
      setSelectedDate(newDate);
      try {
        const data = computePanchang(newDate, city.lat, city.lng, calendarSystem);
        setSelectedDayData(data);
      } catch (err) {
        console.error('Failed to compute panchang for month change:', err);
      }
    }
  }, [viewYear, viewMonth, city, calendarSystem, selectedDate, setSelectedDate, setSelectedDayData]);

  const handleYearSelect = useCallback(
    (year: number) => {
      const { jumpTo } = useCalendarStore.getState();
      jumpTo(year, viewMonth);
    },
    [viewMonth]
  );

  // Ambient Gradient state
  const ambientTheme = useMemo(() => {
    if (!selectedDayData) {
      return { colors: ['#0A0617', '#0E0B1E', '#18122B'] as const, isRahu: false };
    }
    return getAmbientTheme(
      selectedDayData.date,
      selectedDayData.sunrise,
      selectedDayData.sunset,
      selectedDayData.rahuKaal.start,
      selectedDayData.rahuKaal.end
    );
  }, [selectedDayData]);

  return (
    <LinearGradient colors={ambientTheme.colors} style={styles.gradientContainer}>
      <SafeAreaView style={styles.safeArea} edges={['top', 'left', 'right']}>
        <StatusBar barStyle="light-content" translucent backgroundColor="transparent" />

        {/* Sticky Header Section */}
        <View style={styles.header}>
          <View>
            <View style={{ flexDirection: 'row', alignItems: 'center' }}>
              <Image
                source={require('../../assets/logo.png')}
                style={{ width: 44, height: 44, borderRadius: 22, marginRight: 10, borderWidth: 1.5, borderColor: 'rgba(212, 168, 67, 0.4)' }}
              />
              <Text style={styles.appTitle}>{t('ui.appTitle')}</Text>
            </View>
            <Pressable style={styles.cityButton} onPress={() => setCityPickerVisible(true)}>
              <Text style={styles.cityName}>📍 {city.name}</Text>
            </Pressable>
          </View>
          <View style={styles.langContainer}>
            <Pressable
              style={[styles.langToggle, language === 'en' && styles.langActive]}
              onPress={() => setLanguage('en')}
            >
              <Text style={[styles.langText, language === 'en' && styles.langTextActive]}>EN</Text>
            </Pressable>
            <Pressable
              style={[styles.langToggle, language === 'hi' && styles.langActive]}
              onPress={() => setLanguage('hi')}
            >
              <Text style={[styles.langText, language === 'hi' && styles.langTextActive]}>HI</Text>
            </Pressable>
          </View>
        </View>

        {loading ? (
          <View style={styles.loadingContainer}>
            <ActivityIndicator size="large" color={Colors.accent.saffron} />
            <Text style={styles.loadingText}>{t('ui.computing')}</Text>
          </View>
        ) : (
          <ScrollView
            style={styles.scrollView}
            contentContainerStyle={styles.scrollContent}
            showsVerticalScrollIndicator={false}
          >
            {/* 1. Today's Summary Card */}
            {today && <TodaySummaryCard data={today} />}

            {/* 2. Today + Tomorrow Summary Column */}
            <DualDayCards selectedData={selectedDayData} />

            {/* Festivals & Fasts of Selected Day - Rendered above the calendar */}
            {selectedDayData && selectedDayData.festivals.length > 0 && (
              <View style={styles.topFestivalsContainer}>
                <Text style={styles.topFestivalsHeading}>
                  🎉 {t('ui.festivals')} & {t('ui.fasting')}
                </Text>
                <GlassCard style={styles.topFestivalsCard}>
                  <View style={styles.topFestivalsWrap}>
                    {selectedDayData.festivals.map((f: any, i: number) => (
                      <FestivalChip key={f.id || i} festival={{ ...f, name: tVal(f.name) }} />
                    ))}
                  </View>
                </GlassCard>
              </View>
            )}

            {/* 3. Inline Calendar Grid */}
            <View style={styles.calendarSection}>
              <MonthGrid
                year={viewYear}
                month={viewMonth}
                selectedDate={selectedDate}
                daysData={monthlyPanchangData}
                onDayPress={handleDayPress}
                onDayLongPress={handleDayLongPress}
                onPrevMonth={prevMonth}
                onNextMonth={nextMonth}
                onMonthYearPress={() => setYearPickerVisible(true)}
              />
            </View>

            {/* 4. Panchang Details statically rendered at bottom */}
            {selectedDayData && <PanchangDetailCard data={selectedDayData} />}
          </ScrollView>
        )}

        {/* City Picker Modal */}
        <CityPickerModal
          visible={cityPickerVisible}
          onClose={() => setCityPickerVisible(false)}
        />

        {/* Year Picker Modal */}
        <YearPicker
          visible={yearPickerVisible}
          currentYear={viewYear}
          onSelectYear={handleYearSelect}
          onClose={() => setYearPickerVisible(false)}
        />

        {/* Day Quick Preview Modal */}
        <Modal
          visible={previewVisible}
          transparent
          animationType="fade"
          statusBarTranslucent
          onRequestClose={() => setPreviewVisible(false)}
        >
          <Pressable style={styles.previewOverlay} onPress={() => setPreviewVisible(false)}>
            <View style={styles.previewCard}>
              {previewData && (
                <>
                  <Text style={styles.previewDate}>{formatDateLong(previewData.date)}</Text>
                  <View style={styles.previewDivider} />
                  <View style={styles.previewRow}>
                    <Text style={styles.previewLabel}>🌙 {t('ui.tithi')}</Text>
                    <Text style={styles.previewValue}>{tVal(previewData.tithi.name)}</Text>
                  </View>
                  <View style={styles.previewRow}>
                    <Text style={styles.previewLabel}>⭐ {t('ui.nakshatra')}</Text>
                    <Text style={styles.previewValue}>{tVal(previewData.nakshatra.name)}</Text>
                  </View>
                  <View style={styles.previewRow}>
                    <Text style={styles.previewLabel}>🌅 {t('ui.sunrise')}</Text>
                    <Text style={styles.previewValue}>{formatTime12h(previewData.sunrise)}</Text>
                  </View>
                  <View style={styles.previewRow}>
                    <Text style={styles.previewLabel}>🌇 {t('ui.sunset')}</Text>
                    <Text style={styles.previewValue}>{formatTime12h(previewData.sunset)}</Text>
                  </View>
                  {previewData.festivals.length > 0 && (
                    <View style={styles.previewFestivalRow}>
                      <Text style={styles.previewFestivalText}>
                        🎉 {previewData.festivals.map((f: any) => tVal(f.name)).join(', ')}
                      </Text>
                    </View>
                  )}
                  <Text style={styles.previewHint}>Tap anywhere to dismiss</Text>
                </>
              )}
            </View>
          </Pressable>
        </Modal>
      </SafeAreaView>
    </LinearGradient>
  );
}

const styles = StyleSheet.create({
  gradientContainer: {
    flex: 1,
  },
  safeArea: {
    flex: 1,
    backgroundColor: 'transparent',
  },
  scrollView: {
    flex: 1,
  },
  scrollContent: {
    paddingBottom: Spacing['4xl'],
    paddingTop: Spacing.xs,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    paddingHorizontal: Spacing.lg,
    paddingTop: Spacing.md,
    paddingBottom: Spacing.sm,
  },
  appTitle: {
    color: Colors.text.primary,
    fontSize: Typography.size['2xl'],
    fontWeight: Typography.weight.extraBold,
    letterSpacing: -0.5,
  },
  logoImage: {
    height: 48,
    width: 200,
    marginTop: 4,
    marginBottom: 4,
  },
  cityButton: {
    marginTop: Spacing.xs,
    paddingVertical: Spacing.xxs,
  },
  cityName: {
    color: Colors.text.secondary,
    fontSize: Typography.size.md,
  },
  langContainer: {
    flexDirection: 'row',
    backgroundColor: 'rgba(255, 255, 255, 0.08)',
    borderRadius: 20,
    padding: 3,
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.12)',
  },
  langToggle: {
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 16,
  },
  langActive: {
    backgroundColor: Colors.accent.saffron,
  },
  langText: {
    color: Colors.text.tertiary,
    fontSize: Typography.size.xs,
    fontWeight: Typography.weight.bold,
  },
  langTextActive: {
    color: '#fff',
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  loadingText: {
    color: Colors.text.tertiary,
    fontSize: Typography.size.md,
    marginTop: Spacing.md,
  },
  calendarSection: {
    marginTop: Spacing.sm,
    backgroundColor: Colors.background.solidCard,
    marginHorizontal: Spacing.lg,
    borderRadius: 18,
    borderWidth: 1,
    borderColor: Colors.background.solidCardBorder,
    paddingBottom: Spacing.md,
    overflow: 'hidden',
  },
  previewOverlay: {
    flex: 1,
    backgroundColor: 'rgba(7, 13, 18, 0.78)',
    justifyContent: 'center',
    alignItems: 'center',
    padding: Spacing.xl,
  },
  previewCard: {
    width: '90%',
    backgroundColor: '#102030',
    borderRadius: 20,
    borderWidth: 1,
    borderColor: '#26404F',
    padding: Spacing.xl,
  },
  previewDate: {
    color: Colors.text.primary,
    fontSize: Typography.size.lg,
    fontWeight: Typography.weight.bold,
    textAlign: 'center',
  },
  previewDivider: {
    height: 1,
    backgroundColor: '#26404F',
    marginVertical: Spacing.md,
  },
  previewRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 6,
    borderBottomWidth: StyleSheet.hairlineWidth,
    borderBottomColor: 'rgba(255,255,255,0.06)',
  },
  previewLabel: {
    color: Colors.text.secondary,
    fontSize: Typography.size.md,
  },
  previewValue: {
    color: Colors.text.primary,
    fontSize: Typography.size.md,
    fontWeight: Typography.weight.semiBold,
  },
  previewFestivalRow: {
    backgroundColor: 'rgba(255, 142, 60, 0.1)',
    borderRadius: 10,
    paddingVertical: 8,
    paddingHorizontal: 12,
    marginTop: Spacing.sm,
    borderWidth: 1,
    borderColor: 'rgba(255, 142, 60, 0.2)',
  },
  previewFestivalText: {
    color: Colors.accent.saffron,
    fontSize: Typography.size.sm,
    fontWeight: Typography.weight.bold,
    textAlign: 'center',
  },
  previewHint: {
    color: Colors.text.tertiary,
    fontSize: Typography.size.xs,
    textAlign: 'center',
    marginTop: Spacing.md,
    fontStyle: 'italic',
  },
  topFestivalsContainer: {
    marginHorizontal: Spacing.lg,
    marginTop: Spacing.xs,
    marginBottom: Spacing.sm,
  },
  topFestivalsHeading: {
    color: Colors.text.secondary,
    fontSize: Typography.size.sm,
    fontWeight: Typography.weight.bold,
    letterSpacing: 0.8,
    textTransform: 'uppercase',
    marginBottom: Spacing.xs,
    paddingLeft: 4,
  },
  topFestivalsCard: {
    paddingVertical: Spacing.md,
    paddingHorizontal: Spacing.md,
    borderRadius: BorderRadius.lg,
  },
  topFestivalsWrap: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: Spacing.sm,
  },
});

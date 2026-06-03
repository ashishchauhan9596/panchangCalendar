/**
 * SettingsScreen — App Settings
 *
 * User preferences: city selection, notifications,
 * theme, calendar system.
 */

import React, { useState } from 'react';
import {
  StyleSheet,
  View,
  Text,
  ScrollView,
  Switch,
  Pressable,
  Alert,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { GlassCard } from '../components/GlassCard';
import { Colors, Typography, Spacing, BorderRadius } from '../constants/theme';
import { useSettingsStore } from '../stores/settingsStore';
import { CityPickerModal } from '../components/CityPickerModal';
import {
  requestNotificationPermission,
  scheduleWeeklyNotifications,
  cancelAllNotifications,
  scheduleTestNotification,
} from '../services/notificationService';

export function SettingsScreen() {
  const {
    city,
    notificationsEnabled,
    notificationVerbosity,
    language,
    theme,
    calendarSystem,
    favoriteCities,
    setCity,
    setNotificationsEnabled,
    setNotificationVerbosity,
    setTheme,
    setLanguage,
    setCalendarSystem,
    removeFavoriteCity,
  } = useSettingsStore();

  const [cityPickerVisible, setCityPickerVisible] = useState(false);

  return (
    <SafeAreaView style={styles.safeArea}>
      <ScrollView style={styles.scrollView} showsVerticalScrollIndicator={false}>
        <Text style={styles.title}>Settings</Text>

        {/* Location */}
        <GlassCard style={styles.section}>
          <Text style={styles.sectionTitle}>Location</Text>
          <Pressable
            style={styles.settingRow}
            onPress={() => setCityPickerVisible(true)}
          >
            <View>
              <Text style={styles.settingLabel}>City</Text>
              <Text style={styles.settingValue}>
                📍 {city.name}, {city.state}
              </Text>
            </View>
            <Text style={styles.chevron}>▶</Text>
          </Pressable>
          <Text style={styles.settingHint}>
            Lat: {city.lat.toFixed(4)}° | Lng: {city.lng.toFixed(4)}°
          </Text>

          {/* Favorite Cities List */}
          {favoriteCities.length > 0 && (
            <View style={styles.favoritesContainer}>
              <Text style={[styles.sectionTitle, { marginTop: Spacing.md }]}>Favorite Cities</Text>
              {favoriteCities.map((favCity) => (
                <View key={favCity.name} style={styles.favoriteRow}>
                  <Pressable
                    style={styles.favoriteInfo}
                    onPress={() => setCity(favCity)}
                  >
                    <Text style={styles.favoriteName}>
                      {favCity.name === city.name ? '✓ ' : ''}{favCity.name}
                    </Text>
                  </Pressable>
                  <Pressable
                    onPress={() => removeFavoriteCity(favCity.name)}
                    style={styles.removeButton}
                  >
                    <Text style={styles.removeIcon}>×</Text>
                  </Pressable>
                </View>
              ))}
            </View>
          )}
        </GlassCard>

        {/* Notifications */}
        <GlassCard style={styles.section}>
          <Text style={styles.sectionTitle}>Notifications</Text>

          <View style={styles.settingRow}>
            <View style={{ flex: 1, paddingRight: Spacing.md }}>
              <Text style={styles.settingLabel}>Daily Sunrise Alert</Text>
              <Text style={styles.settingHint}>
                Get notified at sunrise with panchang info
              </Text>
            </View>
            <Switch
              value={notificationsEnabled}
              onValueChange={async (value) => {
                if (value) {
                  const granted = await requestNotificationPermission();
                  if (granted) {
                    setNotificationsEnabled(true);
                    await scheduleWeeklyNotifications(city);
                  } else {
                    Alert.alert(
                      'Permission Denied',
                      'Please enable notifications in your device settings to receive daily sunrise and Ekadashi alerts.'
                    );
                  }
                } else {
                  setNotificationsEnabled(false);
                  await cancelAllNotifications();
                }
              }}
              trackColor={{
                false: 'rgba(255,255,255,0.1)',
                true: Colors.accent.saffron,
              }}
              thumbColor="#fff"
            />
          </View>

          {notificationsEnabled && (
            <View style={styles.settingRow}>
              <Text style={[styles.settingLabel, { flex: 1, paddingRight: Spacing.sm }]}>Notification Detail</Text>
              <View style={styles.segmentControl}>
                <Pressable
                  style={[
                    styles.segmentButton,
                    notificationVerbosity === 'minimal' && styles.segmentActive,
                  ]}
                  onPress={async () => {
                    setNotificationVerbosity('minimal');
                    await scheduleWeeklyNotifications(city);
                  }}
                >
                  <Text
                    style={[
                      styles.segmentText,
                      notificationVerbosity === 'minimal' && styles.segmentTextActive,
                    ]}
                  >
                    Minimal
                  </Text>
                </Pressable>
                <Pressable
                  style={[
                    styles.segmentButton,
                    notificationVerbosity === 'full' && styles.segmentActive,
                  ]}
                  onPress={async () => {
                    setNotificationVerbosity('full');
                    await scheduleWeeklyNotifications(city);
                  }}
                >
                  <Text
                    style={[
                      styles.segmentText,
                      notificationVerbosity === 'full' && styles.segmentTextActive,
                    ]}
                  >
                    Full
                  </Text>
                </Pressable>
              </View>
            </View>
          )}

          {notificationsEnabled && (
            <View style={[styles.settingRow, { borderTopWidth: StyleSheet.hairlineWidth, borderTopColor: 'rgba(255,255,255,0.08)', paddingTop: Spacing.md, marginTop: Spacing.sm }]}>
              <View style={{ flex: 1, paddingRight: Spacing.md }}>
                <Text style={styles.settingLabel}>Test Notifications</Text>
                <Text style={styles.settingHint}>
                  Trigger a test alert with 5s delay
                </Text>
              </View>
              <Pressable
                style={styles.testButton}
                onPress={async () => {
                  try {
                    await scheduleTestNotification();
                    Alert.alert('Scheduled', 'A test notification will trigger in 5 seconds. Please lock your device or exit the app to see it.');
                  } catch (err: any) {
                    Alert.alert('Error', err.message || 'Failed to schedule test notification');
                  }
                }}
              >
                <Text style={styles.testButtonText}>Test</Text>
              </Pressable>
            </View>
          )}
        </GlassCard>

        {/* Language */}
        <GlassCard style={styles.section}>
          <Text style={styles.sectionTitle}>Language</Text>
          <View style={styles.settingRow}>
            <Text style={styles.settingLabel}>App Language</Text>
            <View style={styles.segmentControl}>
              <Pressable
                style={[
                  styles.segmentButton,
                  language === 'en' && styles.segmentActive,
                ]}
                onPress={() => setLanguage('en')}
              >
                <Text
                  style={[
                    styles.segmentText,
                    language === 'en' && styles.segmentTextActive,
                  ]}
                >
                  English
                </Text>
              </Pressable>
              <Pressable
                style={[
                  styles.segmentButton,
                  language === 'hi' && styles.segmentActive,
                ]}
                onPress={() => setLanguage('hi')}
              >
                <Text
                  style={[
                    styles.segmentText,
                    language === 'hi' && styles.segmentTextActive,
                  ]}
                >
                  हिंदी
                </Text>
              </Pressable>
            </View>
          </View>
        </GlassCard>

        {/* Calendar System */}
        <GlassCard style={styles.section}>
          <Text style={styles.sectionTitle}>Calendar System</Text>
          <View style={styles.settingRow}>
            <Text style={styles.settingLabel}>Month System</Text>
            <View style={styles.segmentControl}>
              <Pressable
                style={[
                  styles.segmentButton,
                  calendarSystem === 'purnimant' && styles.segmentActive,
                ]}
                onPress={() => setCalendarSystem('purnimant')}
              >
                <Text
                  style={[
                    styles.segmentText,
                    calendarSystem === 'purnimant' && styles.segmentTextActive,
                  ]}
                >
                  Purnimant
                </Text>
              </Pressable>
              <Pressable
                style={[
                  styles.segmentButton,
                  calendarSystem === 'amant' && styles.segmentActive,
                ]}
                onPress={() => setCalendarSystem('amant')}
              >
                <Text
                  style={[
                    styles.segmentText,
                    calendarSystem === 'amant' && styles.segmentTextActive,
                  ]}
                >
                  Amant
                </Text>
              </Pressable>
            </View>
          </View>
        </GlassCard>

        {/* About */}
        <GlassCard style={styles.section}>
          <Text style={styles.sectionTitle}>About</Text>
          <Text style={styles.aboutText}>
            Swarupa Panchang & Nirnay{'\n'}
            Version 1.0.0{'\n'}
            {'\n'}
            High-precision on-device Hindu calendar with{'\n'}
            Swaminarayan Nirnay integration.{'\n'}
            {'\n'}
            100% offline • Zero server costs
          </Text>
        </GlassCard>

        <View style={{ height: 100 }} />
      </ScrollView>

      {/* City Picker Modal */}
      <CityPickerModal
        visible={cityPickerVisible}
        onClose={() => setCityPickerVisible(false)}
      />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: Colors.background.deepIndigo,
  },
  scrollView: {
    flex: 1,
    paddingHorizontal: Spacing.lg,
  },
  title: {
    color: Colors.text.primary,
    fontSize: Typography.size['4xl'],
    fontWeight: Typography.weight.extraBold,
    paddingTop: Spacing.lg,
    paddingBottom: Spacing.xl,
  },
  section: {
    marginBottom: Spacing.lg,
  },
  sectionTitle: {
    color: Colors.text.secondary,
    fontSize: Typography.size.xs,
    fontWeight: Typography.weight.bold,
    letterSpacing: 1,
    textTransform: 'uppercase',
    marginBottom: Spacing.md,
  },
  settingRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: Spacing.sm,
  },
  settingLabel: {
    color: Colors.text.primary,
    fontSize: Typography.size.lg,
    fontWeight: Typography.weight.medium,
  },
  settingValue: {
    color: Colors.text.secondary,
    fontSize: Typography.size.md,
    marginTop: 2,
  },
  settingHint: {
    color: Colors.text.tertiary,
    fontSize: Typography.size.sm,
    marginTop: 2,
  },
  chevron: {
    color: Colors.text.tertiary,
    fontSize: Typography.size.sm,
  },
  segmentControl: {
    flexDirection: 'row',
    backgroundColor: 'rgba(255,255,255,0.06)',
    borderRadius: BorderRadius.md,
    padding: 2,
  },
  segmentButton: {
    paddingHorizontal: Spacing.md,
    paddingVertical: Spacing.xs,
    borderRadius: BorderRadius.sm,
  },
  segmentActive: {
    backgroundColor: Colors.accent.saffron,
  },
  segmentText: {
    color: Colors.text.tertiary,
    fontSize: Typography.size.sm,
    fontWeight: Typography.weight.medium,
  },
  segmentTextActive: {
    color: '#fff',
    fontWeight: Typography.weight.bold,
  },
  aboutText: {
    color: Colors.text.tertiary,
    fontSize: Typography.size.md,
    lineHeight: 22,
  },
  favoritesContainer: {
    marginTop: Spacing.sm,
    borderTopWidth: StyleSheet.hairlineWidth,
    borderTopColor: 'rgba(255,255,255,0.1)',
    paddingTop: Spacing.sm,
  },
  favoriteRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: Spacing.xs,
  },
  favoriteInfo: {
    flex: 1,
  },
  favoriteName: {
    color: Colors.text.secondary,
    fontSize: Typography.size.md,
  },
  removeButton: {
    padding: Spacing.xs,
    backgroundColor: 'rgba(255,0,0,0.1)',
    borderRadius: BorderRadius.sm,
  },
  removeIcon: {
    color: Colors.status.error,
    fontSize: Typography.size.md,
    fontWeight: Typography.weight.bold,
  },
  testButton: {
    backgroundColor: 'rgba(255, 255, 255, 0.08)',
    borderColor: 'rgba(255, 255, 255, 0.15)',
    borderWidth: 1,
    borderRadius: BorderRadius.md,
    paddingHorizontal: Spacing.md,
    paddingVertical: Spacing.sm,
  },
  testButtonText: {
    color: Colors.accent.saffron,
    fontSize: Typography.size.sm,
    fontWeight: Typography.weight.bold,
  },
});

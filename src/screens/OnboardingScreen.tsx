/**
 * OnboardingScreen — First Launch Setup Flow
 *
 * A high-fidelity, premium onboarding flow that:
 * 1. Welcomes the user with a stunning Hindu aesthetic.
 * 2. Guides the user to set up location (GPS auto-detect or manual city).
 * 3. Configures daily/Ekadashi notifications.
 */

import React, { useState, useCallback } from 'react';
import {
  StyleSheet,
  View,
  Text,
  Pressable,
  ActivityIndicator,
  Switch,
  FlatList,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { LinearGradient } from 'expo-linear-gradient';
import { Colors, Typography, Spacing, Gradients } from '../constants/theme';
import { useSettingsStore } from '../stores/settingsStore';
import { requestLocationPermission, getCurrentCoordinates, getNearestCity } from '../services/locationService';
import { requestNotificationPermission, scheduleWeeklyNotifications } from '../services/notificationService';
import cities from '../constants/cities.json';
import type { CityInfo } from '../engine/types';

export function OnboardingScreen() {
  const [step, setStep] = useState(0);
  const [loading, setLoading] = useState(false);
  const [permissionError, setPermissionError] = useState<string | null>(null);

  const {
    city,
    notificationsEnabled,
    setCity,
    setNotificationsEnabled,
    completeOnboarding,
  } = useSettingsStore();

  // Step 0: Welcome
  // Step 1: Location Setup
  // Step 2: Notifications Setup
  // Step 3: Finish

  const handleNext = () => {
    if (step < 3) {
      setStep(step + 1);
    } else {
      // Done! Schedule notifications and finish
      scheduleWeeklyNotifications(city);
      completeOnboarding();
    }
  };

  const handleBack = () => {
    if (step > 0) {
      setStep(step - 1);
    }
  };

  const handleAutoDetect = useCallback(async () => {
    setLoading(true);
    setPermissionError(null);
    try {
      const granted = await requestLocationPermission();
      if (granted) {
        const coords = await getCurrentCoordinates();
        const nearest = getNearestCity(coords.latitude, coords.longitude);
        setCity(nearest);
      } else {
        setPermissionError('Location permission denied. Please choose manually.');
      }
    } catch (err: any) {
      console.error(err);
      setPermissionError(err.message || 'Failed to get location. Please choose manually.');
    } finally {
      setLoading(false);
    }
  }, []);

  const handleSelectCity = useCallback((item: CityInfo) => {
    setCity(item);
  }, []);

  const handleToggleNotifications = useCallback(async (value: boolean) => {
    if (value) {
      const granted = await requestNotificationPermission();
      setNotificationsEnabled(granted);
    } else {
      setNotificationsEnabled(false);
    }
  }, []);

  const renderWelcome = () => (
    <View style={styles.card}>
      <Text style={styles.emoji}>🕉️</Text>
      <Text style={styles.title}>Swarupa Panchang</Text>
      <Text style={styles.subtitle}>
        An infinite, zero-cost Hindu astronomical calendar & Nirnay assistant.
      </Text>
      <Pressable style={styles.primaryButton} onPress={handleNext}>
        <Text style={styles.primaryButtonText}>Begin Setup →</Text>
      </Pressable>
    </View>
  );

  const renderLocation = () => (
    <View style={styles.card}>
      <Text style={styles.stepTitle}>📍 Where are you?</Text>
      <Text style={styles.stepSubtitle}>
        Panchang details change based on location due to sunrise & sunset offsets.
      </Text>

      {permissionError && <Text style={styles.errorText}>{permissionError}</Text>}

      {loading ? (
        <ActivityIndicator size="large" color={Colors.accent.saffron} style={styles.loader} />
      ) : (
        <React.Fragment>
          <Pressable style={styles.gpsButton} onPress={handleAutoDetect}>
            <Text style={styles.gpsButtonText}>📡 Auto-Detect Location (GPS)</Text>
          </Pressable>

          <Text style={styles.divider}>— OR SELECT A CITY —</Text>

          <FlatList
            data={cities.slice(0, 5)} // Top popular cities
            keyExtractor={(item) => item.name}
            style={styles.cityList}
            renderItem={({ item }) => {
              const isSelected = city.name === item.name && city.lat === item.lat;
              return (
                <Pressable
                  style={[
                    styles.cityItem,
                    isSelected && styles.cityItemActive,
                  ]}
                  onPress={() => handleSelectCity(item)}
                >
                  <Text style={[styles.cityItemText, isSelected && styles.cityItemTextActive]}>
                    {item.name}, {item.state} ({item.country}) {isSelected ? '✓' : ''}
                  </Text>
                </Pressable>
              );
            }}
          />

          <View style={styles.selectedFeedback}>
            <Text style={styles.selectedLabel}>Selected Location:</Text>
            <Text style={styles.selectedCityValue}>
              📍 {city.name}, {city.state} ({city.country})
            </Text>
          </View>
        </React.Fragment>
      )}

      <Pressable style={styles.primaryButton} onPress={handleNext}>
        <Text style={styles.primaryButtonText}>Continue with {city.name} →</Text>
      </Pressable>
    </View>
  );

  const renderNotifications = () => (
    <View style={styles.card}>
      <Text style={styles.stepTitle}>🔔 Stay Updated</Text>
      <Text style={styles.stepSubtitle}>
        Receive alerts on your device for upcoming Ekadashi fasts and daily Panchang events.
      </Text>

      <View style={styles.switchRow}>
        <View style={{ flex: 1 }}>
          <Text style={styles.switchLabel}>Ekadashi & Daily Alerts</Text>
          <Text style={styles.switchDesc}>Get notifications for fast reminders.</Text>
        </View>
        <Switch
          value={notificationsEnabled}
          onValueChange={handleToggleNotifications}
          trackColor={{ true: Colors.accent.saffron, false: '#333' }}
        />
      </View>

      <Pressable style={styles.primaryButton} onPress={handleNext}>
        <Text style={styles.primaryButtonText}>Continue →</Text>
      </Pressable>
    </View>
  );

  const renderFinish = () => (
    <View style={styles.card}>
      <Text style={styles.emoji}>🔱</Text>
      <Text style={styles.title}>All Set!</Text>
      <Text style={styles.subtitle}>
        Your location is configured to {city.name} and notifications are {notificationsEnabled ? 'enabled' : 'disabled'}.
      </Text>
      <Pressable style={styles.primaryButton} onPress={handleNext}>
        <Text style={styles.primaryButtonText}>Open Calendar</Text>
      </Pressable>
    </View>
  );

  return (
    <SafeAreaView style={styles.container}>
      <LinearGradient
        colors={[Colors.background.deepIndigo, Colors.background.purple]}
        style={styles.gradient}
      >
        <View style={styles.content}>
          {step > 0 && step < 3 && (
            <Pressable style={styles.backButton} onPress={handleBack}>
              <Text style={styles.backButtonText}>← Back</Text>
            </Pressable>
          )}

          {step === 0 && renderWelcome()}
          {step === 1 && renderLocation()}
          {step === 2 && renderNotifications()}
          {step === 3 && renderFinish()}
        </View>
      </LinearGradient>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.background.deepIndigo,
  },
  gradient: {
    flex: 1,
  },
  content: {
    flex: 1,
    justifyContent: 'center',
    paddingHorizontal: Spacing.xl,
  },
  backButton: {
    position: 'absolute',
    top: 40,
    left: Spacing.xl,
    padding: Spacing.sm,
  },
  backButtonText: {
    color: Colors.text.secondary,
    fontSize: Typography.size.md,
  },
  card: {
    backgroundColor: Colors.glass.background,
    borderRadius: 24,
    borderWidth: 1,
    borderColor: Colors.glass.borderLight,
    padding: Spacing.xl,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.3,
    shadowRadius: 16,
    elevation: 8,
  },
  emoji: {
    fontSize: 64,
    marginBottom: Spacing.lg,
  },
  title: {
    color: Colors.text.primary,
    fontSize: Typography.size['4xl'],
    fontWeight: Typography.weight.bold,
    textAlign: 'center',
    marginBottom: Spacing.sm,
  },
  subtitle: {
    color: Colors.text.secondary,
    fontSize: Typography.size.md,
    textAlign: 'center',
    lineHeight: 22,
    marginBottom: Spacing.xl,
  },
  stepTitle: {
    color: Colors.text.primary,
    fontSize: Typography.size['2xl'],
    fontWeight: Typography.weight.bold,
    marginBottom: Spacing.xs,
    width: '100%',
  },
  stepSubtitle: {
    color: Colors.text.secondary,
    fontSize: Typography.size.sm,
    lineHeight: 18,
    marginBottom: Spacing.lg,
    width: '100%',
  },
  primaryButton: {
    backgroundColor: Colors.accent.saffron,
    borderRadius: 16,
    paddingVertical: Spacing.md,
    paddingHorizontal: Spacing.xl,
    width: '100%',
    alignItems: 'center',
    marginTop: Spacing.lg,
  },
  primaryButtonText: {
    color: Colors.background.deepIndigo,
    fontSize: Typography.size.md,
    fontWeight: Typography.weight.bold,
  },
  secondaryButton: {
    paddingVertical: Spacing.md,
    width: '100%',
    alignItems: 'center',
    marginTop: Spacing.md,
  },
  secondaryButtonText: {
    color: Colors.text.tertiary,
    fontSize: Typography.size.sm,
  },
  gpsButton: {
    backgroundColor: 'rgba(255, 255, 255, 0.08)',
    borderWidth: 1,
    borderColor: Colors.glass.borderLight,
    borderRadius: 14,
    paddingVertical: Spacing.md,
    width: '100%',
    alignItems: 'center',
    marginBottom: Spacing.md,
  },
  gpsButtonText: {
    color: Colors.text.primary,
    fontSize: Typography.size.sm,
    fontWeight: Typography.weight.semiBold,
  },
  divider: {
    color: Colors.text.tertiary,
    fontSize: Typography.size.xs,
    fontWeight: Typography.weight.bold,
    marginVertical: Spacing.sm,
  },
  cityList: {
    width: '100%',
    maxHeight: 180,
  },
  cityItem: {
    paddingVertical: Spacing.sm,
    paddingHorizontal: Spacing.md,
    borderRadius: 10,
    backgroundColor: 'rgba(255, 255, 255, 0.03)',
    marginBottom: Spacing.xs,
    width: '100%',
  },
  cityItemActive: {
    backgroundColor: 'rgba(217, 119, 6, 0.15)',
    borderColor: Colors.accent.saffron,
    borderWidth: 1,
  },
  cityItemText: {
    color: Colors.text.secondary,
    fontSize: Typography.size.sm,
  },
  cityItemTextActive: {
    color: Colors.accent.saffron,
    fontWeight: Typography.weight.bold,
  },
  selectedFeedback: {
    marginTop: Spacing.md,
    padding: Spacing.sm,
    backgroundColor: 'rgba(255, 255, 255, 0.04)',
    borderRadius: 12,
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.08)',
    width: '100%',
    alignItems: 'center',
  },
  selectedLabel: {
    color: Colors.text.tertiary,
    fontSize: Typography.size.xs,
    fontWeight: Typography.weight.medium,
    marginBottom: 2,
  },
  selectedCityValue: {
    color: Colors.accent.saffron,
    fontSize: Typography.size.sm,
    fontWeight: Typography.weight.bold,
  },
  errorText: {
    color: '#ef4444',
    fontSize: Typography.size.xs,
    marginBottom: Spacing.sm,
    textAlign: 'center',
  },
  loader: {
    marginVertical: Spacing.xl,
  },
  switchRow: {
    flexDirection: 'row',
    alignItems: 'center',
    width: '100%',
    paddingVertical: Spacing.md,
    borderTopWidth: StyleSheet.hairlineWidth,
    borderBottomWidth: StyleSheet.hairlineWidth,
    borderColor: Colors.glass.borderLight,
    marginVertical: Spacing.lg,
  },
  switchLabel: {
    color: Colors.text.primary,
    fontSize: Typography.size.md,
    fontWeight: Typography.weight.semiBold,
  },
  switchDesc: {
    color: Colors.text.tertiary,
    fontSize: Typography.size.xs,
    marginTop: 2,
  },
});

/**
 * @fileoverview Notification Service.
 *
 * Handles on-device scheduling of local notifications using expo-notifications.
 * Schedules alerts for upcoming Ekadashi fasts and daily Panchang updates
 * for the next 7 days to stay within OS limits.
 */

import * as Notifications from 'expo-notifications';
import { Platform } from 'react-native';
import { computePanchang } from '../engine/astronomicalEngine';
import { checkEkadashiFast } from '../engine/ekadashiResolver';
import type { CityInfo } from '../engine/types';

import { useSettingsStore } from '../stores/settingsStore';

// Set up default behavior for handling notifications when the app is foregrounded
// Wrapped in try-catch because this can fail in Expo Go environments
try {
  Notifications.setNotificationHandler({
    handleNotification: async () => ({
      shouldShowAlert: true,
      shouldPlaySound: true,
      shouldSetBadge: false,
      shouldShowBanner: true,
      shouldShowList: true,
    }),
  });
} catch (e) {
  console.warn('Notification handler setup failed (expected in Expo Go):', e);
}

/**
 * Request notification permissions from the user.
 *
 * @returns boolean indicating if permission is granted
 */
export async function requestNotificationPermission(): Promise<boolean> {
  try {
    const { status: existingStatus } = await Notifications.getPermissionsAsync();
    let finalStatus = existingStatus;

    if (existingStatus !== 'granted') {
      const { status } = await Notifications.requestPermissionsAsync();
      finalStatus = status;
    }

    return finalStatus === 'granted';
  } catch (err) {
    console.error('Error requesting notification permission:', err);
    return false;
  }
}

/**
 * Cancels all currently scheduled trigger notifications.
 */
export async function cancelAllNotifications(): Promise<void> {
  await Notifications.cancelAllScheduledNotificationsAsync();
}

/**
 * Formats a Date object to HH:MM AM/PM string.
 */
function formatTime(date: Date): string {
  let hours = date.getHours();
  const minutes = date.getMinutes();
  const ampm = hours >= 12 ? 'PM' : 'AM';
  hours = hours % 12;
  hours = hours ? hours : 12; // the hour '0' should be '12'
  const minutesStr = minutes < 10 ? '0' + minutes : minutes;
  return `${hours}:${minutesStr} ${ampm}`;
}

/**
 * Schedules notifications for the next 7 days based on the user's location and preferences.
 *
 * @param city - Selected city coordinates and timezone
 */
export async function scheduleWeeklyNotifications(city: CityInfo): Promise<void> {
  // 1. Cancel existing notifications first
  await cancelAllNotifications();

  const { notificationsEnabled, notificationVerbosity } = useSettingsStore.getState();

  // If notifications are disabled, stop here after clearing
  if (!notificationsEnabled) {
    return;
  }

  // Set up Android notification channel (required for Android 8+)
  if (Platform.OS === 'android') {
    await Notifications.setNotificationChannelAsync('panchang_alerts', {
      name: 'Panchang & Fast Alerts',
      importance: Notifications.AndroidImportance.HIGH,
      vibrationPattern: [0, 250, 250, 250],
      lightColor: '#D97706', // Saffron
    });
  }

  const now = new Date();

  // 2. Loop through next 7 days
  for (let i = 0; i < 7; i++) {
    const targetDate = new Date(now.getTime() + i * 24 * 60 * 60 * 1000);
    
    // Set target date to local noon of that day for calculation stability
    const calcDate = new Date(targetDate);
    calcDate.setHours(12, 0, 0, 0);

    // Compute complete Panchang for this day to get sunrise/sunset times
    const panchang = computePanchang(calcDate, city.lat, city.lng);
    const sunriseTime = panchang.sunrise;

    // A. Daily Sunrise Notification
    if (sunriseTime.getTime() > now.getTime()) {
      const body = notificationVerbosity === 'minimal'
        ? `Sunrise is at ${formatTime(sunriseTime)}.`
        : `Sunrise: ${formatTime(sunriseTime)} • Tithi: ${panchang.tithi.name} • Nakshatra: ${panchang.nakshatra.name}${
            panchang.festivals.length > 0 ? ' • ' + panchang.festivals.map(f => f.name).join(', ') : ''
          }`;

      await Notifications.scheduleNotificationAsync({
        content: {
          title: '🌅 Good Morning',
          body,
          sound: true,
          data: { id: `sunrise_alert_${calcDate.toDateString()}` },
        },
        trigger: {
          type: 'date',
          date: sunriseTime,
        } as Notifications.NotificationTriggerInput,
      });
    }

    // B. Calculate Ekadashi fast for this day
    const fastInfo = checkEkadashiFast(calcDate, city.lat, city.lng);

    if (fastInfo) {
      // We found an Ekadashi! Let's schedule two notifications:
      // i. Remind evening before (at 8:00 PM) to prepare for the fast
      const eveningAlertTime = new Date(calcDate);
      eveningAlertTime.setDate(eveningAlertTime.getDate() - 1); // Yesterday
      eveningAlertTime.setHours(20, 0, 0, 0); // 8:00 PM

      if (eveningAlertTime.getTime() > now.getTime()) {
        await Notifications.scheduleNotificationAsync({
          content: {
            title: `🔔 Fasting Tomorrow: ${fastInfo.name}`,
            body: `Preparation reminder: tomorrow is ${fastInfo.name}. Waterless or fruit-based fast.`,
            sound: true,
            data: { id: `ekadashi_eve_${calcDate.toDateString()}` },
          },
          trigger: {
            type: 'date',
            date: eveningAlertTime,
          } as Notifications.NotificationTriggerInput,
        });
      }

      // ii. Remind morning of the fast (at 7:00 AM)
      const morningAlertTime = new Date(calcDate);
      morningAlertTime.setHours(7, 0, 0, 0); // 7:00 AM

      if (morningAlertTime.getTime() > now.getTime()) {
        await Notifications.scheduleNotificationAsync({
          content: {
            title: `🔱 Today is ${fastInfo.name}`,
            body: `Fasting day is active. Observe ${fastInfo.name} with devotion.`,
            sound: true,
            data: { id: `ekadashi_day_${calcDate.toDateString()}` },
          },
          trigger: {
            type: 'date',
            date: morningAlertTime,
          } as Notifications.NotificationTriggerInput,
        });
      }
    }
  }
}

/**
 * Schedules a test notification to trigger after 5 seconds.
 */
export async function scheduleTestNotification(): Promise<void> {
  const granted = await requestNotificationPermission();
  if (!granted) {
    throw new Error('Notification permission not granted. Please enable it in Settings.');
  }

  // Set up Android notification channel (required for Android 8+)
  if (Platform.OS === 'android') {
    await Notifications.setNotificationChannelAsync('panchang_alerts', {
      name: 'Panchang & Fast Alerts',
      importance: Notifications.AndroidImportance.HIGH,
      vibrationPattern: [0, 250, 250, 250],
      lightColor: '#D97706',
    });
  }

  await Notifications.scheduleNotificationAsync({
    content: {
      title: '🕉️ Swarupa Panchang Test',
      body: 'If you see this, local notifications are working perfectly on your device!',
      sound: true,
      data: { id: 'test_alert' },
    },
    trigger: {
      type: 'timeInterval',
      seconds: 5,
    } as Notifications.NotificationTriggerInput,
  });
}


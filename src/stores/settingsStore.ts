/**
 * Settings Store — Zustand
 *
 * Manages user preferences: selected city, notification settings,
 * theme preference, calendar system.
 */

import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';
import { zustandStorage } from '../services/storageService';
import type { CityInfo } from '../engine/types';

interface SettingsState {
  /** User's selected city for panchang calculations */
  city: CityInfo;
  /** Whether daily sunrise notifications are enabled */
  notificationsEnabled: boolean;
  /** Notification verbosity: 'minimal' (time only) or 'full' (panchang summary) */
  notificationVerbosity: 'minimal' | 'full';
  /** Theme: 'dark' (default), 'light', or 'system' */
  theme: 'dark' | 'light' | 'system';
  /** Language preference */
  language: 'en' | 'hi';
  /** Calendar month system */
  calendarSystem: 'purnimant' | 'amant';
  /** Whether onboarding has been completed */
  onboardingCompleted: boolean;
  /** Favorite cities list */
  favoriteCities: CityInfo[];

  /** Update the selected city */
  setCity: (city: CityInfo) => void;
  /** Toggle notifications */
  setNotificationsEnabled: (enabled: boolean) => void;
  /** Set notification verbosity */
  setNotificationVerbosity: (verbosity: 'minimal' | 'full') => void;
  /** Set theme preference */
  setTheme: (theme: 'dark' | 'light' | 'system') => void;
  /** Set language preference */
  setLanguage: (language: 'en' | 'hi') => void;
  /** Set calendar system */
  setCalendarSystem: (system: 'purnimant' | 'amant') => void;
  /** Mark onboarding as completed */
  completeOnboarding: () => void;
  /** Add a city to favorites */
  addFavoriteCity: (city: CityInfo) => void;
  /** Remove a city from favorites */
  removeFavoriteCity: (cityName: string) => void;
}

/** Default city: Ahmedabad, Gujarat */
const DEFAULT_CITY: CityInfo = {
  name: 'Ahmedabad',
  state: 'Gujarat',
  country: 'India',
  lat: 23.0225,
  lng: 72.5714,
  tz: 'Asia/Kolkata',
};

export const useSettingsStore = create<SettingsState>()(
  persist(
    (set) => ({
      city: DEFAULT_CITY,
      notificationsEnabled: true,
      notificationVerbosity: 'full',
      theme: 'dark',
      language: 'en',
      calendarSystem: 'amant', // Amavasyant default for Swaminarayan / Gujarat
      onboardingCompleted: false,
      favoriteCities: [],

      setCity: (city: CityInfo) => set({ city }),
      setNotificationsEnabled: (enabled: boolean) =>
        set({ notificationsEnabled: enabled }),
      setNotificationVerbosity: (verbosity: 'minimal' | 'full') =>
        set({ notificationVerbosity: verbosity }),
      setTheme: (theme: 'dark' | 'light' | 'system') => set({ theme }),
      setLanguage: (language: 'en' | 'hi') => set({ language }),
      setCalendarSystem: (system: 'purnimant' | 'amant') =>
        set({ calendarSystem: system }),
      completeOnboarding: () => set({ onboardingCompleted: true }),
      addFavoriteCity: (city: CityInfo) =>
        set((state) => ({
          favoriteCities: [...state.favoriteCities, city],
        })),
      removeFavoriteCity: (cityName: string) =>
        set((state) => ({
          favoriteCities: state.favoriteCities.filter((c) => c.name !== cityName),
        })),
    }),
    {
      name: 'swarupa-settings-store',
      storage: createJSONStorage(() => zustandStorage),
      version: 1,
      migrate: (persistedState: any, version: number) => {
        if (!persistedState) return {};
        if (version === 0 || !version) {
          // Migrate from old state that may have 'gu' language
          if (persistedState.language && persistedState.language !== 'en' && persistedState.language !== 'hi') {
            persistedState.language = 'en';
          }
        }
        return persistedState;
      },
      merge: (persistedState: unknown, currentState: SettingsState): SettingsState => {
        if (!persistedState || typeof persistedState !== 'object') {
          return currentState;
        }
        return { ...currentState, ...(persistedState as any) };
      },
    }
  )
);

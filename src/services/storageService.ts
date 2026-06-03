/**
 * @fileoverview Storage Service.
 *
 * Provides a high-performance local key-value store using AsyncStorage,
 * with an in-memory cache to preserve synchronous read capabilities,
 * and a storage adapter for Zustand persistence middleware.
 */

import AsyncStorage from '@react-native-async-storage/async-storage';

// Keep an in-memory cache to allow synchronous reads
const memoryCache = new Map<string, string>();

// Initialize memory cache from AsyncStorage (fire-and-forget sync at startup)
AsyncStorage.getAllKeys()
  .then((keys) => AsyncStorage.multiGet(keys))
  .then((pairs) => {
    for (const [key, value] of pairs) {
      if (value !== null) {
        memoryCache.set(key, value);
      }
    }
  })
  .catch((err) => console.error('Failed to hydrate storage cache:', err));

/**
 * Zustand-compatible persistence storage wrapper around AsyncStorage.
 */
export const zustandStorage = {
  setItem: async (name: string, value: string): Promise<void> => {
    memoryCache.set(name, value);
    await AsyncStorage.setItem(name, value);
  },
  getItem: async (name: string): Promise<string | null> => {
    const cached = memoryCache.get(name);
    if (cached !== undefined) return cached;
    const stored = await AsyncStorage.getItem(name);
    if (stored !== null) {
      memoryCache.set(name, stored);
    }
    return stored;
  },
  removeItem: async (name: string): Promise<void> => {
    memoryCache.delete(name);
    await AsyncStorage.removeItem(name);
  },
};

/**
 * Low-level storage utilities
 */
export const storageService = {
  set: (key: string, value: string | number | boolean): void => {
    const valStr = String(value);
    memoryCache.set(key, valStr);
    AsyncStorage.setItem(key, valStr).catch((err) =>
      console.error('AsyncStorage setItem error:', err)
    );
  },
  getString: (key: string): string | undefined => {
    return memoryCache.get(key);
  },
  getNumber: (key: string): number | undefined => {
    const val = memoryCache.get(key);
    return val !== undefined ? Number(val) : undefined;
  },
  getBoolean: (key: string): boolean | undefined => {
    const val = memoryCache.get(key);
    return val !== undefined ? val === 'true' : undefined;
  },
  delete: (key: string): void => {
    memoryCache.delete(key);
    AsyncStorage.removeItem(key).catch((err) =>
      console.error('AsyncStorage removeItem error:', err)
    );
  },
  clearAll: (): void => {
    memoryCache.clear();
    AsyncStorage.clear().catch((err) =>
      console.error('AsyncStorage clear error:', err)
    );
  },
};

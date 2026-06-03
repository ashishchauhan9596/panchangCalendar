import type { PanchangData } from '../engine/types';

// In-memory cache map
const cache = new Map<string, PanchangData>();

/**
 * Generates a unique key for the cache based on date, location, and calendar system.
 * Latitude and longitude are rounded to 2 decimal places (~1.1km precision) to allow
 * minor location updates to share the cache.
 */
function getCacheKey(
  date: Date,
  lat: number,
  lng: number,
  calendarSystem: 'amant' | 'purnimant'
): string {
  const yyyymmdd = date.toISOString().split('T')[0];
  const roundedLat = lat.toFixed(2);
  const roundedLng = lng.toFixed(2);
  return `${yyyymmdd}_${roundedLat}_${roundedLng}_${calendarSystem}`;
}

export const PanchangCache = {
  /**
   * Retrieves a cached PanchangData object if it exists.
   */
  get(
    date: Date,
    lat: number,
    lng: number,
    calendarSystem: 'amant' | 'purnimant'
  ): PanchangData | null {
    const key = getCacheKey(date, lat, lng, calendarSystem);
    return cache.get(key) || null;
  },

  /**
   * Caches a computed PanchangData object.
   */
  set(
    date: Date,
    lat: number,
    lng: number,
    calendarSystem: 'amant' | 'purnimant',
    data: PanchangData
  ): void {
    const key = getCacheKey(date, lat, lng, calendarSystem);
    cache.set(key, data);
  },

  /**
   * Clears the cache.
   */
  clear(): void {
    cache.clear();
  },
};

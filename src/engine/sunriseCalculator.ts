/**
 * @fileoverview Sunrise, Sunset, and Twilight calculation using suncalc3.
 *
 * Provides times of sunrise, sunset, dawn, and dusk for a given date and location.
 */

// @ts-ignore
import SunCalc from 'suncalc3';
import type { SunTimes } from './types';

/**
 * Compute sunrise, sunset, dawn (civil twilight start), and dusk (civil twilight end)
 * for a given date, latitude, and longitude.
 *
 * @param date - The date to compute times for
 * @param latitude - Latitude in decimal degrees
 * @param longitude - Longitude in decimal degrees
 * @returns SunTimes containing sunrise, sunset, dawn, and dusk Date objects
 */
export function computeSunTimes(date: Date, latitude: number, longitude: number): SunTimes {
  const noonDate = new Date(Date.UTC(
    date.getUTCFullYear(),
    date.getUTCMonth(),
    date.getUTCDate(),
    12,
    0,
    0,
    0
  ));

  const times = SunCalc.getSunTimes(noonDate, latitude, longitude, 0, true);

  return {
    sunrise: times.sunrise.value,
    sunset: times.sunset.value,
    dawn: times.dawn.value,
    dusk: times.dusk.value,
  };
}

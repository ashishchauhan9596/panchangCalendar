/**
 * @fileoverview Astronomical calculation orchestrator.
 *
 * Integrates astronomia (for Sun/Moon positions), suncalc3 (for sunrise/sunset),
 * and local calculators to compute the five Panchang elements for any moment.
 */

import { dateToJD } from './dateUtils';
import { tropicalToSidereal } from './ayanamsaCalculator';
import { computeSunTimes } from './sunriseCalculator';
import {
  computeTithi,
  computeNakshatra,
  computeYoga,
  computeKarana,
  computeVara,
} from './panchangCalculator';
import { computeRahuKaal } from './rahuKaalCalculator';
import { resolveHinduMonth } from './monthResolver';
import { resolveFestivals } from './festivalEngine';
import { PanchangCache } from '../utils/cache';
import type { PanchangData, SunTimes } from './types';
import { getSiderealPositions } from './positionsCalculator';


/**
 * Compute the complete Panchang data for a given date, latitude, and longitude.
 *
 * @param date - The moment for which Panchang is computed (e.g. current time, or sunrise time)
 * @param latitude - Observer latitude
 * @param longitude - Observer longitude
 * @returns Complete PanchangData object
 */
export function computePanchang(
  date: Date,
  latitude: number,
  longitude: number,
  calendarSystem: 'amant' | 'purnimant' = 'amant'
): PanchangData {
  // Check cache first
  const cached = PanchangCache.get(date, latitude, longitude, calendarSystem);
  if (cached) {
    return cached;
  }

  const jd = dateToJD(date);

  // 1. Get astronomical positions
  const { sunLongitude, moonLongitude, ayanamsa } = getSiderealPositions(jd);

  // 2. Compute Sun Times (sunrise/sunset) for the day
  const sunTimes = computeSunTimes(date, latitude, longitude);

  // 3. Compute Weekday (Vara) based on the Sunrise time of the day
  const { vara, varaName } = computeVara(sunTimes.sunrise);

  // 4. Compute the 4 luni-solar elements for the given moment
  const tithi = computeTithi(moonLongitude, sunLongitude);
  const nakshatra = computeNakshatra(moonLongitude);
  const yoga = computeYoga(moonLongitude, sunLongitude);
  const karana = computeKarana(moonLongitude, sunLongitude);

  // 5. Compute inauspicious periods (Rahu Kaal) for the day
  const rahuKaal = computeRahuKaal(sunTimes.sunrise, sunTimes.sunset, vara);

  // 6. Compute Abhijit Muhurat (the 8th segment of 15 divisions between sunrise and sunset)
  const daytimeMs = sunTimes.sunset.getTime() - sunTimes.sunrise.getTime();
  const segmentMs = daytimeMs / 15;
  const abhijitStart = new Date(sunTimes.sunrise.getTime() + 7 * segmentMs);
  const abhijitEnd = new Date(sunTimes.sunrise.getTime() + 8 * segmentMs);
  const abhijitMuhurat = { start: abhijitStart, end: abhijitEnd };

  const partialPanchang = {
    date,
    latitude,
    longitude,
    tithi,
    nakshatra,
    yoga,
    karana,
    vara,
    varaName,
    sunrise: sunTimes.sunrise,
    sunset: sunTimes.sunset,
    rahuKaal,
    abhijitMuhurat,
    ayanamsa,
    sunLongitude,
    moonLongitude,
    hinduMonth: resolveHinduMonth(date, tithi.paksha, calendarSystem),
  };

  const result = {
    ...partialPanchang,
    festivals: resolveFestivals(date, latitude, longitude, partialPanchang),
  };

  // Save to cache
  PanchangCache.set(date, latitude, longitude, calendarSystem, result);

  return result;
}

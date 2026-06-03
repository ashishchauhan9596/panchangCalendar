/**
 * @fileoverview Calculators for inauspicious time periods in Hindu astrology.
 *
 * Three inauspicious periods (Kaal) are derived by dividing the total
 * daylight duration (sunrise → sunset) into **8 equal segments** and
 * selecting the segment ruled by a specific graha (planet) based on
 * the weekday.
 *
 * | Period           | Ruling Graha | Significance                |
 * |------------------|--------------|-----------------------------|
 * | **Rahu Kaal**    | Rahu         | Generally inauspicious      |
 * | **Yamaghanta**   | Yama         | Lord of death, inauspicious |
 * | **Gulika Kaal**  | Gulika/Mandi | Son of Saturn, inauspicious |
 *
 * The segment number for each weekday is drawn from traditional Jyotish
 * texts and is the same across all major panchangam publishers.
 */

import type { TimePeriod } from './types';

// ──────────────────────────────────────────────
// Segment Maps (weekday → 1-based segment number)
// ──────────────────────────────────────────────
// Index: 0=Sun, 1=Mon, 2=Tue, 3=Wed, 4=Thu, 5=Fri, 6=Sat

/**
 * Rahu Kaal segment map.
 *
 * Traditional mnemonic: "Mother Saw Father Wearing The Turban Slowly"
 * → Mon(2), Sat(3), Fri(4), Wed(5), Thu(6), Tue(7), Sun(8)
 *
 * Here stored as: weekdayIndex → segment number (1-based).
 */
const RAHU_KAAL_SEGMENTS: readonly number[] = [
  8, // Sunday
  2, // Monday
  7, // Tuesday
  5, // Wednesday
  6, // Thursday
  4, // Friday
  3, // Saturday
] as const;

/**
 * Yamaghanta Kaal segment map.
 *
 * Traditional assignment from standard Jyotish panchangams.
 */
const YAMAGHANTA_SEGMENTS: readonly number[] = [
  5, // Sunday
  4, // Monday
  3, // Tuesday
  2, // Wednesday
  1, // Thursday
  7, // Friday
  6, // Saturday
] as const;

/**
 * Gulika (Mandi) Kaal segment map.
 *
 * Gulika is considered the son of Saturn (Shani).
 * Its segment follows a descending pattern starting from Sunday = 7.
 */
const GULIKA_SEGMENTS: readonly number[] = [
  7, // Sunday
  6, // Monday
  5, // Tuesday
  4, // Wednesday
  3, // Thursday
  2, // Friday
  1, // Saturday
] as const;

// ──────────────────────────────────────────────
// Core Computation
// ──────────────────────────────────────────────

/**
 * Compute a time period by selecting a numbered segment from 8 equal
 * divisions of the daylight duration.
 *
 * @param sunrise        - Sunrise `Date`
 * @param sunset         - Sunset `Date`
 * @param segmentNumber  - Which segment to select (1 = first after sunrise, 8 = last before sunset)
 * @returns The start and end `Date` of the selected segment
 *
 * @throws {Error} If segmentNumber is outside 1–8 or sunrise ≥ sunset.
 */
function computeSegmentPeriod(
  sunrise: Date,
  sunset: Date,
  segmentNumber: number,
): TimePeriod {
  if (segmentNumber < 1 || segmentNumber > 8) {
    throw new Error(`Segment number must be 1–8, got ${segmentNumber}`);
  }

  const sunriseMs: number = sunrise.getTime();
  const sunsetMs: number = sunset.getTime();
  const daylightDurationMs: number = sunsetMs - sunriseMs;

  if (daylightDurationMs <= 0) {
    throw new Error('Sunrise must be before sunset');
  }

  const segmentDurationMs: number = daylightDurationMs / 8;

  const segmentStartMs: number = sunriseMs + (segmentNumber - 1) * segmentDurationMs;
  const segmentEndMs: number = segmentStartMs + segmentDurationMs;

  return {
    start: new Date(segmentStartMs),
    end: new Date(segmentEndMs),
  };
}

// ──────────────────────────────────────────────
// Public API
// ──────────────────────────────────────────────

/**
 * Compute **Rahu Kaal** for a given day.
 *
 * Rahu Kaal is considered inauspicious for starting new ventures.
 * It is one of the most widely observed inauspicious periods in
 * Hindu daily life.
 *
 * @param sunrise  - Sunrise time
 * @param sunset   - Sunset time
 * @param weekday  - Day of week (0 = Sunday … 6 = Saturday)
 * @returns The Rahu Kaal time period
 *
 * @example
 * // Monday: Rahu Kaal is the 2nd segment
 * const rk = computeRahuKaal(sunrise, sunset, 1);
 */
export function computeRahuKaal(
  sunrise: Date,
  sunset: Date,
  weekday: number,
): TimePeriod {
  const segmentNumber: number = RAHU_KAAL_SEGMENTS[weekday];
  return computeSegmentPeriod(sunrise, sunset, segmentNumber);
}

/**
 * Compute **Yamaghanta Kaal** for a given day.
 *
 * Yamaghanta Kaal is ruled by Yama (Lord of Death) and is considered
 * inauspicious, especially for travel.
 *
 * @param sunrise  - Sunrise time
 * @param sunset   - Sunset time
 * @param weekday  - Day of week (0 = Sunday … 6 = Saturday)
 * @returns The Yamaghanta Kaal time period
 */
export function computeYamaghantaKaal(
  sunrise: Date,
  sunset: Date,
  weekday: number,
): TimePeriod {
  const segmentNumber: number = YAMAGHANTA_SEGMENTS[weekday];
  return computeSegmentPeriod(sunrise, sunset, segmentNumber);
}

/**
 * Compute **Gulika (Mandi) Kaal** for a given day.
 *
 * Gulika is considered the offspring of Saturn and its period is
 * deemed inauspicious for initiating important activities.
 *
 * @param sunrise  - Sunrise time
 * @param sunset   - Sunset time
 * @param weekday  - Day of week (0 = Sunday … 6 = Saturday)
 * @returns The Gulika Kaal time period
 */
export function computeGulikaKaal(
  sunrise: Date,
  sunset: Date,
  weekday: number,
): TimePeriod {
  const segmentNumber: number = GULIKA_SEGMENTS[weekday];
  return computeSegmentPeriod(sunrise, sunset, segmentNumber);
}

/**
 * Compute all three inauspicious periods at once.
 *
 * Convenience function that returns Rahu Kaal, Yamaghanta Kaal, and
 * Gulika Kaal for a single sunrise/sunset/weekday combination.
 *
 * @param sunrise  - Sunrise time
 * @param sunset   - Sunset time
 * @param weekday  - Day of week (0 = Sunday … 6 = Saturday)
 * @returns Object containing all three inauspicious periods
 */
export function computeAllInauspiciousPeriods(
  sunrise: Date,
  sunset: Date,
  weekday: number,
): {
  rahuKaal: TimePeriod;
  yamaghantaKaal: TimePeriod;
  gulikaKaal: TimePeriod;
} {
  return {
    rahuKaal: computeRahuKaal(sunrise, sunset, weekday),
    yamaghantaKaal: computeYamaghantaKaal(sunrise, sunset, weekday),
    gulikaKaal: computeGulikaKaal(sunrise, sunset, weekday),
  };
}

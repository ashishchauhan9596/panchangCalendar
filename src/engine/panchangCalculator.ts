/**
 * @fileoverview Panchang element calculator.
 *
 * Computes the five limbs (Panchangam) of the Hindu calendar from sidereal
 * (Nirāyana) longitudes of the Sun and Moon:
 *
 * | Element    | Derived from                              | Segment size |
 * |------------|-------------------------------------------|-------------|
 * | **Tithi**  | Moon − Sun elongation                     | 12°         |
 * | **Nakshatra** | Moon longitude                         | 13°20′      |
 * | **Yoga**   | Moon longitude + Sun longitude             | 13°20′      |
 * | **Karana** | Moon − Sun elongation                      | 6°          |
 * | **Vara**   | Weekday of sunrise                        | —           |
 *
 * All longitude inputs must already be **sidereal** (Lahiri-corrected).
 */

import type { TithiInfo, NakshatraInfo, YogaInfo, KaranaInfo } from './types';
import { normalize360 } from './mathUtils';
import {
  TITHI_NAMES,
  TITHI_NAMES_IN_PAKSHA,
  NAKSHATRA_NAMES,
  YOGA_NAMES,
  KARANA_REPEATING_NAMES,
  KARANA_FIXED_NAMES,
  VARA_NAMES,
} from '../constants/panchangNames';

// ──────────────────────────────────────────────
// Constants
// ──────────────────────────────────────────────

/** Degrees per tithi: 360° ÷ 30 = 12° */
const DEGREES_PER_TITHI: number = 12;

/** Degrees per nakshatra: 360° ÷ 27 = 13°20′ = 13.3333…° */
const DEGREES_PER_NAKSHATRA: number = 360 / 27;

/** Degrees per yoga: same as nakshatra = 13°20′ */
const DEGREES_PER_YOGA: number = 360 / 27;

/** Degrees per karana: 360° ÷ 60 = 6° */
const DEGREES_PER_KARANA: number = 6;

// ──────────────────────────────────────────────
// Tithi
// ──────────────────────────────────────────────

/**
 * Compute the current Tithi from sidereal Moon and Sun longitudes.
 *
 * **Method**: The Moon–Sun elongation (ΔL = Moon − Sun, normalised to 0–360°)
 * is divided into 30 equal segments of 12° each.
 *
 * - Tithis 1–15 → Shukla Paksha (waxing / bright half)
 * - Tithis 16–30 → Krishna Paksha (waning / dark half)
 *
 * @param moonLongitude - Sidereal Moon longitude in degrees
 * @param sunLongitude  - Sidereal Sun longitude in degrees
 * @returns Complete tithi information
 */
export function computeTithi(moonLongitude: number, sunLongitude: number): TithiInfo {
  const elongation: number = normalize360(moonLongitude - sunLongitude);

  // Continuous tithi position (0-based, fractional)
  const tithiPosition: number = elongation / DEGREES_PER_TITHI;

  // 1-based tithi number (1–30)
  const tithiNumber: number = Math.floor(tithiPosition) + 1;

  // Elapsed fraction within the current tithi (0.0–1.0)
  const elapsed: number = tithiPosition - Math.floor(tithiPosition);

  // Determine paksha
  const paksha: 'shukla' | 'krishna' = tithiNumber <= 15 ? 'shukla' : 'krishna';

  // Paksha-relative number (1–15)
  const pakshaNumber: number = tithiNumber <= 15 ? tithiNumber : tithiNumber - 15;

  // Build the display name
  let name: string;
  if (tithiNumber === 15) {
    name = 'Purnima';
  } else if (tithiNumber === 30) {
    name = 'Amavasya';
  } else {
    const pakshaLabel: string = paksha === 'shukla' ? 'Shukla' : 'Krishna';
    name = `${pakshaLabel} ${TITHI_NAMES_IN_PAKSHA[pakshaNumber]}`;
  }

  return {
    number: tithiNumber,
    paksha,
    pakshaNumber,
    name,
    elapsed,
  };
}

// ──────────────────────────────────────────────
// Nakshatra
// ──────────────────────────────────────────────

/**
 * Compute the current Nakshatra from the sidereal Moon longitude.
 *
 * **Method**: The Moon's sidereal longitude is divided into 27 equal
 * segments of 13°20′ (13.3333…°) each, starting from 0° sidereal Aries
 * (Ashwini).
 *
 * @param moonLongitude - Sidereal Moon longitude in degrees
 * @returns Nakshatra information
 */
export function computeNakshatra(moonLongitude: number): NakshatraInfo {
  const normalizedMoon: number = normalize360(moonLongitude);
  const nakshatraPosition: number = normalizedMoon / DEGREES_PER_NAKSHATRA;

  const nakshatraNumber: number = Math.floor(nakshatraPosition) + 1;
  const elapsed: number = nakshatraPosition - Math.floor(nakshatraPosition);

  return {
    number: nakshatraNumber,
    name: NAKSHATRA_NAMES[nakshatraNumber],
    elapsed,
  };
}

// ──────────────────────────────────────────────
// Yoga
// ──────────────────────────────────────────────

/**
 * Compute the current Yoga (Niti-Yoga) from sidereal longitudes.
 *
 * **Method**: The sum of the Moon's and Sun's sidereal longitudes is
 * divided into 27 equal segments of 13°20′.  Unlike Nakshatra (which
 * depends only on the Moon), Yoga is a luni-solar quantity.
 *
 *   yogaIndex = floor( (moonLng + sunLng) mod 360° / 13.333…° )
 *
 * @param moonLongitude - Sidereal Moon longitude in degrees
 * @param sunLongitude  - Sidereal Sun longitude in degrees
 * @returns Yoga information
 */
export function computeYoga(moonLongitude: number, sunLongitude: number): YogaInfo {
  const sumLongitudes: number = normalize360(moonLongitude + sunLongitude);
  const yogaPosition: number = sumLongitudes / DEGREES_PER_YOGA;

  const yogaNumber: number = Math.floor(yogaPosition) + 1;
  const elapsed: number = yogaPosition - Math.floor(yogaPosition);

  return {
    number: yogaNumber,
    name: YOGA_NAMES[yogaNumber],
    elapsed,
  };
}

// ──────────────────────────────────────────────
// Karana
// ──────────────────────────────────────────────

/**
 * Compute the current Karana from sidereal Moon and Sun longitudes.
 *
 * **Method**: The Moon–Sun elongation is divided into 60 segments of 6°
 * each (i.e. each tithi contains exactly 2 karanas).
 *
 * There are 11 distinct karana names:
 * - **4 fixed (sthira)**: occupy positions 1, 58, 59, 60
 * - **7 repeating (chara)**: cycle through positions 2–57 (8 full cycles)
 *
 * @param moonLongitude - Sidereal Moon longitude in degrees
 * @param sunLongitude  - Sidereal Sun longitude in degrees
 * @returns Karana information
 */
export function computeKarana(moonLongitude: number, sunLongitude: number): KaranaInfo {
  const elongation: number = normalize360(moonLongitude - sunLongitude);
  const karanaPosition: number = elongation / DEGREES_PER_KARANA;

  // 1-based karana number (1–60)
  const karanaNumber: number = Math.floor(karanaPosition) + 1;
  const elapsed: number = karanaPosition - Math.floor(karanaPosition);

  // Determine name from fixed or repeating table
  let name: string;

  if (karanaNumber in KARANA_FIXED_NAMES) {
    // Positions 1, 58, 59, 60 are fixed karanas
    name = KARANA_FIXED_NAMES[karanaNumber];
  } else {
    // Positions 2–57 use the 7 repeating karanas
    // (karanaNumber - 2) gives a 0-based index into the repeating cycle
    const repeatingIndex: number = (karanaNumber - 2) % 7;
    name = KARANA_REPEATING_NAMES[repeatingIndex];
  }

  return {
    number: karanaNumber,
    name,
    elapsed,
  };
}

// ──────────────────────────────────────────────
// Vara (Weekday)
// ──────────────────────────────────────────────

/**
 * Compute the Vara (weekday) based on the sunrise time.
 *
 * In the Hindu calendar, the day changes at **sunrise**, not midnight.
 * Therefore the vara is determined by the weekday of the sunrise moment.
 *
 * @param sunrise - The local sunrise `Date` for the day
 * @returns An object with the vara index (0 = Sunday) and its Sanskrit name
 */
export function computeVara(sunrise: Date): { vara: number; varaName: string } {
  const vara: number = sunrise.getDay(); // 0=Sun, 1=Mon, …, 6=Sat
  return {
    vara,
    varaName: VARA_NAMES[vara],
  };
}

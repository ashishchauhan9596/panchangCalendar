/**
 * @fileoverview Hindu Lunar Month Resolver.
 *
 * Resolves the Hindu month name and Adhik (leap month) status for any given date
 * based on the Sun's sidereal rashi (zodiac sign) at the preceding and following new moons.
 */

import { getSiderealPositions } from './positionsCalculator';
import { dateToJD } from './dateUtils';
import { normalize360 } from './mathUtils';
import { HINDU_MONTH_NAMES, HINDU_MONTH_NAMES_GUJARATI } from '../constants/panchangNames';
import type { HinduMonthInfo } from './types';

// Helper to get Moon - Sun elongation in degrees in range [-180, 180)
function getElongation180(jd: number): number {
  const { sunLongitude, moonLongitude } = getSiderealPositions(jd);
  let diff = normalize360(moonLongitude - sunLongitude);
  if (diff > 180) diff -= 360;
  return diff;
}

/**
 * Finds the exact Julian Day of a conjunction (New Moon) near a guess JD
 * using the Secant root-finding method.
 *
 * @param guessJd - Starting guess for the conjunction JD
 * @returns Refined Julian Day of the conjunction
 */
export function findConjunction(guessJd: number): number {
  let t0 = guessJd - 0.05; // ~1.2 hours before guess
  let t1 = guessJd;

  let f0 = getElongation180(t0);
  let f1 = getElongation180(t1);

  for (let i = 0; i < 15; i++) {
    if (Math.abs(f1) < 0.000001) return t1;
    if (Math.abs(f1 - f0) < 0.000001) break;
    const t2 = t1 - (f1 * (t1 - t0)) / (f1 - f0);
    t0 = t1;
    f0 = f1;
    t1 = t2;
    f1 = getElongation180(t1);
  }
  return t1;
}

/**
 * Finds the exact Julian Day of the conjunction (New Moon) preceding a given JD.
 *
 * @param jd - Julian Day
 * @returns Preceding conjunction Julian Day
 */
export function findConjunctionPreceding(jd: number): number {
  const pos = getSiderealPositions(jd);
  const elongation = normalize360(pos.moonLongitude - pos.sunLongitude);

  // Mean synodic motion of the Moon relative to the Sun is ~12.19075 degrees/day
  const guess = jd - elongation / 12.19075;
  return findConjunction(guess);
}

/**
 * Finds the exact Julian Day of the conjunction (New Moon) following a given JD.
 *
 * @param jd - Julian Day
 * @returns Following conjunction Julian Day
 */
export function findConjunctionFollowing(jd: number): number {
  const pos = getSiderealPositions(jd);
  const elongation = normalize360(pos.moonLongitude - pos.sunLongitude);

  const guess = jd + (360 - elongation) / 12.19075;
  return findConjunction(guess);
}

/**
 * Resolves the Hindu month info (name, number, isAdhik) for a given date.
 *
 * @param date - The Date to resolve
 * @returns HinduMonthInfo
 */
function getSamvatYear(
  date: Date,
  monthNumber: number,
  paksha: 'shukla' | 'krishna',
  calendarSystem: 'amant' | 'purnimant'
): number {
  const gregYear = date.getFullYear();
  if (calendarSystem === 'amant') {
    const gregMonth = date.getMonth(); // 0-11
    if (gregMonth >= 9) { // Oct, Nov, Dec
      const isKartikOrLater = monthNumber > 8 || (monthNumber === 8 && paksha === 'shukla');
      return isKartikOrLater ? gregYear + 57 : gregYear + 56;
    } else {
      return gregYear + 56;
    }
  } else {
    const gregMonth = date.getMonth(); // 0-11
    if (gregMonth >= 2) { // March or later
      const isChaitraOrLater = monthNumber > 1 || (monthNumber === 1 && paksha === 'shukla');
      return isChaitraOrLater ? gregYear + 57 : gregYear + 56;
    } else {
      return gregYear + 56;
    }
  }
}

/**
 * Resolves the Hindu month info (name, number, isAdhik, samvat) for a given date.
 *
 * @param date - The Date to resolve
 * @returns HinduMonthInfo
 */
export function resolveHinduMonth(
  date: Date,
  paksha: 'shukla' | 'krishna' = 'shukla',
  calendarSystem: 'amant' | 'purnimant' = 'amant'
): HinduMonthInfo {
  const jd = dateToJD(date);

  // 1. Find the boundaries of the current lunar month (conjunctions)
  const jdPrev = findConjunctionPreceding(jd);
  const jdNext = findConjunctionFollowing(jd);

  // 2. Get the Sun's sidereal longitude at both boundaries
  const posPrev = getSiderealPositions(jdPrev);
  const posNext = getSiderealPositions(jdNext);

  // 3. Determine the Sun's Rashi (zodiac sign) at both boundaries (0 = Aries ... 11 = Pisces)
  const rashiPrev = Math.floor(posPrev.sunLongitude / 30);
  const rashiNext = Math.floor(posNext.sunLongitude / 30);

  // 4. If the Sun did not cross a Rashi boundary, it is an Adhika Masa (leap month)
  const isAdhik = rashiPrev === rashiNext;

  // 5. Determine Month Number (1 = Chaitra ... 12 = Phalguna)
  // In a normal month, the month name is determined by rashiNext.
  // In an Adhik month, it takes the name of the following normal month.
  let monthNumber = rashiNext + 1;
  if (isAdhik) {
    monthNumber = ((rashiNext + 1) % 12) + 1;
  }

  // Handle wrapping and bounds
  if (monthNumber < 1) monthNumber = 12;
  if (monthNumber > 12) monthNumber = 1;

  let name = HINDU_MONTH_NAMES[monthNumber];
  let nameGujarati = HINDU_MONTH_NAMES_GUJARATI[monthNumber];

  if (isAdhik) {
    name = `Adhik ${name}`;
    nameGujarati = `અધિક ${nameGujarati}`;
  }

  const samvat = getSamvatYear(date, monthNumber, paksha, calendarSystem);

  return {
    name,
    nameGujarati,
    number: monthNumber,
    isAdhik,
    samvat,
  };
}

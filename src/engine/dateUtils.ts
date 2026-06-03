/**
 * @fileoverview Julian Date and calendar conversion utilities.
 *
 * Julian Day Numbers (JD) provide a continuous day count used in astronomy.
 * The epoch J2000.0 (JD 2451545.0 = 2000-01-01 12:00 TT) is the reference
 * for most modern astronomical formulae.
 *
 * All algorithms follow Jean Meeus, *Astronomical Algorithms*, 2nd ed.
 */

/**
 * Convert a JavaScript `Date` (interpreted as UTC) to a Julian Day Number.
 *
 * **Algorithm**: Meeus, Chapter 7, valid for dates on or after the Gregorian
 * reform (15 Oct 1582).  The Gregorian correction terms A and B account for
 * the leap-year rule change.
 *
 * @param date - A `Date` object; its UTC components are used.
 * @returns Julian Day Number (fractional days since 1 Jan 4713 BC 12:00 UT).
 */
export function dateToJD(date: Date): number {
  let year: number = date.getUTCFullYear();
  let month: number = date.getUTCMonth() + 1; // JS months are 0-based

  const dayFraction: number =
    date.getUTCDate() +
    date.getUTCHours() / 24 +
    date.getUTCMinutes() / 1440 +
    date.getUTCSeconds() / 86400 +
    date.getUTCMilliseconds() / 86400000;

  // Meeus convention: treat Jan & Feb as months 13 & 14 of the previous year
  if (month <= 2) {
    year -= 1;
    month += 12;
  }

  // Gregorian correction
  const centuryTerm: number = Math.floor(year / 100);
  const gregorianCorrection: number = 2 - centuryTerm + Math.floor(centuryTerm / 4);

  return (
    Math.floor(365.25 * (year + 4716)) +
    Math.floor(30.6001 * (month + 1)) +
    dayFraction +
    gregorianCorrection -
    1524.5
  );
}

/**
 * Convert a Julian Day Number back to a JavaScript `Date` (UTC).
 *
 * **Algorithm**: Meeus, Chapter 7 inverse.
 *
 * @param jd - Julian Day Number
 * @returns UTC `Date` object
 */
export function jdToDate(jd: number): Date {
  const z: number = Math.floor(jd + 0.5);
  const fractionalDay: number = jd + 0.5 - z;

  let A: number;
  if (z < 2299161) {
    // Julian calendar date (before 15 Oct 1582)
    A = z;
  } else {
    const alpha: number = Math.floor((z - 1867216.25) / 36524.25);
    A = z + 1 + alpha - Math.floor(alpha / 4);
  }

  const B: number = A + 1524;
  const C: number = Math.floor((B - 122.1) / 365.25);
  const D: number = Math.floor(365.25 * C);
  const E: number = Math.floor((B - D) / 30.6001);

  const day: number = B - D - Math.floor(30.6001 * E) + fractionalDay;
  const month: number = E < 14 ? E - 1 : E - 13;
  const year: number = month > 2 ? C - 4716 : C - 4715;

  const dayInt: number = Math.floor(day);
  const dayFrac: number = day - dayInt;
  const hours: number = Math.floor(dayFrac * 24);
  const minutes: number = Math.floor((dayFrac * 24 - hours) * 60);
  const seconds: number = Math.floor(((dayFrac * 24 - hours) * 60 - minutes) * 60);
  const milliseconds: number = Math.round(
    ((((dayFrac * 24 - hours) * 60 - minutes) * 60 - seconds) * 1000)
  );

  return new Date(Date.UTC(year, month - 1, dayInt, hours, minutes, seconds, milliseconds));
}

/**
 * Compute the number of Julian centuries elapsed since the J2000.0 epoch.
 *
 * T is the fundamental time argument in most astronomical position formulae.
 *
 *   T = (JD − 2451545.0) / 36525
 *
 * where 36525 is the number of days in a Julian century.
 *
 * @param jd - Julian Day Number
 * @returns Julian centuries since J2000.0 (positive = after, negative = before)
 */
export function julianCenturies(jd: number): number {
  return (jd - 2451545.0) / 36525.0;
}

/**
 * Add a (possibly fractional) number of days to a `Date`.
 *
 * @param date  - Base date
 * @param days  - Number of days to add (may be negative or fractional)
 * @returns New `Date` offset by the specified number of days
 */
export function addDays(date: Date, days: number): Date {
  return new Date(date.getTime() + days * 86400000);
}

/**
 * Get the day-of-year (1-based) for a given `Date`.
 *
 * @param date - Input date
 * @returns Day number within the year (1 = Jan 1, 365/366 = Dec 31)
 */
export function dayOfYear(date: Date): number {
  const startOfYear = new Date(Date.UTC(date.getUTCFullYear(), 0, 1));
  const diffMs = date.getTime() - startOfYear.getTime();
  return Math.floor(diffMs / 86400000) + 1;
}

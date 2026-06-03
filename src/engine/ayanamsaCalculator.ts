/**
 * @fileoverview Lahiri (Chitrapaksha) Ayanamsa calculator.
 *
 * **Ayanamsa** is the angular difference between the tropical (Sāyana) and
 * sidereal (Nirāyana) zodiacs, caused by the precession of the equinoxes.
 *
 * The Lahiri ayanamsa is the official standard used by the Indian
 * Astronomical Ephemeris (published by the Positional Astronomy Centre,
 * Government of India).  It is defined so that the star Spica (Chitrā)
 * lies at exactly 0° sidereal Libra — hence the alternate name
 * "Chitrapaksha Ayanamsa".
 *
 * **Polynomial approximation** (valid ~1900–2100):
 *
 *   ε(T) = 23.85 + 1.396917·T + 0.000308·T²
 *
 * where T = Julian centuries since J2000.0.
 *
 * **References**:
 * - Indian Astronomical Ephemeris, Positional Astronomy Centre, Kolkata.
 * - Lahiri, N.C.  *Tables of the Sun*, Calcutta, 1957.
 */

import { dateToJD, julianCenturies } from './dateUtils';

/**
 * Compute the Lahiri (Chitrapaksha) Ayanamsa for a given Julian Day Number.
 *
 * The result represents how many degrees the sidereal First Point of Aries
 * has shifted (westward) from the tropical equinox due to precession.
 *
 * To convert a tropical longitude to sidereal:
 *   `siderealLng = tropicalLng − ayanamsa`
 *
 * @param jd - Julian Day Number (e.g. from `dateToJD`)
 * @returns Ayanamsa in decimal degrees (≈ 24° in the 2020s)
 *
 * @example
 * // Ayanamsa on 1 January 2025 ≈ 24.19°
 * const jd = dateToJD(new Date('2025-01-01T00:00:00Z'));
 * const aya = computeLahiriAyanamsa(jd); // ~24.19
 */
export function computeLahiriAyanamsa(jd: number): number {
  const T: number = julianCenturies(jd);

  // Polynomial approximation:
  //   ε = c₀ + c₁·T + c₂·T²
  const ayanamsaDegrees: number =
    23.85 +
    1.396917 * T +
    0.000308 * T * T;

  return ayanamsaDegrees;
}

/**
 * Compute the Lahiri Ayanamsa directly from a JavaScript `Date`.
 *
 * Convenience wrapper around {@link computeLahiriAyanamsa}.
 *
 * @param date - A `Date` object (UTC components are used)
 * @returns Ayanamsa in decimal degrees
 */
export function computeLahiriAyanamsaForDate(date: Date): number {
  const jd: number = dateToJD(date);
  return computeLahiriAyanamsa(jd);
}

/**
 * Convert a tropical (Sāyana) ecliptic longitude to its sidereal
 * (Nirāyana) equivalent by subtracting the Lahiri Ayanamsa.
 *
 * The result is normalised to the [0, 360) range.
 *
 * @param tropicalLongitude - Tropical longitude in degrees
 * @param jd                - Julian Day Number for the computation instant
 * @returns Sidereal longitude in degrees [0, 360)
 */
export function tropicalToSidereal(tropicalLongitude: number, jd: number): number {
  const ayanamsa: number = computeLahiriAyanamsa(jd);
  let siderealLongitude: number = tropicalLongitude - ayanamsa;

  // Normalise to [0, 360)
  siderealLongitude = siderealLongitude % 360;
  if (siderealLongitude < 0) siderealLongitude += 360;

  return siderealLongitude;
}

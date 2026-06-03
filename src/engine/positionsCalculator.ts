/**
 * @fileoverview Sidereal positions calculator for Sun and Moon.
 *
 * Extracted to resolve circular dependencies between monthResolver and astronomicalEngine.
 */

// @ts-ignore
import { solar, moonposition } from 'astronomia';
import { normalize360 } from './mathUtils';
import { computeLahiriAyanamsa } from './ayanamsaCalculator';

/**
 * Computes the sidereal longitudes of the Sun and Moon at a given Julian Day.
 *
 * @param jd - Julian Day Number
 * @returns Object containing sidereal Sun & Moon longitudes (degrees) and Ayanamsa (degrees)
 */
export function getSiderealPositions(jd: number): {
  sunLongitude: number;
  moonLongitude: number;
  ayanamsa: number;
} {
  const T = (jd - 2451545.0) / 36525.0; // Julian centuries since J2000.0

  // 1. Get tropical Sun longitude (returns { lon, ano } in radians)
  const sunPos = solar.trueLongitude(T);
  const sunTropicalLng = (sunPos.lon * 180) / Math.PI;

  // 2. Get tropical Moon longitude (returns Coord { lon, lat, range } in radians)
  const moonPos = moonposition.position(jd);
  const moonTropicalLng = (moonPos.lon * 180) / Math.PI;

  // 3. Compute Ayanamsa (degrees)
  const ayanamsa = computeLahiriAyanamsa(jd);

  // 4. Subtract Ayanamsa to get sidereal longitudes (normalized to [0, 360))
  const sunSidereal = normalize360(sunTropicalLng - ayanamsa);
  const moonSidereal = normalize360(moonTropicalLng - ayanamsa);

  return {
    sunLongitude: sunSidereal,
    moonLongitude: moonSidereal,
    ayanamsa,
  };
}

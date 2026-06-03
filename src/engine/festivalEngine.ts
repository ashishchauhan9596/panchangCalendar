/**
 * @fileoverview Festival Engine.
 *
 * Resolves rule-based festivals, Swaminarayan calendar overrides,
 * and Vaishnava Ekadashi fasts for any given date and observer location.
 */

import festivalsDb from './festivals.json';
import overridesDb from './nirnayOverrides.json';
import { checkEkadashiFast } from './ekadashiResolver';
import type { PanchangData, FestivalInfo } from './types';

/**
 * Resolves all festivals and observances for a given date and location.
 *
 * @param date - The Date to resolve
 * @param lat - Observer latitude
 * @param lng - Observer longitude
 * @param panchang - Computed PanchangData for the sunrise moment of the day
 * @returns Array of FestivalInfo objects
 */
export function resolveFestivals(
  date: Date,
  lat: number,
  lng: number,
  panchang: Omit<PanchangData, 'festivals'>
): FestivalInfo[] {
  const resolved: FestivalInfo[] = [];

  // 1. Check for Vaishnava Ekadashi Fast
  const ekadashi = checkEkadashiFast(date, lat, lng);
  if (ekadashi) {
    resolved.push(ekadashi);
  }

  // 2. Check rule-based festivals from festivals.json
  if (panchang.hinduMonth) {
    const monthNum = panchang.hinduMonth.number;
    const isMonthAdhik = panchang.hinduMonth.isAdhik;

    // Rule-based festivals are NOT observed during Adhik Maas, unless they are specifically Adhik festivals
    if (!isMonthAdhik) {
      for (const fest of festivalsDb) {
        if (
          fest.month === monthNum &&
          fest.paksha === panchang.tithi.paksha &&
          fest.tithi === panchang.tithi.number
        ) {
          resolved.push({
            id: fest.id,
            name: fest.name,
            nameGujarati: fest.nameGujarati,
            category: fest.category as any,
            importance: fest.importance as any,
            description: fest.description,
          });
        }
      }
    }
  }

  // 3. Check for Swaminarayan Nirnay manual overrides/additions from overrides.json
  const localYear = date.getFullYear();
  const localMonth = String(date.getMonth() + 1).padStart(2, '0');
  const localDay = String(date.getDate()).padStart(2, '0');
  const dateKey = `${localYear}-${localMonth}-${localDay}`;

  const overrides = (overridesDb as Record<string, any[]>)[dateKey];
  if (overrides && Array.isArray(overrides)) {
    for (const ovr of overrides) {
      resolved.push({
        id: ovr.id,
        name: ovr.name,
        nameGujarati: ovr.nameGujarati,
        category: ovr.category as any,
        importance: ovr.importance as any,
        description: ovr.description,
      });
    }
  }

  return resolved;
}

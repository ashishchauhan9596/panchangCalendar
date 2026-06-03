/**
 * @fileoverview Vaishnava Ekadashi Resolver.
 *
 * Implements the Shuddha/Viddha Ekadashi calculation rules for the Swaminarayan/Vaishnava sect:
 * - A fast is observed on Ekadashi if the tithi is pure (Shuddha) at Arunodaya (96 mins before sunrise).
 * - If Dashami is active at Arunodaya, the Ekadashi is pierced (Viddha) and the fast shifts to Dwadashi.
 * - Handles Kshaya (skipped) Ekadashis.
 */

import { getSiderealPositions } from './positionsCalculator';
import { computeTithi } from './panchangCalculator';
import { dateToJD } from './dateUtils';
import { computeSunTimes } from './sunriseCalculator';
import { resolveHinduMonth } from './monthResolver';
import type { FestivalInfo } from './types';

// Ekadashi Names Mapping (Month Number 1-12)
const EKADASHI_NAMES: {
  [month: number]: {
    shukla: { en: string; gu: string };
    krishna: { en: string; gu: string };
  };
} = {
  1: {
    shukla: { en: 'Kamada Ekadashi', gu: 'કામદા એકાદશી' },
    krishna: { en: 'Varuthini Ekadashi', gu: 'વરુથિની એકાદશી' },
  },
  2: {
    shukla: { en: 'Mohini Ekadashi', gu: 'મોહિની એકાદશી' },
    krishna: { en: 'Apara Ekadashi', gu: 'અપરા એકાદશી' },
  },
  3: {
    shukla: { en: 'Nirjala Ekadashi', gu: 'નિર્જળા એકાદશી' },
    krishna: { en: 'Yogini Ekadashi', gu: 'યોગિની એકાદશી' },
  },
  4: {
    shukla: { en: 'Devshayani Ekadashi', gu: 'દેવશયની એકાદશી' },
    krishna: { en: 'Kamika Ekadashi', gu: 'કામિકા એકાદશી' },
  },
  5: {
    shukla: { en: 'Shravana Putrada Ekadashi', gu: 'પુત્રદા એકાદશી' },
    krishna: { en: 'Aja Ekadashi', gu: 'અજા એકાદશી' },
  },
  6: {
    shukla: { en: 'Parivartini Ekadashi', gu: 'પરિવર્તિની એકાદશી' },
    krishna: { en: 'Indira Ekadashi', gu: 'ઇન્દિરા એકાદશી' },
  },
  7: {
    shukla: { en: 'Papankusha Ekadashi', gu: 'પાપાંકુશા એકાદશી' },
    krishna: { en: 'Rama Ekadashi', gu: 'રમા એકાદશી' },
  },
  8: {
    shukla: { en: 'Devutthana (Prabodhini) Ekadashi', gu: 'પ્રબોધિની એકાદશી' },
    krishna: { en: 'Utpanna Ekadashi', gu: 'ઉત્પન્ના એકાદશી' },
  },
  9: {
    shukla: { en: 'Mokshada Ekadashi', gu: 'મોક્ષદા એકાદશી' },
    krishna: { en: 'Saphala Ekadashi', gu: 'સફલા એકાદશી' },
  },
  10: {
    shukla: { en: 'Pausha Putrada Ekadashi', gu: 'પુત્રદા એકાદશી' },
    krishna: { en: 'Shattila Ekadashi', gu: 'ષટતિલા એકાદશી' },
  },
  11: {
    shukla: { en: 'Jaya Ekadashi', gu: 'જયા એકાદશી' },
    krishna: { en: 'Vijaya Ekadashi', gu: 'વિજયા એકાદશી' },
  },
  12: {
    shukla: { en: 'Amalaki Ekadashi', gu: 'આમલકી એકાદશી' },
    krishna: { en: 'Papmochani Ekadashi', gu: 'પાપમોચની એકાદશી' },
  },
};

const ADHIK_EKADASHI = {
  shukla: { en: 'Padmini Adhik Ekadashi', gu: 'પદ્મિની અધિક એકાદશી' },
  krishna: { en: 'Parama Adhik Ekadashi', gu: 'પરમા અધિક એકાદશી' },
};

/**
 * Helper to get the tithi number at a specific date.
 */
function getTithiAt(date: Date, lat?: number, lng?: number): number {
  const jd = dateToJD(date);
  const { sunLongitude, moonLongitude } = getSiderealPositions(jd);
  return computeTithi(moonLongitude, sunLongitude).number;
}

/**
 * Returns the name and metadata of the Ekadashi for a given month, paksha, and Adhik status.
 */
export function getEkadashiNameInfo(
  monthNumber: number,
  paksha: 'shukla' | 'krishna',
  isAdhik: boolean
): { name: string; nameGujarati: string } {
  if (isAdhik) {
    return {
      name: ADHIK_EKADASHI[paksha].en,
      nameGujarati: ADHIK_EKADASHI[paksha].gu,
    };
  }
  const names = EKADASHI_NAMES[monthNumber];
  if (!names) {
    return {
      name: paksha === 'shukla' ? 'Shukla Ekadashi' : 'Krishna Ekadashi',
      nameGujarati: paksha === 'shukla' ? 'સુદ એકાદશી' : 'વદ એકાદશી',
    };
  }
  return {
    name: names[paksha].en,
    nameGujarati: names[paksha].gu,
  };
}

/**
 * Check if a given date is a Vaishnava Ekadashi fasting day.
 *
 * @param date - Date to check
 * @param lat - Latitude
 * @param lng - Longitude
 * @returns FestivalInfo if it is a fasting day, otherwise null
 */
export function checkEkadashiFast(
  date: Date,
  lat: number,
  lng: number
): FestivalInfo | null {
  // 1. Get sunrise for the day
  const sunTimes = computeSunTimes(date, lat, lng);
  const sunrise = sunTimes.sunrise;

  // 2. Tithi at sunrise of today
  const tithiSunrise = getTithiAt(sunrise, lat, lng);

  // ── Case A: Today's sunrise is Ekadashi (Tithi 11 or 26) ──
  if (tithiSunrise === 11 || tithiSunrise === 26) {
    const isShukla = tithiSunrise === 11;
    const paksha = isShukla ? 'shukla' : 'krishna';
    const targetTithi = tithiSunrise;

    // Check tithi at Arunodaya (96 minutes before sunrise)
    const arunodaya = new Date(sunrise.getTime() - 96 * 60 * 1000);
    const tithiArunodaya = getTithiAt(arunodaya, lat, lng);

    if (tithiArunodaya === targetTithi) {
      // Shuddha Ekadashi - Fast is observed today!
      const monthInfo = resolveHinduMonth(date);
      const nameInfo = getEkadashiNameInfo(monthInfo.number, paksha, monthInfo.isAdhik);

      return {
        id: `ekadashi_${monthInfo.number}_${paksha}`,
        name: nameInfo.name,
        nameGujarati: nameInfo.nameGujarati,
        category: 'fast',
        importance: 'high',
        description: 'Vaishnava Ekadashi waterless/fruit fast.',
      };
    }
    // Viddha Ekadashi - No fast today (shifts to Dwadashi tomorrow)
    return null;
  }

  // ── Case B: Today's sunrise is Dwadashi (Tithi 12 or 27) ──
  if (tithiSunrise === 12 || tithiSunrise === 27) {
    const isShukla = tithiSunrise === 12;
    const paksha = isShukla ? 'shukla' : 'krishna';
    const targetEkadashiTithi = isShukla ? 11 : 26;

    // We must check if the previous day was Viddha or if Ekadashi was Kshaya (skipped)
    const dateYesterday = new Date(date.getTime() - 24 * 60 * 60 * 1000);
    const sunTimesYesterday = computeSunTimes(dateYesterday, lat, lng);
    const sunriseYesterday = sunTimesYesterday.sunrise;

    const tithiSunriseYesterday = getTithiAt(sunriseYesterday, lat, lng);

    let isPreviousDayViddha = false;
    let isKshaya = false;

    if (tithiSunriseYesterday === targetEkadashiTithi) {
      // Yesterday's sunrise was Ekadashi. Was it Viddha at Arunodaya?
      const arunodayaYesterday = new Date(sunriseYesterday.getTime() - 96 * 60 * 1000);
      const tithiArunodayaYesterday = getTithiAt(arunodayaYesterday, lat, lng);
      if (tithiArunodayaYesterday === (targetEkadashiTithi - 1 === 0 ? 30 : targetEkadashiTithi - 1)) {
        isPreviousDayViddha = true;
      }
    } else if (tithiSunriseYesterday === (targetEkadashiTithi - 1 === 0 ? 30 : targetEkadashiTithi - 1)) {
      // Yesterday's sunrise was Dashami (10 or 25) and today's is Dwadashi.
      // This means Ekadashi was skipped (Kshaya) in between.
      isKshaya = true;
    }

    if (isPreviousDayViddha || isKshaya) {
      // Fast is observed today on Dwadashi!
      // Month info should be resolved based on yesterday's date (since it belongs to yesterday's Ekadashi tithi)
      const monthInfo = resolveHinduMonth(dateYesterday);
      const nameInfo = getEkadashiNameInfo(monthInfo.number, paksha, monthInfo.isAdhik);

      return {
        id: `ekadashi_${monthInfo.number}_${paksha}_dwadashi`,
        name: `${nameInfo.name} (Dwadashi)`,
        nameGujarati: `${nameInfo.nameGujarati} (દ્વાદશી)`,
        category: 'fast',
        importance: 'high',
        description: `Vaishnava Ekadashi fast observed on Dwadashi due to ${
          isKshaya ? 'Kshaya Ekadashi' : 'Viddha Ekadashi'
        }.`,
      };
    }
  }

  return null;
}

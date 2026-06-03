import { dateToJD, jdToDate } from '../src/engine/dateUtils';
import { computeLahiriAyanamsa } from '../src/engine/ayanamsaCalculator';
import {
  computeTithi,
  computeNakshatra,
  computeYoga,
  computeKarana,
  computeVara,
} from '../src/engine/panchangCalculator';
import { computeRahuKaal } from '../src/engine/rahuKaalCalculator';
import { computeSunTimes } from '../src/engine/sunriseCalculator';
import { computePanchang } from '../src/engine/astronomicalEngine';
import { resolveHinduMonth } from '../src/engine/monthResolver';
import { checkEkadashiFast } from '../src/engine/ekadashiResolver';
import { resolveFestivals } from '../src/engine/festivalEngine';

describe('Panchang Engine Unit Tests', () => {
  describe('Date Utilities (dateUtils)', () => {
    test('converts J2000 epoch (2000-01-01 12:00:00 UTC) to JD 2451545.0', () => {
      const date = new Date(Date.UTC(2000, 0, 1, 12, 0, 0, 0));
      const jd = dateToJD(date);
      expect(jd).toBeCloseTo(2451545.0, 5);
    });

    test('converts JD 2451545.0 back to J2000 epoch Date', () => {
      const jd = 2451545.0;
      const date = jdToDate(jd);
      expect(date.getUTCFullYear()).toBe(2000);
      expect(date.getUTCMonth()).toBe(0);
      expect(date.getUTCDate()).toBe(1);
      expect(date.getUTCHours()).toBe(12);
      expect(date.getUTCMinutes()).toBe(0);
    });
  });

  describe('Ayanamsa Calculator (ayanamsaCalculator)', () => {
    test('computes exact Lahiri ayanamsa at J2000 epoch to be 23.85 degrees', () => {
      const jd = 2451545.0; // T = 0
      const ayanamsa = computeLahiriAyanamsa(jd);
      expect(ayanamsa).toBe(23.85);
    });

    test('computes ayanamsa for 2026 to be around 24.2 degrees', () => {
      const date = new Date(Date.UTC(2026, 0, 1, 0, 0, 0));
      const jd = dateToJD(date);
      const ayanamsa = computeLahiriAyanamsa(jd);
      expect(ayanamsa).toBeGreaterThan(24.1);
      expect(ayanamsa).toBeLessThan(24.3);
    });
  });

  describe('Panchang Calculator (panchangCalculator)', () => {
    test('computes correct Tithi based on Moon-Sun elongation', () => {
      // 0 degrees elongation = Shukla Pratipada (Tithi #1)
      const tithi1 = computeTithi(100, 100);
      expect(tithi1.number).toBe(1);
      expect(tithi1.paksha).toBe('shukla');
      expect(tithi1.name).toBe('Shukla Pratipada');

      // 180 degrees elongation = Krishna Pratipada (Tithi #16)
      const tithi16 = computeTithi(280, 100);
      expect(tithi16.number).toBe(16);
      expect(tithi16.paksha).toBe('krishna');
      expect(tithi16.name).toBe('Krishna Pratipada');

      // 170 degrees elongation = Purnima (Tithi #15)
      const purnima = computeTithi(270, 100);
      expect(purnima.number).toBe(15);
      expect(purnima.paksha).toBe('shukla');
      expect(purnima.name).toBe('Purnima');

      // 350 degrees elongation = Amavasya (Tithi #30)
      const amavasya = computeTithi(90, 100);
      expect(amavasya.number).toBe(30);
      expect(amavasya.paksha).toBe('krishna');
      expect(amavasya.name).toBe('Amavasya');
    });

    test('computes Nakshatra correctly from Moon longitude', () => {
      // 0 degrees = Ashwini (Nakshatra #1)
      const n1 = computeNakshatra(0);
      expect(n1.number).toBe(1);
      expect(n1.name).toBe('Ashwini');

      // 13.333 degrees = Bharani (Nakshatra #2)
      const n2 = computeNakshatra(13.4);
      expect(n2.number).toBe(2);
      expect(n2.name).toBe('Bharani');
    });

    test('computes Yoga correctly from Moon + Sun longitudes', () => {
      // Sum = 0 degrees = Vishkumbha (Yoga #1)
      const y1 = computeYoga(0, 0);
      expect(y1.number).toBe(1);
      expect(y1.name).toBe('Vishkumbha');
    });

    test('computes Karana correctly from Moon-Sun elongation', () => {
      // Position 1 = Kimstughna (Fixed)
      const k1 = computeKarana(101, 100); // elongation = 1 degree -> karana position 1
      expect(k1.number).toBe(1);
      expect(k1.name).toBe('Kimstughna');

      // Position 2 = Bava (Repeating)
      const k2 = computeKarana(107, 100); // elongation = 7 degrees -> karana position 2
      expect(k2.number).toBe(2);
      expect(k2.name).toBe('Bava');
    });

    test('computes Vara correctly based on sunrise time', () => {
      // 2026-06-02 is a Tuesday (Day index 2)
      const sunrise = new Date('2026-06-02T06:00:00Z');
      const varaInfo = computeVara(sunrise);
      expect(varaInfo.vara).toBe(2);
      expect(varaInfo.varaName).toBe('Mangalavara');
    });
  });

  describe('Rahu Kaal Calculator (rahuKaalCalculator)', () => {
    test('divides daylight into 8 segments and maps correct segment for Monday', () => {
      // Monday (1) = Segment 2. 12-hour day: segment 2 is 07:30 to 09:00
      const sunrise = new Date('2026-06-01T06:00:00Z'); // June 1, 2026 is Monday
      const sunset = new Date('2026-06-01T18:00:00Z');
      const rc = computeRahuKaal(sunrise, sunset, 1);

      expect(rc.start.getUTCHours()).toBe(7);
      expect(rc.start.getUTCMinutes()).toBe(30);
      expect(rc.end.getUTCHours()).toBe(9);
      expect(rc.end.getUTCMinutes()).toBe(0);
    });
  });

  describe('Sunrise Calculator (sunriseCalculator)', () => {
    test('computes sensible sunrise/sunset times for Ahmedabad', () => {
      const date = new Date('2026-06-02T12:00:00Z');
      const lat = 23.0225; // Ahmedabad
      const lng = 72.5714;
      const times = computeSunTimes(date, lat, lng);

      expect(times.sunrise).toBeInstanceOf(Date);
      expect(times.sunset).toBeInstanceOf(Date);
      expect(times.sunset.getTime()).toBeGreaterThan(times.sunrise.getTime());
    });
  });

  describe('Astronomical Engine (astronomicalEngine)', () => {
    test('computes complete Panchang data successfully', () => {
      const date = new Date('2026-06-02T12:00:00Z');
      const lat = 23.0225;
      const lng = 72.5714;
      const panchang = computePanchang(date, lat, lng);

      expect(panchang.date).toBe(date);
      expect(panchang.tithi).toBeDefined();
      expect(panchang.nakshatra).toBeDefined();
      expect(panchang.yoga).toBeDefined();
      expect(panchang.karana).toBeDefined();
      expect(panchang.vara).toBeDefined();
      expect(panchang.sunrise).toBeInstanceOf(Date);
      expect(panchang.sunset).toBeInstanceOf(Date);
      expect(panchang.sunLongitude).toBeGreaterThanOrEqual(0);
      expect(panchang.moonLongitude).toBeGreaterThanOrEqual(0);
      expect(panchang.hinduMonth).toBeDefined();
      expect(panchang.hinduMonth?.name).toBeDefined();
    });
  });

  describe('Month Resolver (monthResolver)', () => {
    test('resolves Hindu month name and number successfully', () => {
      const date = new Date('2026-06-02T12:00:00Z');
      const monthInfo = resolveHinduMonth(date);
      expect(monthInfo.number).toBeGreaterThanOrEqual(1);
      expect(monthInfo.number).toBeLessThanOrEqual(12);
      expect(monthInfo.name).toBeDefined();
      expect(monthInfo.nameGujarati).toBeDefined();
      expect(monthInfo.isAdhik).toBeDefined();
      console.log('Resolved month for 2026-06-02:', monthInfo);
    });
  });

  describe('Ekadashi Resolver (ekadashiResolver)', () => {
    test('identifies Ekadashi fast days in June 2026', () => {
      const lat = 23.0225; // Ahmedabad
      const lng = 72.5714;
      const foundEkadashis: string[] = [];

      for (let day = 1; day <= 30; day++) {
        // Date in local time of Ahmedabad (+5.5 UTC)
        // Let's create the date at noon local time
        const date = new Date(Date.UTC(2026, 5, day, 6, 30, 0)); // June is month 5 (0-indexed)
        const fastInfo = checkEkadashiFast(date, lat, lng);
        if (fastInfo) {
          foundEkadashis.push(`${date.toISOString().split('T')[0]}: ${fastInfo.name} / ${fastInfo.nameGujarati}`);
        }
      }

      console.log('Fasting Ekadashis in June 2026:', foundEkadashis);
      expect(foundEkadashis.length).toBeGreaterThanOrEqual(1);
    });
  });

  describe('Festival Engine (festivalEngine)', () => {
    test('applies overrides from overrides.json successfully', () => {
      const date = new Date('2026-04-26T12:00:00Z');
      const lat = 23.0225;
      const lng = 72.5714;
      const panchang = computePanchang(date, lat, lng);
      
      const swamiJayanti = panchang.festivals.find(f => f.id === 'swaminarayan_jayanti_override');
      expect(swamiJayanti).toBeDefined();
      expect(swamiJayanti?.name).toBe('Hari Jayanti Special Celebration');
    });

    test('resolves Rama Navami & Hari Jayanti in 2026', () => {
      // In 2026, Ram Navami falls on March 26 (Chaitra Shukla 9)
      const date = new Date('2026-03-26T12:00:00Z');
      const lat = 23.0225;
      const lng = 72.5714;
      const panchang = computePanchang(date, lat, lng);
      
      const ramNavami = panchang.festivals.find(f => f.id === 'ram_navami');
      expect(ramNavami).toBeDefined();
      expect(ramNavami?.name).toContain('Ram Navami');
      console.log('Festivals resolved for 2026-03-26:', panchang.festivals);
    });
  });
});

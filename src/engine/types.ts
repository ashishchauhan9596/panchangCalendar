/**
 * @fileoverview Core type definitions for the Hindu Panchang astronomical computation engine.
 *
 * These interfaces model the five elements (Panchangam) of the Hindu calendar:
 * Tithi, Nakshatra, Yoga, Karana, and Vara — plus supplementary data such as
 * sun/moon positions, festival information, and observer location.
 */

// ──────────────────────────────────────────────
// Panchang Element Types
// ──────────────────────────────────────────────

/** Represents one of the 30 tithis (lunar days) in a synodic month. */
export interface TithiInfo {
  /** 1–30 absolute tithi number within the lunar month */
  number: number;
  /** 'shukla' (bright / waxing) or 'krishna' (dark / waning) half */
  paksha: 'shukla' | 'krishna';
  /** 1–15 tithi number within the current paksha */
  pakshaNumber: number;
  /** Sanskrit / Hindi transliterated name of the tithi */
  name: string;
  /** 0.0–1.0 fraction indicating how far through this tithi we are */
  elapsed: number;
}

/** Represents one of the 27 nakshatras (lunar mansions). */
export interface NakshatraInfo {
  /** 1–27 nakshatra number */
  number: number;
  /** Sanskrit / Hindi transliterated name */
  name: string;
  /** 0.0–1.0 elapsed fraction within this nakshatra */
  elapsed: number;
}

/** Represents one of the 27 yogas (luni-solar combinations). */
export interface YogaInfo {
  /** 1–27 yoga number */
  number: number;
  /** Sanskrit / Hindi transliterated name */
  name: string;
  /** 0.0–1.0 elapsed fraction within this yoga */
  elapsed: number;
}

/** Represents one of the 60 karanas (half-tithis). */
export interface KaranaInfo {
  /** 1–60 karana number within the lunar month */
  number: number;
  /** Sanskrit / Hindi transliterated name */
  name: string;
  /** 0.0–1.0 elapsed fraction within this karana */
  elapsed: number;
}

// ──────────────────────────────────────────────
// Time & Location Types
// ──────────────────────────────────────────────

/** A time interval with explicit start and end. */
export interface TimePeriod {
  start: Date;
  end: Date;
}

/** Key solar event times for a given day and location. */
export interface SunTimes {
  /** Moment the upper limb of the Sun appears on the horizon */
  sunrise: Date;
  /** Moment the upper limb of the Sun disappears below the horizon */
  sunset: Date;
  /** Civil twilight start (Sun centre 6° below horizon, before sunrise) */
  dawn: Date;
  /** Civil twilight end (Sun centre 6° below horizon, after sunset) */
  dusk: Date;
}

// ──────────────────────────────────────────────
// Aggregate Panchang Data
// ──────────────────────────────────────────────

/** Complete Panchang output for a single date and observer location. */
export interface PanchangData {
  /** The date this panchang is computed for */
  date: Date;
  /** Observer latitude in decimal degrees (north positive) */
  latitude: number;
  /** Observer longitude in decimal degrees (east positive) */
  longitude: number;

  // ── Five Panchang elements ──
  /** Tithi information */
  tithi: TithiInfo;
  /** Nakshatra information */
  nakshatra: NakshatraInfo;
  /** Yoga information */
  yoga: YogaInfo;
  /** Karana information */
  karana: KaranaInfo;
  /** Weekday index (0 = Sunday … 6 = Saturday) */
  vara: number;
  /** Weekday name in Sanskrit */
  varaName: string;

  // ── Solar events ──
  /** Sunrise time at the observer location */
  sunrise: Date;
  /** Sunset time at the observer location */
  sunset: Date;

  // ── Solar periods ──
  /** Rahu Kaal period */
  rahuKaal: TimePeriod;
  /** Abhijit Muhurat period */
  abhijitMuhurat: TimePeriod;

  // ── Astronomical parameters ──
  /** Lahiri (Chitrapaksha) Ayanamsa value in degrees */
  ayanamsa: number;
  /** Sidereal Sun longitude in degrees (0–360) */
  sunLongitude: number;
  /** Sidereal Moon longitude in degrees (0–360) */
  moonLongitude: number;

  // ── Calendar metadata ──
  /** Hindu lunar month information (may be absent during sandhi) */
  hinduMonth?: HinduMonthInfo;
  /** Festivals falling on this day */
  festivals: FestivalInfo[];
}

// ──────────────────────────────────────────────
// Calendar Metadata
// ──────────────────────────────────────────────

/** Information about the current Hindu lunar month. */
export interface HinduMonthInfo {
  /** Month name in English transliteration */
  name: string;
  /** Month name in Gujarati script */
  nameGujarati: string;
  /** Ordinal number 1–12 (Chaitra = 1) */
  number: number;
  /** True if this is an adhik (intercalary / leap) month */
  isAdhik: boolean;
  /** Vikram Samvat year */
  samvat: number;
}

/** A festival or observance on a given day. */
export interface FestivalInfo {
  /** Unique machine-readable identifier */
  id: string;
  /** Display name in English */
  name: string;
  /** Optional display name in Gujarati */
  nameGujarati?: string;
  /** Broad category of the observance */
  category: 'major_festival' | 'fast' | 'auspicious' | 'national' | 'swaminarayan';
  /** Relative importance for UI display priority */
  importance: 'critical' | 'high' | 'medium' | 'low';
  /** Optional longer description */
  description?: string;
}

// ──────────────────────────────────────────────
// Location
// ──────────────────────────────────────────────

/** Pre-defined city with coordinates and timezone for quick selection. */
export interface CityInfo {
  /** City display name */
  name: string;
  /** State / province / region */
  state: string;
  /** Country name */
  country: string;
  /** Latitude in decimal degrees (north positive) */
  lat: number;
  /** Longitude in decimal degrees (east positive) */
  lng: number;
  /** IANA timezone identifier, e.g. 'Asia/Kolkata' */
  tz: string;
}

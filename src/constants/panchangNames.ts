/**
 * @fileoverview Canonical name tables for all Hindu Panchang calendar elements.
 *
 * Every array is **1-indexed by convention** — element [0] is a sentinel so
 * that `TITHI_NAMES[1]` corresponds to Tithi #1, etc.
 *
 * Sanskrit transliterations follow IAST-lite (no diacritics, ASCII-safe).
 */

// ──────────────────────────────────────────────
// Tithi Names (1-30)
// ──────────────────────────────────────────────

/**
 * Names of the 15 tithis within a single paksha.
 * Index 1–14 are shared between Shukla and Krishna pakshas.
 * Index 15 is Purnima (Shukla) or Amavasya (Krishna).
 */
export const TITHI_NAMES_IN_PAKSHA: readonly string[] = [
  '',            // 0 — unused sentinel
  'Pratipada',   // 1
  'Dwitiya',     // 2
  'Tritiya',     // 3
  'Chaturthi',   // 4
  'Panchami',    // 5
  'Shashthi',    // 6
  'Saptami',     // 7
  'Ashtami',     // 8
  'Navami',      // 9
  'Dashami',     // 10
  'Ekadashi',    // 11
  'Dwadashi',    // 12
  'Trayodashi',  // 13
  'Chaturdashi', // 14
  'Purnima',     // 15 — only used for Shukla Paksha
] as const;

/**
 * Full 30-tithi name list covering both pakshas.
 *
 * - Tithis 1–15: Shukla Paksha (bright half), ending with Purnima.
 * - Tithis 16–30: Krishna Paksha (dark half), ending with Amavasya.
 */
export const TITHI_NAMES: readonly string[] = [
  '',                        // 0  — unused sentinel
  'Shukla Pratipada',        // 1
  'Shukla Dwitiya',          // 2
  'Shukla Tritiya',          // 3
  'Shukla Chaturthi',        // 4
  'Shukla Panchami',         // 5
  'Shukla Shashthi',         // 6
  'Shukla Saptami',          // 7
  'Shukla Ashtami',          // 8
  'Shukla Navami',           // 9
  'Shukla Dashami',          // 10
  'Shukla Ekadashi',         // 11
  'Shukla Dwadashi',         // 12
  'Shukla Trayodashi',       // 13
  'Shukla Chaturdashi',      // 14
  'Purnima',                 // 15
  'Krishna Pratipada',       // 16
  'Krishna Dwitiya',         // 17
  'Krishna Tritiya',         // 18
  'Krishna Chaturthi',       // 19
  'Krishna Panchami',        // 20
  'Krishna Shashthi',        // 21
  'Krishna Saptami',         // 22
  'Krishna Ashtami',         // 23
  'Krishna Navami',          // 24
  'Krishna Dashami',         // 25
  'Krishna Ekadashi',        // 26
  'Krishna Dwadashi',        // 27
  'Krishna Trayodashi',      // 28
  'Krishna Chaturdashi',     // 29
  'Amavasya',                // 30
] as const;

// ──────────────────────────────────────────────
// Nakshatra Names (1-27)
// ──────────────────────────────────────────────

/**
 * The 27 nakshatras (lunar mansions), each spanning 13°20' of the ecliptic.
 *
 * Numbering starts with Ashwini at 0° sidereal Aries.
 */
export const NAKSHATRA_NAMES: readonly string[] = [
  '',                    // 0  — unused sentinel
  'Ashwini',             // 1
  'Bharani',             // 2
  'Krittika',            // 3
  'Rohini',              // 4
  'Mrigashira',          // 5
  'Ardra',               // 6
  'Punarvasu',           // 7
  'Pushya',              // 8
  'Ashlesha',            // 9
  'Magha',               // 10
  'Purva Phalguni',      // 11
  'Uttara Phalguni',     // 12
  'Hasta',               // 13
  'Chitra',              // 14
  'Swati',               // 15
  'Vishakha',            // 16
  'Anuradha',            // 17
  'Jyeshtha',            // 18
  'Moola',               // 19
  'Purva Ashadha',       // 20
  'Uttara Ashadha',      // 21
  'Shravana',            // 22
  'Dhanishta',           // 23
  'Shatabhisha',         // 24
  'Purva Bhadrapada',    // 25
  'Uttara Bhadrapada',   // 26
  'Revati',              // 27
] as const;

// ──────────────────────────────────────────────
// Yoga Names (1-27)
// ──────────────────────────────────────────────

/**
 * The 27 niti-yogas, computed from (Moon longitude + Sun longitude) ÷ 13°20'.
 */
export const YOGA_NAMES: readonly string[] = [
  '',             // 0  — unused sentinel
  'Vishkumbha',   // 1
  'Priti',        // 2
  'Ayushman',     // 3
  'Saubhagya',    // 4
  'Shobhana',     // 5
  'Atiganda',     // 6
  'Sukarma',      // 7
  'Dhriti',       // 8
  'Shula',        // 9
  'Ganda',        // 10
  'Vriddhi',      // 11
  'Dhruva',       // 12
  'Vyaghata',     // 13
  'Harshana',     // 14
  'Vajra',        // 15
  'Siddhi',       // 16
  'Vyatipata',    // 17
  'Variyana',     // 18
  'Parigha',      // 19
  'Shiva',        // 20
  'Siddha',       // 21
  'Sadhya',       // 22
  'Shubha',       // 23
  'Shukla',       // 24
  'Brahma',       // 25
  'Indra',        // 26
  'Vaidhriti',    // 27
] as const;

// ──────────────────────────────────────────────
// Karana Names
// ──────────────────────────────────────────────

/**
 * The 7 **repeating** (chara) karanas that cycle through positions 2–57.
 *
 * Each complete cycle covers 7 karanas; 56 positions ÷ 7 = 8 full cycles.
 */
export const KARANA_REPEATING_NAMES: readonly string[] = [
  'Bava',     // 0
  'Balava',   // 1
  'Kaulava',  // 2
  'Taitila',  // 3
  'Gara',     // 4
  'Vanija',   // 5
  'Vishti',   // 6  — also called Bhadra (inauspicious)
] as const;

/**
 * The 4 **fixed** (sthira) karanas, occupying the first and last three positions.
 *
 * - Position 1:  Kimstughna
 * - Position 58: Shakuni
 * - Position 59: Chatushpada
 * - Position 60: Nagava
 */
export const KARANA_FIXED_NAMES: {
  readonly [position: number]: string;
} = {
  1: 'Kimstughna',
  58: 'Shakuni',
  59: 'Chatushpada',
  60: 'Nagava',
} as const;

// ──────────────────────────────────────────────
// Vara (Weekday) Names
// ──────────────────────────────────────────────

/**
 * Sanskrit weekday names, indexed 0 (Sunday) through 6 (Saturday).
 *
 * These align with `Date.getDay()` in JavaScript.
 */
export const VARA_NAMES: readonly string[] = [
  'Ravivara',     // 0 — Sunday    (Ravi = Sun)
  'Somavara',     // 1 — Monday    (Soma = Moon)
  'Mangalavara',  // 2 — Tuesday   (Mangala = Mars)
  'Budhavara',    // 3 — Wednesday (Budha = Mercury)
  'Guruvara',     // 4 — Thursday  (Guru = Jupiter)
  'Shukravara',   // 5 — Friday    (Shukra = Venus)
  'Shanivara',    // 6 — Saturday  (Shani = Saturn)
] as const;

// ──────────────────────────────────────────────
// Hindu Month Names (Chaitra = 1 … Phalguna = 12)
// ──────────────────────────────────────────────

/**
 * Hindu lunar month names in English transliteration.
 *
 * The Hindu lunar year begins with Chaitra (March/April).
 */
export const HINDU_MONTH_NAMES: readonly string[] = [
  '',              // 0  — unused sentinel
  'Chaitra',       // 1
  'Vaishakha',     // 2
  'Jyeshtha',      // 3
  'Ashadha',       // 4
  'Shravana',      // 5
  'Bhadrapada',    // 6
  'Ashwin',        // 7
  'Kartik',        // 8
  'Margashirsha',  // 9
  'Pausha',        // 10
  'Magha',         // 11
  'Phalguna',      // 12
] as const;

/**
 * Hindu lunar month names in Gujarati script.
 */
export const HINDU_MONTH_NAMES_GUJARATI: readonly string[] = [
  '',            // 0  — unused sentinel
  'ચૈત્ર',       // 1
  'વૈશાખ',      // 2
  'જેઠ',         // 3
  'અષાઢ',       // 4
  'શ્રાવણ',     // 5
  'ભાદરવો',     // 6
  'આસો',        // 7
  'કારતક',      // 8
  'માગશર',      // 9
  'પોષ',         // 10
  'મહા',         // 11
  'ફાગણ',       // 12
] as const;

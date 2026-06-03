/**
 * Formatting Utilities for Panchang Display
 *
 * Specialized formatters for Hindu calendar data presentation.
 */

import type { TithiInfo, NakshatraInfo, PanchangData, TimePeriod } from '../engine/types';
import { formatTime12h, formatTimeRange } from './dateUtils';
import { useSettingsStore } from '../stores/settingsStore';
import { translatePanchang } from '../i18n/translator';

/**
 * Format tithi as "Shukla Dwitiya" or "Krishna Ekadashi"
 */
export function formatTithi(tithi: TithiInfo): string {
  const lang = useSettingsStore.getState().language;
  // tithi.name already has the paksha name in the engine, e.g., "Shukla Pratipada"
  // so we just translate that string directly.
  return translatePanchang(tithi.name, lang);
}

/**
 * Format tithi with short paksha prefix: "S. Dwitiya" or "K. Ekadashi"
 */
export function formatTithiShort(tithi: TithiInfo): string {
  const lang = useSettingsStore.getState().language;
  const prefix = tithi.paksha === 'shukla' 
    ? (lang === 'hi' ? 'शु.' : 'S.') 
    : (lang === 'hi' ? 'कृ.' : 'K.');
  // Strip Shukla/Krishna from tithi.name if it's there
  let shortName = tithi.name.replace(/^(Shukla|Krishna)\s+/i, '');
  return `${prefix} ${translatePanchang(shortName, lang)}`;
}

/**
 * Format elapsed percentage as "72% elapsed"
 */
export function formatElapsed(elapsed: number): string {
  const lang = useSettingsStore.getState().language;
  const label = lang === 'hi' ? 'व्यतीत' : 'elapsed';
  return `${Math.round(elapsed * 100)}% ${label}`;
}

/**
 * Format a progress value (0-1) as a visual bar
 */
export function formatProgressBar(elapsed: number, width: number = 10): string {
  const filled = Math.round(elapsed * width);
  const empty = width - filled;
  return '█'.repeat(filled) + '░'.repeat(empty);
}

/**
 * Format Hindu date as "Jyeshtha Shukla Dwitiya"
 * (Month Paksha Tithi)
 */
export function formatHinduDate(panchangData: PanchangData): string {
  const lang = useSettingsStore.getState().language;
  const month = panchangData.hinduMonth?.name ?? '';
  const tithi = formatTithi(panchangData.tithi);
  const translatedMonth = translatePanchang(month, lang);
  return translatedMonth ? `${translatedMonth} ${tithi}` : tithi;
}

/**
 * Format a compact one-line panchang summary
 * e.g., "Dwitiya | Rohini | Vishkumbha"
 */
export function formatPanchangSummary(data: PanchangData): string {
  const lang = useSettingsStore.getState().language;
  const summary = `${data.tithi.name} | ${data.nakshatra.name} | ${data.yoga.name}`;
  return translatePanchang(summary, lang);
}

/**
 * Format sunrise notification body text
 */
export function formatSunriseNotification(data: PanchangData): string {
  const sunriseTime = formatTime12h(data.sunrise);
  const tithiStr = formatTithi(data.tithi);
  const festivalStr =
    data.festivals.length > 0 ? ` 🎉 ${data.festivals[0].name}` : '';
  return `🌅 Sunrise at ${sunriseTime} | ${tithiStr} | ${data.nakshatra.name}${festivalStr}`;
}

/**
 * Format degrees to a readable longitude string
 * e.g., "72° 34' 12\""
 */
export function formatDegrees(degrees: number): string {
  const d = Math.floor(degrees);
  const mFloat = (degrees - d) * 60;
  const m = Math.floor(mFloat);
  const s = Math.round((mFloat - m) * 60);
  return `${d}° ${m}' ${s}"`;
}

/**
 * Get the zodiac sign name for a given sidereal longitude
 */
export function getZodiacSign(longitude: number): string {
  const signs = [
    'Mesha (Aries)', 'Vrishabha (Taurus)', 'Mithuna (Gemini)',
    'Karka (Cancer)', 'Simha (Leo)', 'Kanya (Virgo)',
    'Tula (Libra)', 'Vrischika (Scorpio)', 'Dhanu (Sagittarius)',
    'Makara (Capricorn)', 'Kumbha (Aquarius)', 'Meena (Pisces)',
  ];
  const index = Math.floor(longitude / 30) % 12;
  return signs[index];
}

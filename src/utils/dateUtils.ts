/**
 * Date and Time Utility Functions
 *
 * Formatting helpers for displaying panchang data in the UI.
 * Julian Date conversion math lives in engine/dateUtils.ts
 */

/**
 * Format a Date to a 12-hour time string (e.g., "5:48 AM")
 */
import { useSettingsStore } from '../stores/settingsStore';

/**
 * Format a Date to a 12-hour time string (e.g., "5:48 AM")
 */
export function formatTime12h(date: Date): string {
  const lang = useSettingsStore.getState().language;
  let hours = date.getHours();
  const minutes = date.getMinutes();
  const ampm = hours >= 12 ? (lang === 'hi' ? 'अपराह्न' : 'PM') : (lang === 'hi' ? 'पूर्वाह्न' : 'AM');
  hours = hours % 12;
  if (hours === 0) hours = 12;
  const minuteStr = minutes < 10 ? `0${minutes}` : `${minutes}`;
  return `${hours}:${minuteStr} ${ampm}`;
}

/**
 * Format a Date to 24-hour time string (e.g., "17:48")
 */
export function formatTime24h(date: Date): string {
  const hours = date.getHours();
  const minutes = date.getMinutes();
  const hourStr = hours < 10 ? `0${hours}` : `${hours}`;
  const minuteStr = minutes < 10 ? `0${minutes}` : `${minutes}`;
  return `${hourStr}:${minuteStr}`;
}

/**
 * Format a TimePeriod to a range string (e.g., "3:30 PM - 5:00 PM")
 */
export function formatTimeRange(start: Date, end: Date): string {
  return `${formatTime12h(start)} - ${formatTime12h(end)}`;
}

/**
 * Format a date as "Mon, Jun 2, 2026"
 */
export function formatDateFull(date: Date): string {
  const lang = useSettingsStore.getState().language;
  if (lang === 'hi') {
    const daysHi = ['रवि', 'सोम', 'मंगल', 'बुध', 'गुरु', 'शुक्र', 'शनि'];
    const monthsHi = [
      'जनवरी', 'फरवरी', 'मार्च', 'अप्रैल', 'मई', 'जून',
      'जुलाई', 'अगस्त', 'सितम्बर', 'अक्टूबर', 'नवम्बर', 'दिसम्बर',
    ];
    return `${daysHi[date.getDay()]}, ${date.getDate()} ${monthsHi[date.getMonth()]} ${date.getFullYear()}`;
  }

  const days = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
  const months = [
    'Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun',
    'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec',
  ];
  return `${days[date.getDay()]}, ${months[date.getMonth()]} ${date.getDate()}, ${date.getFullYear()}`;
}

/**
 * Format a date as "June 2, 2026"
 */
export function formatDateLong(date: Date): string {
  const lang = useSettingsStore.getState().language;
  if (lang === 'hi') {
    const monthsHi = [
      'जनवरी', 'फरवरी', 'मार्च', 'अप्रैल', 'मई', 'जून',
      'जुलाई', 'अगस्त', 'सितम्बर', 'अक्टूबर', 'नवम्बर', 'दिसम्बर',
    ];
    return `${date.getDate()} ${monthsHi[date.getMonth()]} ${date.getFullYear()}`;
  }

  const months = [
    'January', 'February', 'March', 'April', 'May', 'June',
    'July', 'August', 'September', 'October', 'November', 'December',
  ];
  return `${months[date.getMonth()]} ${date.getDate()}, ${date.getFullYear()}`;
}

/**
 * Format a date as "2 Jun"
 */
export function formatDateShort(date: Date): string {
  const lang = useSettingsStore.getState().language;
  if (lang === 'hi') {
    const monthsHi = [
      'जनवरी', 'फरवरी', 'मार्च', 'अप्रैल', 'मई', 'जून',
      'जुलाई', 'अगस्त', 'सितम्बर', 'अक्टूबर', 'नवम्बर', 'दिसम्बर',
    ];
    return `${date.getDate()} ${monthsHi[date.getMonth()].slice(0, 3)}`;
  }

  const months = [
    'Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun',
    'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec',
  ];
  return `${date.getDate()} ${months[date.getMonth()]}`;
}

/**
 * Check if two dates represent the same calendar day
 */
export function isSameDay(a: Date, b: Date): boolean {
  return (
    a.getFullYear() === b.getFullYear() &&
    a.getMonth() === b.getMonth() &&
    a.getDate() === b.getDate()
  );
}

/**
 * Check if a date is today
 */
export function isToday(date: Date): boolean {
  return isSameDay(date, new Date());
}

/**
 * Get tomorrow's date
 */
export function getTomorrow(): Date {
  const tomorrow = new Date();
  tomorrow.setDate(tomorrow.getDate() + 1);
  return tomorrow;
}

/**
 * Get the first day of the month for a given year/month
 */
export function getFirstDayOfMonth(year: number, month: number): Date {
  return new Date(year, month, 1);
}

/**
 * Get the number of days in a given month
 */
export function getDaysInMonth(year: number, month: number): number {
  return new Date(year, month + 1, 0).getDate();
}

/**
 * Get the weekday of the first day of the month (0=Sunday, 6=Saturday)
 */
export function getFirstWeekdayOfMonth(year: number, month: number): number {
  return new Date(year, month, 1).getDay();
}

/**
 * Calculate duration between two dates in hours and minutes
 */
export function formatDuration(start: Date, end: Date): string {
  const diffMs = end.getTime() - start.getTime();
  const totalMinutes = Math.round(diffMs / 60000);
  const hours = Math.floor(totalMinutes / 60);
  const minutes = totalMinutes % 60;
  if (hours === 0) return `${minutes}m`;
  if (minutes === 0) return `${hours}h`;
  return `${hours}h ${minutes}m`;
}

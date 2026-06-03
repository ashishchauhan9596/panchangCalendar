/**
 * @fileoverview Low-level mathematical utilities for angular arithmetic.
 *
 * All angles are in **degrees** unless a function name explicitly says "Rad".
 * These helpers are used by every astronomical calculator in the engine.
 */

/**
 * Normalize an angle into the [0, 360) range.
 *
 * Handles negative values and values ≥ 360 correctly.
 *
 * @param degrees - Angle in degrees (any real number)
 * @returns Equivalent angle in [0, 360)
 *
 * @example
 * normalize360(-30)  // → 330
 * normalize360(400)  // → 40
 */
export function normalize360(degrees: number): number {
  let result: number = degrees % 360;
  if (result < 0) result += 360;
  return result;
}

/**
 * Convert degrees to radians.
 *
 * @param degrees - Angle in degrees
 * @returns Angle in radians
 */
export function degToRad(degrees: number): number {
  return degrees * (Math.PI / 180);
}

/**
 * Convert radians to degrees.
 *
 * @param radians - Angle in radians
 * @returns Angle in degrees
 */
export function radToDeg(radians: number): number {
  return radians * (180 / Math.PI);
}

/**
 * Format a decimal-degree value as a degrees-minutes-seconds string.
 *
 * Seconds are rounded to the nearest integer.
 *
 * @param degrees - Angle in decimal degrees (≥ 0)
 * @returns Human-readable DMS string, e.g. `"23° 51' 11""`
 */
export function degToDMS(degrees: number): string {
  const d: number = Math.floor(degrees);
  const mFloat: number = (degrees - d) * 60;
  const m: number = Math.floor(mFloat);
  const s: number = Math.round((mFloat - m) * 60);
  return `${d}° ${m}' ${s}"`;
}

/**
 * Compute the sine of an angle given in **degrees**.
 *
 * Convenience wrapper to avoid manual deg→rad conversion throughout the codebase.
 *
 * @param degrees - Angle in degrees
 * @returns sin(degrees)
 */
export function sinDeg(degrees: number): number {
  return Math.sin(degToRad(degrees));
}

/**
 * Compute the cosine of an angle given in **degrees**.
 *
 * @param degrees - Angle in degrees
 * @returns cos(degrees)
 */
export function cosDeg(degrees: number): number {
  return Math.cos(degToRad(degrees));
}

/**
 * Compute the tangent of an angle given in **degrees**.
 *
 * @param degrees - Angle in degrees
 * @returns tan(degrees)
 */
export function tanDeg(degrees: number): number {
  return Math.tan(degToRad(degrees));
}

/**
 * Compute the arc-sine and return the result in **degrees**.
 *
 * @param value - A number in [-1, 1]
 * @returns Angle in degrees
 */
export function asinDeg(value: number): number {
  return radToDeg(Math.asin(value));
}

/**
 * Compute the arc-cosine and return the result in **degrees**.
 *
 * @param value - A number in [-1, 1]
 * @returns Angle in degrees
 */
export function acosDeg(value: number): number {
  return radToDeg(Math.acos(value));
}

/**
 * Compute the two-argument arc-tangent and return the result in **degrees**.
 *
 * @param y - Numerator (sin-like component)
 * @param x - Denominator (cos-like component)
 * @returns Angle in degrees in (-180, 180]
 */
export function atan2Deg(y: number, x: number): number {
  return radToDeg(Math.atan2(y, x));
}

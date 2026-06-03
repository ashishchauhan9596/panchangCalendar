/**
 * @fileoverview Location Service.
 *
 * Handles GPS coordinate retrieval using expo-location,
 * requesting device permissions (Android & iOS), and resolving the nearest city
 * from our cities.json database.
 */

import * as Location from 'expo-location';
import cities from '../constants/cities.json';
import type { CityInfo } from '../engine/types';

/**
 * Calculates the distance between two coordinates using the Haversine formula (in km).
 */
function getDistance(lat1: number, lon1: number, lat2: number, lon2: number): number {
  const R = 6371; // Radius of the earth in km
  const dLat = ((lat2 - lat1) * Math.PI) / 180;
  const dLon = ((lon2 - lon1) * Math.PI) / 180;
  const a =
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos((lat1 * Math.PI) / 180) *
      Math.cos((lat2 * Math.PI) / 180) *
      Math.sin(dLon / 2) *
      Math.sin(dLon / 2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  return R * c;
}

/**
 * Requests location permission for the device.
 *
 * @returns Promise resolving to boolean (true if granted)
 */
export async function requestLocationPermission(): Promise<boolean> {
  try {
    const { status } = await Location.requestForegroundPermissionsAsync();
    return status === 'granted';
  } catch (err) {
    console.error('Error requesting location permission:', err);
    return false;
  }
}

/**
 * Retrieves the current device GPS location.
 *
 * @returns Promise resolving to coordinates { latitude, longitude }
 */
export async function getCurrentCoordinates(): Promise<{ latitude: number; longitude: number }> {
  // Check if location services are enabled on the device
  const isServicesEnabled = await Location.hasServicesEnabledAsync();
  if (!isServicesEnabled) {
    throw new Error('Location services are turned off. Please enable GPS/Location in your device settings.');
  }

  // Try to get the last known location first (faster and works offline)
  try {
    const lastKnown = await Location.getLastKnownPositionAsync({});
    if (lastKnown && lastKnown.coords) {
      return {
        latitude: lastKnown.coords.latitude,
        longitude: lastKnown.coords.longitude,
      };
    }
  } catch (err) {
    console.warn('Failed to get last known location:', err);
  }

  // Fallback to getting current position
  const location = await Location.getCurrentPositionAsync({
    accuracy: Location.Accuracy.Balanced,
  });

  if (!location || !location.coords) {
    throw new Error('Could not retrieve current location coordinates.');
  }

  return {
    latitude: location.coords.latitude,
    longitude: location.coords.longitude,
  };
}

/**
 * Finds the nearest pre-defined city from cities.json for a given set of coordinates.
 *
 * @param lat - Latitude
 * @param lng - Longitude
 * @returns Nearest CityInfo
 */
export function getNearestCity(lat: number, lng: number): CityInfo {
  let minDistance = Infinity;
  let nearestCity = cities[0];

  for (const city of cities) {
    const dist = getDistance(lat, lng, city.lat, city.lng);
    if (dist < minDistance) {
      minDistance = dist;
      nearestCity = city;
    }
  }

  return nearestCity;
}

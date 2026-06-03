/**
 * Panchang Store — Zustand
 *
 * Manages the panchang computation state for today, tomorrow,
 * and any user-selected date.
 */

import { create } from 'zustand';
import type { PanchangData, CityInfo } from '../engine/types';

interface PanchangState {
  /** Panchang data for today */
  today: PanchangData | null;
  /** Panchang data for tomorrow */
  tomorrow: PanchangData | null;
  /** Panchang data for the user-selected date */
  selectedDayData: PanchangData | null;
  /** The currently selected date */
  selectedDate: Date;
  /** Whether computation is in progress */
  loading: boolean;
  /** Error message if computation failed */
  error: string | null;

  /** Set the selected date */
  setSelectedDate: (date: Date) => void;
  /** Set today's panchang data */
  setToday: (data: PanchangData) => void;
  /** Set tomorrow's panchang data */
  setTomorrow: (data: PanchangData) => void;
  /** Set selected day data */
  setSelectedDayData: (data: PanchangData | null) => void;
  /** Set loading state */
  setLoading: (loading: boolean) => void;
  /** Set error */
  setError: (error: string | null) => void;
}

export const usePanchangStore = create<PanchangState>((set) => ({
  today: null,
  tomorrow: null,
  selectedDayData: null,
  selectedDate: new Date(),
  loading: false,
  error: null,

  setSelectedDate: (date: Date) => set({ selectedDate: date }),
  setToday: (data: PanchangData) => set({ today: data }),
  setTomorrow: (data: PanchangData) => set({ tomorrow: data }),
  setSelectedDayData: (data: PanchangData | null) => set({ selectedDayData: data }),
  setLoading: (loading: boolean) => set({ loading }),
  setError: (error: string | null) => set({ error }),
}));

/**
 * Calendar Store — Zustand
 *
 * Manages the calendar grid navigation state:
 * current month/year being viewed, selected date.
 */

import { create } from 'zustand';

interface CalendarState {
  /** Currently viewed year */
  viewYear: number;
  /** Currently viewed month (0-11) */
  viewMonth: number;
  /** Selected date on the calendar */
  selectedDate: Date;
  /** Map of date strings to festival count for the current month */
  festivalDots: Record<string, number>;

  /** Navigate to next month */
  nextMonth: () => void;
  /** Navigate to previous month */
  prevMonth: () => void;
  /** Jump to a specific year and month */
  jumpTo: (year: number, month: number) => void;
  /** Jump to today */
  jumpToToday: () => void;
  /** Set the selected date */
  setSelectedDate: (date: Date) => void;
  /** Set festival dots for the current month */
  setFestivalDots: (dots: Record<string, number>) => void;
}

const now = new Date();

export const useCalendarStore = create<CalendarState>((set) => ({
  viewYear: now.getFullYear(),
  viewMonth: now.getMonth(),
  selectedDate: now,
  festivalDots: {},

  nextMonth: () =>
    set((state) => {
      let newMonth = state.viewMonth + 1;
      let newYear = state.viewYear;
      if (newMonth > 11) {
        newMonth = 0;
        newYear += 1;
      }
      return { viewMonth: newMonth, viewYear: newYear };
    }),

  prevMonth: () =>
    set((state) => {
      let newMonth = state.viewMonth - 1;
      let newYear = state.viewYear;
      if (newMonth < 0) {
        newMonth = 11;
        newYear -= 1;
      }
      return { viewMonth: newMonth, viewYear: newYear };
    }),

  jumpTo: (year: number, month: number) =>
    set({ viewYear: year, viewMonth: month }),

  jumpToToday: () => {
    const today = new Date();
    set({
      viewYear: today.getFullYear(),
      viewMonth: today.getMonth(),
      selectedDate: today,
    });
  },

  setSelectedDate: (date: Date) => set({ selectedDate: date }),
  setFestivalDots: (dots: Record<string, number>) =>
    set({ festivalDots: dots }),
}));

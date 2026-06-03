/**
 * Favorites Store — Zustand
 *
 * Manages user bookmarked festivals and important dates.
 * Favorite cities are managed in settingsStore.
 */

import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';
import { zustandStorage } from '../services/storageService';

interface FavoriteDate {
  /** ISO date string (YYYY-MM-DD) */
  dateString: string;
  /** User label for this date */
  label: string;
}

interface FavoritesState {
  /** Bookmarked festival IDs */
  favoriteFestivals: string[];
  /** Saved important dates */
  favoriteDates: FavoriteDate[];

  /** Add a festival to favorites */
  addFestival: (festivalId: string) => void;
  /** Remove a festival from favorites */
  removeFestival: (festivalId: string) => void;
  /** Check if a festival is a favorite */
  isFavoriteFestival: (festivalId: string) => boolean;

  /** Add an important date */
  addDate: (dateString: string, label: string) => void;
  /** Remove an important date */
  removeDate: (dateString: string) => void;
}

export const useFavoritesStore = create<FavoritesState>()(
  persist(
    (set, get) => ({
      favoriteFestivals: [],
      favoriteDates: [],

      addFestival: (festivalId: string) =>
        set((state) => ({
          favoriteFestivals: state.favoriteFestivals.includes(festivalId)
            ? state.favoriteFestivals
            : [...state.favoriteFestivals, festivalId],
        })),

      removeFestival: (festivalId: string) =>
        set((state) => ({
          favoriteFestivals: state.favoriteFestivals.filter(
            (id) => id !== festivalId
          ),
        })),

      isFavoriteFestival: (festivalId: string) =>
        get().favoriteFestivals.includes(festivalId),

      addDate: (dateString: string, label: string) =>
        set((state) => ({
          favoriteDates: [
            ...state.favoriteDates.filter((d) => d.dateString !== dateString),
            { dateString, label },
          ],
        })),

      removeDate: (dateString: string) =>
        set((state) => ({
          favoriteDates: state.favoriteDates.filter(
            (d) => d.dateString !== dateString
          ),
        })),
    }),
    {
      name: 'swarupa-favorites-store',
      storage: createJSONStorage(() => zustandStorage),
      merge: (persistedState: unknown, currentState: FavoritesState): FavoritesState => {
        if (!persistedState || typeof persistedState !== 'object') {
          return currentState;
        }
        return { ...currentState, ...(persistedState as any) };
      },
    }
  )
);

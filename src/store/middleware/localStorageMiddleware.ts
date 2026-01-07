import type { Middleware } from '@reduxjs/toolkit';
import { storage } from '@utils';

const STORAGE_KEY = 'flowboard-state';

/**
 * Middleware to sync Redux state with localStorage
 */
export const localStorageMiddleware: Middleware = (store) => (next) => (action) => {
  const result = next(action);
  
  // Save state to localStorage after each action
  try {
    const state = store.getState();
    storage.set(STORAGE_KEY, state);
  } catch (error) {
    console.error('Failed to save state to localStorage:', error);
  }
  
  return result;
};

/**
 * Load initial state from localStorage
 */
export const loadStateFromStorage = (): any => {
  try {
    const savedState = storage.get(STORAGE_KEY);
    
    if (savedState) {
      return savedState;
    }
  } catch (error) {
    console.error('Failed to load state from localStorage:', error);
  }
  
  return undefined;
};

/**
 * Clear state from localStorage
 */
export const clearStorage = (): void => {
  storage.remove(STORAGE_KEY);
};

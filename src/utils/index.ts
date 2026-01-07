import type { ValidationError } from '@types';

/**
 * Generate a unique ID for tasks
 */
export const generateId = (): string => {
  return `task-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
};

/**
 * Validate task title
 */
export const validateTaskTitle = (title: string): ValidationError | null => {
  const trimmedTitle = title.trim();
  
  if (!trimmedTitle) {
    return {
      field: 'title',
      message: 'Task title cannot be empty',
    };
  }
  
  return null;
};

/**
 * Get current timestamp
 */
export const getCurrentTimestamp = (): number => {
  return Date.now();
};

/**
 * Format date for display
 */
export const formatDate = (timestamp: number): string => {
  return new Date(timestamp).toLocaleString();
};

/**
 * localStorage wrapper with error handling
 */
export const storage = {
  get: <T>(key: string): T | null => {
    try {
      const item = localStorage.getItem(key);
      return item ? JSON.parse(item) : null;
    } catch (error) {
      console.error(`Error reading from localStorage: ${error}`);
      return null;
    }
  },
  
  set: <T>(key: string, value: T): boolean => {
    try {
      localStorage.setItem(key, JSON.stringify(value));
      return true;
    } catch (error) {
      console.error(`Error writing to localStorage: ${error}`);
      return false;
    }
  },
  
  remove: (key: string): void => {
    try {
      localStorage.removeItem(key);
    } catch (error) {
      console.error(`Error removing from localStorage: ${error}`);
    }
  },
  
  clear: (): void => {
    try {
      localStorage.clear();
    } catch (error) {
      console.error(`Error clearing localStorage: ${error}`);
    }
  },
};

/**
 * Reorder items in an array
 */
export const reorder = <T>(list: T[], startIndex: number, endIndex: number): T[] => {
  const result = Array.from(list);
  const [removed] = result.splice(startIndex, 1);
  result.splice(endIndex, 0, removed);
  return result;
};

/**
 * Move item between arrays
 */
export const move = <T>(
  source: T[],
  destination: T[],
  droppableSource: { index: number },
  droppableDestination: { index: number }
): { source: T[]; destination: T[] } => {
  const sourceClone = Array.from(source);
  const destClone = Array.from(destination);
  const [removed] = sourceClone.splice(droppableSource.index, 1);
  destClone.splice(droppableDestination.index, 0, removed);
  
  return {
    source: sourceClone,
    destination: destClone,
  };
};

/**
 * Export test data generators
 */
export { generateTestTasks, generateDistributedTasks } from './testDataGenerator';

import { describe, it, expect, beforeEach } from 'vitest';
import { generateId, validateTaskTitle, getCurrentTimestamp, storage, reorder, move } from './index';

describe('Utils', () => {
  describe('generateId', () => {
    it('should generate unique IDs', () => {
      const id1 = generateId();
      const id2 = generateId();
      
      expect(id1).toContain('task-');
      expect(id2).toContain('task-');
      expect(id1).not.toBe(id2);
    });
  });

  describe('validateTaskTitle', () => {
    it('should return null for valid title', () => {
      const result = validateTaskTitle('Valid Task Title');
      expect(result).toBeNull();
    });

    it('should return error for empty title', () => {
      const result = validateTaskTitle('');
      expect(result).toEqual({
        field: 'title',
        message: 'Task title cannot be empty',
      });
    });

    it('should return error for whitespace-only title', () => {
      const result = validateTaskTitle('   ');
      expect(result).toEqual({
        field: 'title',
        message: 'Task title cannot be empty',
      });
    });
  });

  describe('getCurrentTimestamp', () => {
    it('should return a timestamp', () => {
      const timestamp = getCurrentTimestamp();
      expect(typeof timestamp).toBe('number');
      expect(timestamp).toBeGreaterThan(0);
    });
  });

  describe('storage', () => {
    beforeEach(() => {
      localStorage.clear();
    });

    it('should set and get values', () => {
      const testData = { name: 'Test', value: 123 };
      storage.set('test-key', testData);
      
      const retrieved = storage.get('test-key');
      expect(retrieved).toEqual(testData);
    });

    it('should return null for non-existent key', () => {
      const result = storage.get('non-existent');
      expect(result).toBeNull();
    });

    it('should remove values', () => {
      storage.set('test-key', 'value');
      storage.remove('test-key');
      
      const result = storage.get('test-key');
      expect(result).toBeNull();
    });

    it('should clear all values', () => {
      storage.set('key1', 'value1');
      storage.set('key2', 'value2');
      storage.clear();
      
      expect(storage.get('key1')).toBeNull();
      expect(storage.get('key2')).toBeNull();
    });
  });

  describe('reorder', () => {
    it('should reorder items in array', () => {
      const list = ['a', 'b', 'c', 'd'];
      const result = reorder(list, 1, 3);
      
      expect(result).toEqual(['a', 'c', 'd', 'b']);
    });

    it('should not mutate original array', () => {
      const list = ['a', 'b', 'c'];
      const original = [...list];
      reorder(list, 0, 2);
      
      expect(list).toEqual(original);
    });
  });

  describe('move', () => {
    it('should move item between arrays', () => {
      const source = ['a', 'b', 'c'];
      const destination = ['x', 'y'];
      
      const result = move(
        source,
        destination,
        { index: 1 },
        { index: 1 }
      );
      
      expect(result.source).toEqual(['a', 'c']);
      expect(result.destination).toEqual(['x', 'b', 'y']);
    });

    it('should not mutate original arrays', () => {
      const source = ['a', 'b'];
      const destination = ['x', 'y'];
      const originalSource = [...source];
      const originalDest = [...destination];
      
      move(source, destination, { index: 0 }, { index: 0 });
      
      expect(source).toEqual(originalSource);
      expect(destination).toEqual(originalDest);
    });
  });
});

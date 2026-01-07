import { describe, it, expect } from 'vitest';
import { generateTestTasks, generateDistributedTasks } from './testDataGenerator';

describe('Performance: Large Dataset Generation', () => {
  it('should generate 50 test tasks', () => {
    const tasks = generateTestTasks(50, 'todo');

    expect(tasks).toHaveLength(50);
    expect(tasks[0].columnId).toBe('todo');
    expect(tasks[0].title).toContain('Test Task #1');
  });

  it('should generate 100 test tasks', () => {
    const tasks = generateTestTasks(100, 'in-progress');

    expect(tasks).toHaveLength(100);
    expect(tasks[99].title).toContain('Test Task #100');
  });

  it('should generate unique task IDs', () => {
    const tasks = generateTestTasks(50, 'todo');
    const ids = tasks.map((t) => t.id);
    const uniqueIds = new Set(ids);

    expect(uniqueIds.size).toBe(50);
  });

  it('should generate distributed tasks across columns', () => {
    const tasks = generateDistributedTasks(100);

    expect(tasks).toHaveLength(100);

    const todoTasks = tasks.filter((t) => t.columnId === 'todo');
    const inProgressTasks = tasks.filter((t) => t.columnId === 'in-progress');
    const doneTasks = tasks.filter((t) => t.columnId === 'done');

    expect(todoTasks.length).toBeGreaterThan(0);
    expect(inProgressTasks.length).toBeGreaterThan(0);
    expect(doneTasks.length).toBeGreaterThan(0);
    expect(todoTasks.length + inProgressTasks.length + doneTasks.length).toBe(100);
  });

  it('should generate unique IDs across all columns in distributed tasks', () => {
    const tasks = generateDistributedTasks(50);
    const ids = tasks.map((t) => t.id);
    const uniqueIds = new Set(ids);

    // Critical test: All 50 tasks must have unique IDs
    expect(uniqueIds.size).toBe(50);
    expect(ids.length).toBe(50);
    
    // Verify no duplicates exist
    const duplicates = ids.filter((id, index) => ids.indexOf(id) !== index);
    expect(duplicates).toHaveLength(0);
  });

  it('should generate sequential task numbers across columns', () => {
    const tasks = generateDistributedTasks(30);
    
    // Extract task numbers from IDs (format: test-task-{number}-{timestamp})
    const taskNumbers = tasks.map(t => {
      const match = t.id.match(/test-task-(\d+)-/);
      return match ? parseInt(match[1], 10) : 0;
    });

    // Verify task numbers are sequential from 1 to 30
    expect(taskNumbers).toHaveLength(30);
    expect(Math.min(...taskNumbers)).toBe(1);
    expect(Math.max(...taskNumbers)).toBe(30);
    
    // Verify all numbers are unique
    const uniqueNumbers = new Set(taskNumbers);
    expect(uniqueNumbers.size).toBe(30);
  });

  it('should generate tasks with correct structure', () => {
    const tasks = generateTestTasks(10, 'done');

    tasks.forEach((task) => {
      expect(task).toHaveProperty('id');
      expect(task).toHaveProperty('title');
      expect(task).toHaveProperty('columnId');
      expect(task).toHaveProperty('createdAt');
      expect(task).toHaveProperty('updatedAt');
      expect(task).toHaveProperty('isDeleted');
      expect(task.isDeleted).toBe(false);
    });
  });

  it('should handle edge case: 0 tasks', () => {
    const tasks = generateTestTasks(0, 'todo');
    expect(tasks).toHaveLength(0);
  });

  it('should handle edge case: 1 task', () => {
    const tasks = generateTestTasks(1, 'todo');
    expect(tasks).toHaveLength(1);
  });

  it('should generate tasks quickly (performance check)', () => {
    const startTime = Date.now();
    const tasks = generateTestTasks(1000, 'todo');
    const endTime = Date.now();

    expect(tasks).toHaveLength(1000);
    expect(endTime - startTime).toBeLessThan(100); // Should complete in < 100ms
  });
});

import { describe, it, expect } from 'vitest';
import {
  selectAllTasks,
  selectAllTaskIds,
  selectActiveTasks,
  selectTasksByColumnId,
  selectDeletedTasks,
  selectActiveTaskCount,
  selectDeletedTaskCount,
} from './index';
import type { Task } from '@types';
import type { RootState } from '../index';

describe('Selectors', () => {
  const mockTask1: Task = {
    id: 'task-1',
    title: 'Task 1',
    columnId: 'todo',
    createdAt: 1000,
    updatedAt: 1000,
    isDeleted: false,
    order: 0,
  };

  const mockTask2: Task = {
    id: 'task-2',
    title: 'Task 2',
    columnId: 'in-progress',
    createdAt: 2000,
    updatedAt: 2000,
    isDeleted: false,
    order: 1,
  };

  const mockTask3: Task = {
    id: 'task-3',
    title: 'Task 3 (Deleted)',
    columnId: 'done',
    createdAt: 3000,
    updatedAt: 3000,
    isDeleted: true,
    deletedAt: 3500,
    order: 2,
  };

  const mockState: RootState = {
    tasks: {
      byId: {
        'task-1': mockTask1,
        'task-2': mockTask2,
        'task-3': mockTask3,
      },
      allIds: ['task-1', 'task-2', 'task-3'],
    },
    columns: {
      byId: {
        'todo': {
          id: 'todo',
          name: 'To Do',
          taskIds: ['task-1'],
        },
        'in-progress': {
          id: 'in-progress',
          name: 'In Progress',
          taskIds: ['task-2'],
        },
        'done': {
          id: 'done',
          name: 'Done',
          taskIds: ['task-3'],
        },
      },
      allIds: ['todo', 'in-progress', 'done'],
    },
  };

  describe('selectAllTasks', () => {
    it('should return all tasks by ID', () => {
      const result = selectAllTasks(mockState);
      expect(result).toEqual(mockState.tasks.byId);
    });
  });

  describe('selectAllTaskIds', () => {
    it('should return all task IDs', () => {
      const result = selectAllTaskIds(mockState);
      expect(result).toEqual(['task-1', 'task-2', 'task-3']);
    });
  });

  describe('selectActiveTasks', () => {
    it('should return only non-deleted tasks', () => {
      const result = selectActiveTasks(mockState);
      expect(result).toHaveLength(2);
      expect(result).toEqual([mockTask1, mockTask2]);
    });

    it('should filter out deleted tasks', () => {
      const result = selectActiveTasks(mockState);
      const hasDeletedTask = result.some((task: Task) => task.isDeleted);
      expect(hasDeletedTask).toBe(false);
    });
  });

  describe('selectTasksByColumnId', () => {
    it('should return tasks for todo column', () => {
      const selector = selectTasksByColumnId('todo');
      const result = selector(mockState);
      
      expect(result).toHaveLength(1);
      expect(result[0]).toEqual(mockTask1);
    });

    it('should return tasks for in-progress column', () => {
      const selector = selectTasksByColumnId('in-progress');
      const result = selector(mockState);
      
      expect(result).toHaveLength(1);
      expect(result[0]).toEqual(mockTask2);
    });

    it('should not return deleted tasks in column', () => {
      const selector = selectTasksByColumnId('done');
      const result = selector(mockState);
      
      expect(result).toHaveLength(0);
    });

    it('should return sorted tasks by order', () => {
      const stateWithMultipleTasks: RootState = {
        ...mockState,
        tasks: {
          byId: {
            'task-1': { ...mockTask1, order: 2 },
            'task-2': { ...mockTask2, order: 0, columnId: 'todo' },
            'task-3': { ...mockTask3, order: 1, columnId: 'todo', isDeleted: false },
          },
          allIds: ['task-1', 'task-2', 'task-3'],
        },
        columns: {
          ...mockState.columns,
          byId: {
            ...mockState.columns.byId,
            'todo': {
              id: 'todo',
              name: 'To Do',
              taskIds: ['task-1', 'task-2', 'task-3'],
            },
          },
        },
      };

      const selector = selectTasksByColumnId('todo');
      const result = selector(stateWithMultipleTasks);
      
      expect(result).toHaveLength(3);
      expect(result[0].id).toBe('task-2');
      expect(result[1].id).toBe('task-3');
      expect(result[2].id).toBe('task-1');
    });
  });

  describe('selectDeletedTasks', () => {
    it('should return only deleted tasks', () => {
      const result = selectDeletedTasks(mockState);
      expect(result).toHaveLength(1);
      expect(result[0]).toEqual(mockTask3);
    });

    it('should return empty array when no deleted tasks', () => {
      const stateWithoutDeleted: RootState = {
        ...mockState,
        tasks: {
          byId: {
            'task-1': mockTask1,
            'task-2': mockTask2,
          },
          allIds: ['task-1', 'task-2'],
        },
      };

      const result = selectDeletedTasks(stateWithoutDeleted);
      expect(result).toHaveLength(0);
    });
  });

  describe('selectActiveTaskCount', () => {
    it('should return count of active tasks', () => {
      const result = selectActiveTaskCount(mockState);
      expect(result).toBe(2);
    });
  });

  describe('selectDeletedTaskCount', () => {
    it('should return count of deleted tasks', () => {
      const result = selectDeletedTaskCount(mockState);
      expect(result).toBe(1);
    });
  });
});

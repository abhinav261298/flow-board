import { describe, it, expect, beforeEach } from 'vitest';
import tasksReducer, { addTask, deleteTask, moveTask, reorderTasks, clearDeletedTasks } from './tasksSlice';
import type { TasksState } from '@types';

describe('tasksSlice', () => {
  let initialState: TasksState;

  beforeEach(() => {
    initialState = {
      byId: {},
      allIds: [],
    };
  });

  describe('addTask', () => {
    it('should add a new task to the state', () => {
      const action = addTask({ title: 'New Task' });
      const state = tasksReducer(initialState, action);

      expect(state.allIds).toHaveLength(1);
      const taskId = state.allIds[0];
      expect(state.byId[taskId]).toBeDefined();
      expect(state.byId[taskId].title).toBe('New Task');
      expect(state.byId[taskId].columnId).toBe('todo');
      expect(state.byId[taskId].isDeleted).toBe(false);
    });

    it('should add task to specific column', () => {
      const action = addTask({ title: 'In Progress Task', columnId: 'in-progress' });
      const state = tasksReducer(initialState, action);

      const taskId = state.allIds[0];
      expect(state.byId[taskId].columnId).toBe('in-progress');
    });

    it('should trim task title', () => {
      const action = addTask({ title: '  Trimmed Task  ' });
      const state = tasksReducer(initialState, action);

      const taskId = state.allIds[0];
      expect(state.byId[taskId].title).toBe('Trimmed Task');
    });

    it('should set creation and update timestamps', () => {
      const action = addTask({ title: 'Task with Timestamp' });
      const state = tasksReducer(initialState, action);

      const taskId = state.allIds[0];
      expect(state.byId[taskId].createdAt).toBeGreaterThan(0);
      expect(state.byId[taskId].updatedAt).toBeGreaterThan(0);
    });
  });

  describe('deleteTask', () => {
    it('should soft delete a task', () => {
      let state = tasksReducer(initialState, addTask({ title: 'Task to Delete' }));
      const taskId = state.allIds[0];

      state = tasksReducer(state, deleteTask({ taskId }));

      expect(state.byId[taskId].isDeleted).toBe(true);
      expect(state.byId[taskId].deletedAt).toBeDefined();
      expect(state.allIds).toContain(taskId);
    });

    it('should not throw error for non-existent task', () => {
      expect(() => {
        tasksReducer(initialState, deleteTask({ taskId: 'non-existent' }));
      }).not.toThrow();
    });
  });

  describe('moveTask', () => {
    it('should move task to different column', () => {
      let state = tasksReducer(initialState, addTask({ title: 'Task to Move' }));
      const taskId = state.allIds[0];

      state = tasksReducer(state, moveTask({ taskId, targetColumnId: 'done' }));

      expect(state.byId[taskId].columnId).toBe('done');
      expect(state.byId[taskId].updatedAt).toBeGreaterThanOrEqual(state.byId[taskId].createdAt);
    });

    it('should not move deleted task', () => {
      let state = tasksReducer(initialState, addTask({ title: 'Deleted Task' }));
      const taskId = state.allIds[0];
      state = tasksReducer(state, deleteTask({ taskId }));

      const beforeMove = state.byId[taskId].columnId;
      state = tasksReducer(state, moveTask({ taskId, targetColumnId: 'done' }));

      expect(state.byId[taskId].columnId).toBe(beforeMove);
    });
  });

  describe('reorderTasks', () => {
    it('should update task order', () => {
      let state = initialState;
      state = tasksReducer(state, addTask({ title: 'Task 1' }));
      state = tasksReducer(state, addTask({ title: 'Task 2' }));
      state = tasksReducer(state, addTask({ title: 'Task 3' }));

      const taskIds = [...state.allIds].reverse();
      state = tasksReducer(state, reorderTasks({ taskIds }));

      expect(state.byId[taskIds[0]].order).toBe(0);
      expect(state.byId[taskIds[1]].order).toBe(1);
      expect(state.byId[taskIds[2]].order).toBe(2);
    });
  });

  describe('clearDeletedTasks', () => {
    it('should remove all deleted tasks', () => {
      let state = initialState;
      state = tasksReducer(state, addTask({ title: 'Task 1' }));
      state = tasksReducer(state, addTask({ title: 'Task 2' }));
      state = tasksReducer(state, addTask({ title: 'Task 3' }));

      const taskToDelete = state.allIds[1];
      state = tasksReducer(state, deleteTask({ taskId: taskToDelete }));

      expect(state.allIds).toHaveLength(3);

      state = tasksReducer(state, clearDeletedTasks());

      expect(state.allIds).toHaveLength(2);
      expect(state.allIds).not.toContain(taskToDelete);
      expect(state.byId[taskToDelete]).toBeUndefined();
    });

    it('should keep all active tasks', () => {
      let state = initialState;
      state = tasksReducer(state, addTask({ title: 'Task 1' }));
      state = tasksReducer(state, addTask({ title: 'Task 2' }));

      const beforeClear = state.allIds.length;
      state = tasksReducer(state, clearDeletedTasks());

      expect(state.allIds).toHaveLength(beforeClear);
    });
  });
});

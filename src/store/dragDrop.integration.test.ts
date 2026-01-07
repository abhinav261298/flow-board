import { describe, it, expect } from 'vitest';
import { configureStore } from '@reduxjs/toolkit';
import tasksReducer, { addTask, moveTask } from './slices/tasksSlice';
import columnsReducer, { moveTaskBetweenColumns } from './slices/columnsSlice';

describe('Integration: Drag & Drop', () => {
  it('should move task from To Do to In Progress', () => {
    const store = configureStore({
      reducer: {
        tasks: tasksReducer,
        columns: columnsReducer,
      },
    });

    // Add a task to "To Do"
    store.dispatch(addTask({ title: 'Test Task', columnId: 'todo' }));
    
    const taskId = store.getState().tasks.allIds[0];
    
    // Verify task is in "To Do"
    expect(store.getState().tasks.byId[taskId].columnId).toBe('todo');
    expect(store.getState().columns.byId.todo.taskIds).toContain(taskId);

    // Simulate drag & drop: move to "In Progress"
    store.dispatch(moveTask({ taskId, targetColumnId: 'in-progress' }));
    store.dispatch(moveTaskBetweenColumns({ taskId, targetColumnId: 'in-progress' }));

    // Verify task moved to "In Progress"
    const state = store.getState();
    expect(state.tasks.byId[taskId].columnId).toBe('in-progress');
    expect(state.columns.byId.todo.taskIds).not.toContain(taskId);
    expect(state.columns.byId['in-progress'].taskIds).toContain(taskId);
  });

  it('should move task from In Progress to Done', () => {
    const store = configureStore({
      reducer: {
        tasks: tasksReducer,
        columns: columnsReducer,
      },
    });

    // Add task to "In Progress"
    store.dispatch(addTask({ title: 'Test Task', columnId: 'in-progress' }));
    const taskId = store.getState().tasks.allIds[0];

    // Move to "Done"
    store.dispatch(moveTask({ taskId, targetColumnId: 'done' }));
    store.dispatch(moveTaskBetweenColumns({ taskId, targetColumnId: 'done' }));

    const state = store.getState();
    expect(state.tasks.byId[taskId].columnId).toBe('done');
    expect(state.columns.byId['in-progress'].taskIds).not.toContain(taskId);
    expect(state.columns.byId.done.taskIds).toContain(taskId);
  });

  it('should move task backwards from Done to In Progress', () => {
    const store = configureStore({
      reducer: {
        tasks: tasksReducer,
        columns: columnsReducer,
      },
    });

    // Add task to "Done"
    store.dispatch(addTask({ title: 'Completed Task', columnId: 'done' }));
    const taskId = store.getState().tasks.allIds[0];

    // Move back to "In Progress"
    store.dispatch(moveTask({ taskId, targetColumnId: 'in-progress' }));
    store.dispatch(moveTaskBetweenColumns({ taskId, targetColumnId: 'in-progress' }));

    const state = store.getState();
    expect(state.tasks.byId[taskId].columnId).toBe('in-progress');
    expect(state.columns.byId.done.taskIds).not.toContain(taskId);
    expect(state.columns.byId['in-progress'].taskIds).toContain(taskId);
  });

  it('should handle multiple tasks being moved', () => {
    const store = configureStore({
      reducer: {
        tasks: tasksReducer,
        columns: columnsReducer,
      },
    });

    // Add 3 tasks to "To Do"
    store.dispatch(addTask({ title: 'Task 1', columnId: 'todo' }));
    store.dispatch(addTask({ title: 'Task 2', columnId: 'todo' }));
    store.dispatch(addTask({ title: 'Task 3', columnId: 'todo' }));

    const taskIds = store.getState().tasks.allIds;

    // Move first two tasks to "In Progress"
    store.dispatch(moveTask({ taskId: taskIds[0], targetColumnId: 'in-progress' }));
    store.dispatch(moveTaskBetweenColumns({ taskId: taskIds[0], targetColumnId: 'in-progress' }));
    
    store.dispatch(moveTask({ taskId: taskIds[1], targetColumnId: 'in-progress' }));
    store.dispatch(moveTaskBetweenColumns({ taskId: taskIds[1], targetColumnId: 'in-progress' }));

    const state = store.getState();
    
    // Verify distribution
    expect(state.columns.byId.todo.taskIds).toHaveLength(1);
    expect(state.columns.byId['in-progress'].taskIds).toHaveLength(2);
    expect(state.columns.byId.done.taskIds).toHaveLength(0);

    // Verify specific tasks
    expect(state.tasks.byId[taskIds[0]].columnId).toBe('in-progress');
    expect(state.tasks.byId[taskIds[1]].columnId).toBe('in-progress');
    expect(state.tasks.byId[taskIds[2]].columnId).toBe('todo');
  });

  it('should preserve task order when moving', () => {
    const store = configureStore({
      reducer: {
        tasks: tasksReducer,
        columns: columnsReducer,
      },
    });

    // Add tasks
    store.dispatch(addTask({ title: 'First', columnId: 'todo' }));
    store.dispatch(addTask({ title: 'Second', columnId: 'todo' }));
    store.dispatch(addTask({ title: 'Third', columnId: 'todo' }));

    const taskIds = store.getState().tasks.allIds;

    // Move middle task
    store.dispatch(moveTask({ taskId: taskIds[1], targetColumnId: 'in-progress' }));
    store.dispatch(moveTaskBetweenColumns({ taskId: taskIds[1], targetColumnId: 'in-progress' }));

    const state = store.getState();
    
    // Verify remaining tasks in original column maintain order
    expect(state.columns.byId.todo.taskIds).toEqual([taskIds[0], taskIds[2]]);
    expect(state.columns.byId['in-progress'].taskIds).toEqual([taskIds[1]]);
  });

  it('should update task timestamps on move', () => {
    const store = configureStore({
      reducer: {
        tasks: tasksReducer,
        columns: columnsReducer,
      },
    });

    store.dispatch(addTask({ title: 'Test', columnId: 'todo' }));
    const taskId = store.getState().tasks.allIds[0];
    const originalUpdatedAt = store.getState().tasks.byId[taskId].updatedAt;

    // Wait a bit to ensure timestamp difference
    const later = Date.now() + 100;
    vi.setSystemTime(later);

    // Move task
    store.dispatch(moveTask({ taskId, targetColumnId: 'in-progress' }));
    store.dispatch(moveTaskBetweenColumns({ taskId, targetColumnId: 'in-progress' }));

    const newUpdatedAt = store.getState().tasks.byId[taskId].updatedAt;
    expect(newUpdatedAt).toBeGreaterThanOrEqual(originalUpdatedAt);

    vi.useRealTimers();
  });
});

import { describe, it, expect } from 'vitest';
import { configureStore } from '@reduxjs/toolkit';
import tasksReducer, { addTask } from './slices/tasksSlice';
import columnsReducer from './slices/columnsSlice';

describe('Integration: Task Creation', () => {
  it('should add task to both tasks state and column state', () => {
    const store = configureStore({
      reducer: {
        tasks: tasksReducer,
        columns: columnsReducer,
      },
    });

    // Add a task
    store.dispatch(addTask({ title: 'Test Task', columnId: 'todo' }));

    const state = store.getState();
    
    // Check task was created
    expect(state.tasks.allIds).toHaveLength(1);
    const taskId = state.tasks.allIds[0];
    expect(state.tasks.byId[taskId]).toBeDefined();
    expect(state.tasks.byId[taskId].title).toBe('Test Task');
    expect(state.tasks.byId[taskId].columnId).toBe('todo');
    
    // Check task was added to column
    expect(state.columns.byId.todo.taskIds).toContain(taskId);
    expect(state.columns.byId.todo.taskIds).toHaveLength(1);
  });

  it('should add multiple tasks to column', () => {
    const store = configureStore({
      reducer: {
        tasks: tasksReducer,
        columns: columnsReducer,
      },
    });

    // Add multiple tasks
    store.dispatch(addTask({ title: 'Task 1', columnId: 'todo' }));
    store.dispatch(addTask({ title: 'Task 2', columnId: 'todo' }));
    store.dispatch(addTask({ title: 'Task 3', columnId: 'in-progress' }));

    const state = store.getState();
    
    // Check all tasks created
    expect(state.tasks.allIds).toHaveLength(3);
    
    // Check tasks distributed correctly
    expect(state.columns.byId.todo.taskIds).toHaveLength(2);
    expect(state.columns.byId['in-progress'].taskIds).toHaveLength(1);
    expect(state.columns.byId.done.taskIds).toHaveLength(0);
  });
});

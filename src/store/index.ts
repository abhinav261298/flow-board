import { configureStore } from '@reduxjs/toolkit';
import tasksReducer from './slices/tasksSlice';
import columnsReducer from './slices/columnsSlice';
import { localStorageMiddleware, loadStateFromStorage } from './middleware/localStorageMiddleware';
import { generateDistributedTasks } from '@utils';
import type { Task } from '@types';

// Check for test data environment variable
const testTaskCount = import.meta.env.VITE_TEST_TASKS 
  ? parseInt(import.meta.env.VITE_TEST_TASKS as string, 10) 
  : 0;

// Load persisted state or generate test data
let preloadedState = loadStateFromStorage();

// Generate test data if environment variable is set and in dev mode
if (testTaskCount > 0 && import.meta.env.DEV) {
  console.log(`🧪 Generating ${testTaskCount} test tasks...`);
  
  const testTasks = generateDistributedTasks(testTaskCount);
  
  const tasksById: Record<string, Task> = {};
  const taskIds: string[] = [];
  
  testTasks.forEach((task: Task) => {
    tasksById[task.id] = task;
    taskIds.push(task.id);
  });

  // Initialize column task IDs
  const todoTasks = testTasks.filter((t: Task) => t.columnId === 'todo').map((t: Task) => t.id);
  const inProgressTasks = testTasks.filter((t: Task) => t.columnId === 'in-progress').map((t: Task) => t.id);
  const doneTasks = testTasks.filter((t: Task) => t.columnId === 'done').map((t: Task) => t.id);

  preloadedState = {
    tasks: {
      byId: tasksById,
      allIds: taskIds
    },
    columns: {
      byId: {
        'todo': {
          id: 'todo',
          name: 'To Do',
          taskIds: todoTasks
        },
        'in-progress': {
          id: 'in-progress',
          name: 'In Progress',
          taskIds: inProgressTasks
        },
        'done': {
          id: 'done',
          name: 'Done',
          taskIds: doneTasks
        }
      },
      allIds: ['todo', 'in-progress', 'done']
    }
  } as any;

  console.log(`✅ Generated ${testTaskCount} test tasks (${todoTasks.length} todo, ${inProgressTasks.length} in-progress, ${doneTasks.length} done)`);
}

export const store = configureStore({
  reducer: {
    tasks: tasksReducer,
    columns: columnsReducer,
  } as any,
  preloadedState: preloadedState as any,
  middleware: (getDefaultMiddleware: any) =>
    getDefaultMiddleware({
      serializableCheck: false,
    }).concat(localStorageMiddleware) as any,
} as any);

// Expose store to window in dev mode for console testing
if (import.meta.env.DEV) {
  (window as any).store = store;
  console.log('🔧 Redux store exposed to window.store for dev testing');
}

export type AppDispatch = typeof store.dispatch;
export type RootState = ReturnType<typeof store.getState>;

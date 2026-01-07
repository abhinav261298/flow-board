import type { Task, ColumnId } from '@types';

/**
 * Generate test tasks for performance testing
 */
export const generateTestTasks = (count: number, columnId: ColumnId = 'todo'): Task[] => {
  const tasks: Task[] = [];
  const now = Date.now();

  for (let i = 1; i <= count; i++) {
    tasks.push({
      id: `test-task-${i}-${now}`,
      title: `Test Task #${i} - ${getRandomTaskTitle()}`,
      columnId,
      createdAt: now + i,
      updatedAt: now + i,
      isDeleted: false,
      order: i,
    });
  }

  return tasks;
};

/**
 * Generate random task title for variety
 */
const getRandomTaskTitle = (): string => {
  const titles = [
    'Review pull request',
    'Fix bug in authentication',
    'Update documentation',
    'Refactor component structure',
    'Add unit tests',
    'Optimize performance',
    'Design new feature',
    'Code review session',
    'Meeting with team',
    'Deploy to production',
    'Write API endpoint',
    'Update dependencies',
    'Security audit',
    'Customer feedback review',
    'Sprint planning',
  ];

  return titles[Math.floor(Math.random() * titles.length)];
};

/**
 * Distribute tasks across columns with guaranteed unique IDs
 */
export const generateDistributedTasks = (totalCount: number): Task[] => {
  const todoCount = Math.floor(totalCount * 0.4);
  const inProgressCount = Math.floor(totalCount * 0.35);
  const doneCount = totalCount - todoCount - inProgressCount;

  const now = Date.now();
  const allTasks: Task[] = [];
  let taskNumber = 1;

  // Generate todo tasks
  for (let i = 0; i < todoCount; i++) {
    allTasks.push({
      id: `test-task-${taskNumber}-${now}`,
      title: `Test Task #${taskNumber} - ${getRandomTaskTitle()}`,
      columnId: 'todo',
      createdAt: now + taskNumber,
      updatedAt: now + taskNumber,
      isDeleted: false,
      order: taskNumber,
    });
    taskNumber++;
  }

  // Generate in-progress tasks
  for (let i = 0; i < inProgressCount; i++) {
    allTasks.push({
      id: `test-task-${taskNumber}-${now}`,
      title: `Test Task #${taskNumber} - ${getRandomTaskTitle()}`,
      columnId: 'in-progress',
      createdAt: now + taskNumber,
      updatedAt: now + taskNumber,
      isDeleted: false,
      order: taskNumber,
    });
    taskNumber++;
  }

  // Generate done tasks
  for (let i = 0; i < doneCount; i++) {
    allTasks.push({
      id: `test-task-${taskNumber}-${now}`,
      title: `Test Task #${taskNumber} - ${getRandomTaskTitle()}`,
      columnId: 'done',
      createdAt: now + taskNumber,
      updatedAt: now + taskNumber,
      isDeleted: false,
      order: taskNumber,
    });
    taskNumber++;
  }

  return allTasks;
};

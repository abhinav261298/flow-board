import { createSelector } from '@reduxjs/toolkit';
import type { Task, ColumnId } from '@types';
import type { RootState } from '../index';

/**
 * Get all tasks from state
 */
export const selectAllTasks = (state: RootState) => state.tasks.byId;

/**
 * Get all task IDs
 */
export const selectAllTaskIds = (state: RootState) => state.tasks.allIds;

/**
 * Get all columns
 */
export const selectAllColumns = (state: RootState) => state.columns.byId;

/**
 * Get column order
 */
export const selectColumnIds = (state: RootState) => state.columns.allIds;

/**
 * Get a specific task by ID
 */
export const selectTaskById = (taskId: string) => (state: RootState): Task | undefined => {
  return state.tasks.byId[taskId];
};

/**
 * Get active (non-deleted) tasks
 */
export const selectActiveTasks = createSelector(
  [selectAllTasks, selectAllTaskIds],
  (tasksById, taskIds) => {
    return taskIds
      .map((id: string) => tasksById[id])
      .filter((task: Task) => task && !task.isDeleted);
  }
);

/**
 * Get tasks for a specific column
 */
export const selectTasksByColumnId = (columnId: ColumnId) =>
  createSelector(
    [selectAllTasks, (state: RootState) => state.columns.byId[columnId]],
    (tasksById, column) => {
      if (!column) return [];
      
      return column.taskIds
        .map((id: string) => tasksById[id])
        .filter((task: Task) => task && !task.isDeleted)
        .sort((a: Task, b: Task) => a.order - b.order);
    }
  );

/**
 * Get deleted tasks
 */
export const selectDeletedTasks = createSelector(
  [selectAllTasks, selectAllTaskIds],
  (tasksById, taskIds) => {
    return taskIds
      .map((id: string) => tasksById[id])
      .filter((task: Task) => task && task.isDeleted);
  }
);

/**
 * Get task count by column
 */
export const selectTaskCountByColumn = (columnId: ColumnId) =>
  createSelector([selectTasksByColumnId(columnId)], (tasks) => tasks.length);

/**
 * Get total active task count
 */
export const selectActiveTaskCount = createSelector(
  [selectActiveTasks],
  (tasks) => tasks.length
);

/**
 * Get total deleted task count
 */
export const selectDeletedTaskCount = createSelector(
  [selectDeletedTasks],
  (tasks) => tasks.length
);

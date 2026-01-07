// FlowBoard Type Definitions

/**
 * Task entity with normalized structure
 */
export interface Task {
  id: string;
  title: string;
  columnId: ColumnId;
  createdAt: number;
  updatedAt: number;
  isDeleted: boolean;
  deletedAt?: number;
  order: number;
}

/**
 * Column IDs as string literals
 */
export type ColumnId = 'todo' | 'in-progress' | 'done';

/**
 * Column entity
 */
export interface Column {
  id: ColumnId;
  name: string;
  taskIds: string[];
}

/**
 * Normalized state structure for tasks
 */
export interface TasksState {
  byId: Record<string, Task>;
  allIds: string[];
}

/**
 * State structure for columns
 */
export interface ColumnsState {
  byId: Record<ColumnId, Column>;
  allIds: ColumnId[];
}

/**
 * DTO for creating a new task
 */
export interface CreateTaskDTO {
  title: string;
  columnId?: ColumnId;
}

/**
 * DTO for moving a task
 */
export interface MoveTaskDTO {
  taskId: string;
  targetColumnId: ColumnId;
  targetIndex?: number;
}

/**
 * DTO for deleting a task
 */
export interface DeleteTaskDTO {
  taskId: string;
}

/**
 * Validation error type
 */
export interface ValidationError {
  field: string;
  message: string;
}

/**
 * Drag and drop state
 */
export interface DragState {
  isDragging: boolean;
  draggedTaskId: string | null;
  sourceColumnId: ColumnId | null;
  targetColumnId: ColumnId | null;
}

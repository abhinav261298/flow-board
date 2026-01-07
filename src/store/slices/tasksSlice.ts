import { createSlice } from '@reduxjs/toolkit';
import type { PayloadAction } from '@reduxjs/toolkit';
import type { TasksState, Task, CreateTaskDTO, DeleteTaskDTO, ColumnId } from '@types';
import { generateId, getCurrentTimestamp } from '@utils';

const initialState: TasksState = {
  byId: {},
  allIds: [],
};

const tasksSlice = createSlice({
  name: 'tasks',
  initialState,
  reducers: {
    addTask: {
      reducer: (state, action: PayloadAction<{ task: Task }>) => {
        const task = action.payload.task;
        state.byId[task.id] = task;
        state.allIds.push(task.id);
      },
      prepare: (dto: CreateTaskDTO) => {
        const taskId = generateId();
        const timestamp = getCurrentTimestamp();
        const columnId = dto.columnId || 'todo';
        
        const newTask: Task = {
          id: taskId,
          title: dto.title.trim(),
          columnId,
          createdAt: timestamp,
          updatedAt: timestamp,
          isDeleted: false,
          order: 0, // Will be set by column
        };
        
        return {
          payload: { task: newTask },
          meta: { taskId, columnId },
        };
      },
    },
    
    deleteTask: (state, action: PayloadAction<DeleteTaskDTO>) => {
      const { taskId } = action.payload;
      const task = state.byId[taskId];
      
      if (task) {
        task.isDeleted = true;
        task.deletedAt = getCurrentTimestamp();
        task.updatedAt = getCurrentTimestamp();
      }
    },
    
    moveTask: (state, action: PayloadAction<{ taskId: string; targetColumnId: ColumnId }>) => {
      const { taskId, targetColumnId } = action.payload;
      const task = state.byId[taskId];
      
      if (task && !task.isDeleted) {
        task.columnId = targetColumnId;
        task.updatedAt = getCurrentTimestamp();
      }
    },
    
    reorderTasks: (state, action: PayloadAction<{ taskIds: string[] }>) => {
      const { taskIds } = action.payload;
      
      taskIds.forEach((taskId, index) => {
        const task = state.byId[taskId];
        if (task && !task.isDeleted) {
          task.order = index;
          task.updatedAt = getCurrentTimestamp();
        }
      });
    },
    
    loadTasks: (_state, action: PayloadAction<TasksState>) => {
      return action.payload;
    },
    
    clearDeletedTasks: (state) => {
      const activeTaskIds = state.allIds.filter(
        (id) => !state.byId[id]?.isDeleted
      );
      
      const newById: Record<string, Task> = {};
      activeTaskIds.forEach((id) => {
        newById[id] = state.byId[id];
      });
      
      return {
        byId: newById,
        allIds: activeTaskIds,
      };
    },
  },
});

export const {
  addTask,
  deleteTask,
  moveTask,
  reorderTasks,
  loadTasks,
  clearDeletedTasks,
} = tasksSlice.actions;

export default tasksSlice.reducer;

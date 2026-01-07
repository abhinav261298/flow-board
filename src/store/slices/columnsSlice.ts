import { createSlice } from '@reduxjs/toolkit';
import type { PayloadAction } from '@reduxjs/toolkit';
import type { ColumnsState, ColumnId, MoveTaskDTO } from '@types';
import { addTask } from './tasksSlice';

const initialState: ColumnsState = {
  byId: {
    'todo': {
      id: 'todo',
      name: 'To Do',
      taskIds: [],
    },
    'in-progress': {
      id: 'in-progress',
      name: 'In Progress',
      taskIds: [],
    },
    'done': {
      id: 'done',
      name: 'Done',
      taskIds: [],
    },
  },
  allIds: ['todo', 'in-progress', 'done'],
};

const columnsSlice = createSlice({
  name: 'columns',
  initialState,
  reducers: {
    addTaskToColumn: (state, action: PayloadAction<{ taskId: string; columnId: ColumnId }>) => {
      const { taskId, columnId } = action.payload;
      const column = state.byId[columnId];
      
      if (column && !column.taskIds.includes(taskId)) {
        column.taskIds.push(taskId);
      }
    },
    
    removeTaskFromColumn: (state, action: PayloadAction<{ taskId: string; columnId: ColumnId }>) => {
      const { taskId, columnId } = action.payload;
      const column = state.byId[columnId];
      
      if (column) {
        column.taskIds = column.taskIds.filter((id) => id !== taskId);
      }
    },
    
    moveTaskBetweenColumns: (state, action: PayloadAction<MoveTaskDTO>) => {
      const { taskId, targetColumnId, targetIndex } = action.payload;
      
      // Find source column
      let sourceColumnId: ColumnId | null = null;
      for (const colId of state.allIds) {
        if (state.byId[colId].taskIds.includes(taskId)) {
          sourceColumnId = colId;
          break;
        }
      }
      
      if (!sourceColumnId) return;
      
      // Remove from source
      const sourceColumn = state.byId[sourceColumnId];
      sourceColumn.taskIds = sourceColumn.taskIds.filter((id) => id !== taskId);
      
      // Add to target
      const targetColumn = state.byId[targetColumnId];
      if (typeof targetIndex === 'number') {
        targetColumn.taskIds.splice(targetIndex, 0, taskId);
      } else {
        targetColumn.taskIds.push(taskId);
      }
    },
    
    reorderColumn: (state, action: PayloadAction<{ columnId: ColumnId; taskIds: string[] }>) => {
      const { columnId, taskIds } = action.payload;
      const column = state.byId[columnId];
      
      if (column) {
        column.taskIds = taskIds;
      }
    },
    
    loadColumns: (_state, action: PayloadAction<ColumnsState>) => {
      return action.payload;
    },
  },
  extraReducers: (builder) => {
    builder.addCase(addTask, (state, action) => {
      // Automatically add task to column when created
      const columnId = action.meta.columnId as ColumnId;
      const taskId = action.meta.taskId as string;
      const column = state.byId[columnId];
      
      if (column && !column.taskIds.includes(taskId)) {
        column.taskIds.push(taskId);
      }
    });
  },
});

export const {
  addTaskToColumn,
  removeTaskFromColumn,
  moveTaskBetweenColumns,
  reorderColumn,
  loadColumns,
} = columnsSlice.actions;

export default columnsSlice.reducer;

import { describe, it, expect, beforeEach } from 'vitest';
import columnsReducer, {
  addTaskToColumn,
  removeTaskFromColumn,
  moveTaskBetweenColumns,
  reorderColumn,
} from './columnsSlice';
import type { ColumnsState } from '@types';

describe('columnsSlice', () => {
  let initialState: ColumnsState;

  beforeEach(() => {
    initialState = {
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
  });

  describe('addTaskToColumn', () => {
    it('should add task to column', () => {
      const state = columnsReducer(
        initialState,
        addTaskToColumn({ taskId: 'task-1', columnId: 'todo' })
      );

      expect(state.byId['todo'].taskIds).toContain('task-1');
      expect(state.byId['todo'].taskIds).toHaveLength(1);
    });

    it('should not add duplicate task to column', () => {
      let state = columnsReducer(
        initialState,
        addTaskToColumn({ taskId: 'task-1', columnId: 'todo' })
      );
      state = columnsReducer(
        state,
        addTaskToColumn({ taskId: 'task-1', columnId: 'todo' })
      );

      expect(state.byId['todo'].taskIds).toHaveLength(1);
    });

    it('should add multiple tasks to column', () => {
      let state = initialState;
      state = columnsReducer(state, addTaskToColumn({ taskId: 'task-1', columnId: 'todo' }));
      state = columnsReducer(state, addTaskToColumn({ taskId: 'task-2', columnId: 'todo' }));

      expect(state.byId['todo'].taskIds).toHaveLength(2);
      expect(state.byId['todo'].taskIds).toEqual(['task-1', 'task-2']);
    });
  });

  describe('removeTaskFromColumn', () => {
    it('should remove task from column', () => {
      let state = columnsReducer(
        initialState,
        addTaskToColumn({ taskId: 'task-1', columnId: 'todo' })
      );
      state = columnsReducer(
        state,
        removeTaskFromColumn({ taskId: 'task-1', columnId: 'todo' })
      );

      expect(state.byId['todo'].taskIds).not.toContain('task-1');
      expect(state.byId['todo'].taskIds).toHaveLength(0);
    });

    it('should not error when removing non-existent task', () => {
      expect(() => {
        columnsReducer(
          initialState,
          removeTaskFromColumn({ taskId: 'non-existent', columnId: 'todo' })
        );
      }).not.toThrow();
    });
  });

  describe('moveTaskBetweenColumns', () => {
    it('should move task from source to target column', () => {
      let state = columnsReducer(
        initialState,
        addTaskToColumn({ taskId: 'task-1', columnId: 'todo' })
      );

      state = columnsReducer(
        state,
        moveTaskBetweenColumns({ taskId: 'task-1', targetColumnId: 'in-progress' })
      );

      expect(state.byId['todo'].taskIds).not.toContain('task-1');
      expect(state.byId['in-progress'].taskIds).toContain('task-1');
    });

    it('should insert task at specific index', () => {
      let state = initialState;
      state = columnsReducer(state, addTaskToColumn({ taskId: 'task-1', columnId: 'todo' }));
      state = columnsReducer(state, addTaskToColumn({ taskId: 'task-2', columnId: 'todo' }));
      state = columnsReducer(state, addTaskToColumn({ taskId: 'task-3', columnId: 'in-progress' }));

      state = columnsReducer(
        state,
        moveTaskBetweenColumns({ taskId: 'task-1', targetColumnId: 'in-progress', targetIndex: 0 })
      );

      expect(state.byId['in-progress'].taskIds).toEqual(['task-1', 'task-3']);
    });

    it('should handle moving non-existent task gracefully', () => {
      const state = columnsReducer(
        initialState,
        moveTaskBetweenColumns({ taskId: 'non-existent', targetColumnId: 'done' })
      );

      expect(state).toEqual(initialState);
    });
  });

  describe('reorderColumn', () => {
    it('should reorder tasks in column', () => {
      let state = initialState;
      state = columnsReducer(state, addTaskToColumn({ taskId: 'task-1', columnId: 'todo' }));
      state = columnsReducer(state, addTaskToColumn({ taskId: 'task-2', columnId: 'todo' }));
      state = columnsReducer(state, addTaskToColumn({ taskId: 'task-3', columnId: 'todo' }));

      state = columnsReducer(
        state,
        reorderColumn({ columnId: 'todo', taskIds: ['task-3', 'task-1', 'task-2'] })
      );

      expect(state.byId['todo'].taskIds).toEqual(['task-3', 'task-1', 'task-2']);
    });

    it('should only affect specified column', () => {
      let state = initialState;
      state = columnsReducer(state, addTaskToColumn({ taskId: 'task-1', columnId: 'todo' }));
      state = columnsReducer(state, addTaskToColumn({ taskId: 'task-2', columnId: 'in-progress' }));

      const beforeReorder = [...state.byId['in-progress'].taskIds];

      state = columnsReducer(
        state,
        reorderColumn({ columnId: 'todo', taskIds: ['task-1'] })
      );

      expect(state.byId['in-progress'].taskIds).toEqual(beforeReorder);
    });
  });
});

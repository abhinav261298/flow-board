import { useMemo } from 'react';
import type { DragEvent } from 'react';
import { useAppSelector } from '@hooks';
import { selectTasksByColumnId, selectAllColumns } from '@store/selectors';
import type { ColumnId, Task } from '@types';
import TaskCard from '../TaskCard/TaskCard';
import AddTaskForm from '../AddTaskForm/AddTaskForm';
import styles from './Column.module.css';

interface DragState {
  isDragging: boolean;
  draggedTaskId: string | null;
  sourceColumnId: ColumnId | null;
  dragOverColumnId: ColumnId | null;
}

interface ColumnProps {
  columnId: ColumnId;
  dragState: DragState;
  onDragStart: (taskId: string, columnId: ColumnId) => (e: DragEvent) => void;
  onDragEnd: () => void;
  onDragOver: (columnId: ColumnId) => (e: DragEvent) => void;
  onDragLeave: () => void;
  onDrop: (targetColumnId: ColumnId, onMove: (taskId: string, targetColumnId: ColumnId) => void) => (e: DragEvent) => void;
  onMoveTask: (taskId: string, targetColumnId: ColumnId) => void;
}

const Column = ({ 
  columnId, 
  dragState,
  onDragStart,
  onDragEnd,
  onDragOver,
  onDragLeave,
  onDrop,
  onMoveTask,
}: ColumnProps) => {
  const column = useAppSelector((state) => selectAllColumns(state)[columnId]);
  const tasks = useAppSelector(selectTasksByColumnId(columnId));
  
  const taskCount = useMemo(() => tasks.length, [tasks.length]);
  
  const isDropTarget = dragState.dragOverColumnId === columnId && dragState.isDragging;

  return (
    <div 
      className={`${styles.column} ${isDropTarget ? styles.dropTarget : ''}`}
      onDragOver={onDragOver(columnId)}
      onDragLeave={onDragLeave}
      onDrop={onDrop(columnId, onMoveTask)}
    >
      <div className={styles.header}>
        <h2 className={styles.title}>{column.name}</h2>
        <span className={styles.count}>{taskCount}</span>
      </div>

      {columnId === 'todo' && (
        <div className={styles.addTaskSection}>
          <AddTaskForm />
        </div>
      )}

      <div className={styles.tasksList}>
        {tasks.length === 0 ? (
          <div className={styles.emptyState}>
            <p className={styles.emptyText}>
              {columnId === 'todo' 
                ? 'Add your first task above' 
                : 'No tasks yet'}
            </p>
          </div>
        ) : (
          tasks.map((task: Task) => (
            <div key={task.id} className={styles.taskWrapper}>
              <TaskCard 
                task={task}
                isDragging={dragState.draggedTaskId === task.id}
                onDragStart={onDragStart}
                onDragEnd={onDragEnd}
              />
            </div>
          ))
        )}
      </div>
    </div>
  );
};

export default Column;

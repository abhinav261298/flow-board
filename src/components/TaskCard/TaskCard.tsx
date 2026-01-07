import { useState, useRef } from 'react';
import type { DragEvent } from 'react';
import { useAppDispatch } from '@hooks';
import { moveTask } from '@store/slices/tasksSlice';
import { moveTaskBetweenColumns } from '@store/slices/columnsSlice';
import type { Task, ColumnId } from '@types';
import DeleteConfirmation from '../DeleteConfirmation/DeleteConfirmation';
import styles from './TaskCard.module.css';

interface TaskCardProps {
  task: Task;
  isDragging: boolean;
  onDragStart: (taskId: string, columnId: ColumnId) => (e: DragEvent) => void;
  onDragEnd: () => void;
}

const TaskCard = ({ task, isDragging, onDragStart, onDragEnd }: TaskCardProps) => {
  const dispatch = useAppDispatch();
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const taskCardRef = useRef<HTMLDivElement>(null);

  const canMoveLeft = task.columnId !== 'todo';
  const canMoveRight = task.columnId !== 'done';

  const handleMoveLeft = () => {
    const targetColumnId: ColumnId = 
      task.columnId === 'done' ? 'in-progress' : 'todo';
    
    dispatch(moveTask({ taskId: task.id, targetColumnId }));
    dispatch(moveTaskBetweenColumns({ taskId: task.id, targetColumnId }));
  };

  const handleMoveRight = () => {
    const targetColumnId: ColumnId = 
      task.columnId === 'todo' ? 'in-progress' : 'done';
    
    dispatch(moveTask({ taskId: task.id, targetColumnId }));
    dispatch(moveTaskBetweenColumns({ taskId: task.id, targetColumnId }));
  };

  const handleDelete = () => {
    setShowDeleteModal(true);
  };

  const handleCloseModal = () => {
    setShowDeleteModal(false);
  };

  return (
    <>
      <div 
        ref={taskCardRef}
        className={`${styles.taskCard} ${isDragging ? styles.dragging : ''}`}
        draggable
        onDragStart={onDragStart(task.id, task.columnId)}
        onDragEnd={onDragEnd}
      >
        <div className={styles.content}>
          <p className={styles.title}>{task.title}</p>
        </div>

        <div className={styles.actions}>
          <div className={styles.moveButtons}>
            {canMoveLeft && (
              <button
                className={`${styles.moveButton} ${styles.moveLeft}`}
                onClick={handleMoveLeft}
                aria-label="Move task left"
                title="Move left"
              >
                ←
              </button>
            )}
            {canMoveRight && (
              <button
                className={`${styles.moveButton} ${styles.moveRight}`}
                onClick={handleMoveRight}
                aria-label="Move task right"
                title="Move right"
              >
                →
              </button>
            )}
          </div>
          
          <button
            className={styles.deleteButton}
            onClick={handleDelete}
            aria-label="Delete task"
            title="Delete task"
          >
            ✕
          </button>
        </div>
      </div>

      {showDeleteModal && (
        <DeleteConfirmation
          taskId={task.id}
          taskTitle={task.title}
          onClose={handleCloseModal}
          taskRef={taskCardRef}
        />
      )}
    </>
  );
};

export default TaskCard;

import { createPortal } from 'react-dom';
import { useAppDispatch } from '@hooks';
import { deleteTask } from '@store/slices/tasksSlice';
import { removeTaskFromColumn } from '@store/slices/columnsSlice';
import { useAppSelector } from '@hooks';
import { selectAllColumns } from '@store/selectors';
import styles from './DeleteConfirmation.module.css';

interface DeleteConfirmationProps {
  taskId: string;
  taskTitle: string;
  onClose: () => void;
  taskRef?: React.RefObject<HTMLDivElement | null>;
}

const DeleteConfirmation = ({ taskId, taskTitle, onClose, taskRef }: DeleteConfirmationProps) => {
  const dispatch = useAppDispatch();
  const columns = useAppSelector(selectAllColumns);
  
  // Get task card position for inline positioning
  const rect = taskRef?.current?.getBoundingClientRect();

  const handleConfirm = () => {
    dispatch(deleteTask({ taskId }));
    
    // Find which column the task is in and remove it
    for (const columnId of Object.keys(columns)) {
      const column = columns[columnId as keyof typeof columns];
      if (column.taskIds.includes(taskId)) {
        dispatch(removeTaskFromColumn({ 
          taskId, 
          columnId: column.id 
        }));
        break;
      }
    }
    
    onClose();
  };

  const handleCancel = () => {
    onClose();
  };

  const handleBackdropClick = (e: React.MouseEvent) => {
    if (e.target === e.currentTarget) {
      onClose();
    }
  };

  // Render inline confirmation using Portal (positioned over task card)
  return createPortal(
    <div className={styles.backdrop} onClick={handleBackdropClick}>
      <div 
        className={styles.inlineModal}
        style={{
          top: rect ? `${rect.top}px` : '50%',
          left: rect ? `${rect.left}px` : '50%',
          width: rect ? `${rect.width}px` : 'auto',
          transform: rect ? 'none' : 'translate(-50%, -50%)'
        }}
      >
        <div className={styles.header}>
          <span className={styles.icon}>⚠️</span>
          <h4 className={styles.title}>Delete?</h4>
        </div>
        
        <p className={styles.message}>
          <strong>"{taskTitle}"</strong>
        </p>
        
        <div className={styles.actions}>
          <button
            className={styles.cancelButton}
            onClick={handleCancel}
            type="button"
          >
            Cancel
          </button>
          <button
            className={styles.deleteButton}
            onClick={handleConfirm}
            type="button"
          >
            Delete
          </button>
        </div>
      </div>
    </div>,
    document.body
  );
};

export default DeleteConfirmation;

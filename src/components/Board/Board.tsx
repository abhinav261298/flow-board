import { useAppSelector, useAppDispatch, useDragAndDrop } from '@hooks';
import { selectColumnIds } from '@store/selectors';
import { moveTaskBetweenColumns } from '@store/slices/columnsSlice';
import { moveTask } from '@store/slices/tasksSlice';
import type { ColumnId } from '@types';
import Column from '../Column/Column';
import styles from './Board.module.css';

const Board = () => {
  const dispatch = useAppDispatch();
  const columnIds = useAppSelector(selectColumnIds);
  const dragAndDrop = useDragAndDrop();

  const handleMoveTask = (taskId: string, targetColumnId: ColumnId) => {
    // Update task's columnId in tasks state
    dispatch(moveTask({ taskId, targetColumnId }));
    
    // Move task between columns in columns state
    dispatch(moveTaskBetweenColumns({ taskId, targetColumnId }));
  };

  return (
    <div className={styles.board}>
      <header className={styles.header}>
        <h1 className={styles.title}>FlowBoard</h1>
        <p className={styles.subtitle}>Task Management Made Simple</p>
      </header>
      
      <div className={styles.columnsContainer}>
        {columnIds.map((columnId: ColumnId) => (
          <Column 
            key={columnId} 
            columnId={columnId}
            dragState={dragAndDrop.dragState}
            onDragStart={dragAndDrop.handleDragStart}
            onDragEnd={dragAndDrop.handleDragEnd}
            onDragOver={dragAndDrop.handleDragOver}
            onDragLeave={dragAndDrop.handleDragLeave}
            onDrop={dragAndDrop.handleDrop}
            onMoveTask={handleMoveTask}
          />
        ))}
      </div>
    </div>
  );
};

export default Board;

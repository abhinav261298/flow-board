import { useState, useCallback } from 'react';
import type { DragEvent } from 'react';
import type { ColumnId } from '@types';

interface DragState {
  isDragging: boolean;
  draggedTaskId: string | null;
  sourceColumnId: ColumnId | null;
  dragOverColumnId: ColumnId | null;
}

interface UseDragAndDropReturn {
  dragState: DragState;
  handleDragStart: (taskId: string, columnId: ColumnId) => (e: DragEvent) => void;
  handleDragEnd: () => void;
  handleDragOver: (columnId: ColumnId) => (e: DragEvent) => void;
  handleDragLeave: () => void;
  handleDrop: (targetColumnId: ColumnId, onMove: (taskId: string, targetColumnId: ColumnId) => void) => (e: DragEvent) => void;
}

/**
 * Custom hook for HTML5 drag-and-drop functionality
 */
export const useDragAndDrop = (): UseDragAndDropReturn => {
  const [dragState, setDragState] = useState<DragState>({
    isDragging: false,
    draggedTaskId: null,
    sourceColumnId: null,
    dragOverColumnId: null,
  });

  const handleDragStart = useCallback(
    (taskId: string, columnId: ColumnId) => (e: DragEvent) => {
      e.dataTransfer.effectAllowed = 'move';
      e.dataTransfer.setData('text/plain', taskId);
      e.dataTransfer.setData('application/json', JSON.stringify({ taskId, columnId }));
      
      setDragState({
        isDragging: true,
        draggedTaskId: taskId,
        sourceColumnId: columnId,
        dragOverColumnId: null,
      });

      // Add slight delay to allow CSS transitions to take effect
      setTimeout(() => {
        const target = e.target as HTMLElement;
        target.style.opacity = '0.4';
      }, 0);
    },
    []
  );

  const handleDragEnd = useCallback(() => {
    setDragState({
      isDragging: false,
      draggedTaskId: null,
      sourceColumnId: null,
      dragOverColumnId: null,
    });
  }, []);

  const handleDragOver = useCallback(
    (columnId: ColumnId) => (e: DragEvent) => {
      e.preventDefault();
      e.dataTransfer.dropEffect = 'move';
      
      setDragState((prev) => ({
        ...prev,
        dragOverColumnId: columnId,
      }));
    },
    []
  );

  const handleDragLeave = useCallback(() => {
    setDragState((prev) => ({
      ...prev,
      dragOverColumnId: null,
    }));
  }, []);

  const handleDrop = useCallback(
    (targetColumnId: ColumnId, onMove: (taskId: string, targetColumnId: ColumnId) => void) =>
      (e: DragEvent) => {
        e.preventDefault();
        e.stopPropagation();

        const taskId = e.dataTransfer.getData('text/plain');
        
        if (!taskId) return;

        // Get source column from drag data
        let sourceColumnId: ColumnId | null = null;
        try {
          const data = e.dataTransfer.getData('application/json');
          if (data) {
            const parsed = JSON.parse(data);
            sourceColumnId = parsed.columnId;
          }
        } catch (error) {
          console.error('Error parsing drag data:', error);
        }

        // Only move if dropping in a different column
        if (sourceColumnId && sourceColumnId !== targetColumnId) {
          onMove(taskId, targetColumnId);
        }

        // Reset drag state
        setDragState({
          isDragging: false,
          draggedTaskId: null,
          sourceColumnId: null,
          dragOverColumnId: null,
        });
      },
    []
  );

  return {
    dragState,
    handleDragStart,
    handleDragEnd,
    handleDragOver,
    handleDragLeave,
    handleDrop,
  };
};

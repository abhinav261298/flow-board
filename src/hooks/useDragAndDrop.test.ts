import { describe, it, expect, beforeEach } from 'vitest';
import { renderHook, act } from '@testing-library/react';
import { useDragAndDrop } from './useDragAndDrop';
import type { DragEvent } from 'react';

describe('useDragAndDrop', () => {
  let mockDataTransfer: any;

  beforeEach(() => {
    mockDataTransfer = {
      effectAllowed: '',
      dropEffect: '',
      setData: () => {},
      getData: (format: string) => {
        if (format === 'text/plain') return 'task-1';
        if (format === 'application/json') {
          return JSON.stringify({ taskId: 'task-1', columnId: 'todo' });
        }
        return '';
      },
    };
  });

  const createMockDragEvent = (overrides = {}): Partial<DragEvent> => ({
    dataTransfer: mockDataTransfer,
    preventDefault: () => {},
    stopPropagation: () => {},
    target: { style: {} } as any,
    ...overrides,
  });

  it('should initialize with default state', () => {
    const { result } = renderHook(() => useDragAndDrop());

    expect(result.current.dragState).toEqual({
      isDragging: false,
      draggedTaskId: null,
      sourceColumnId: null,
      dragOverColumnId: null,
    });
  });

  it('should set dragging state on drag start', () => {
    const { result } = renderHook(() => useDragAndDrop());
    const mockEvent = createMockDragEvent() as DragEvent;

    act(() => {
      result.current.handleDragStart('task-1', 'todo')(mockEvent);
    });

    expect(result.current.dragState.isDragging).toBe(true);
    expect(result.current.dragState.draggedTaskId).toBe('task-1');
    expect(result.current.dragState.sourceColumnId).toBe('todo');
  });

  it('should reset state on drag end', () => {
    const { result } = renderHook(() => useDragAndDrop());
    const mockEvent = createMockDragEvent() as DragEvent;

    act(() => {
      result.current.handleDragStart('task-1', 'todo')(mockEvent);
    });

    expect(result.current.dragState.isDragging).toBe(true);

    act(() => {
      result.current.handleDragEnd();
    });

    expect(result.current.dragState).toEqual({
      isDragging: false,
      draggedTaskId: null,
      sourceColumnId: null,
      dragOverColumnId: null,
    });
  });

  it('should set dragOverColumnId on drag over', () => {
    const { result } = renderHook(() => useDragAndDrop());
    const mockEvent = createMockDragEvent() as DragEvent;

    act(() => {
      result.current.handleDragStart('task-1', 'todo')(mockEvent);
      result.current.handleDragOver('in-progress')(mockEvent);
    });

    expect(result.current.dragState.dragOverColumnId).toBe('in-progress');
  });

  it('should clear dragOverColumnId on drag leave', () => {
    const { result } = renderHook(() => useDragAndDrop());
    const mockEvent = createMockDragEvent() as DragEvent;

    act(() => {
      result.current.handleDragStart('task-1', 'todo')(mockEvent);
      result.current.handleDragOver('in-progress')(mockEvent);
    });

    expect(result.current.dragState.dragOverColumnId).toBe('in-progress');

    act(() => {
      result.current.handleDragLeave();
    });

    expect(result.current.dragState.dragOverColumnId).toBeNull();
  });

  it('should call onMove on drop when dropping in different column', () => {
    const { result } = renderHook(() => useDragAndDrop());
    const mockEvent = createMockDragEvent() as DragEvent;
    const onMove = vi.fn();

    act(() => {
      result.current.handleDragStart('task-1', 'todo')(mockEvent);
      result.current.handleDrop('in-progress', onMove)(mockEvent);
    });

    expect(onMove).toHaveBeenCalledWith('task-1', 'in-progress');
  });

  it('should not call onMove when dropping in same column', () => {
    const { result } = renderHook(() => useDragAndDrop());
    const mockEvent = createMockDragEvent() as DragEvent;
    const onMove = vi.fn();

    act(() => {
      result.current.handleDragStart('task-1', 'todo')(mockEvent);
      result.current.handleDrop('todo', onMove)(mockEvent);
    });

    expect(onMove).not.toHaveBeenCalled();
  });

  it('should reset drag state after drop', () => {
    const { result } = renderHook(() => useDragAndDrop());
    const mockEvent = createMockDragEvent() as DragEvent;
    const onMove = vi.fn();

    act(() => {
      result.current.handleDragStart('task-1', 'todo')(mockEvent);
      result.current.handleDrop('in-progress', onMove)(mockEvent);
    });

    expect(result.current.dragState).toEqual({
      isDragging: false,
      draggedTaskId: null,
      sourceColumnId: null,
      dragOverColumnId: null,
    });
  });

  it('should handle invalid drop data gracefully', () => {
    const { result } = renderHook(() => useDragAndDrop());
    const invalidDataTransfer = {
      ...mockDataTransfer,
      getData: () => '', // Empty data
    };
    const mockEvent = createMockDragEvent({ dataTransfer: invalidDataTransfer }) as DragEvent;
    const onMove = vi.fn();

    act(() => {
      result.current.handleDrop('in-progress', onMove)(mockEvent);
    });

    expect(onMove).not.toHaveBeenCalled();
  });
});

import { describe, it, expect, beforeEach } from 'vitest';
import { renderHook, act } from '@testing-library/react';
import { useToast, useToastStore } from '../hooks/useToast';

describe('useToast hook & store', () => {
  beforeEach(() => {
    useToastStore.getState().clearToasts();
  });

  it('should initialize with empty toast list', () => {
    const { result } = renderHook(() => useToast());
    expect(result.current.toasts).toEqual([]);
  });

  it('should add a success toast correctly', () => {
    const { result } = renderHook(() => useToast());

    act(() => {
      result.current.success('Task Saved', 'Task details updated');
    });

    expect(result.current.toasts).toHaveLength(1);
    expect(result.current.toasts[0].type).toBe('success');
    expect(result.current.toasts[0].title).toBe('Task Saved');
    expect(result.current.toasts[0].description).toBe('Task details updated');
  });

  it('should add error, warning, and info toasts', () => {
    const { result } = renderHook(() => useToast());

    act(() => {
      result.current.error('Error Occurred');
      result.current.warning('Warning Alert');
      result.current.info('Info Message');
    });

    expect(result.current.toasts).toHaveLength(3);
    expect(result.current.toasts[0].type).toBe('error');
    expect(result.current.toasts[1].type).toBe('warning');
    expect(result.current.toasts[2].type).toBe('info');
  });

  it('should manually dismiss a toast by ID', () => {
    const { result } = renderHook(() => useToast());

    let toastId: string = '';
    act(() => {
      toastId = result.current.toast({ type: 'info', title: 'Temporary' });
    });

    expect(result.current.toasts).toHaveLength(1);

    act(() => {
      result.current.dismiss(toastId);
    });

    expect(result.current.toasts).toHaveLength(0);
  });

  it('should clear all toasts', () => {
    const { result } = renderHook(() => useToast());

    act(() => {
      result.current.success('Toast 1');
      result.current.success('Toast 2');
      result.current.success('Toast 3');
    });

    expect(result.current.toasts).toHaveLength(3);

    act(() => {
      result.current.clearAll();
    });

    expect(result.current.toasts).toHaveLength(0);
  });
});

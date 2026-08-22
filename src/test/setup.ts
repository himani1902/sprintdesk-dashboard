import '@testing-library/jest-dom';
import { beforeEach } from 'vitest';
import { useBoardStore } from '../store/board.store';
import { useAuthStore } from '../store/auth.store';
import { useToastStore } from '../hooks/useToast';
import { useNotificationStore } from '../store/notification.store';

const createStorageMock = () => {
  let store: Record<string, string> = {};
  return {
    getItem: (key: string) => store[key] ?? null,
    setItem: (key: string, value: string) => {
      store[key] = String(value);
    },
    removeItem: (key: string) => {
      delete store[key];
    },
    clear: () => {
      store = {};
    },
    get length() {
      return Object.keys(store).length;
    },
    key: (index: number) => Object.keys(store)[index] ?? null,
  };
};

const storageMock = createStorageMock();
Object.defineProperty(globalThis, 'localStorage', {
  value: storageMock,
  writable: true,
});

beforeEach(() => {
  localStorage.clear();
  useBoardStore.getState().resetFilters();
  useAuthStore.getState().logout();
  useToastStore.getState().clearToasts();
});


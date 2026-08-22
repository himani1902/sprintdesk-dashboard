import { create } from 'zustand';
import { storage } from '../utils/storage';

export type ThemeMode = 'light' | 'dark';

interface ThemeState {
  theme: ThemeMode;
  toggleTheme: () => void;
  setTheme: (theme: ThemeMode) => void;
  initTheme: () => void;
}

const LOCAL_STORAGE_KEY = 'sp_theme_mode';

export const useThemeStore = create<ThemeState>((set, get) => ({
  theme: storage.getItem<ThemeMode>(LOCAL_STORAGE_KEY, 'light'),

  toggleTheme: () => {
    const nextTheme: ThemeMode = get().theme === 'dark' ? 'light' : 'dark';
    storage.setItem(LOCAL_STORAGE_KEY, nextTheme);
    if (nextTheme === 'dark') {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
    set({ theme: nextTheme });
  },

  setTheme: (theme: ThemeMode) => {
    storage.setItem(LOCAL_STORAGE_KEY, theme);
    if (theme === 'dark') {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
    set({ theme });
  },

  initTheme: () => {
    const savedTheme = storage.getItem<ThemeMode>(LOCAL_STORAGE_KEY, 'light');
    if (savedTheme === 'dark') {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
    set({ theme: savedTheme });
  },
}));

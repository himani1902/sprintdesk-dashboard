import { create } from 'zustand';
import { NotificationState, NotificationItem } from '../types/notification';
import { storage } from '../utils/storage';

const LOCAL_STORAGE_KEY = 'sp_notifications_v1';

export const useNotificationStore = create<NotificationState>((set, get) => ({
  notifications: storage.getItem<NotificationItem[]>(LOCAL_STORAGE_KEY, [
    {
      id: 'init-1',
      title: 'Welcome to SprintDesk',
      body: 'Sprint 24 is now active. Review active tasks and track real-time team progress.',
      timestamp: new Date().toISOString(),
      isRead: false,
      type: 'info',
    },
    {
      id: 'init-2',
      title: 'Sprint 23 Retrospective Completed',
      body: 'Team achieved 94% velocity goal in Sprint 23. Check analytics page for details.',
      timestamp: new Date(Date.now() - 3600000 * 4).toISOString(),
      isRead: true,
      type: 'success',
    }
  ]),
  unreadCount: 1,
  currentPage: 1,
  itemsPerPage: 5,
  isPanelOpen: false,

  addNotification: (newItem) => {
    const notifications = get().notifications;
    // Check duplicate ID
    if (notifications.some((n) => String(n.id) === String(newItem.id))) {
      return;
    }

    const item: NotificationItem = {
      ...newItem,
      timestamp: new Date().toISOString(),
      isRead: false,
    };

    const updated = [item, ...notifications];
    storage.setItem(LOCAL_STORAGE_KEY, updated);
    
    const unreadCount = updated.filter((n) => !n.isRead).length;
    set({ notifications: updated, unreadCount });
  },

  markAsRead: (id) => {
    const updated = get().notifications.map((n) =>
      String(n.id) === String(id) ? { ...n, isRead: true } : n
    );
    storage.setItem(LOCAL_STORAGE_KEY, updated);
    const unreadCount = updated.filter((n) => !n.isRead).length;
    set({ notifications: updated, unreadCount });
  },

  markAllAsRead: () => {
    const updated = get().notifications.map((n) => ({ ...n, isRead: true }));
    storage.setItem(LOCAL_STORAGE_KEY, updated);
    set({ notifications: updated, unreadCount: 0 });
  },

  setPage: (currentPage) => set({ currentPage }),
  togglePanel: () => set((state) => ({ isPanelOpen: !state.isPanelOpen })),
  setPanelOpen: (isPanelOpen) => set({ isPanelOpen }),
}));

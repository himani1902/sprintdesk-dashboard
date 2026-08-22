import { create } from 'zustand';
import { NotificationState, NotificationItem } from '../types/notification';
import { storage } from '../utils/storage';

const LOCAL_STORAGE_KEY = 'sp_notifications_v3';

export const useNotificationStore = create<NotificationState>((set, get) => ({
  notifications: storage.getItem<NotificationItem[]>(LOCAL_STORAGE_KEY, [
    {
      id: 101,
      title: 'Task assigned',
      body: "You have been assigned to 'Build Kanban board'.",
      timestamp: '2026-08-19T11:10:00Z',
      isRead: false,
      type: 'info',
    },
    {
      id: 102,
      title: 'Review requested',
      body: "A review has been requested for 'Create analytics dashboard'.",
      timestamp: '2026-08-19T13:30:00Z',
      isRead: false,
      type: 'warning',
    },
    {
      id: 103,
      title: 'Task completed',
      body: "'Implement authentication flow' has been completed.",
      timestamp: '2026-08-18T16:20:00Z',
      isRead: true,
      type: 'success',
    },
    {
      id: 104,
      title: 'Review requested',
      body: "A review has been requested for 'Accessibility audit'.",
      timestamp: '2026-08-19T14:00:00Z',
      isRead: false,
      type: 'warning',
    },
  ]),
  unreadCount: 3,
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

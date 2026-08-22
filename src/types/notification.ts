export interface NotificationItem {
  id: string | number;
  title: string;
  body: string;
  timestamp: string;
  isRead: boolean;
  type: 'info' | 'warning' | 'success' | 'alert';
}

export interface NotificationState {
  notifications: NotificationItem[];
  unreadCount: number;
  currentPage: number;
  itemsPerPage: number;
  isPanelOpen: boolean;
  
  // Actions
  addNotification: (notification: Omit<NotificationItem, 'timestamp' | 'isRead'>) => void;
  markAsRead: (id: string | number) => void;
  markAllAsRead: () => void;
  setPage: (page: number) => void;
  togglePanel: () => void;
  setPanelOpen: (isOpen: boolean) => void;
}

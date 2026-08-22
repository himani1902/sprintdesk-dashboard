import { useEffect } from 'react';
import { useQuery } from '@tanstack/react-query';
import { notificationsApi } from '../api/notifications.api';
import { useNotificationStore } from '../store/notification.store';
import { useToast } from './useToast';

export function useNotifications() {
  const { addNotification, isPanelOpen } = useNotificationStore();
  const { info } = useToast();

  const { data, refetch } = useQuery({
    queryKey: ['notifications-polling'],
    queryFn: notificationsApi.pollNotifications,
    refetchInterval: () => (typeof document !== 'undefined' && document.hidden ? false : 15000),
    refetchOnWindowFocus: true,
  });

  // Handle new polled data
  useEffect(() => {
    if (!data || data.length === 0) return;

    data.forEach((post) => {
      const notifId = `polled-post-${post.id}`;
      // Add notification to store if not already present
      addNotification({
        id: notifId,
        title: `Community Update: ${post.title.substring(0, 30)}...`,
        body: post.body.substring(0, 80) + '...',
        type: 'info',
      });

      // Show toast if notification panel is closed
      if (!isPanelOpen) {
        info('New Notification Received', post.title.substring(0, 45) + '...');
      }
    });
  }, [data]);

  // Pause polling when browser tab is hidden (document.hidden)
  useEffect(() => {
    const handleVisibilityChange = () => {
      if (!document.hidden) {
        refetch();
      }
    };

    document.addEventListener('visibilitychange', handleVisibilityChange);
    return () => {
      document.removeEventListener('visibilitychange', handleVisibilityChange);
    };
  }, [refetch]);
}

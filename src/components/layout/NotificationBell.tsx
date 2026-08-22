import React, { useRef, useEffect } from 'react';
import { Bell, CheckCheck, ChevronLeft, ChevronRight, Inbox } from 'lucide-react';
import { useNotificationStore } from '../../store/notification.store';
import { useNotifications } from '../../hooks/useNotifications';
import { Button } from '../ui/Button';
import { formatRelativeTime } from '../../utils/date';

export const NotificationBell: React.FC = () => {
  // Activate polling hook
  useNotifications();

  const {
    notifications,
    unreadCount,
    currentPage,
    itemsPerPage,
    isPanelOpen,
    togglePanel,
    setPanelOpen,
    markAsRead,
    markAllAsRead,
    setPage,
  } = useNotificationStore();

  const panelRef = useRef<HTMLDivElement>(null);

  // Close panel on outside click
  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (panelRef.current && !panelRef.current.contains(e.target as Node)) {
        setPanelOpen(false);
      }
    };
    if (isPanelOpen) {
      document.addEventListener('mousedown', handleClickOutside);
    }
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [isPanelOpen, setPanelOpen]);

  const totalPages = Math.ceil(notifications.length / itemsPerPage) || 1;
  const paginatedNotifications = notifications.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  return (
    <div className="relative" ref={panelRef}>
      <button
        onClick={togglePanel}
        className="relative p-2 rounded-xl text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800/80 transition-colors focus:outline-none focus:ring-2 focus:ring-brand-500"
        aria-label={`Notifications, ${unreadCount} unread`}
      >
        <Bell className="w-5 h-5" />
        {unreadCount > 0 && (
          <span className="absolute top-1 right-1 flex items-center justify-center min-w-[18px] h-[18px] px-1 text-[10px] font-bold text-white bg-brand-600 rounded-full ring-2 ring-white dark:ring-slate-900 animate-pulse-subtle">
            {unreadCount > 99 ? '99+' : unreadCount}
          </span>
        )}
      </button>

      {/* Popover Panel */}
      {isPanelOpen && (
        <div className="absolute right-0 mt-3 w-80 sm:w-96 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl shadow-2xl z-50 overflow-hidden animate-slide-down">
          {/* Header */}
          <div className="flex items-center justify-between px-5 py-3.5 border-b border-slate-100 dark:border-slate-800/80 bg-slate-50/50 dark:bg-slate-950/40">
            <div className="flex items-center gap-2">
              <h3 className="text-sm font-semibold text-slate-900 dark:text-slate-100">Notifications</h3>
              {unreadCount > 0 && (
                <span className="text-xs font-semibold px-2 py-0.5 rounded-full bg-brand-100 dark:bg-brand-950 text-brand-700 dark:text-brand-300">
                  {unreadCount} new
                </span>
              )}
            </div>
            {unreadCount > 0 && (
              <Button
                variant="ghost"
                size="sm"
                onClick={markAllAsRead}
                className="text-xs py-1 px-2 text-brand-600 dark:text-brand-400 hover:bg-brand-50 dark:hover:bg-brand-950/50 gap-1"
              >
                <CheckCheck className="w-3.5 h-3.5" />
                Mark all read
              </Button>
            )}
          </div>

          {/* List Body */}
          <div className="max-h-80 overflow-y-auto divide-y divide-slate-100 dark:divide-slate-800/60">
            {paginatedNotifications.length > 0 ? (
              paginatedNotifications.map((notif) => (
                <div
                  key={notif.id}
                  onClick={() => markAsRead(notif.id)}
                  className={`p-4 transition-colors cursor-pointer flex items-start gap-3 hover:bg-orange-50/60 dark:hover:bg-slate-800/60 ${
                    !notif.isRead ? 'bg-orange-50/40 dark:bg-brand-950/20' : ''
                  }`}
                >
                  <div className={`w-2.5 h-2.5 mt-1.5 rounded-full shrink-0 ${!notif.isRead ? 'bg-brand-500 ring-2 ring-brand-500/20' : 'bg-transparent'}`} />
                  <div className="flex-1 min-w-0">
                    <h4 className={`text-xs font-bold ${!notif.isRead ? 'text-slate-900 dark:text-slate-100' : 'text-slate-700 dark:text-slate-300'}`}>
                      {notif.title}
                    </h4>
                    <p className="mt-0.5 text-xs text-slate-600 dark:text-slate-300 line-clamp-2 leading-relaxed">{notif.body}</p>
                    <span className="mt-1 block text-[10px] font-semibold text-slate-500 dark:text-slate-400">
                      {formatRelativeTime(notif.timestamp)}
                    </span>
                  </div>
                </div>
              ))
            ) : (
              <div className="py-12 px-4 text-center text-slate-500 dark:text-slate-400 flex flex-col items-center gap-2">
                <Inbox className="w-8 h-8 stroke-1 text-brand-500" />
                <p className="text-xs font-semibold">No notifications right now</p>
              </div>
            )}
          </div>

          {/* Footer Pagination */}
          {totalPages > 1 && (
            <div className="flex items-center justify-between px-4 py-2.5 bg-slate-50/80 dark:bg-slate-950/60 border-t border-slate-100 dark:border-slate-800/80 text-xs font-semibold text-slate-600 dark:text-slate-400">
              <span>
                Page {currentPage} of {totalPages}
              </span>
              <div className="flex items-center gap-1">
                <Button
                  size="sm"
                  variant="ghost"
                  disabled={currentPage === 1}
                  onClick={() => setPage(Math.max(currentPage - 1, 1))}
                  className="p-1"
                >
                  <ChevronLeft className="w-4 h-4" />
                </Button>
                <Button
                  size="sm"
                  variant="ghost"
                  disabled={currentPage === totalPages}
                  onClick={() => setPage(Math.min(currentPage + 1, totalPages))}
                  className="p-1"
                >
                  <ChevronRight className="w-4 h-4" />
                </Button>
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
};

import React, { useState, useRef, useEffect } from 'react';
import { Sun, Moon, LogOut, Kanban, User as UserIcon, Plus } from 'lucide-react';
import { useAuthStore } from '../../store/auth.store';
import { useThemeStore } from '../../store/theme.store';
import { useBoardStore } from '../../store/board.store';
import { NotificationBell } from './NotificationBell';
import { Avatar } from '../ui/Avatar';
import { Button } from '../ui/Button';

export const Header: React.FC = () => {
  const { user, logout } = useAuthStore();
  const { theme, toggleTheme } = useThemeStore();
  const { setCreateModalOpen } = useBoardStore();

  const [isProfileOpen, setIsProfileOpen] = useState(false);
  const profileRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (profileRef.current && !profileRef.current.contains(e.target as Node)) {
        setIsProfileOpen(false);
      }
    };
    if (isProfileOpen) {
      document.addEventListener('mousedown', handleClickOutside);
    }
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [isProfileOpen]);

  const userAvatar =
    user?.image?.includes('dummyjson.com/icon') || !user?.image
      ? 'https://i.pravatar.cc/150?img=47'
      : user.image;

  const fullName = user ? `${user.firstName || ''} ${user.lastName || ''}`.trim() || user.username : 'Developer';

  return (
    <header className="sticky top-0 z-40 w-full h-16 bg-white/95 dark:bg-slate-900/95 backdrop-blur-md border-b border-orange-100 dark:border-slate-800 px-3 sm:px-6 flex items-center justify-between transition-colors shadow-xs">
      {/* Brand & Active Sprint Indicator */}
      <div className="flex items-center gap-2 sm:gap-3">
        <div className="flex items-center gap-2.5 sm:gap-3">
          <div className="w-9 h-9 sm:w-10 sm:h-10 rounded-2xl bg-brand-500 flex items-center justify-center text-white shadow-md shadow-brand-500/25 shrink-0">
            <Kanban className="w-5 h-5 sm:w-5.5 sm:h-5.5" />
          </div>
          <div className="min-w-0">
            <div className="flex items-center gap-1.5 sm:gap-2">
              <span className="text-base sm:text-lg font-black tracking-tight text-slate-900 dark:text-slate-100 font-sans truncate">
                SprintDesk
              </span>
              <span className="inline-flex items-center px-2 py-0.5 rounded-full text-[10px] font-bold bg-orange-100 text-brand-900 dark:bg-brand-950 dark:text-brand-300 border border-orange-200 dark:border-brand-800 shrink-0">
                Sprint 3
              </span>
            </div>
            <p className="text-[11px] text-slate-600 dark:text-slate-400 font-medium hidden sm:block">
              Sprint 3 — Active Workspace
            </p>
          </div>
        </div>
      </div>

      {/* Global Actions, Notification Bell, Theme Switcher & User Profile */}
      <div className="flex items-center gap-1.5 sm:gap-3">
        {/* Quick New Task Trigger Button */}
        <Button
          size="sm"
          variant="primary"
          onClick={() => setCreateModalOpen(true)}
          leftIcon={<Plus className="w-4 h-4" />}
          className="hidden sm:inline-flex shadow-sm shadow-brand-500/20"
        >
          New Task
        </Button>

        {/* Theme Toggle Button */}
        <button
          onClick={toggleTheme}
          className="p-2 rounded-xl text-slate-600 dark:text-slate-300 hover:bg-orange-50 dark:hover:bg-slate-800 transition-colors focus:outline-none focus:ring-2 focus:ring-brand-500"
          aria-label="Toggle theme"
          title={`Switch to ${theme === 'dark' ? 'light' : 'dark'} mode`}
        >
          {theme === 'dark' ? <Sun className="w-5 h-5 text-amber-400" /> : <Moon className="w-5 h-5 text-slate-600" />}
        </button>

        {/* Notification Bell */}
        <NotificationBell />

        {/* User Profile Menu */}
        <div className="relative ml-0.5 sm:ml-1" ref={profileRef}>
          <button
            onClick={() => setIsProfileOpen(!isProfileOpen)}
            className="flex items-center gap-2 p-1 rounded-full hover:bg-orange-50 dark:hover:bg-slate-800 transition-colors focus:outline-none focus:ring-2 focus:ring-brand-500"
            aria-label="User menu"
          >
            <Avatar src={userAvatar} name={fullName} size="sm" />
            <span className="hidden md:inline-block text-xs font-semibold text-slate-700 dark:text-slate-200">
              {fullName}
            </span>
          </button>

          {isProfileOpen && (
            <div className="absolute right-0 mt-3 w-52 sm:w-56 bg-white dark:bg-slate-900 border border-orange-100 dark:border-slate-800 rounded-2xl shadow-2xl z-50 overflow-hidden animate-slide-down">
              <div className="px-4 py-3 border-b border-orange-100 dark:border-slate-800 bg-orange-50/50 dark:bg-slate-950/40">
                <p className="text-xs font-bold text-slate-900 dark:text-slate-100">{fullName}</p>
                <p className="text-[11px] text-slate-500 dark:text-slate-400 truncate">{user?.email || 'emily.johnson@example.com'}</p>
              </div>

              <div className="p-1.5">
                <div className="px-3 py-2 text-xs text-slate-600 dark:text-slate-400 flex items-center gap-2">
                  <Avatar src={userAvatar} name={fullName} size="xs" />
                  <span>Lead Frontend Engineer</span>
                </div>
                <button
                  onClick={() => {
                    setIsProfileOpen(false);
                    logout();
                  }}
                  className="w-full flex items-center gap-2 px-3 py-2 text-xs font-medium text-red-600 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-950/40 rounded-xl transition-colors"
                >
                  <LogOut className="w-4 h-4" />
                  <span>Sign out</span>
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </header>
  );
};

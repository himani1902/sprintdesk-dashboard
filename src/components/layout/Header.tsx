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

  const fullName = user ? `${user.firstName || ''} ${user.lastName || ''}`.trim() || user.username : 'Developer';

  return (
    <header className="sticky top-0 z-40 w-full h-16 bg-white/95 dark:bg-slate-900/95 backdrop-blur-md border-b border-orange-100 dark:border-slate-800 px-4 sm:px-6 flex items-center justify-between transition-colors shadow-xs">
      {/* Brand & Active Sprint Indicator */}
      <div className="flex items-center gap-3">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-2xl bg-brand-500 flex items-center justify-center text-white shadow-md shadow-brand-500/25">
            <Kanban className="w-5.5 h-5.5" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="text-lg font-black tracking-tight text-slate-900 dark:text-slate-100 font-sans">
                SprintDesk
              </span>
              <span className="px-2 py-0.5 text-[10px] font-bold rounded-full bg-brand-100 text-brand-700 dark:bg-brand-950 dark:text-brand-300">
                PRO
              </span>
            </div>
            <div className="flex items-center gap-1.5 mt-0.5">
              <span className="inline-block w-2 h-2 rounded-full bg-orange-500 animate-pulse" />
              <span className="text-[11px] font-medium text-slate-500 dark:text-slate-400">
                Sprint 24 — Active Workspace
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* Actions */}
      <div className="flex items-center gap-3">
        {/* Quick New Task Button */}
        <Button
          size="sm"
          onClick={() => setCreateModalOpen(true)}
          leftIcon={<Plus className="w-4 h-4" />}
          className="hidden sm:inline-flex"
        >
          New Task
        </Button>

        {/* Theme Switcher */}
        <button
          onClick={toggleTheme}
          className="p-2 rounded-xl text-slate-600 dark:text-slate-300 hover:bg-orange-50 dark:hover:bg-slate-800 transition-colors focus:outline-none focus:ring-2 focus:ring-brand-500"
          aria-label="Toggle dark mode"
          title={`Switch to ${theme === 'dark' ? 'light' : 'dark'} mode`}
        >
          {theme === 'dark' ? <Sun className="w-5 h-5 text-amber-400" /> : <Moon className="w-5 h-5 text-slate-600" />}
        </button>

        {/* Notification Bell */}
        <NotificationBell />

        {/* User Profile Menu */}
        <div className="relative ml-1" ref={profileRef}>
          <button
            onClick={() => setIsProfileOpen(!isProfileOpen)}
            className="flex items-center gap-2.5 p-1 rounded-full hover:bg-orange-50 dark:hover:bg-slate-800 transition-colors focus:outline-none focus:ring-2 focus:ring-brand-500"
            aria-label="User menu"
          >
            <Avatar src={user?.image} name={fullName} size="sm" />
            <span className="hidden md:inline-block text-xs font-semibold text-slate-700 dark:text-slate-200">
              {fullName}
            </span>
          </button>

          {isProfileOpen && (
            <div className="absolute right-0 mt-3 w-56 bg-white dark:bg-slate-900 border border-orange-100 dark:border-slate-800 rounded-2xl shadow-2xl z-50 overflow-hidden animate-slide-down">
              <div className="px-4 py-3 border-b border-orange-100 dark:border-slate-800 bg-orange-50/50 dark:bg-slate-950/40">
                <p className="text-xs font-bold text-slate-900 dark:text-slate-100">{fullName}</p>
                <p className="text-[11px] text-slate-500 dark:text-slate-400 truncate">{user?.email || 'emily.smith@grubpac.com'}</p>
              </div>

              <div className="p-1.5">
                <div className="px-3 py-2 text-xs text-slate-600 dark:text-slate-400 flex items-center gap-2">
                  <UserIcon className="w-4 h-4 text-brand-500" />
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

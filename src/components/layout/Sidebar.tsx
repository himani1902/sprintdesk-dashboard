import React from 'react';
import { NavLink } from 'react-router-dom';
import { LayoutDashboard, Kanban, BarChart3 } from 'lucide-react';
import { clsx } from 'clsx';
import { useAuthStore } from '../../store/auth.store';
import { Avatar } from '../ui/Avatar';

export const Sidebar: React.FC = () => {
  const { user } = useAuthStore();
  const fullName = user ? `${user.firstName || ''} ${user.lastName || ''}`.trim() || user.username : 'Emily Johnson';
  const userAvatar =
    user?.image?.includes('dummyjson.com/icon') || !user?.image
      ? 'https://i.pravatar.cc/150?img=47'
      : user.image;

  const navItems = [
    {
      label: 'Dashboard',
      path: '/dashboard',
      icon: <LayoutDashboard className="w-5 h-5" />,
    },
    {
      label: 'Sprint Board',
      path: '/board',
      icon: <Kanban className="w-5 h-5" />,
    },
    {
      label: 'Analytics',
      path: '/analytics',
      icon: <BarChart3 className="w-5 h-5" />,
    },
  ];

  return (
    <aside className="w-64 shrink-0 bg-white dark:bg-slate-900 border-r border-orange-100 dark:border-slate-800 p-4 flex flex-col justify-between hidden md:flex transition-colors h-full overflow-y-auto select-none">
      <div className="flex flex-col gap-6">
        <div className="px-3 py-1">
          <span className="text-[11px] font-black uppercase tracking-wider text-brand-700 dark:text-brand-400">
            Workspace Navigation
          </span>
        </div>

        <nav className="flex flex-col gap-1.5" aria-label="Main Navigation">
          {navItems.map((item) => (
            <NavLink
              key={item.path}
              to={item.path}
              className={({ isActive }) =>
                clsx(
                  'flex items-center gap-3 px-3.5 py-2.5 rounded-xl text-sm font-semibold transition-all duration-200 select-none',
                  isActive
                    ? 'bg-brand-500 text-white shadow-md shadow-brand-500/25 font-bold'
                    : 'text-slate-700 dark:text-slate-300 hover:bg-orange-100/60 dark:hover:bg-slate-800/80 hover:text-brand-700 dark:hover:text-brand-300'
                )
              }
            >
              {item.icon}
              <span>{item.label}</span>
            </NavLink>
          ))}
        </nav>
      </div>

      {/* Bottom User Profile Badge with Photo */}
      <div className="p-3 rounded-2xl bg-orange-100/60 dark:bg-slate-950/80 border border-orange-200 dark:border-slate-800 flex items-center gap-3 shadow-2xs">
        <Avatar src={userAvatar} name={fullName} size="sm" />
        <div className="flex flex-col min-w-0">
          <span className="text-xs font-bold text-slate-900 dark:text-slate-100 truncate">{fullName}</span>
          <span className="text-[10px] font-semibold text-slate-600 dark:text-slate-400 truncate">Lead Frontend Engineer</span>
        </div>
      </div>
    </aside>
  );
};

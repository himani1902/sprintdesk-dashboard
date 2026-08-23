import React from 'react';
import { Outlet, NavLink } from 'react-router-dom';
import { LayoutDashboard, Kanban, BarChart3 } from 'lucide-react';
import { Header } from './Header';
import { Sidebar } from './Sidebar';
import { ToastContainer } from '../ui/Toast';
import { CreateTaskModal } from '../board/CreateTaskModal';
import { TaskDetailDrawer } from '../board/TaskDetailDrawer';
import { clsx } from 'clsx';

export const AppLayout: React.FC = () => {
  const mobileNavItems = [
    { label: 'Dashboard', path: '/dashboard', icon: <LayoutDashboard className="w-5 h-5" /> },
    { label: 'Board', path: '/board', icon: <Kanban className="w-5 h-5" /> },
    { label: 'Analytics', path: '/analytics', icon: <BarChart3 className="w-5 h-5" /> },
  ];

  return (
    <div className="h-screen flex flex-col bg-slate-50 dark:bg-slate-950 text-slate-900 dark:text-slate-100 transition-colors overflow-hidden">
      <Header />

      <div className="flex-1 flex overflow-hidden">
        <Sidebar />

        <main className="flex-1 overflow-y-auto p-4 sm:p-6 pb-20 md:pb-6">
          <div className="max-w-7xl mx-auto w-full">
            <Outlet />
          </div>
        </main>
      </div>

      {/* Global Toast Container */}
      <ToastContainer />

      {/* Global Create Task Modal */}
      <CreateTaskModal />

      {/* Global Task Detail Drawer */}
      <TaskDetailDrawer />

      {/* Mobile Bottom Navigation Bar */}
      <nav className="md:hidden fixed bottom-0 left-0 right-0 z-40 bg-white/95 dark:bg-slate-900/95 backdrop-blur-md border-t border-slate-200 dark:border-slate-800 px-6 py-2 flex items-center justify-around">
        {mobileNavItems.map((item) => (
          <NavLink
            key={item.path}
            to={item.path}
            className={({ isActive }) =>
              clsx(
                'flex flex-col items-center gap-1 text-[11px] font-medium transition-colors py-1 px-3 rounded-xl',
                isActive
                  ? 'text-brand-600 dark:text-brand-400 font-semibold'
                  : 'text-slate-500 dark:text-slate-400 hover:text-slate-900 dark:hover:text-slate-200'
              )
            }
          >
            {item.icon}
            <span>{item.label}</span>
          </NavLink>
        ))}
      </nav>
    </div>
  );
};

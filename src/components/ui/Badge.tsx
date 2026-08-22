import React from 'react';
import { clsx } from 'clsx';
import { TaskPriority, TaskStatus } from '../../types/board';

export interface BadgeProps {
  children?: React.ReactNode;
  variant?: 'priority' | 'status' | 'outline' | 'ghost';
  priority?: TaskPriority;
  status?: TaskStatus;
  size?: 'sm' | 'md';
  className?: string;
}

export const Badge: React.FC<BadgeProps> = ({
  children,
  priority,
  status,
  size = 'sm',
  className,
}) => {
  const priorityStyles: Record<TaskPriority, string> = {
    low: 'bg-slate-100 text-slate-800 dark:bg-slate-800 dark:text-slate-200 border-slate-300 dark:border-slate-700 font-semibold',
    medium: 'bg-orange-100 text-brand-900 dark:bg-orange-950/80 dark:text-orange-200 border-orange-300 dark:border-orange-700 font-bold',
    high: 'bg-amber-100 text-amber-900 dark:bg-amber-950/80 dark:text-amber-200 border-amber-300 dark:border-amber-700 font-bold',
    urgent: 'bg-red-100 text-red-900 dark:bg-red-950/80 dark:text-red-200 border-red-300 dark:border-red-700 font-extrabold',
  };

  const statusStyles: Record<TaskStatus, string> = {
    backlog: 'bg-slate-100 text-slate-800 dark:bg-slate-800 dark:text-slate-200 border-slate-300 dark:border-slate-700 font-semibold',
    in_progress: 'bg-orange-100 text-brand-900 dark:bg-orange-950/80 dark:text-orange-200 border-orange-300 dark:border-orange-700 font-bold',
    review: 'bg-amber-100 text-amber-900 dark:bg-amber-950/80 dark:text-amber-200 border-amber-300 dark:border-amber-700 font-bold',
    done: 'bg-emerald-100 text-emerald-900 dark:bg-emerald-950/80 dark:text-emerald-200 border-emerald-300 dark:border-emerald-700 font-bold',
  };

  const statusLabels: Record<TaskStatus, string> = {
    backlog: 'Backlog',
    in_progress: 'In Progress',
    review: 'Review',
    done: 'Done',
  };

  let style = 'bg-orange-100 text-brand-900 border-orange-300 dark:bg-slate-800 dark:text-slate-100 dark:border-slate-700 font-semibold';

  if (priority && priorityStyles[priority]) {
    style = priorityStyles[priority];
  } else if (status && statusStyles[status]) {
    style = statusStyles[status];
  }

  const sizes = {
    sm: 'text-[11px] px-2 py-0.5 rounded-md',
    md: 'text-xs px-2.5 py-1 rounded-lg',
  };

  return (
    <span
      className={clsx(
        'inline-flex items-center gap-1 font-semibold border uppercase tracking-wider select-none shrink-0 shadow-2xs',
        sizes[size],
        style,
        className
      )}
    >
      {priority ? priority : status ? statusLabels[status] : children}
    </span>
  );
};

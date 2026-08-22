import React from 'react';
import { clsx } from 'clsx';

export interface SkeletonProps {
  className?: string;
  variant?: 'text' | 'circular' | 'rectangular' | 'card';
  width?: string | number;
  height?: string | number;
}

export const Skeleton: React.FC<SkeletonProps> = ({
  className,
  variant = 'rectangular',
  width,
  height,
}) => {
  const baseClasses = 'animate-pulse bg-slate-200 dark:bg-slate-800 rounded-md';

  const variants = {
    text: 'h-4 w-3/4 rounded',
    circular: 'rounded-full',
    rectangular: 'rounded-lg',
    card: 'h-32 w-full rounded-xl',
  };

  return (
    <div
      className={clsx(baseClasses, variants[variant], className)}
      style={{
        width: typeof width === 'number' ? `${width}px` : width,
        height: typeof height === 'number' ? `${height}px` : height,
      }}
    />
  );
};

export const KanbanBoardSkeleton: React.FC = () => {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-5 w-full">
      {[1, 2, 3, 4].map((col) => (
        <div key={col} className="flex flex-col gap-4 p-4 bg-slate-100/60 dark:bg-slate-900/40 border border-slate-200/60 dark:border-slate-800/60 rounded-2xl">
          <div className="flex justify-between items-center pb-2">
            <Skeleton variant="text" className="w-28 h-5" />
            <Skeleton variant="circular" className="w-6 h-6" />
          </div>
          {[1, 2, 3].map((card) => (
            <Skeleton key={card} variant="card" className="h-28" />
          ))}
        </div>
      ))}
    </div>
  );
};

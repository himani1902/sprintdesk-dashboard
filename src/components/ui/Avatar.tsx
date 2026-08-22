import React, { useState } from 'react';
import { clsx } from 'clsx';
import { UserAssignee } from '../../types/board';

export interface AvatarProps {
  src?: string;
  name?: string;
  size?: 'xs' | 'sm' | 'md' | 'lg';
  className?: string;
}

export const Avatar: React.FC<AvatarProps> = ({ src, name = 'User', size = 'md', className }) => {
  const [imageError, setImageError] = useState(false);

  const getInitials = (n: string) => {
    const parts = n.trim().split(/\s+/);
    if (parts.length >= 2) return `${parts[0][0]}${parts[1][0]}`.toUpperCase();
    return n.substring(0, 2).toUpperCase();
  };

  const sizes = {
    xs: 'w-6 h-6 text-[10px]',
    sm: 'w-8 h-8 text-xs',
    md: 'w-10 h-10 text-sm',
    lg: 'w-12 h-12 text-base',
  };

  const hasImage = Boolean(src && !imageError);

  return (
    <div
      className={clsx(
        'relative shrink-0 rounded-full overflow-hidden flex items-center justify-center bg-brand-100 dark:bg-brand-950 text-brand-700 dark:text-brand-300 font-bold ring-2 ring-white dark:ring-slate-900 shadow-sm aspect-square select-none',
        sizes[size],
        className
      )}
      title={name}
    >
      {hasImage ? (
        <img
          src={src}
          alt={name}
          className="absolute inset-0 w-full h-full object-cover object-center rounded-full"
          onError={() => setImageError(true)}
          loading="lazy"
        />
      ) : (
        <span className="leading-none select-none tracking-tight">{getInitials(name)}</span>
      )}
    </div>
  );
};

export interface AvatarGroupProps {
  users: UserAssignee[];
  max?: number;
  size?: 'xs' | 'sm' | 'md';
}

export const AvatarGroup: React.FC<AvatarGroupProps> = ({ users, max = 4, size = 'sm' }) => {
  const visibleUsers = users.slice(0, max);
  const remaining = users.length - max;

  return (
    <div className="flex items-center -space-x-2 overflow-hidden">
      {visibleUsers.map((user) => (
        <Avatar key={user.id} src={user.avatar} name={user.name} size={size} />
      ))}
      {remaining > 0 && (
        <div
          className={clsx(
            'relative shrink-0 flex items-center justify-center rounded-full bg-slate-200 dark:bg-slate-800 text-slate-800 dark:text-slate-200 font-bold ring-2 ring-white dark:ring-slate-900 aspect-square select-none',
            size === 'xs' ? 'w-6 h-6 text-[10px]' : size === 'sm' ? 'w-8 h-8 text-xs' : 'w-10 h-10 text-sm'
          )}
        >
          +{remaining}
        </div>
      )}
    </div>
  );
};

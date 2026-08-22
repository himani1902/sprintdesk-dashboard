import React, { ButtonHTMLAttributes, forwardRef } from 'react';
import { Loader2 } from 'lucide-react';
import { clsx } from 'clsx';
import { twMerge } from 'tailwind-merge';

export interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary' | 'outline' | 'danger' | 'ghost';
  size?: 'sm' | 'md' | 'lg';
  isLoading?: boolean;
  leftIcon?: React.ReactNode;
  rightIcon?: React.ReactNode;
}

export const Button = forwardRef<HTMLButtonElement, ButtonProps>(
  (
    {
      children,
      className,
      variant = 'primary',
      size = 'md',
      isLoading = false,
      disabled,
      leftIcon,
      rightIcon,
      type = 'button',
      ...props
    },
    ref
  ) => {
    const baseStyles = 'inline-flex items-center justify-center font-medium transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed rounded-xl shadow-sm active:scale-[0.98] select-none';

    const variants = {
      primary: 'bg-brand-500 text-white hover:bg-brand-600 focus:ring-brand-500 border border-brand-600/10 shadow-brand-500/20',
      secondary: 'bg-orange-100/80 text-brand-800 hover:bg-orange-200/80 focus:ring-brand-500 border border-orange-200/60 dark:bg-slate-800 dark:hover:bg-slate-700 dark:text-slate-100',
      outline: 'bg-white text-slate-700 dark:text-slate-200 hover:bg-orange-50/60 dark:hover:bg-slate-800/80 border border-orange-200/80 dark:border-slate-700 focus:ring-brand-500',
      danger: 'bg-red-600 text-white hover:bg-red-500 focus:ring-red-500 border border-red-500/20 shadow-red-500/10',
      ghost: 'bg-transparent text-slate-600 dark:text-slate-300 hover:bg-orange-50/80 dark:hover:bg-slate-800/60 hover:text-brand-700 dark:hover:text-brand-400 shadow-none border-transparent focus:ring-brand-500',
    };

    const sizes = {
      sm: 'text-xs px-3.5 py-1.5 gap-1.5 min-h-[34px]',
      md: 'text-sm px-4 py-2 gap-2 min-h-[40px]',
      lg: 'text-base px-5 py-2.5 gap-2.5 min-h-[48px]',
    };

    return (
      <button
        ref={ref}
        type={type}
        disabled={disabled || isLoading}
        className={twMerge(clsx(baseStyles, variants[variant], sizes[size], className))}
        {...props}
      >
        {isLoading ? (
          <Loader2 className="w-4 h-4 animate-spin text-current shrink-0" aria-label="Loading" />
        ) : (
          leftIcon && <span className="shrink-0">{leftIcon}</span>
        )}
        <span>{children}</span>
        {!isLoading && rightIcon && <span className="shrink-0">{rightIcon}</span>}
      </button>
    );
  }
);

Button.displayName = 'Button';

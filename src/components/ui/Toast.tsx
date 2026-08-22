import React from 'react';
import { CheckCircle2, AlertCircle, AlertTriangle, Info, X } from 'lucide-react';
import { useToastStore, ToastMessage } from '../../hooks/useToast';
import { Button } from './Button';

export const ToastContainer: React.FC = () => {
  const { toasts, removeToast } = useToastStore();

  if (toasts.length === 0) return null;

  return (
    <div className="fixed bottom-5 right-5 z-50 flex flex-col gap-3 max-w-sm w-full pointer-events-none px-4 sm:px-0">
      {toasts.map((toast) => (
        <ToastItem key={toast.id} toast={toast} onClose={() => removeToast(toast.id)} />
      ))}
    </div>
  );
};

interface ToastItemProps {
  toast: ToastMessage;
  onClose: () => void;
}

const ToastItem: React.FC<ToastItemProps> = ({ toast, onClose }) => {
  const icons = {
    success: <CheckCircle2 className="w-5 h-5 text-emerald-500 shrink-0" />,
    error: <AlertCircle className="w-5 h-5 text-red-500 shrink-0" />,
    warning: <AlertTriangle className="w-5 h-5 text-amber-500 shrink-0" />,
    info: <Info className="w-5 h-5 text-brand-500 shrink-0" />,
  };

  const borders = {
    success: 'border-emerald-500/30 dark:border-emerald-500/20',
    error: 'border-red-500/30 dark:border-red-500/20',
    warning: 'border-amber-500/30 dark:border-amber-500/20',
    info: 'border-brand-500/30 dark:border-brand-500/20',
  };

  return (
    <div
      className={`pointer-events-auto flex items-start gap-3 p-4 bg-white dark:bg-slate-900 border ${borders[toast.type]} rounded-xl shadow-xl animate-slide-up transition-all`}
      role="alert"
    >
      {icons[toast.type]}
      <div className="flex-1 min-w-0">
        <h4 className="text-sm font-semibold text-slate-900 dark:text-slate-100">{toast.title}</h4>
        {toast.description && (
          <p className="mt-0.5 text-xs text-slate-500 dark:text-slate-400">{toast.description}</p>
        )}
        {toast.actionLabel && toast.onAction && (
          <div className="mt-2">
            <Button
              size="sm"
              variant="outline"
              onClick={() => {
                toast.onAction?.();
                onClose();
              }}
              className="text-xs py-1 px-2.5 h-auto border-brand-500/40 text-brand-600 dark:text-brand-400 hover:bg-brand-50 dark:hover:bg-brand-950/50"
            >
              {toast.actionLabel}
            </Button>
          </div>
        )}
      </div>
      <button
        onClick={onClose}
        className="p-1 text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 transition-colors"
        aria-label="Dismiss toast"
      >
        <X className="w-4 h-4" />
      </button>
    </div>
  );
};

import React from 'react';
import { Loader2, Kanban } from 'lucide-react';

export const PageLoader: React.FC = () => {
  return (
    <div className="fixed inset-0 z-50 flex flex-col items-center justify-center bg-slate-950 text-white">
      <div className="flex flex-col items-center gap-4 animate-pulse">
        <div className="w-14 h-14 rounded-2xl bg-brand-600 flex items-center justify-center shadow-xl shadow-brand-500/30">
          <Kanban className="w-8 h-8 text-white" />
        </div>
        <div className="flex flex-col items-center gap-1">
          <h2 className="text-xl font-bold tracking-tight">SprintDesk</h2>
          <p className="text-xs text-slate-400">Validating workspace session...</p>
        </div>
        <Loader2 className="w-6 h-6 animate-spin text-brand-500 mt-2" />
      </div>
    </div>
  );
};

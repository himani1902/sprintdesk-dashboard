import React from 'react';
import { useBoardTasks } from '../hooks/useBoardTasks';
import { useBoardStore } from '../store/board.store';
import { KanbanBoard } from '../components/board/KanbanBoard';
import { BoardFilters } from '../components/board/BoardFilters';
import { Button } from '../components/ui/Button';
import { Plus, RotateCcw } from 'lucide-react';

import { useToast } from '../hooks/useToast';

export const BoardPage: React.FC = () => {
  useBoardTasks();
  const { tasks, setCreateModalOpen, undoStack, undoLastMove } = useBoardStore();
  const { success } = useToast();

  const totalTasks = tasks.length;
  const backlogCount = tasks.filter((t) => t.status === 'backlog').length;
  const inProgressCount = tasks.filter((t) => t.status === 'in_progress').length;
  const reviewCount = tasks.filter((t) => t.status === 'review').length;
  const doneCount = tasks.filter((t) => t.status === 'done').length;

  const handleTopUndo = () => {
    const undone = undoLastMove();
    if (undone) {
      success('Move Undone', 'Task restored to its previous position.');
    }
  };

  return (
    <div className="flex flex-col gap-6 animate-fade-in">
      {/* Header Banner */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 sm:gap-4">
        <div>
          <div className="flex items-center gap-2 sm:gap-2.5 flex-wrap">
            <h1 className="text-xl sm:text-3xl font-black tracking-tight text-slate-900 dark:text-slate-100">
              Kanban Sprint Board
            </h1>
            <span className="text-xs font-bold px-2.5 py-0.5 rounded-full bg-brand-100 dark:bg-brand-950 text-brand-800 dark:text-brand-300 border border-brand-200 dark:border-brand-900/60 shrink-0">
              Sprint 3
            </span>
          </div>
          <p className="text-xs sm:text-sm font-medium text-slate-600 dark:text-slate-400 mt-1">
            Drag tasks between workflow columns to update status • Backlog ({backlogCount}), In Progress ({inProgressCount}), Review ({reviewCount}), Done ({doneCount})
          </p>
        </div>

        <div className="flex items-center gap-2.5 sm:gap-3 shrink-0">
          {undoStack.length > 0 && (
            <Button
              size="sm"
              variant="outline"
              onClick={handleTopUndo}
              leftIcon={<RotateCcw className="w-3.5 h-3.5" />}
              className="text-xs text-slate-700 dark:text-slate-200 border-slate-300 dark:border-slate-700"
            >
              Undo ({undoStack.length})
            </Button>
          )}

          <Button
            size="sm"
            onClick={() => setCreateModalOpen(true)}
            leftIcon={<Plus className="w-4 h-4" />}
          >
            Add Task
          </Button>
        </div>
      </div>

      {/* Filter Controls */}
      <BoardFilters />

      {/* Kanban Board Container */}
      <KanbanBoard />
    </div>
  );
};

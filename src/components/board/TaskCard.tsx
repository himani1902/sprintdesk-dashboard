import React from 'react';
import { useSortable } from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';
import { Calendar, MessageSquare, Trash2, GripVertical, ArrowUpRight } from 'lucide-react';
import { SprintTask } from '../../types/board';
import { Badge } from '../ui/Badge';
import { Avatar } from '../ui/Avatar';
import { formatDate } from '../../utils/date';

export interface TaskCardProps {
  task: SprintTask;
  onSelect: (taskId: string) => void;
  onDelete: (taskId: string) => void;
  isOverlay?: boolean;
}

export const TaskCard: React.FC<TaskCardProps> = ({ task, onSelect, onDelete, isOverlay = false }) => {
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging,
  } = useSortable({
    id: task.id,
    data: { task },
    disabled: isOverlay,
  });

  const style = {
    transform: CSS.Translate.toString(transform),
    transition,
  };

  const isOverdue = task.dueDate && new Date(task.dueDate) < new Date() && task.status !== 'done';

  return (
    <div
      ref={setNodeRef}
      style={style}
      {...attributes}
      {...listeners}
      onClick={() => onSelect(task.id)}
      className={`group relative w-full bg-white dark:bg-slate-900 border border-orange-100 dark:border-slate-800 rounded-xl p-4 shadow-xs hover:shadow-md hover:border-orange-300 dark:hover:border-slate-700 transition-all duration-200 flex flex-col justify-between select-none cursor-grab active:cursor-grabbing touch-none ${
        isDragging ? 'opacity-30 border-dashed border-brand-500' : ''
      } ${isOverlay ? 'shadow-2xl border-brand-500 ring-2 ring-brand-500/20 rotate-1 cursor-grabbing z-50' : ''}`}
    >
      <div>
        {/* Top Header: Priority Badge & Drag Handle & Delete */}
        <div className="flex items-center justify-between gap-2 mb-2.5">
          <Badge priority={task.priority} size="sm" />
          <div className="flex items-center gap-1" onClick={(e) => e.stopPropagation()} onPointerDown={(e) => e.stopPropagation()}>
            <span
              className="p-1 text-slate-400 hover:text-brand-600 dark:hover:text-slate-200 rounded focus:outline-none transition-colors"
              aria-label={`Drag task ${task.id}`}
            >
              <GripVertical className="w-4 h-4" />
            </span>
            {!isOverlay && (
              <button
                type="button"
                onClick={(e) => {
                  e.stopPropagation();
                  onDelete(task.id);
                }}
                onPointerDown={(e) => e.stopPropagation()}
                className="p-1 text-slate-400 hover:text-red-600 dark:hover:text-red-400 rounded focus:outline-none focus:ring-2 focus:ring-red-500 transition-colors cursor-pointer"
                aria-label={`Delete task ${task.id}`}
              >
                <Trash2 className="w-3.5 h-3.5" />
              </button>
            )}
          </div>
        </div>

        {/* Task Title */}
        <h4
          className="text-sm font-bold text-slate-900 dark:text-slate-100 group-hover:text-brand-600 dark:group-hover:text-brand-400 transition-colors line-clamp-2 leading-snug mb-1.5 inline-flex items-center gap-1.5 flex-wrap"
        >
          <span>{task.title}</span>
          <ArrowUpRight className="w-3.5 h-3.5 opacity-0 group-hover:opacity-100 group-hover:translate-x-0.5 group-hover:-translate-y-0.5 text-brand-500 shrink-0 transition-all" />
        </h4>

        {/* Task Description Snippet */}
        {task.description && (
          <p className="text-xs text-slate-600 dark:text-slate-300 line-clamp-2 mb-3 font-normal leading-relaxed">
            {task.description}
          </p>
        )}
      </div>

      {/* Bottom Footer: Assignee Avatar, Points, Due Date & Comments */}
      <div className="pt-2.5 mt-2 border-t border-orange-100 dark:border-slate-800 flex items-center justify-between text-xs text-slate-600 dark:text-slate-400">
        <div className="flex items-center gap-2">
          {task.assignee && (
            <Avatar src={task.assignee.avatar} name={task.assignee.name} size="xs" />
          )}
          {task.estimatePoints && (
            <span
              className="font-mono text-[11px] font-bold px-1.5 py-0.5 rounded bg-orange-100 text-brand-900 dark:bg-slate-800 dark:text-slate-200 border border-orange-200 dark:border-slate-700 hover:border-brand-400 transition-colors"
              title="Estimate Story Points"
            >
              {task.estimatePoints} pts
            </span>
          )}
        </div>

        <div className="flex items-center gap-2.5">
          {task.comments && task.comments.length > 0 && (
            <div
              className="flex items-center gap-1 text-slate-500 dark:text-slate-400 hover:text-brand-600 dark:hover:text-brand-400 font-medium transition-colors cursor-pointer"
              title={`${task.comments.length} comments - Click to view`}
            >
              <MessageSquare className="w-3.5 h-3.5" />
              <span className="text-[11px] font-semibold">{task.comments.length}</span>
            </div>
          )}

          {task.dueDate && (
            <div
              className={`flex items-center gap-1 text-[11px] font-semibold ${
                isOverdue ? 'text-red-700 dark:text-red-400 bg-red-50 dark:bg-red-950/60 px-1 py-0.5 rounded' : 'text-slate-500 dark:text-slate-400'
              }`}
              title={isOverdue ? 'Overdue task' : `Due on ${formatDate(task.dueDate)}`}
            >
              <Calendar className="w-3.5 h-3.5" />
              <span>{formatDate(task.dueDate)}</span>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

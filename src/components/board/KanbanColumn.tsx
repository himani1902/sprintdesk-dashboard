import React from 'react';
import { useDroppable } from '@dnd-kit/core';
import { SortableContext, verticalListSortingStrategy } from '@dnd-kit/sortable';
import { Plus, Inbox } from 'lucide-react';
import { SprintTask, TaskStatus } from '../../types/board';
import { TaskCard } from './TaskCard';
import { Button } from '../ui/Button';

export interface KanbanColumnProps {
  id: TaskStatus;
  title: string;
  tasks: SprintTask[];
  onSelectTask: (taskId: string) => void;
  onDeleteTask: (taskId: string) => void;
  onAddTask: () => void;
  accentColor: string;
}

export const KanbanColumn: React.FC<KanbanColumnProps> = ({
  id,
  title,
  tasks,
  onSelectTask,
  onDeleteTask,
  onAddTask,
  accentColor,
}) => {
  const { setNodeRef, isOver } = useDroppable({
    id,
    data: { type: 'Column', status: id },
  });

  const taskIds = tasks.map((t) => t.id);

  return (
    <div
      ref={setNodeRef}
      className={`flex flex-col h-full min-h-[580px] min-w-[270px] w-full bg-orange-50/50 dark:bg-slate-900/60 border border-orange-100 dark:border-slate-800 rounded-2xl overflow-hidden transition-all ${
        isOver ? 'ring-2 ring-brand-500 bg-orange-100/60 dark:bg-brand-950/30 shadow-md' : 'shadow-2xs'
      }`}
    >
      {/* Column Header */}
      <div className="p-4 border-b border-orange-100 dark:border-slate-800 flex items-center justify-between bg-white/80 dark:bg-slate-900/80 backdrop-blur-xs">
        <div className="flex items-center gap-2.5">
          <span className={`w-3 h-3 rounded-full ${accentColor} shadow-2xs`} />
          <h3 className="text-sm font-bold text-slate-900 dark:text-slate-100">{title}</h3>
          <span className="text-xs font-extrabold px-2 py-0.5 rounded-full bg-orange-100 text-brand-900 dark:bg-slate-800 dark:text-slate-200 border border-orange-200 dark:border-slate-700">
            {tasks.length}
          </span>
        </div>

        <Button
          size="sm"
          variant="ghost"
          onClick={onAddTask}
          className="p-1.5 min-h-[30px] text-slate-500 hover:text-brand-600 dark:text-slate-400 dark:hover:text-slate-200"
          aria-label={`Add task to ${title}`}
          title="Add task"
        >
          <Plus className="w-4 h-4" />
        </Button>
      </div>

      {/* Task List Container */}
      <div className="flex-1 p-3 overflow-y-auto flex flex-col gap-3 min-h-[320px]">
        <SortableContext items={taskIds} strategy={verticalListSortingStrategy}>
          {tasks.map((task) => (
            <TaskCard
              key={task.id}
              task={task}
              onSelect={onSelectTask}
              onDelete={onDeleteTask}
            />
          ))}
        </SortableContext>

        {tasks.length === 0 && (
          <div className="flex-1 flex flex-col items-center justify-center p-6 text-center border-2 border-dashed border-orange-200 dark:border-slate-800 rounded-xl text-slate-500 dark:text-slate-400 bg-white/40 dark:bg-slate-900/20">
            <Inbox className="w-8 h-8 stroke-1 mb-2 text-brand-500" />
            <p className="text-xs font-semibold text-slate-700 dark:text-slate-300">No tasks in {title}</p>
            <p className="text-[11px] text-slate-500 dark:text-slate-400 mt-0.5">Drag tasks here or create a new one</p>
            <button
              type="button"
              onClick={onAddTask}
              className="mt-3 text-xs font-bold text-brand-600 dark:text-brand-400 hover:underline cursor-pointer"
            >
              + Create task
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Kanban, CheckCircle2, Clock, Zap, Plus, ArrowRight } from 'lucide-react';
import { useBoardStore } from '../store/board.store';
import { useBoardTasks } from '../hooks/useBoardTasks';
import { Button } from '../components/ui/Button';
import { Badge } from '../components/ui/Badge';
import { Avatar } from '../components/ui/Avatar';
import { DataTable, Column } from '../components/ui/DataTable';
import { SprintTask } from '../types/board';

export const DashboardPage: React.FC = () => {
  useBoardTasks();
  const navigate = useNavigate();
  const { tasks, setCreateModalOpen } = useBoardStore();

  const totalTasks = tasks.length;
  const completedTasks = tasks.filter((t) => t.status === 'done').length;
  const inProgressTasks = tasks.filter((t) => t.status === 'in_progress').length;
  const overdueTasks = tasks.filter(
    (t) => t.dueDate && new Date(t.dueDate) < new Date() && t.status !== 'done'
  ).length;

  const totalStoryPoints = tasks.reduce((sum, t) => sum + (t.estimatePoints || 0), 0);
  const completedStoryPoints = tasks
    .filter((t) => t.status === 'done')
    .reduce((sum, t) => sum + (t.estimatePoints || 0), 0);

  const completionPercentage = totalTasks > 0 ? Math.round((completedTasks / totalTasks) * 100) : 0;

  const columns: Column<SprintTask>[] = [
    {
      key: 'id',
      header: 'Task ID',
      sortable: true,
      render: (task) => (
        <span className="font-mono text-xs font-bold text-brand-700 dark:text-brand-400">
          {task.id}
        </span>
      ),
    },
    {
      key: 'title',
      header: 'Title',
      sortable: true,
      render: (task) => (
        <div className="flex flex-col">
          <span className="font-bold text-slate-900 dark:text-slate-100">{task.title}</span>
          <span className="text-xs text-slate-500 dark:text-slate-400 line-clamp-1">{task.description}</span>
        </div>
      ),
    },
    {
      key: 'status',
      header: 'Status',
      sortable: true,
      render: (task) => <Badge status={task.status} />,
    },
    {
      key: 'priority',
      header: 'Priority',
      sortable: true,
      render: (task) => <Badge priority={task.priority} />,
    },
    {
      key: 'assignee',
      header: 'Assignee',
      render: (task) =>
        task.assignee ? (
          <div className="flex items-center gap-2">
            <Avatar src={task.assignee.avatar} name={task.assignee.name} size="xs" />
            <span className="text-xs font-semibold text-slate-800 dark:text-slate-200">{task.assignee.name}</span>
          </div>
        ) : (
          <span className="text-xs text-slate-400 font-medium">Unassigned</span>
        ),
    },
    {
      key: 'estimatePoints',
      header: 'Points',
      sortable: true,
      render: (task) => (
        <span className="font-mono text-xs font-bold px-2 py-0.5 rounded bg-orange-100 text-brand-900 dark:bg-slate-800 dark:text-slate-200 border border-orange-200 dark:border-slate-700">
          {task.estimatePoints} pts
        </span>
      ),
    },
  ];

  return (
    <div className="flex flex-col gap-6 animate-fade-in">
      {/* Header Banner */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 p-5 sm:p-7 bg-gradient-to-r from-orange-600 via-brand-500 to-amber-500 rounded-2xl sm:rounded-3xl text-white shadow-xl shadow-brand-500/20">
        <div>
          <span className="text-[11px] sm:text-xs font-black uppercase tracking-wider text-orange-100 drop-shadow-xs">
            Sprint Management Overview
          </span>
          <h1 className="text-xl sm:text-3xl font-black tracking-tight mt-1 text-white">
            Sprint 3 Dashboard
          </h1>
          <p className="text-xs sm:text-sm text-white/95 mt-1.5 max-w-xl font-medium leading-relaxed">
            Track real-time story point completion, task movements across columns, and overall team velocity.
          </p>
        </div>

        <div className="flex flex-col xs:flex-row items-stretch xs:items-center gap-2.5 sm:gap-3 shrink-0 w-full sm:w-auto">
          <Button
            onClick={() => setCreateModalOpen(true)}
            leftIcon={<Plus className="w-4 h-4 text-brand-900" />}
            className="w-full sm:w-auto justify-center bg-white text-brand-900 hover:bg-orange-50 hover:text-brand-950 font-black shadow-md border border-white"
          >
            Create Task
          </Button>
          <Button
            onClick={() => navigate('/board')}
            rightIcon={<ArrowRight className="w-4 h-4 text-white" />}
            className="w-full sm:w-auto justify-center bg-orange-900/40 hover:bg-orange-900/60 text-white border-2 border-white font-bold backdrop-blur-xs shadow-md"
          >
            Sprint Board
          </Button>
        </div>
      </div>

      {/* Metrics Grid - Equal Sized Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-5">
        {/* Card 1: Total Tasks */}
        <div className="p-5 bg-white dark:bg-slate-900 border border-orange-100 dark:border-slate-800 rounded-2xl shadow-xs flex items-center justify-between h-full min-h-[110px] transition-all hover:shadow-md hover:border-orange-300 dark:hover:border-slate-700">
          <div>
            <span className="text-xs font-bold text-slate-600 dark:text-slate-400">Total Sprint Tasks</span>
            <h3 className="text-2xl font-black text-slate-900 dark:text-slate-100 mt-1">{totalTasks}</h3>
            <span className="text-[11px] font-medium text-slate-500 dark:text-slate-400 mt-1 block">{inProgressTasks} active in progress</span>
          </div>
          <div className="w-12 h-12 rounded-2xl bg-orange-100 dark:bg-orange-950/80 text-brand-600 dark:text-brand-400 flex items-center justify-center shrink-0 shadow-2xs">
            <Kanban className="w-6 h-6" />
          </div>
        </div>

        {/* Card 2: Completed Tasks */}
        <div className="p-5 bg-white dark:bg-slate-900 border border-orange-100 dark:border-slate-800 rounded-2xl shadow-xs flex items-center justify-between h-full min-h-[110px] transition-all hover:shadow-md hover:border-orange-300 dark:hover:border-slate-700">
          <div>
            <span className="text-xs font-bold text-slate-600 dark:text-slate-400">Completed Tasks</span>
            <h3 className="text-2xl font-black text-emerald-600 dark:text-emerald-400 mt-1">{completedTasks}</h3>
            <span className="text-[11px] font-medium text-slate-500 dark:text-slate-400 mt-1 block">{completionPercentage}% completion rate</span>
          </div>
          <div className="w-12 h-12 rounded-2xl bg-emerald-100 dark:bg-emerald-950/80 text-emerald-600 dark:text-emerald-400 flex items-center justify-center shrink-0 shadow-2xs">
            <CheckCircle2 className="w-6 h-6" />
          </div>
        </div>

        {/* Card 3: Completed Velocity */}
        <div className="p-5 bg-white dark:bg-slate-900 border border-orange-100 dark:border-slate-800 rounded-2xl shadow-xs flex items-center justify-between h-full min-h-[110px] transition-all hover:shadow-md hover:border-orange-300 dark:hover:border-slate-700">
          <div>
            <span className="text-xs font-bold text-slate-600 dark:text-slate-400">Completed Velocity</span>
            <h3 className="text-2xl font-black text-brand-600 dark:text-brand-400 mt-1">
              {completedStoryPoints} <span className="text-xs text-slate-500 dark:text-slate-400 font-semibold">/ {totalStoryPoints} pts</span>
            </h3>
            <span className="text-[11px] font-medium text-slate-500 dark:text-slate-400 mt-1 block">Story points delivered</span>
          </div>
          <div className="w-12 h-12 rounded-2xl bg-orange-100 dark:bg-orange-950/80 text-brand-600 dark:text-brand-400 flex items-center justify-center shrink-0 shadow-2xs">
            <Zap className="w-6 h-6" />
          </div>
        </div>

        {/* Card 4: Overdue Tasks */}
        <div className="p-5 bg-white dark:bg-slate-900 border border-orange-100 dark:border-slate-800 rounded-2xl shadow-xs flex items-center justify-between h-full min-h-[110px] transition-all hover:shadow-md hover:border-orange-300 dark:hover:border-slate-700">
          <div>
            <span className="text-xs font-bold text-slate-600 dark:text-slate-400">Overdue Tasks</span>
            <h3 className={`text-2xl font-black mt-1 ${overdueTasks > 0 ? 'text-red-600 dark:text-red-400' : 'text-slate-900 dark:text-slate-100'}`}>
              {overdueTasks}
            </h3>
            <span className="text-[11px] font-medium text-slate-500 dark:text-slate-400 mt-1 block">Past target due dates</span>
          </div>
          <div className="w-12 h-12 rounded-2xl bg-amber-100 dark:bg-amber-950/80 text-amber-600 dark:text-amber-400 flex items-center justify-center shrink-0 shadow-2xs">
            <Clock className="w-6 h-6" />
          </div>
        </div>
      </div>

      {/* Sprint Completion Progress Bar */}
      <div className="p-5 bg-white dark:bg-slate-900 border border-orange-100 dark:border-slate-800 rounded-2xl shadow-xs">
        <div className="flex justify-between items-center mb-2.5 text-xs">
          <span className="font-extrabold text-slate-900 dark:text-slate-100">Active Sprint Completion Progress</span>
          <span className="font-mono font-black text-brand-600 dark:text-brand-400">{completionPercentage}%</span>
        </div>
        <div className="h-3.5 w-full bg-orange-100/60 dark:bg-slate-800 rounded-full overflow-hidden">
          <div
            className="h-full bg-gradient-to-r from-brand-500 to-amber-500 transition-all duration-500 rounded-full"
            style={{ width: `${completionPercentage}%` }}
          />
        </div>
      </div>

      {/* Active Tasks Table Section */}
      <div className="flex flex-col gap-3">
        <div className="flex items-center justify-between">
          <h3 className="text-lg font-black text-slate-900 dark:text-slate-100">Sprint 3 Tasks</h3>
          <Button
            size="sm"
            variant="ghost"
            onClick={() => navigate('/board')}
            rightIcon={<ArrowRight className="w-3.5 h-3.5" />}
            className="font-bold text-brand-600 dark:text-brand-400 hover:text-brand-700"
          >
            View Full Board
          </Button>
        </div>

        <DataTable
          data={tasks}
          columns={columns}
          keyExtractor={(t) => t.id}
          pageSize={8}
        />
      </div>
    </div>
  );
};

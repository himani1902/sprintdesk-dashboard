import React, { useState, useRef } from 'react';
import {
  DndContext,
  DragOverlay,
  PointerSensor,
  KeyboardSensor,
  useSensor,
  useSensors,
  DragStartEvent,
  DragEndEvent,
  DragOverEvent,
  closestCorners,
} from '@dnd-kit/core';
import { sortableKeyboardCoordinates } from '@dnd-kit/sortable';
import { RotateCcw, AlertTriangle } from 'lucide-react';
import { useBoardStore } from '../../store/board.store';
import { useToast } from '../../hooks/useToast';
import { KanbanColumn } from './KanbanColumn';
import { TaskCard } from './TaskCard';
import { TaskDetailDrawer } from './TaskDetailDrawer';
import { Modal } from '../ui/Modal';
import { Button } from '../ui/Button';
import { ColumnDefinition, SprintTask, TaskStatus } from '../../types/board';

const COLUMNS: ColumnDefinition[] = [
  { id: 'backlog', title: 'Backlog', accentColor: 'bg-slate-400' },
  { id: 'in_progress', title: 'In Progress', accentColor: 'bg-brand-500' },
  { id: 'review', title: 'Review', accentColor: 'bg-amber-500' },
  { id: 'done', title: 'Done', accentColor: 'bg-emerald-500' },
];

export const KanbanBoard: React.FC = () => {
  const {
    tasks,
    filters,
    moveTask,
    deleteTask,
    setSelectedTaskId,
    setCreateModalOpen,
    undoLastMove,
  } = useBoardStore();

  const { toast } = useToast();

  const [activeTask, setActiveTask] = useState<SprintTask | null>(null);
  const [taskToDeleteId, setTaskToDeleteId] = useState<string | null>(null);
  const dragOriginRef = useRef<{ id: string; status: TaskStatus; index: number } | null>(null);

  // Configure DND Sensors (Mouse/Touch + Keyboard Accessibility)
  const sensors = useSensors(
    useSensor(PointerSensor, {
      activationConstraint: {
        distance: 5, // 5px movement required before drag starts to allow card click
      },
    }),
    useSensor(KeyboardSensor, {
      coordinateGetter: sortableKeyboardCoordinates,
    })
  );

  // Apply filters (Priority, Assignee, Search Query)
  const filteredTasks = tasks.filter((task) => {
    // Search query
    if (
      filters.searchQuery &&
      !task.title.toLowerCase().includes(filters.searchQuery.toLowerCase()) &&
      !task.id.toLowerCase().includes(filters.searchQuery.toLowerCase()) &&
      !task.description?.toLowerCase().includes(filters.searchQuery.toLowerCase())
    ) {
      return false;
    }

    // Priority Filter
    if (filters.priorityFilter !== 'all' && task.priority !== filters.priorityFilter) {
      return false;
    }

    // Assignee Filter
    if (filters.assigneeId !== 'all' && task.assignee?.id !== filters.assigneeId) {
      return false;
    }

    return true;
  });

  // Group tasks by column status
  const getTasksByStatus = (status: TaskStatus) => {
    return filteredTasks.filter((t) => t.status === status);
  };

  // DND Event Handlers
  const handleDragStart = (event: DragStartEvent) => {
    const { active } = event;
    const task = tasks.find((t) => t.id === active.id);
    if (task) {
      setActiveTask(task);
      const columnTasks = tasks.filter((t) => t.status === task.status);
      const idx = columnTasks.findIndex((t) => t.id === task.id);
      dragOriginRef.current = { id: task.id, status: task.status, index: idx };
    }
  };

  const handleDragOver = (event: DragOverEvent) => {
    const { active, over } = event;
    if (!over) return;

    const activeId = active.id as string;
    const overId = over.id as string;

    if (activeId === overId) return;

    const activeTaskItem = tasks.find((t) => t.id === activeId);
    if (!activeTaskItem) return;

    // Is over a column?
    const isOverColumn = COLUMNS.some((col) => col.id === overId);
    if (isOverColumn) {
      const overStatus = overId as TaskStatus;
      if (activeTaskItem.status !== overStatus) {
        moveTask(activeId, overStatus, undefined, false);
      }
      return;
    }

    // Is over another task?
    const overTaskItem = tasks.find((t) => t.id === overId);
    if (overTaskItem && activeTaskItem.status !== overTaskItem.status) {
      moveTask(activeId, overTaskItem.status, undefined, false);
    }
  };

  const handleDragEnd = (event: DragEndEvent) => {
    const { active, over } = event;
    setActiveTask(null);

    const origin = dragOriginRef.current;
    dragOriginRef.current = null;

    if (!over || !origin) return;

    const activeId = active.id as string;
    const overId = over.id as string;

    const activeTaskItem = tasks.find((t) => t.id === activeId);
    if (!activeTaskItem) return;

    const isOverColumn = COLUMNS.some((col) => col.id === overId);

    if (isOverColumn) {
      const targetStatus = overId as TaskStatus;
      moveTask(activeId, targetStatus, undefined, true, origin.status, origin.index);
      if (origin.status !== targetStatus) {
        triggerUndoToast(activeId, targetStatus);
      }
    } else {
      const overTaskItem = tasks.find((t) => t.id === overId);
      if (overTaskItem) {
        const targetStatus = overTaskItem.status;
        const columnTasks = tasks.filter((t) => t.status === targetStatus);
        const overIndex = columnTasks.findIndex((t) => t.id === overId);

        moveTask(activeId, targetStatus, overIndex, true, origin.status, origin.index);
        if (origin.status !== targetStatus || origin.index !== overIndex) {
          triggerUndoToast(activeId, targetStatus);
        }
      }
    }
  };

  const triggerUndoToast = (taskId: string, targetStatus: TaskStatus) => {
    toast({
      type: 'info',
      title: 'Task Moved',
      description: `Task ${taskId} moved to ${targetStatus.replace('_', ' ')}.`,
      actionLabel: 'Undo Drag',
      onAction: () => {
        undoLastMove();
      },
      duration: 6000,
    });
  };

  const handleDeleteConfirm = () => {
    if (taskToDeleteId) {
      deleteTask(taskToDeleteId);
      setTaskToDeleteId(null);
    }
  };

  return (
    <div className="w-full flex flex-col gap-6">
      {/* Board Column Canvas */}
      <DndContext
        sensors={sensors}
        collisionDetection={closestCorners}
        onDragStart={handleDragStart}
        onDragOver={handleDragOver}
        onDragEnd={handleDragEnd}
      >
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-5 items-start">
          {COLUMNS.map((col) => (
            <KanbanColumn
              key={col.id}
              id={col.id}
              title={col.title}
              tasks={getTasksByStatus(col.id)}
              onSelectTask={(id) => setSelectedTaskId(id)}
              onDeleteTask={(id) => setTaskToDeleteId(id)}
              onAddTask={() => setCreateModalOpen(true)}
              accentColor={col.accentColor}
            />
          ))}
        </div>

        {/* Smooth Drag Overlay Preview */}
        <DragOverlay>
          {activeTask ? (
            <TaskCard
              task={activeTask}
              onSelect={() => {}}
              onDelete={() => {}}
              isOverlay
            />
          ) : null}
        </DragOverlay>
      </DndContext>

      {/* Task Details Side Drawer */}
      <TaskDetailDrawer />

      {/* Confirm Delete Modal */}
      <Modal
        isOpen={!!taskToDeleteId}
        onClose={() => setTaskToDeleteId(null)}
        title="Delete Sprint Task?"
        description="Are you sure you want to delete this task? This action cannot be undone."
        maxWidth="sm"
        footer={
          <>
            <Button variant="outline" onClick={() => setTaskToDeleteId(null)}>
              Cancel
            </Button>
            <Button variant="danger" onClick={handleDeleteConfirm}>
              Delete Task
            </Button>
          </>
        }
      >
        <div className="flex items-center gap-3 text-red-600 dark:text-red-400 bg-red-50 dark:bg-red-950/40 p-3.5 rounded-xl border border-red-200 dark:border-red-900/40">
          <AlertTriangle className="w-5 h-5 shrink-0" />
          <span className="text-xs font-medium">Task {taskToDeleteId} will be permanently removed from board state.</span>
        </div>
      </Modal>
    </div>
  );
};

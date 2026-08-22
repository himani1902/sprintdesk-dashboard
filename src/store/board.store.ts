import { create } from 'zustand';
import { BoardState, SprintTask, TaskStatus, BoardFilterState, UndoOperation, Sprint, UserAssignee } from '../types/board';
import { storage } from '../utils/storage';

const LOCAL_STORAGE_KEY = 'sp_board_tasks_v3';

const initialFilters: BoardFilterState = {
  searchQuery: '',
  priorityFilter: 'all',
  assigneeId: 'all',
  sprintId: 'all',
};

export const useBoardStore = create<BoardState>((set, get) => ({
  tasks: storage.getItem<SprintTask[]>(LOCAL_STORAGE_KEY, []),
  sprints: [],
  users: [],
  filters: initialFilters,
  selectedTaskId: null,
  isCreateModalOpen: false,
  undoStack: [],

  setTasks: (tasks: SprintTask[]) => {
    const cached = storage.getItem<SprintTask[] | null>(LOCAL_STORAGE_KEY, null);
    if (cached && cached.length > 0) {
      set({ tasks: cached });
    } else {
      storage.setItem(LOCAL_STORAGE_KEY, tasks);
      set({ tasks });
    }
  },

  setSprints: (sprints: Sprint[]) => set({ sprints }),
  setUsers: (users: UserAssignee[]) => set({ users }),

  addTask: (newTaskData) => {
    const id = `TASK-${100 + get().tasks.length + 1}`;
    const newTask: SprintTask = {
      ...newTaskData,
      id,
      createdAt: new Date().toISOString(),
      comments: [],
    };

    const updatedTasks = [newTask, ...get().tasks];
    storage.setItem(LOCAL_STORAGE_KEY, updatedTasks);
    set({ tasks: updatedTasks, isCreateModalOpen: false });
    return newTask;
  },

  updateTask: (id: string, updates: Partial<SprintTask>) => {
    const updatedTasks = get().tasks.map((task) => {
      if (task.id !== id) return task;
      const updated = { ...task, ...updates };
      if (updates.status === 'done' && task.status !== 'done') {
        updated.completedAt = new Date().toISOString();
      } else if (updates.status && updates.status !== 'done') {
        updated.completedAt = null;
      }
      return updated;
    });

    storage.setItem(LOCAL_STORAGE_KEY, updatedTasks);
    set({ tasks: updatedTasks });
  },

  moveTask: (taskId: string, targetStatus: TaskStatus, newIndex?: number) => {
    const tasks = [...get().tasks];
    const taskIndex = tasks.findIndex((t) => t.id === taskId);
    if (taskIndex === -1) return;

    const task = tasks[taskIndex];
    const previousStatus = task.status;
    const previousIndex = tasks.filter((t) => t.status === previousStatus).findIndex((t) => t.id === taskId);

    // If same status and position didn't change, return
    if (previousStatus === targetStatus && newIndex === previousIndex) return;

    // Record operation for UNDO capability
    const undoOp: UndoOperation = {
      taskId,
      previousStatus,
      newStatus: targetStatus,
      previousIndex,
      newIndex: newIndex ?? 0,
      timestamp: Date.now(),
    };

    // Remove task from array
    tasks.splice(taskIndex, 1);

    const updatedTask: SprintTask = {
      ...task,
      status: targetStatus,
      completedAt: targetStatus === 'done' ? new Date().toISOString() : (previousStatus === 'done' ? null : task.completedAt),
    };

    // Find all tasks with target status
    const targetStatusTasks = tasks.filter((t) => t.status === targetStatus);
    
    if (newIndex !== undefined && newIndex >= 0 && newIndex < targetStatusTasks.length) {
      const targetReferenceTask = targetStatusTasks[newIndex];
      const insertAtGlobalIndex = tasks.findIndex((t) => t.id === targetReferenceTask.id);
      tasks.splice(insertAtGlobalIndex, 0, updatedTask);
    } else {
      // Append to the end of target status
      tasks.push(updatedTask);
    }

    storage.setItem(LOCAL_STORAGE_KEY, tasks);
    set({
      tasks,
      undoStack: [undoOp, ...get().undoStack.slice(0, 9)], // keep last 10 undos
    });
  },

  undoLastMove: (): boolean => {
    const stack = [...get().undoStack];
    if (stack.length === 0) return false;

    const lastOp = stack.shift()!;
    const tasks = [...get().tasks];
    const taskIndex = tasks.findIndex((t) => t.id === lastOp.taskId);
    if (taskIndex === -1) return false;

    const task = tasks.splice(taskIndex, 1)[0];
    const restoredTask: SprintTask = {
      ...task,
      status: lastOp.previousStatus,
      completedAt: lastOp.previousStatus === 'done' ? (task.completedAt || new Date().toISOString()) : null,
    };

    // Insert back to target position
    const sameStatusTasks = tasks.filter((t) => t.status === lastOp.previousStatus);
    if (lastOp.previousIndex >= 0 && lastOp.previousIndex < sameStatusTasks.length) {
      const refTask = sameStatusTasks[lastOp.previousIndex];
      const globalRefIndex = tasks.findIndex((t) => t.id === refTask.id);
      tasks.splice(globalRefIndex, 0, restoredTask);
    } else {
      tasks.push(restoredTask);
    }

    storage.setItem(LOCAL_STORAGE_KEY, tasks);
    set({ tasks, undoStack: stack });
    return true;
  },

  deleteTask: (id: string) => {
    const updatedTasks = get().tasks.filter((t) => t.id !== id);
    storage.setItem(LOCAL_STORAGE_KEY, updatedTasks);
    set({
      tasks: updatedTasks,
      selectedTaskId: get().selectedTaskId === id ? null : get().selectedTaskId,
    });
  },

  addComment: (taskId: string, content: string, authorName: string, authorAvatar: string) => {
    const commentId = `cmt-${Date.now()}`;
    const newComment = {
      id: commentId,
      author: { name: authorName, avatar: authorAvatar },
      content,
      createdAt: new Date().toISOString(),
    };

    const updatedTasks = get().tasks.map((task) => {
      if (task.id !== taskId) return task;
      return {
        ...task,
        comments: [...task.comments, newComment],
      };
    });

    storage.setItem(LOCAL_STORAGE_KEY, updatedTasks);
    set({ tasks: updatedTasks });
  },

  setFilter: (key, value) => {
    set({
      filters: { ...get().filters, [key]: value },
    });
  },

  resetFilters: () => set({ filters: initialFilters }),
  setSelectedTaskId: (selectedTaskId) => set({ selectedTaskId }),
  setCreateModalOpen: (isCreateModalOpen) => set({ isCreateModalOpen }),
}));

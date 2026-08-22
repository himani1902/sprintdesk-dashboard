export type TaskStatus = 'backlog' | 'in_progress' | 'review' | 'done';

export type TaskPriority = 'low' | 'medium' | 'high' | 'urgent';

export interface UserAssignee {
  id: string;
  name: string;
  email: string;
  avatar: string;
  role: string;
}

export interface TaskComment {
  id: string;
  author: {
    name: string;
    avatar: string;
  };
  content: string;
  createdAt: string;
}

export interface SprintTask {
  id: string;
  title: string;
  description: string;
  status: TaskStatus;
  priority: TaskPriority;
  assignee: UserAssignee;
  sprintId: string;
  estimatePoints: number;
  dueDate: string;
  createdAt: string;
  completedAt: string | null;
  tags: string[];
  comments: TaskComment[];
}

export interface Sprint {
  id: string;
  name: string;
  startDate: string;
  endDate: string;
  status: 'active' | 'completed' | 'planned';
}

export interface BoardFilterState {
  searchQuery: string;
  priorityFilter: TaskPriority | 'all';
  assigneeId: string | 'all';
  sprintId: string | 'all';
}

export interface ColumnDefinition {
  id: TaskStatus;
  title: string;
  accentColor: string;
}

export interface UndoOperation {
  taskId: string;
  previousStatus: TaskStatus;
  newStatus: TaskStatus;
  previousIndex: number;
  newIndex: number;
  timestamp: number;
}

export interface BoardState {
  tasks: SprintTask[];
  sprints: Sprint[];
  users: UserAssignee[];
  filters: BoardFilterState;
  selectedTaskId: string | null;
  isCreateModalOpen: boolean;
  undoStack: UndoOperation[];
  
  // Actions
  setTasks: (tasks: SprintTask[]) => void;
  setSprints: (sprints: Sprint[]) => void;
  setUsers: (users: UserAssignee[]) => void;
  addTask: (task: Omit<SprintTask, 'id' | 'createdAt' | 'comments'>) => SprintTask;
  updateTask: (id: string, updates: Partial<SprintTask>) => void;
  moveTask: (taskId: string, targetStatus: TaskStatus, newIndex?: number) => void;
  deleteTask: (id: string) => void;
  addComment: (taskId: string, content: string, authorName: string, authorAvatar: string) => void;
  setFilter: (key: keyof BoardFilterState, value: string) => void;
  resetFilters: () => void;
  setSelectedTaskId: (id: string | null) => void;
  setCreateModalOpen: (isOpen: boolean) => void;
  undoLastMove: () => boolean;
}

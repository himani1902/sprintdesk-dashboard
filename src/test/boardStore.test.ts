import { describe, it, expect, beforeEach } from 'vitest';
import { useBoardStore } from '../store/board.store';
import { SprintTask } from '../types/board';

const mockTask: Omit<SprintTask, 'id' | 'createdAt' | 'comments'> = {
  title: 'Test Unit Task',
  description: 'Testing Zustand board actions',
  status: 'backlog',
  priority: 'high',
  assignee: {
    id: '1',
    name: 'Emily Johnson',
    email: 'emily.johnson@example.com',
    avatar: 'https://i.pravatar.cc/150?img=47',
    role: 'Lead Frontend Engineer',
  },
  sprintId: '3',
  estimatePoints: 5,
  dueDate: '2026-08-30',
  completedAt: null,
  tags: ['Testing'],
};

describe('Zustand Board Store', () => {
  beforeEach(() => {
    localStorage.clear();
    useBoardStore.setState({
      tasks: [],
      sprints: [],
      users: [],
      selectedTaskId: null,
      undoStack: [],
    });
  });

  it('should add a new task to board state', () => {
    const store = useBoardStore.getState();
    const createdTask = store.addTask(mockTask);

    expect(createdTask.id).toBeDefined();
    expect(createdTask.title).toBe('Test Unit Task');
    expect(useBoardStore.getState().tasks).toHaveLength(1);
    expect(useBoardStore.getState().tasks[0].status).toBe('backlog');
  });

  it('should move a task across columns and record undo operation', () => {
    const store = useBoardStore.getState();
    const task = store.addTask(mockTask);

    // Move from backlog to in_progress
    store.moveTask(task.id, 'in_progress');

    const updatedTasks = useBoardStore.getState().tasks;
    expect(updatedTasks[0].status).toBe('in_progress');
    expect(useBoardStore.getState().undoStack).toHaveLength(1);
    expect(useBoardStore.getState().undoStack[0].previousStatus).toBe('backlog');
    expect(useBoardStore.getState().undoStack[0].newStatus).toBe('in_progress');
  });

  it('should undo last drag-and-drop move operation', () => {
    const store = useBoardStore.getState();
    const task = store.addTask(mockTask);

    // Move task
    store.moveTask(task.id, 'in_progress');
    expect(useBoardStore.getState().tasks[0].status).toBe('in_progress');

    // Perform undo
    const success = store.undoLastMove();
    expect(success).toBe(true);
    expect(useBoardStore.getState().tasks[0].status).toBe('backlog');
    expect(useBoardStore.getState().undoStack).toHaveLength(0);
  });

  it('should delete a task from board state', () => {
    const store = useBoardStore.getState();
    const task = store.addTask(mockTask);
    expect(useBoardStore.getState().tasks).toHaveLength(1);

    store.deleteTask(task.id);
    expect(useBoardStore.getState().tasks).toHaveLength(0);
  });

  it('should add a comment to a task', () => {
    const store = useBoardStore.getState();
    const task = store.addTask(mockTask);

    store.addComment(task.id, 'Awesome progress on this feature', 'Alex Rivera', '');

    const updatedTask = useBoardStore.getState().tasks.find((t) => t.id === task.id);
    expect(updatedTask?.comments).toHaveLength(1);
    expect(updatedTask?.comments[0].content).toBe('Awesome progress on this feature');
    expect(updatedTask?.comments[0].author.name).toBe('Alex Rivera');
  });
});

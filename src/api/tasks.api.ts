import { SprintTask, Sprint, UserAssignee, TaskStatus, TaskPriority } from '../types/board';

export interface BoardDataResponse {
  tasks: SprintTask[];
  sprints: Sprint[];
  users: UserAssignee[];
}

export const tasksApi = {
  fetchInitialBoardData: async (): Promise<BoardDataResponse> => {
    const response = await fetch('/mock-data.json');
    if (!response.ok) {
      throw new Error('Failed to load initial board mock data');
    }
    const data = await response.json();

    const rawUsers = data.users || [];
    const users: UserAssignee[] = rawUsers.map((u: any) => ({
      id: String(u.id),
      name: u.name,
      email: u.email,
      avatar: u.avatar,
      role: u.role || 'Software Engineer',
    }));

    const rawSprints = data.sprints || [];
    const sprints: Sprint[] = rawSprints.map((s: any) => ({
      id: String(s.id),
      name: s.name,
      startDate: s.startDate,
      endDate: s.endDate,
      status: s.status || (s.id === 3 ? 'active' : 'completed'),
    }));

    const rawComments = data.comments || [];

    const rawTasks = data.tasks || [];
    const tasks: SprintTask[] = rawTasks.slice(0, 30).map((t: any) => {
      const assigneeObj = users.find((u) => u.id === String(t.assigneeId)) || users[0] || {
        id: '1',
        name: 'Emily Johnson',
        email: 'emily.johnson@example.com',
        avatar: 'https://i.pravatar.cc/150?img=47',
        role: 'Lead Frontend Engineer',
      };

      const normalizedStatus: TaskStatus =
        t.status === 'in-progress' || t.status === 'in_progress'
          ? 'in_progress'
          : t.status === 'review'
          ? 'review'
          : t.status === 'done'
          ? 'done'
          : 'backlog';

      const normalizedPriority: TaskPriority =
        t.priority === 'urgent'
          ? 'urgent'
          : t.priority === 'high'
          ? 'high'
          : t.priority === 'medium'
          ? 'medium'
          : 'low';

      // Match task comments
      const taskComments = rawComments
        .filter((c: any) => Number(c.taskId) === Number(t.id))
        .map((c: any) => {
          const author = users.find((u) => u.id === String(c.authorId)) || assigneeObj;
          return {
            id: `cmt-${c.id}`,
            author: {
              name: author.name,
              avatar: author.avatar,
            },
            content: c.message,
            createdAt: c.createdAt,
          };
        });

      return {
        id: `TASK-${t.id}`,
        title: t.title,
        description: t.description || '',
        status: normalizedStatus,
        priority: normalizedPriority,
        assignee: assigneeObj,
        sprintId: String(t.sprintId),
        estimatePoints: t.estimatePoints || (t.priority === 'high' ? 5 : t.priority === 'medium' ? 3 : 2),
        dueDate: t.dueDate,
        createdAt: t.createdAt,
        completedAt: t.completedAt,
        tags: [`Sprint ${t.sprintId}`, t.priority.toUpperCase()],
        comments: taskComments,
      };
    });

    return {
      tasks,
      sprints,
      users,
    };
  },
};

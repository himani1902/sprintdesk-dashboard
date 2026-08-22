import { SprintTask, Sprint, UserAssignee } from '../types/board';

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
    
    // Ensure we limit to first 30 tasks as specified in prompt
    const initialTasks: SprintTask[] = (data.tasks || []).slice(0, 30);
    
    return {
      tasks: initialTasks,
      sprints: data.sprints || [],
      users: data.users || [],
    };
  }
};

import { useEffect } from 'react';
import { useQuery } from '@tanstack/react-query';
import { tasksApi } from '../api/tasks.api';
import { useBoardStore } from '../store/board.store';

export function useBoardTasks() {
  const { setTasks, setSprints, setUsers, tasks } = useBoardStore();

  const query = useQuery({
    queryKey: ['initial-board-data'],
    queryFn: tasksApi.fetchInitialBoardData,
    staleTime: Infinity, // Keep cached initial mock data
  });

  useEffect(() => {
    if (query.data) {
      if (tasks.length === 0) {
        setTasks(query.data.tasks);
      }
      setSprints(query.data.sprints);
      setUsers(query.data.users);
    }
  }, [query.data, tasks.length, setTasks, setSprints, setUsers]);

  return query;
}

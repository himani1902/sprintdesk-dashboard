import React from 'react';
import { Search, RotateCcw } from 'lucide-react';
import { useBoardStore } from '../../store/board.store';
import { Input } from '../ui/Input';
import { Select } from '../ui/Select';
import { Button } from '../ui/Button';

export const BoardFilters: React.FC = () => {
  const { filters, setFilter, resetFilters, users } = useBoardStore();

  const priorityOptions = [
    { label: 'All Priorities', value: 'all' },
    { label: 'Urgent Priority', value: 'urgent' },
    { label: 'High Priority', value: 'high' },
    { label: 'Medium Priority', value: 'medium' },
    { label: 'Low Priority', value: 'low' },
  ];

  const assigneeOptions = [
    { label: 'All Assignees', value: 'all' },
    ...users.map((u) => ({ label: u.name, value: u.id })),
  ];

  const isFiltered =
    filters.searchQuery !== '' ||
    filters.priorityFilter !== 'all' ||
    filters.assigneeId !== 'all';

  return (
    <div className="w-full flex flex-col md:flex-row items-stretch md:items-center justify-between gap-3 bg-white dark:bg-slate-900 border border-orange-100 dark:border-slate-800 p-3 sm:p-4 rounded-2xl shadow-xs">
      {/* Search Input */}
      <div className="w-full md:max-w-xs">
        <Input
          placeholder="Filter tasks by keyword..."
          value={filters.searchQuery}
          onChange={(e) => setFilter('searchQuery', e.target.value)}
          leftIcon={<Search className="w-4 h-4 text-slate-400" />}
        />
      </div>

      {/* Filter Selects & Reset */}
      <div className="w-full md:w-auto flex flex-col sm:flex-row flex-wrap items-stretch sm:items-center gap-2.5 sm:gap-3">
        <div className="w-full sm:w-44">
          <Select
            options={priorityOptions}
            value={filters.priorityFilter}
            onChange={(e) => setFilter('priorityFilter', e.target.value)}
          />
        </div>

        <div className="w-full sm:w-48">
          <Select
            options={assigneeOptions}
            value={filters.assigneeId}
            onChange={(e) => setFilter('assigneeId', e.target.value)}
          />
        </div>

        {isFiltered && (
          <Button
            size="sm"
            variant="ghost"
            onClick={resetFilters}
            leftIcon={<RotateCcw className="w-3.5 h-3.5" />}
            className="text-xs text-brand-600 dark:text-brand-400 hover:text-brand-700 font-bold self-start sm:self-auto"
          >
            Clear Filters
          </Button>
        )}
      </div>
    </div>
  );
};

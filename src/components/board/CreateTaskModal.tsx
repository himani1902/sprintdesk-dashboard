import React, { useState } from 'react';
import { useBoardStore } from '../../store/board.store';
import { useToast } from '../../hooks/useToast';
import { Modal } from '../ui/Modal';
import { Input } from '../ui/Input';
import { Select } from '../ui/Select';
import { Button } from '../ui/Button';
import { TaskPriority, TaskStatus } from '../../types/board';

export const CreateTaskModal: React.FC = () => {
  const { isCreateModalOpen, setCreateModalOpen, addTask, users } = useBoardStore();
  const { success } = useToast();

  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [priority, setPriority] = useState<TaskPriority>('medium');
  const [status, setStatus] = useState<TaskStatus>('backlog');
  const [assigneeId, setAssigneeId] = useState('1');
  const [estimatePoints, setEstimatePoints] = useState(3);
  const [dueDate, setDueDate] = useState('');
  const [errors, setErrors] = useState<{ title?: string }>({});

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim()) {
      setErrors({ title: 'Task title is required' });
      return;
    }

    const assignee = users.find((u) => u.id === assigneeId) || users[0] || {
      id: '1',
      name: 'Emily Johnson',
      email: 'emily.johnson@example.com',
      avatar: 'https://i.pravatar.cc/150?img=47',
      role: 'Lead Frontend Engineer',
    };

    const created = addTask({
      title: title.trim(),
      description: description.trim(),
      priority,
      status,
      assignee,
      sprintId: '3',
      estimatePoints: Number(estimatePoints) || 1,
      dueDate: dueDate || new Date(Date.now() + 86400000 * 7).toISOString().split('T')[0],
      completedAt: status === 'done' ? new Date().toISOString() : null,
      tags: ['Sprint 3'],
    });

    success('Task Created Successfully', `${created.id} has been added to ${status.replace('_', ' ')}.`);

    // Reset form
    setTitle('');
    setDescription('');
    setPriority('medium');
    setStatus('backlog');
    setErrors({});
  };

  const priorityOptions = [
    { label: 'Low', value: 'low' },
    { label: 'Medium', value: 'medium' },
    { label: 'High', value: 'high' },
    { label: 'Urgent', value: 'urgent' },
  ];

  const statusOptions = [
    { label: 'Backlog', value: 'backlog' },
    { label: 'In Progress', value: 'in_progress' },
    { label: 'Review', value: 'review' },
    { label: 'Done', value: 'done' },
  ];

  return (
    <Modal
      isOpen={isCreateModalOpen}
      onClose={() => setCreateModalOpen(false)}
      title="Create New Sprint Task"
      description="Add a task to Sprint 3 backlog or board columns."
      footer={
        <>
          <Button variant="outline" onClick={() => setCreateModalOpen(false)}>
            Cancel
          </Button>
          <Button onClick={handleSubmit}>Create Task</Button>
        </>
      }
    >
      <form onSubmit={handleSubmit} className="flex flex-col gap-4">
        <Input
          label="Task Title"
          required
          placeholder="e.g. Implement OAuth login redirect"
          value={title}
          onChange={(e) => {
            setTitle(e.target.value);
            if (errors.title) setErrors({});
          }}
          error={errors.title}
        />

        <div>
          <label className="text-xs font-bold text-slate-800 dark:text-slate-200 block mb-1.5">
            Description
          </label>
          <textarea
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            placeholder="Add detailed task scope, acceptance criteria, or reference links..."
            rows={3}
            className="w-full rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-900 text-slate-900 dark:text-slate-100 text-sm p-3 outline-none focus:ring-2 focus:ring-brand-500 placeholder:text-slate-400 dark:placeholder:text-slate-500"
          />
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          <Select
            label="Priority"
            options={priorityOptions}
            value={priority}
            onChange={(e) => setPriority(e.target.value as TaskPriority)}
          />

          <Select
            label="Initial Status"
            options={statusOptions}
            value={status}
            onChange={(e) => setStatus(e.target.value as TaskStatus)}
          />
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
          <Select
            label="Assignee"
            options={users.map((u) => ({ label: u.name, value: u.id }))}
            value={assigneeId}
            onChange={(e) => setAssigneeId(e.target.value)}
          />

          <Input
            label="Story Points"
            type="number"
            min={1}
            max={21}
            value={estimatePoints}
            onChange={(e) => setEstimatePoints(Number(e.target.value))}
          />

          <Input
            label="Due Date"
            type="date"
            value={dueDate}
            onChange={(e) => setDueDate(e.target.value)}
          />
        </div>
      </form>
    </Modal>
  );
};

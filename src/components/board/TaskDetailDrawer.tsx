import React, { useState } from 'react';
import { Calendar, User as UserIcon, Tag, MessageSquare, Send, CheckCircle2, Hash } from 'lucide-react';
import { useBoardStore } from '../../store/board.store';
import { useAuthStore } from '../../store/auth.store';
import { Drawer } from '../ui/Drawer';
import { Badge } from '../ui/Badge';
import { Avatar } from '../ui/Avatar';
import { Button } from '../ui/Button';
import { Input } from '../ui/Input';
import { Select } from '../ui/Select';
import { formatDate, formatRelativeTime } from '../../utils/date';
import { TaskPriority, TaskStatus } from '../../types/board';

export const TaskDetailDrawer: React.FC = () => {
  const { selectedTaskId, setSelectedTaskId, tasks, updateTask, addComment, users } = useBoardStore();
  const { user: authUser } = useAuthStore();

  const [newCommentText, setNewCommentText] = useState('');
  const [isEditing, setIsEditing] = useState(false);

  const task = tasks.find((t) => t.id === selectedTaskId);

  if (!task) return null;

  const handleStatusChange = (status: TaskStatus) => {
    updateTask(task.id, { status });
  };

  const handlePriorityChange = (priority: TaskPriority) => {
    updateTask(task.id, { priority });
  };

  const handleAssigneeChange = (assigneeId: string) => {
    const foundUser = users.find((u) => u.id === assigneeId);
    if (foundUser) {
      updateTask(task.id, { assignee: foundUser });
    }
  };

  const handleAddCommentSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newCommentText.trim()) return;

    const authorName = authUser
      ? `${authUser.firstName || ''} ${authUser.lastName || ''}`.trim() || authUser.username
      : 'Emily Smith';
    const authorAvatar = authUser?.image || 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=150&auto=format&fit=crop&q=80';

    addComment(task.id, newCommentText.trim(), authorName, authorAvatar);
    setNewCommentText('');
  };

  const statusOptions = [
    { label: 'Backlog', value: 'backlog' },
    { label: 'In Progress', value: 'in_progress' },
    { label: 'Review', value: 'review' },
    { label: 'Done', value: 'done' },
  ];

  const priorityOptions = [
    { label: 'Low', value: 'low' },
    { label: 'Medium', value: 'medium' },
    { label: 'High', value: 'high' },
    { label: 'Urgent', value: 'urgent' },
  ];

  return (
    <Drawer
      isOpen={!!selectedTaskId}
      onClose={() => {
        setSelectedTaskId(null);
        setIsEditing(false);
      }}
      title={task.id}
      subtitle={`Sprint 24 • Created ${formatDate(task.createdAt)}`}
    >
      <div className="flex flex-col gap-6">
        {/* Title Section */}
        <div>
          <Input
            value={task.title}
            onChange={(e) => updateTask(task.id, { title: e.target.value })}
            className="text-base font-bold bg-transparent border-transparent hover:border-slate-300 dark:hover:border-slate-700 px-0 focus:px-3 focus:bg-white dark:focus:bg-slate-900"
          />
        </div>

        {/* Quick Settings Grid */}
        <div className="grid grid-cols-2 gap-4 p-4 bg-orange-50/50 dark:bg-slate-950/60 border border-orange-200/60 dark:border-slate-800 rounded-2xl shadow-2xs">
          <div>
            <label className="text-[11px] font-extrabold text-slate-700 dark:text-slate-300 uppercase tracking-wider block mb-1">
              Status
            </label>
            <Select
              options={statusOptions}
              value={task.status}
              onChange={(e) => handleStatusChange(e.target.value as TaskStatus)}
            />
          </div>

          <div>
            <label className="text-[11px] font-extrabold text-slate-700 dark:text-slate-300 uppercase tracking-wider block mb-1">
              Priority
            </label>
            <Select
              options={priorityOptions}
              value={task.priority}
              onChange={(e) => handlePriorityChange(e.target.value as TaskPriority)}
            />
          </div>

          <div>
            <label className="text-[11px] font-extrabold text-slate-700 dark:text-slate-300 uppercase tracking-wider block mb-1">
              Assignee
            </label>
            <Select
              options={users.map((u) => ({ label: u.name, value: u.id }))}
              value={task.assignee?.id || 'usr-1'}
              onChange={(e) => handleAssigneeChange(e.target.value)}
            />
          </div>

          <div>
            <label className="text-[11px] font-extrabold text-slate-700 dark:text-slate-300 uppercase tracking-wider block mb-1">
              Estimate Points
            </label>
            <Input
              type="number"
              min={1}
              max={21}
              value={task.estimatePoints}
              onChange={(e) => updateTask(task.id, { estimatePoints: Number(e.target.value) })}
            />
          </div>
        </div>

        {/* Description Section */}
        <div>
          <label className="text-xs font-bold text-slate-800 dark:text-slate-200 block mb-1.5">
            Description
          </label>
          <textarea
            value={task.description}
            onChange={(e) => updateTask(task.id, { description: e.target.value })}
            rows={4}
            className="w-full rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-900 text-slate-900 dark:text-slate-100 text-sm p-3 outline-none focus:ring-2 focus:ring-brand-500"
            placeholder="Add detailed task requirements..."
          />
        </div>

        {/* Tags */}
        {task.tags && task.tags.length > 0 && (
          <div>
            <label className="text-xs font-bold text-slate-800 dark:text-slate-200 block mb-1.5 flex items-center gap-1.5">
              <Tag className="w-3.5 h-3.5 text-brand-500" />
              <span>Tags</span>
            </label>
            <div className="flex flex-wrap gap-2">
              {task.tags.map((tag) => (
                <span
                  key={tag}
                  className="text-xs px-2.5 py-1 rounded-lg bg-orange-100 text-brand-900 dark:bg-slate-800 dark:text-slate-200 border border-orange-200 dark:border-slate-700 font-bold"
                >
                  #{tag}
                </span>
              ))}
            </div>
          </div>
        )}

        {/* Comments Section */}
        <div className="border-t border-orange-100 dark:border-slate-800 pt-6">
          <h4 className="text-sm font-bold text-slate-900 dark:text-slate-100 flex items-center gap-2 mb-4">
            <MessageSquare className="w-4 h-4 text-brand-500" />
            <span>Comments ({task.comments?.length || 0})</span>
          </h4>

          {/* Add Comment Form */}
          <form onSubmit={handleAddCommentSubmit} className="flex flex-col gap-2 mb-6">
            <textarea
              value={newCommentText}
              onChange={(e) => setNewCommentText(e.target.value)}
              placeholder="Write a comment..."
              rows={2}
              className="w-full rounded-xl border border-slate-300 dark:border-slate-800 bg-slate-50 dark:bg-slate-950 text-slate-900 dark:text-slate-100 text-xs p-3 outline-none focus:ring-2 focus:ring-brand-500"
            />
            <div className="flex justify-end">
              <Button size="sm" type="submit" disabled={!newCommentText.trim()} rightIcon={<Send className="w-3.5 h-3.5" />}>
                Post Comment
              </Button>
            </div>
          </form>

          {/* Comments Feed */}
          <div className="flex flex-col gap-4">
            {task.comments && task.comments.length > 0 ? (
              task.comments.map((comment) => (
                <div key={comment.id} className="flex items-start gap-3 p-3.5 rounded-xl bg-slate-50/80 dark:bg-slate-950/60 border border-slate-200 dark:border-slate-800 shadow-2xs">
                  <Avatar src={comment.author.avatar} name={comment.author.name} size="sm" />
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center justify-between">
                      <span className="text-xs font-bold text-slate-900 dark:text-slate-100">{comment.author.name}</span>
                      <span className="text-[10px] font-semibold text-slate-500 dark:text-slate-400">{formatRelativeTime(comment.createdAt)}</span>
                    </div>
                    <p className="text-xs text-slate-700 dark:text-slate-300 mt-1 leading-relaxed font-normal">{comment.content}</p>
                  </div>
                </div>
              ))
            ) : (
              <p className="text-xs text-slate-500 dark:text-slate-400 text-center py-4 font-medium">No comments yet. Be the first to start the discussion!</p>
            )}
          </div>
        </div>
      </div>
    </Drawer>
  );
};

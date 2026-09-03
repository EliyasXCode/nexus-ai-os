import React, { useState, useEffect } from 'react';
import { tasksService } from '../../services/tasks.service.js';
import { Badge } from '../common/Badge.jsx';
import { Modal } from '../common/Modal.jsx';
import { 
  CheckSquare, 
  Square, 
  Plus, 
  Trash2, 
  Edit3, 
  Calendar, 
  Clock, 
  Filter, 
  Search, 
  Sparkles, 
  AlertCircle 
} from 'lucide-react';

export const TaskManager = () => {
  const [tasks, setTasks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState('all');
  const [searchQuery, setSearchQuery] = useState('');

  // Modal State for Task Creation/Editing
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingTaskId, setEditingTaskId] = useState(null);
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    priority: 'medium',
    dueDate: '',
  });

  useEffect(() => {
    loadTasks();
  }, [filter]);

  const loadTasks = async () => {
    setLoading(true);
    try {
      const data = await tasksService.getTasks({ status: filter });
      setTasks(data || []);
    } catch (err) {
      console.error('Failed to load tasks:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleOpenCreateModal = () => {
    setEditingTaskId(null);
    setFormData({
      title: '',
      description: '',
      priority: 'medium',
      dueDate: '',
    });
    setIsModalOpen(true);
  };

  const handleOpenEditModal = (task) => {
    setEditingTaskId(task._id);
    setFormData({
      title: task.title,
      description: task.description || '',
      priority: task.priority,
      dueDate: task.dueDate ? new Date(task.dueDate).toISOString().substring(0, 10) : '',
    });
    setIsModalOpen(true);
  };

  const handleSaveTask = async (e) => {
    e.preventDefault();
    if (!formData.title.trim()) return;

    try {
      if (editingTaskId) {
        await tasksService.updateTask(editingTaskId, formData);
      } else {
        await tasksService.createTask(formData);
      }
      setIsModalOpen(false);
      loadTasks();
    } catch (err) {
      alert(err.message);
    }
  };

  const handleToggleStatus = async (task) => {
    const nextStatus = task.status === 'completed' ? 'pending' : 'completed';
    try {
      await tasksService.updateTask(task._id, { status: nextStatus });
      setTasks((prev) =>
        prev.map((t) => (t._id === task._id ? { ...t, status: nextStatus } : t))
      );
    } catch (err) {
      console.error(err);
    }
  };

  const handleDeleteTask = async (id) => {
    if (confirm('Delete this task?')) {
      try {
        await tasksService.deleteTask(id);
        setTasks((prev) => prev.filter((t) => t._id !== id));
      } catch (err) {
        alert(err.message);
      }
    }
  };

  const filteredTasks = tasks.filter((t) =>
    searchQuery
      ? t.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        t.description?.toLowerCase().includes(searchQuery.toLowerCase())
      : true
  );

  return (
    <div className="p-4 md:p-8 max-w-6xl mx-auto h-[calc(100vh-3.5rem)] flex flex-col">
      {/* Header bar */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 pb-6 border-b border-white/10">
        <div>
          <h1 className="text-2xl font-bold flex items-center gap-2.5 text-white">
            <CheckSquare className="text-emerald-400" />
            <span>Task Manager</span>
          </h1>
          <p className="text-xs text-slate-400 mt-1">
            Organize personal to-dos or let the NEXUS Task Agent schedule items automatically.
          </p>
        </div>

        <button
          onClick={handleOpenCreateModal}
          className="flex items-center gap-2 px-4 py-2 rounded-xl bg-gradient-to-r from-emerald-500 to-teal-600 text-white text-xs font-semibold shadow-lg shadow-emerald-500/20 hover:opacity-90 transition"
        >
          <Plus size={16} />
          <span>New Task</span>
        </button>
      </div>

      {/* Filter and Search Bar */}
      <div className="flex flex-col sm:flex-row items-center justify-between gap-3 my-4">
        {/* Filter Pills */}
        <div className="flex items-center gap-1.5 p-1 rounded-xl bg-slate-900/80 border border-white/10 text-xs w-full sm:w-auto overflow-x-auto">
          {['all', 'today', 'upcoming', 'completed'].map((f) => (
            <button
              key={f}
              onClick={() => setFilter(f)}
              className={`px-3 py-1.5 rounded-lg capitalize transition ${
                filter === f
                  ? 'bg-emerald-500/20 text-emerald-300 font-semibold border border-emerald-500/30'
                  : 'text-slate-400 hover:text-white'
              }`}
            >
              {f}
            </button>
          ))}
        </div>

        {/* Search Box */}
        <div className="relative w-full sm:w-64">
          <Search size={15} className="absolute left-3 top-2.5 text-slate-400" />
          <input
            type="text"
            placeholder="Search tasks..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-9 pr-3 py-1.5 rounded-xl bg-slate-900/80 border border-white/10 text-xs text-slate-200 placeholder-slate-400 focus:outline-none focus:border-emerald-500"
          />
        </div>
      </div>

      {/* Task List */}
      <div className="flex-1 overflow-y-auto space-y-2.5 pr-1">
        {loading ? (
          <p className="text-xs text-slate-400 text-center py-12">Loading task data...</p>
        ) : filteredTasks.length === 0 ? (
          <div className="text-center py-16 glass-panel rounded-2xl border border-white/5">
            <CheckSquare size={36} className="mx-auto text-slate-600 mb-3" />
            <p className="text-sm font-medium text-slate-300">No tasks found</p>
            <p className="text-xs text-slate-500 mt-1">
              Create a task above or ask NEXUS: &quot;Create a task to practice coding tomorrow&quot;
            </p>
          </div>
        ) : (
          filteredTasks.map((task) => {
            const isCompleted = task.status === 'completed';

            return (
              <div
                key={task._id}
                className={`glass-panel rounded-xl p-3.5 flex items-center justify-between gap-3 border transition-all ${
                  isCompleted
                    ? 'border-white/5 opacity-60 bg-slate-950/40'
                    : 'border-white/10 hover:border-emerald-500/30 hover:bg-white/[0.04]'
                }`}
              >
                {/* Left check & title */}
                <div className="flex items-center gap-3 min-w-0 flex-1">
                  <button
                    onClick={() => handleToggleStatus(task)}
                    className="shrink-0 text-emerald-400 hover:text-emerald-300 transition"
                  >
                    {isCompleted ? <CheckSquare size={19} /> : <Square size={19} className="text-slate-500" />}
                  </button>

                  <div className="truncate">
                    <p
                      className={`text-sm font-medium text-slate-100 truncate ${
                        isCompleted ? 'line-through text-slate-400' : ''
                      }`}
                    >
                      {task.title}
                    </p>
                    {task.description && (
                      <p className="text-xs text-slate-400 truncate mt-0.5">{task.description}</p>
                    )}
                  </div>
                </div>

                {/* Right Badges and Actions */}
                <div className="flex items-center gap-2 shrink-0">
                  {/* Created By AI Badge */}
                  {task.createdBy === 'ai' && (
                    <Badge variant="ai" size="xs">
                      <Sparkles size={11} />
                      <span>NEXUS AI</span>
                    </Badge>
                  )}

                  {/* Priority Badge */}
                  <Badge variant={task.priority} size="xs">
                    {task.priority.toUpperCase()}
                  </Badge>

                  {/* Due Date */}
                  {task.dueDate && (
                    <div className="hidden sm:flex items-center gap-1 text-[11px] text-slate-400 font-mono">
                      <Calendar size={12} className="text-slate-500" />
                      <span>{new Date(task.dueDate).toLocaleDateString()}</span>
                    </div>
                  )}

                  {/* Edit & Delete Buttons */}
                  <div className="flex items-center gap-1 pl-2 border-l border-white/10">
                    <button
                      onClick={() => handleOpenEditModal(task)}
                      className="p-1 rounded-lg text-slate-400 hover:text-cyan-300 transition"
                      title="Edit Task"
                    >
                      <Edit3 size={14} />
                    </button>
                    <button
                      onClick={() => handleDeleteTask(task._id)}
                      className="p-1 rounded-lg text-slate-400 hover:text-rose-400 transition"
                      title="Delete Task"
                    >
                      <Trash2 size={14} />
                    </button>
                  </div>
                </div>
              </div>
            );
          })
        )}
      </div>

      {/* Task Creation & Edit Modal */}
      <Modal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        title={editingTaskId ? 'Edit Task' : 'Create New Task'}
      >
        <form onSubmit={handleSaveTask} className="space-y-4 text-xs">
          <div>
            <label className="block text-slate-300 font-medium mb-1">Task Title *</label>
            <input
              type="text"
              required
              value={formData.title}
              onChange={(e) => setFormData({ ...formData, title: e.target.value })}
              placeholder="e.g. Practice React Hooks"
              className="w-full px-3 py-2 rounded-xl bg-slate-900 border border-white/10 text-slate-100 focus:outline-none focus:border-emerald-500"
            />
          </div>

          <div>
            <label className="block text-slate-300 font-medium mb-1">Description</label>
            <textarea
              rows={3}
              value={formData.description}
              onChange={(e) => setFormData({ ...formData, description: e.target.value })}
              placeholder="Additional instructions or notes..."
              className="w-full px-3 py-2 rounded-xl bg-slate-900 border border-white/10 text-slate-100 focus:outline-none focus:border-emerald-500"
            />
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-slate-300 font-medium mb-1">Priority</label>
              <select
                value={formData.priority}
                onChange={(e) => setFormData({ ...formData, priority: e.target.value })}
                className="w-full px-3 py-2 rounded-xl bg-slate-900 border border-white/10 text-slate-100 focus:outline-none focus:border-emerald-500"
              >
                <option value="low">Low</option>
                <option value="medium">Medium</option>
                <option value="high">High</option>
              </select>
            </div>

            <div>
              <label className="block text-slate-300 font-medium mb-1">Due Date</label>
              <input
                type="date"
                value={formData.dueDate}
                onChange={(e) => setFormData({ ...formData, dueDate: e.target.value })}
                className="w-full px-3 py-2 rounded-xl bg-slate-900 border border-white/10 text-slate-100 focus:outline-none focus:border-emerald-500"
              >
              </input>
            </div>
          </div>

          <div className="flex justify-end gap-2 pt-4 border-t border-white/10">
            <button
              type="button"
              onClick={() => setIsModalOpen(false)}
              className="px-4 py-2 rounded-xl bg-slate-800 text-slate-300 hover:bg-slate-700"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-4 py-2 rounded-xl bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-semibold"
            >
              {editingTaskId ? 'Save Changes' : 'Create Task'}
            </button>
          </div>
        </form>
      </Modal>
    </div>
  );
};

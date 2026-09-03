import React, { useState, useEffect } from 'react';
import { useAuth } from '../../context/AuthContext.jsx';
import { memoryService } from '../../services/memory.service.js';
import { Badge } from '../common/Badge.jsx';
import { Modal } from '../common/Modal.jsx';
import { 
  Database, 
  Plus, 
  Trash2, 
  Edit3, 
  Search, 
  ShieldCheck, 
  AlertTriangle,
  Sparkles,
  ToggleLeft,
  ToggleRight
} from 'lucide-react';

export const MemoryManager = () => {
  const { user, updateSettings } = useAuth();
  const [memories, setMemories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [categoryFilter, setCategoryFilter] = useState('all');
  const [searchQuery, setSearchQuery] = useState('');

  // Memory Toggle
  const memoryEnabled = user?.settings?.memoryEnabled !== false;

  // Modal State
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingId, setEditingId] = useState(null);
  const [formData, setFormData] = useState({
    key: '',
    value: '',
    category: 'general',
  });

  useEffect(() => {
    loadMemories();
  }, [categoryFilter]);

  const loadMemories = async () => {
    setLoading(true);
    try {
      const data = await memoryService.getMemories({ category: categoryFilter });
      setMemories(data || []);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleToggleMemory = async () => {
    try {
      await updateSettings({ memoryEnabled: !memoryEnabled });
    } catch (err) {
      alert(err.message);
    }
  };

  const handleOpenCreateModal = () => {
    setEditingId(null);
    setFormData({ key: '', value: '', category: 'general' });
    setIsModalOpen(true);
  };

  const handleOpenEditModal = (item) => {
    setEditingId(item._id);
    setFormData({
      key: item.key,
      value: item.value,
      category: item.category,
    });
    setIsModalOpen(true);
  };

  const handleSaveMemory = async (e) => {
    e.preventDefault();
    if (!formData.key.trim() || !formData.value.trim()) return;

    try {
      if (editingId) {
        await memoryService.updateMemory(editingId, formData);
      } else {
        await memoryService.createMemory(formData);
      }
      setIsModalOpen(false);
      loadMemories();
    } catch (err) {
      alert(err.message);
    }
  };

  const handleDeleteMemory = async (id) => {
    if (confirm('Permanently remove this memory item from NEXUS?')) {
      try {
        await memoryService.deleteMemory(id);
        setMemories((prev) => prev.filter((m) => m._id !== id));
      } catch (err) {
        alert(err.message);
      }
    }
  };

  const handleClearAll = async () => {
    const confirmation = prompt(
      'Type "DELETE" to confirm erasing all long-term AI memory records:'
    );
    if (confirmation === 'DELETE') {
      try {
        await memoryService.clearAllMemory();
        setMemories([]);
        alert('All memory records have been securely erased.');
      } catch (err) {
        alert(err.message);
      }
    }
  };

  const filteredMemories = memories.filter((m) =>
    searchQuery
      ? m.key.toLowerCase().includes(searchQuery.toLowerCase()) ||
        m.value.toLowerCase().includes(searchQuery.toLowerCase())
      : true
  );

  return (
    <div className="p-4 md:p-8 max-w-5xl mx-auto h-[calc(100vh-3.5rem)] flex flex-col">
      {/* Header */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 pb-6 border-b border-white/10">
        <div>
          <h1 className="text-2xl font-bold flex items-center gap-2.5 text-white">
            <Database className="text-teal-400" />
            <span>AI Long-Term Memory</span>
          </h1>
          <p className="text-xs text-slate-400 mt-1">
            Explicitly controlled facts, user preferences, and project context remembered by NEXUS.
          </p>
        </div>

        <div className="flex items-center gap-3">
          {/* Enable / Disable Memory Toggle */}
          <button
            onClick={handleToggleMemory}
            className={`flex items-center gap-2 px-3.5 py-1.5 rounded-xl border text-xs font-semibold transition ${
              memoryEnabled
                ? 'bg-teal-500/15 text-teal-300 border-teal-500/30'
                : 'bg-slate-800 text-slate-400 border-white/10'
            }`}
          >
            {memoryEnabled ? (
              <>
                <ToggleRight size={18} className="text-teal-400" />
                <span>Memory ON</span>
              </>
            ) : (
              <>
                <ToggleLeft size={18} className="text-slate-500" />
                <span>Memory OFF</span>
              </>
            )}
          </button>

          <button
            onClick={handleOpenCreateModal}
            className="flex items-center gap-2 px-4 py-2 rounded-xl bg-gradient-to-r from-teal-500 to-emerald-600 text-white text-xs font-semibold shadow-lg shadow-teal-500/20 hover:opacity-90 transition"
          >
            <Plus size={16} />
            <span>Add Memory</span>
          </button>
        </div>
      </div>

      {/* Safety Notice */}
      <div className="my-4 p-3 rounded-xl bg-slate-900/80 border border-teal-500/20 flex items-center justify-between text-xs text-slate-300">
        <div className="flex items-center gap-2">
          <ShieldCheck size={16} className="text-teal-400 shrink-0" />
          <span>
            NEXUS never silently stores private data. Memory is strictly user-scoped and only stored when instructed (e.g. &quot;Remember that...&quot;).
          </span>
        </div>
        {memories.length > 0 && (
          <button
            onClick={handleClearAll}
            className="text-xs text-rose-400 hover:text-rose-300 transition underline shrink-0 ml-4"
          >
            Clear All Memory
          </button>
        )}
      </div>

      {/* Filter and Search */}
      <div className="flex flex-col sm:flex-row items-center justify-between gap-3 mb-4">
        <div className="flex items-center gap-1.5 p-1 rounded-xl bg-slate-900/80 border border-white/10 text-xs w-full sm:w-auto overflow-x-auto">
          {['all', 'preference', 'project', 'learning', 'general'].map((c) => (
            <button
              key={c}
              onClick={() => setCategoryFilter(c)}
              className={`px-3 py-1.5 rounded-lg capitalize transition ${
                categoryFilter === c
                  ? 'bg-teal-500/20 text-teal-300 font-semibold border border-teal-500/30'
                  : 'text-slate-400 hover:text-white'
              }`}
            >
              {c}
            </button>
          ))}
        </div>

        <div className="relative w-full sm:w-64">
          <Search size={15} className="absolute left-3 top-2.5 text-slate-400" />
          <input
            type="text"
            placeholder="Search memories..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-9 pr-3 py-1.5 rounded-xl bg-slate-900/80 border border-white/10 text-xs text-slate-200 placeholder-slate-400 focus:outline-none focus:border-teal-500"
          />
        </div>
      </div>

      {/* Memory Cards */}
      <div className="flex-1 overflow-y-auto space-y-2.5">
        {loading ? (
          <p className="text-xs text-slate-400 text-center py-12">Loading memory records...</p>
        ) : filteredMemories.length === 0 ? (
          <div className="text-center py-16 glass-panel rounded-2xl border border-white/5">
            <Database size={36} className="mx-auto text-slate-600 mb-3" />
            <p className="text-sm font-medium text-slate-300">No memories saved</p>
            <p className="text-xs text-slate-500 mt-1">
              Add a memory above or tell NEXUS in chat: &quot;Remember that I am learning MERN stack&quot;
            </p>
          </div>
        ) : (
          filteredMemories.map((item) => (
            <div
              key={item._id}
              className="glass-panel rounded-xl p-4 border border-white/10 flex items-start justify-between gap-4 hover:border-teal-500/30 transition"
            >
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2 mb-1.5">
                  <Badge variant="cyan" size="xs">
                    {item.category.toUpperCase()}
                  </Badge>
                  <span className="text-xs font-semibold text-white font-mono">{item.key}</span>
                </div>
                <p className="text-xs text-slate-300 leading-relaxed">{item.value}</p>
              </div>

              <div className="flex items-center gap-1 shrink-0 pt-1">
                <button
                  onClick={() => handleOpenEditModal(item)}
                  className="p-1 rounded-lg text-slate-400 hover:text-cyan-300 transition"
                  title="Edit Memory"
                >
                  <Edit3 size={14} />
                </button>
                <button
                  onClick={() => handleDeleteMemory(item._id)}
                  className="p-1 rounded-lg text-slate-400 hover:text-rose-400 transition"
                  title="Delete Memory"
                >
                  <Trash2 size={14} />
                </button>
              </div>
            </div>
          ))
        )}
      </div>

      {/* Memory Add/Edit Modal */}
      <Modal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        title={editingId ? 'Edit Memory Item' : 'Add Long-Term Memory'}
      >
        <form onSubmit={handleSaveMemory} className="space-y-4 text-xs">
          <div>
            <label className="block text-slate-300 font-medium mb-1">Key Identifier *</label>
            <input
              type="text"
              required
              value={formData.key}
              onChange={(e) => setFormData({ ...formData, key: e.target.value })}
              placeholder="e.g. learning_focus or tech_stack"
              className="w-full px-3 py-2 rounded-xl bg-slate-900 border border-white/10 text-slate-100 focus:outline-none focus:border-teal-500 font-mono text-xs"
            />
          </div>

          <div>
            <label className="block text-slate-300 font-medium mb-1">Memory Value *</label>
            <textarea
              rows={3}
              required
              value={formData.value}
              onChange={(e) => setFormData({ ...formData, value: e.target.value })}
              placeholder="e.g. Currently learning MERN stack and preparing for fresher developer interviews"
              className="w-full px-3 py-2 rounded-xl bg-slate-900 border border-white/10 text-slate-100 focus:outline-none focus:border-teal-500"
            />
          </div>

          <div>
            <label className="block text-slate-300 font-medium mb-1">Category</label>
            <select
              value={formData.category}
              onChange={(e) => setFormData({ ...formData, category: e.target.value })}
              className="w-full px-3 py-2 rounded-xl bg-slate-900 border border-white/10 text-slate-100 focus:outline-none focus:border-teal-500"
            >
              <option value="preference">Preference</option>
              <option value="project">Project</option>
              <option value="learning">Learning</option>
              <option value="general">General</option>
            </select>
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
              className="px-4 py-2 rounded-xl bg-teal-500 hover:bg-teal-400 text-slate-950 font-semibold"
            >
              {editingId ? 'Save Changes' : 'Remember Fact'}
            </button>
          </div>
        </form>
      </Modal>
    </div>
  );
};

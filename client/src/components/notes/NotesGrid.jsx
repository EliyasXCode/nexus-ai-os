import React, { useState, useEffect } from 'react';
import { useOS } from '../../context/OSContext.jsx';
import { notesService } from '../../services/notes.service.js';
import { Modal } from '../common/Modal.jsx';
import { Badge } from '../common/Badge.jsx';
import { 
  FileText, 
  Plus, 
  Pin, 
  PinOff, 
  Trash2, 
  Edit3, 
  Search, 
  Sparkles, 
  Bot, 
  Tag, 
  Check 
} from 'lucide-react';

export const NotesGrid = () => {
  const { openApp } = useOS();
  const [notes, setNotes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [summarizingId, setSummarizingId] = useState(null);
  const [activeSummary, setActiveSummary] = useState({ noteId: null, text: '' });

  // Modal State
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingNoteId, setEditingNoteId] = useState(null);
  const [formData, setFormData] = useState({
    title: '',
    content: '',
    tags: '',
    pinned: false,
  });

  useEffect(() => {
    loadNotes();
  }, []);

  const loadNotes = async () => {
    setLoading(true);
    try {
      const data = await notesService.getNotes();
      setNotes(data || []);
    } catch (err) {
      console.error('Failed to load notes:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleOpenCreateModal = () => {
    setEditingNoteId(null);
    setFormData({ title: '', content: '', tags: '', pinned: false });
    setIsModalOpen(true);
  };

  const handleOpenEditModal = (note) => {
    setEditingNoteId(note._id);
    setFormData({
      title: note.title,
      content: note.content,
      tags: note.tags?.join(', ') || '',
      pinned: note.pinned || false,
    });
    setIsModalOpen(true);
  };

  const handleSaveNote = async (e) => {
    e.preventDefault();
    if (!formData.title.trim() || !formData.content.trim()) return;

    const tagsArray = formData.tags
      .split(',')
      .map((t) => t.trim())
      .filter(Boolean);

    try {
      if (editingNoteId) {
        await notesService.updateNote(editingNoteId, {
          ...formData,
          tags: tagsArray,
        });
      } else {
        await notesService.createNote({
          ...formData,
          tags: tagsArray,
        });
      }
      setIsModalOpen(false);
      loadNotes();
    } catch (err) {
      alert(err.message);
    }
  };

  const handleTogglePin = async (note) => {
    try {
      await notesService.updateNote(note._id, { pinned: !note.pinned });
      setNotes((prev) =>
        prev.map((n) => (n._id === note._id ? { ...n, pinned: !n.pinned } : n))
      );
    } catch (err) {
      console.error(err);
    }
  };

  const handleDeleteNote = async (id) => {
    if (confirm('Delete this note?')) {
      try {
        await notesService.deleteNote(id);
        setNotes((prev) => prev.filter((n) => n._id !== id));
      } catch (err) {
        alert(err.message);
      }
    }
  };

  const handleSummarizeNote = async (note) => {
    setSummarizingId(note._id);
    try {
      const summary = await notesService.summarizeNote(note._id);
      setActiveSummary({ noteId: note._id, text: summary });
    } catch (err) {
      alert(err.message);
    } finally {
      setSummarizingId(null);
    }
  };

  const handleAskAIAboutNote = (note) => {
    openApp('chat', `I want to discuss my note titled "${note.title}":\n\n${note.content}`);
  };

  const filteredNotes = notes.filter((n) =>
    searchQuery
      ? n.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        n.content.toLowerCase().includes(searchQuery.toLowerCase()) ||
        n.tags?.some((t) => t.toLowerCase().includes(searchQuery.toLowerCase()))
      : true
  );

  return (
    <div className="p-4 md:p-8 max-w-6xl mx-auto h-[calc(100vh-3.5rem)] flex flex-col">
      {/* Top bar */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 pb-6 border-b border-white/10">
        <div>
          <h1 className="text-2xl font-bold flex items-center gap-2.5 text-white">
            <FileText className="text-amber-400" />
            <span>Notes & Knowledge Base</span>
          </h1>
          <p className="text-xs text-slate-400 mt-1">
            Store documentation, interview notes, or ask the Notes Agent to save snippets automatically.
          </p>
        </div>

        <button
          onClick={handleOpenCreateModal}
          className="flex items-center gap-2 px-4 py-2 rounded-xl bg-gradient-to-r from-amber-500 to-orange-600 text-white text-xs font-semibold shadow-lg shadow-amber-500/20 hover:opacity-90 transition"
        >
          <Plus size={16} />
          <span>New Note</span>
        </button>
      </div>

      {/* Search Bar */}
      <div className="my-4 flex items-center justify-between gap-3">
        <div className="relative flex-1 max-w-md">
          <Search size={15} className="absolute left-3 top-2.5 text-slate-400" />
          <input
            type="text"
            placeholder="Search notes by title, content, or tag..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-9 pr-3 py-2 rounded-xl bg-slate-900/80 border border-white/10 text-xs text-slate-200 placeholder-slate-400 focus:outline-none focus:border-amber-500"
          />
        </div>
      </div>

      {/* Notes Grid */}
      <div className="flex-1 overflow-y-auto">
        {loading ? (
          <p className="text-xs text-slate-400 text-center py-12">Loading knowledge notes...</p>
        ) : filteredNotes.length === 0 ? (
          <div className="text-center py-16 glass-panel rounded-2xl border border-white/5">
            <FileText size={36} className="mx-auto text-slate-600 mb-3" />
            <p className="text-sm font-medium text-slate-300">No notes found</p>
            <p className="text-xs text-slate-500 mt-1">
              Create a note or ask NEXUS: &quot;Save a note about MongoDB documents vs tables&quot;
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 pb-6">
            {filteredNotes.map((note) => (
              <div
                key={note._id}
                className={`glass-panel rounded-2xl p-5 border flex flex-col justify-between transition-all duration-200 ${
                  note.pinned
                    ? 'border-amber-500/40 bg-amber-500/[0.03] shadow-amber-500/5'
                    : 'border-white/10 hover:border-white/20'
                }`}
              >
                <div>
                  {/* Top Bar inside card */}
                  <div className="flex items-start justify-between gap-2 mb-2">
                    <h3 className="text-sm font-semibold text-white line-clamp-1">{note.title}</h3>
                    <button
                      onClick={() => handleTogglePin(note)}
                      className={`p-1 rounded-lg transition ${
                        note.pinned ? 'text-amber-400 hover:text-amber-300' : 'text-slate-500 hover:text-slate-300'
                      }`}
                      title={note.pinned ? 'Unpin' : 'Pin to top'}
                    >
                      {note.pinned ? <Pin size={15} /> : <PinOff size={15} />}
                    </button>
                  </div>

                  {/* Body preview */}
                  <p className="text-xs text-slate-300 whitespace-pre-wrap line-clamp-4 leading-relaxed mb-3">
                    {note.content}
                  </p>

                  {/* AI Summary Box if activated */}
                  {activeSummary.noteId === note._id && (
                    <div className="p-3 rounded-xl bg-amber-500/10 border border-amber-500/20 text-xs text-amber-200 mb-3 animate-in fade-in">
                      <div className="flex items-center gap-1.5 font-semibold mb-1 text-amber-300">
                        <Sparkles size={13} />
                        <span>AI Key Summary:</span>
                      </div>
                      <p className="whitespace-pre-wrap leading-relaxed text-[11px]">{activeSummary.text}</p>
                    </div>
                  )}

                  {/* Tags */}
                  {note.tags && note.tags.length > 0 && (
                    <div className="flex flex-wrap gap-1 mb-3">
                      {note.tags.map((tag, idx) => (
                        <span
                          key={idx}
                          className="text-[10px] px-2 py-0.5 rounded-md bg-slate-800 text-slate-400 border border-white/5"
                        >
                          #{tag}
                        </span>
                      ))}
                    </div>
                  )}
                </div>

                {/* Card Actions Footer */}
                <div className="pt-3 border-t border-white/10 flex items-center justify-between text-xs">
                  <div className="flex items-center gap-2">
                    {/* AI Summarize */}
                    <button
                      onClick={() => handleSummarizeNote(note)}
                      disabled={summarizingId === note._id}
                      className="flex items-center gap-1 text-[11px] text-amber-400 hover:text-amber-300 transition"
                    >
                      <Sparkles size={12} className={summarizingId === note._id ? 'animate-spin' : ''} />
                      <span>{summarizingId === note._id ? 'Summarizing...' : 'AI Summary'}</span>
                    </button>

                    {/* Ask AI About Note */}
                    <button
                      onClick={() => handleAskAIAboutNote(note)}
                      className="flex items-center gap-1 text-[11px] text-cyan-400 hover:text-cyan-300 transition"
                      title="Discuss this note with NEXUS"
                    >
                      <Bot size={12} />
                      <span>Ask AI</span>
                    </button>
                  </div>

                  <div className="flex items-center gap-1">
                    <button
                      onClick={() => handleOpenEditModal(note)}
                      className="p-1 rounded-lg text-slate-400 hover:text-white transition"
                    >
                      <Edit3 size={13} />
                    </button>
                    <button
                      onClick={() => handleDeleteNote(note._id)}
                      className="p-1 rounded-lg text-slate-400 hover:text-rose-400 transition"
                    >
                      <Trash2 size={13} />
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Note Create/Edit Modal */}
      <Modal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        title={editingNoteId ? 'Edit Note' : 'Create Knowledge Note'}
      >
        <form onSubmit={handleSaveNote} className="space-y-4 text-xs">
          <div>
            <label className="block text-slate-300 font-medium mb-1">Title *</label>
            <input
              type="text"
              required
              value={formData.title}
              onChange={(e) => setFormData({ ...formData, title: e.target.value })}
              placeholder="e.g. MongoDB Aggregation Pipeline"
              className="w-full px-3 py-2 rounded-xl bg-slate-900 border border-white/10 text-slate-100 focus:outline-none focus:border-amber-500"
            />
          </div>

          <div>
            <label className="block text-slate-300 font-medium mb-1">Content (Markdown supported) *</label>
            <textarea
              rows={6}
              required
              value={formData.content}
              onChange={(e) => setFormData({ ...formData, content: e.target.value })}
              placeholder="Write your note, code snippets, or definitions..."
              className="w-full px-3 py-2 rounded-xl bg-slate-900 border border-white/10 text-slate-100 focus:outline-none focus:border-amber-500 font-mono text-xs"
            />
          </div>

          <div>
            <label className="block text-slate-300 font-medium mb-1">Tags (comma separated)</label>
            <input
              type="text"
              value={formData.tags}
              onChange={(e) => setFormData({ ...formData, tags: e.target.value })}
              placeholder="database, mongodb, backend"
              className="w-full px-3 py-2 rounded-xl bg-slate-900 border border-white/10 text-slate-100 focus:outline-none focus:border-amber-500"
            />
          </div>

          <div className="flex items-center gap-2">
            <input
              type="checkbox"
              id="pinNote"
              checked={formData.pinned}
              onChange={(e) => setFormData({ ...formData, pinned: e.target.checked })}
              className="rounded bg-slate-900 border-white/20 text-amber-500 focus:ring-0"
            />
            <label htmlFor="pinNote" className="text-slate-300">Pin note to top of workspace</label>
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
              className="px-4 py-2 rounded-xl bg-amber-500 hover:bg-amber-400 text-slate-950 font-semibold"
            >
              {editingNoteId ? 'Save Changes' : 'Create Note'}
            </button>
          </div>
        </form>
      </Modal>
    </div>
  );
};

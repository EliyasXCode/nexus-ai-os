import api from './api.js';

export const notesService = {
  async getNotes(params = {}) {
    const res = await api.get('/notes', { params });
    return res.data.notes;
  },

  async createNote(noteData) {
    const res = await api.post('/notes', noteData);
    return res.data.note;
  },

  async updateNote(id, updateData) {
    const res = await api.patch(`/notes/${id}`, updateData);
    return res.data.note;
  },

  async deleteNote(id) {
    const res = await api.delete(`/notes/${id}`);
    return res.data;
  },

  async summarizeNote(id) {
    const res = await api.post(`/notes/${id}/summarize`);
    return res.data.summary;
  },
};

import api from './api.js';

export const memoryService = {
  async getMemories(params = {}) {
    const res = await api.get('/memory', { params });
    return res.data.memories;
  },

  async createMemory(memoryData) {
    const res = await api.post('/memory', memoryData);
    return res.data.memory;
  },

  async updateMemory(id, updateData) {
    const res = await api.patch(`/memory/${id}`, updateData);
    return res.data.memory;
  },

  async deleteMemory(id) {
    const res = await api.delete(`/memory/${id}`);
    return res.data;
  },

  async clearAllMemory() {
    const res = await api.post('/memory/clear-all', { confirm: true });
    return res.data;
  },
};

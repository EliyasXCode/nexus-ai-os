import api from './api.js';

export const tasksService = {
  async getTasks(params = {}) {
    const res = await api.get('/tasks', { params });
    return res.data.tasks;
  },

  async getTaskStats() {
    const res = await api.get('/tasks/stats');
    return res.data.stats;
  },

  async createTask(taskData) {
    const res = await api.post('/tasks', taskData);
    return res.data.task;
  },

  async updateTask(id, updateData) {
    const res = await api.patch(`/tasks/${id}`, updateData);
    return res.data.task;
  },

  async deleteTask(id) {
    const res = await api.delete(`/tasks/${id}`);
    return res.data;
  },
};

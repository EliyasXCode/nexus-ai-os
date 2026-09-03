import api from './api.js';

export const authService = {
  async register(name, email, password) {
    const res = await api.post('/auth/register', { name, email, password });
    if (res.data.token) {
      localStorage.setItem('nexus_token', res.data.token);
    }
    return res.data;
  },

  async login(email, password) {
    const res = await api.post('/auth/login', { email, password });
    if (res.data.token) {
      localStorage.setItem('nexus_token', res.data.token);
    }
    return res.data;
  },

  async logout() {
    try {
      await api.post('/auth/logout');
    } finally {
      localStorage.removeItem('nexus_token');
    }
  },

  async getMe() {
    const res = await api.get('/auth/me');
    return res.data.user;
  },

  async updateSettings(settings) {
    const res = await api.patch('/auth/settings', settings);
    return res.data.settings;
  },
};

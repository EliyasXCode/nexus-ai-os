import api from './api.js';

export const chatService = {
  async sendMessage({ message, conversationId, selectedAgent, image }) {
    const res = await api.post('/chat', {
      message,
      conversationId,
      selectedAgent,
      image,
    });
    return res.data;
  },

  async getConversations() {
    const res = await api.get('/conversations');
    return res.data.conversations;
  },

  async getConversationById(id) {
    const res = await api.get(`/conversations/${id}`);
    return res.data.conversation;
  },

  async updateConversationTitle(id, title) {
    const res = await api.patch(`/conversations/${id}`, { title });
    return res.data.conversation;
  },

  async deleteConversation(id) {
    const res = await api.delete(`/conversations/${id}`);
    return res.data;
  },
};

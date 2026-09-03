import api from './api.js';

export const agentsService = {
  async getAgents() {
    const res = await api.get('/agents');
    return res.data.agents;
  },

  async getAgentRuns() {
    const res = await api.get('/agents/runs');
    return res.data.runs;
  },

  async analyzeCode({ code, language, action }) {
    const res = await api.post('/agents/analyze-code', { code, language, action });
    return res.data.output;
  },

  async studyAssist({ topic, mode }) {
    const res = await api.post('/agents/study-assist', { topic, mode });
    return res.data.output;
  },
};

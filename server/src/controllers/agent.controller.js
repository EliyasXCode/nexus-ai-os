import { getAvailableAgents } from '../agents/agent.orchestrator.js';
import { AgentRun } from '../models/AgentRun.js';
import { geminiService } from '../services/gemini.service.js';

export const getAgents = (req, res) => {
  const agents = getAvailableAgents();
  return res.status(200).json({
    success: true,
    agents,
  });
};

export const getAgentRuns = async (req, res, next) => {
  try {
    const runs = await AgentRun.find({ user: req.user._id })
      .sort({ createdAt: -1 })
      .limit(20);

    return res.status(200).json({
      success: true,
      count: runs.length,
      runs,
    });
  } catch (error) {
    next(error);
  }
};

export const analyzeCode = async (req, res, next) => {
  try {
    const { code, language, action } = req.body;

    if (!code || code.trim() === '') {
      return res.status(400).json({
        success: false,
        message: 'Code snippet is required.',
      });
    }

    const actionPrompts = {
      explain: `Explain this ${language || 'code'} clearly for a developer. Break down how it works step-by-step:`,
      bugs: `Inspect this ${language || 'code'} for potential bugs, logical errors, edge cases, and security vulnerabilities. Explain the issues and provide the fixed code:`,
      improve: `Refactor and improve this ${language || 'code'} according to industry best practices, performance, and readability:`,
      comments: `Add comprehensive, professional comments and JSDoc/docstrings to this ${language || 'code'}:`,
      optimize: `Analyze the time and space complexity of this ${language || 'code'} and provide an optimized implementation:`,
      tests: `Write comprehensive unit tests for this ${language || 'code'} using a standard testing framework:`,
    };

    const promptAction = actionPrompts[action] || actionPrompts.explain;
    const prompt = `${promptAction}\n\n\`\`\`${language || ''}\n${code}\n\`\`\``;

    const result = await geminiService.generateContent({
      systemInstruction: 'You are the NEXUS Coding Specialist. Provide accurate, production-ready code and concise, expert explanations.',
      contents: [{ role: 'user', parts: [{ text: prompt }] }],
      temperature: 0.2,
    });

    const output = result.text || (result.candidates?.[0]?.content?.parts?.[0]?.text) || 'Analysis complete.';

    return res.status(200).json({
      success: true,
      output,
    });
  } catch (error) {
    next(error);
  }
};

export const studyAssist = async (req, res, next) => {
  try {
    const { topic, mode } = req.body;

    if (!topic || topic.trim() === '') {
      return res.status(400).json({
        success: false,
        message: 'Study topic is required.',
      });
    }

    const modePrompts = {
      simple: `Explain "${topic}" in simple, friendly terms with a relatable real-world analogy. Avoid overwhelming jargon, then provide a short 3-line takeaway.`,
      interview: `Generate 5 realistic technical interview questions on "${topic}" (ranging from fundamentals to tricky interview edge-cases) with model answers and evaluation points.`,
      quiz: `Create an interactive 4-question multiple-choice quiz on "${topic}". Include 4 options (A, B, C, D) for each question, and provide the correct answer with explanations at the bottom.`,
      notes: `Create structured revision cheat-sheet notes for "${topic}" including core definitions, key syntax/examples, and common mistakes to avoid.`,
    };

    const promptText = modePrompts[mode] || modePrompts.simple;

    const result = await geminiService.generateContent({
      systemInstruction: 'You are the NEXUS Study & Interview Specialist. Help students and fresher developers understand concepts clearly and ace interviews.',
      contents: [{ role: 'user', parts: [{ text: promptText }] }],
      temperature: 0.4,
    });

    const output = result.text || (result.candidates?.[0]?.content?.parts?.[0]?.text) || 'Study guide generated.';

    return res.status(200).json({
      success: true,
      output,
    });
  } catch (error) {
    next(error);
  }
};

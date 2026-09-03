import { z } from 'zod';
import { geminiService } from '../services/gemini.service.js';

// Schema for supervisor classification
const classificationSchema = z.object({
  agent: z.enum(['GENERAL', 'CODING', 'PLANNER', 'STUDY', 'TASK', 'NOTES']),
  reason: z.string().default(''),
  confidence: z.number().default(0.9),
});

export const classifyUserIntent = async (userMessage) => {
  const prompt = `You are the Supervisor Agent of NEXUS AI OS.
Your job is to analyze the user's message and determine which specialist agent should handle it.

Available Specialist Agents:
- TASK: Creating, listing, updating, completing, or managing to-do items, tasks, deadlines, reminders.
- NOTES: Taking, creating, organizing, searching, or saving notes or documents.
- CODING: Writing code, debugging, explaining programming concepts, refactoring, SQL/APIs/MERN stack/frameworks.
- PLANNER: Roadmaps, study schedules, timelines, step-by-step project plans, daily plans.
- STUDY: Student concepts, mock interview questions, quizzes, technology comparisons, exam revision.
- GENERAL: General questions, greetings, chit-chat, personal preferences, memories, or unspecified queries.

Respond strictly in valid JSON format:
{
  "agent": "TASK" | "NOTES" | "CODING" | "PLANNER" | "STUDY" | "GENERAL",
  "reason": "short explanation",
  "confidence": 0.95
}

User Message: "${userMessage.replace(/"/g, '\\"')}"`;

  try {
    const response = await geminiService.generateContent({
      systemInstruction: 'You are a precise classifier. Return only valid JSON adhering to the requested schema.',
      contents: [{ role: 'user', parts: [{ text: prompt }] }],
      temperature: 0.1,
    });

    const responseText = response.text || (response.candidates?.[0]?.content?.parts?.[0]?.text) || '{}';

    // Parse JSON
    // Extract JSON block if wrapped in markdown ```json ... ```
    let cleanJson = responseText.trim();
    if (cleanJson.startsWith('```')) {
      cleanJson = cleanJson.replace(/^```json\s*/i, '').replace(/```$/i, '').trim();
    }

    const parsed = JSON.parse(cleanJson);
    const validated = classificationSchema.safeParse(parsed);

    if (validated.success) {
      return validated.data;
    } else {
      console.warn('[Supervisor Agent] Zod validation fallback to GENERAL:', validated.error.message);
      return { agent: 'GENERAL', reason: 'Fallback classification', confidence: 0.7 };
    }
  } catch (error) {
    console.warn('[Supervisor Agent Error] Fallback to GENERAL:', error.message);
    // Safe heuristic fallback
    const lower = userMessage.toLowerCase();
    if (lower.includes('task') || lower.includes('todo') || lower.includes('remind') || lower.includes('deadline')) {
      return { agent: 'TASK', reason: 'Keyword heuristic', confidence: 0.8 };
    }
    if (lower.includes('note') || lower.includes('save this note')) {
      return { agent: 'NOTES', reason: 'Keyword heuristic', confidence: 0.8 };
    }
    if (lower.includes('code') || lower.includes('function') || lower.includes('bug') || lower.includes('api') || lower.includes('react') || lower.includes('express')) {
      return { agent: 'CODING', reason: 'Keyword heuristic', confidence: 0.8 };
    }
    if (lower.includes('plan') || lower.includes('schedule') || lower.includes('roadmap')) {
      return { agent: 'PLANNER', reason: 'Keyword heuristic', confidence: 0.8 };
    }
    if (lower.includes('interview') || lower.includes('quiz') || lower.includes('explain simply') || lower.includes('study')) {
      return { agent: 'STUDY', reason: 'Keyword heuristic', confidence: 0.8 };
    }
    return { agent: 'GENERAL', reason: 'Heuristic fallback', confidence: 0.6 };
  }
};

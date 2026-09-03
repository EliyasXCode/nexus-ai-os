import { z } from 'zod';
import { Memory } from '../models/Memory.js';

export const utilityTools = [
  {
    name: 'calculator',
    description: 'Safely evaluate a mathematical calculation (e.g. "24 * 7", "(1500 / 12) + 40"). Never uses unsafe eval.',
    parameters: {
      type: 'object',
      properties: {
        expression: {
          type: 'string',
          description: 'The math expression to evaluate containing numbers and standard math operators (+, -, *, /, %, ^)',
        },
      },
      required: ['expression'],
    },
    validationSchema: z.object({
      expression: z.string().min(1),
    }),
    execute: async (args) => {
      const cleanExpr = args.expression.replace(/\s+/g, '');
      // Only allow numbers and valid arithmetic symbols
      if (!/^[0-9+\-*/().%^e]+$/i.test(cleanExpr)) {
        return {
          success: false,
          error: 'Invalid arithmetic expression. Only numeric operations are permitted.',
        };
      }

      try {
        // Safe evaluation via Function with restricted math context
        // Replace ^ with **
        const sanitized = cleanExpr.replace(/\^/g, '**');
        // Check for disallowed patterns
        if (sanitized.includes(';') || sanitized.includes('import') || sanitized.includes('require')) {
          throw new Error('Unsafe syntax detected');
        }

        const compute = new Function(`return (${sanitized});`);
        const result = compute();

        if (typeof result !== 'number' || isNaN(result) || !isFinite(result)) {
          return { success: false, error: 'Expression resulted in invalid number or division by zero' };
        }

        return {
          success: true,
          expression: args.expression,
          result,
        };
      } catch (err) {
        return {
          success: false,
          error: `Calculation error: ${err.message}`,
        };
      }
    },
  },

  {
    name: 'getCurrentDateTime',
    description: 'Returns the current real-world date, time, and ISO timestamp.',
    parameters: {
      type: 'object',
      properties: {},
    },
    validationSchema: z.object({}),
    execute: async () => {
      const now = new Date();
      return {
        iso: now.toISOString(),
        formattedDate: now.toLocaleDateString('en-US', {
          weekday: 'long',
          year: 'numeric',
          month: 'long',
          day: 'numeric',
        }),
        formattedTime: now.toLocaleTimeString('en-US', {
          hour: '2-digit',
          minute: '2-digit',
          second: '2-digit',
          hour12: true,
        }),
        timezone: Intl.DateTimeFormat().resolvedOptions().timeZone,
      };
    },
  },

  {
    name: 'saveMemory',
    description: 'Explicitly remember a fact, user preference, project detail, or learning status into the user long-term AI memory.',
    parameters: {
      type: 'object',
      properties: {
        key: {
          type: 'string',
          description: 'A brief identifier or summary key (e.g. "learning_focus", "framework_preference", "user_role")',
        },
        value: {
          type: 'string',
          description: 'The detail to remember (e.g. "Currently learning MERN stack and preparing for fresher developer interviews")',
        },
        category: {
          type: 'string',
          enum: ['preference', 'project', 'learning', 'general'],
          description: 'Category of memory item',
        },
      },
      required: ['key', 'value'],
    },
    validationSchema: z.object({
      key: z.string().min(1).max(100),
      value: z.string().min(1),
      category: z.enum(['preference', 'project', 'learning', 'general']).optional().default('general'),
    }),
    execute: async (args, context) => {
      const memory = await Memory.findOneAndUpdate(
        { user: context.userId, key: args.key },
        {
          value: args.value,
          category: args.category || 'general',
        },
        { upsert: true, new: true }
      );

      return {
        success: true,
        message: `Saved to memory: [${memory.category}] ${memory.key} => "${memory.value}"`,
        memoryItem: {
          id: memory._id,
          key: memory.key,
          value: memory.value,
          category: memory.category,
        },
      };
    },
  },

  {
    name: 'searchMemory',
    description: 'Search the user long-term AI memory items to retrieve remembered context, preferences, or project details.',
    parameters: {
      type: 'object',
      properties: {
        query: {
          type: 'string',
          description: 'Keyword to search within memory keys and values',
        },
      },
    },
    validationSchema: z.object({
      query: z.string().optional(),
    }),
    execute: async (args, context) => {
      const queryObj = { user: context.userId };
      if (args.query) {
        const regex = new RegExp(args.query, 'i');
        queryObj.$or = [{ key: regex }, { value: regex }, { category: regex }];
      }

      const memories = await Memory.find(queryObj).limit(10);
      return {
        success: true,
        count: memories.length,
        memories: memories.map((m) => ({
          key: m.key,
          value: m.value,
          category: m.category,
        })),
      };
    },
  },
];

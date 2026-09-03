import { z } from 'zod';
import { Task } from '../models/Task.js';

export const taskTools = [
  {
    name: 'createTask',
    description: 'Create a new task for the user with title, optional description, priority, and due date.',
    parameters: {
      type: 'object',
      properties: {
        title: {
          type: 'string',
          description: 'The title or summary of the task (e.g. "Practice React hooks tomorrow")',
        },
        description: {
          type: 'string',
          description: 'Detailed instructions or notes for the task',
        },
        priority: {
          type: 'string',
          enum: ['low', 'medium', 'high'],
          description: 'Priority level of the task (default: medium)',
        },
        dueDate: {
          type: 'string',
          description: 'ISO format date string or friendly date string (e.g. "2025-05-15")',
        },
      },
      required: ['title'],
    },
    validationSchema: z.object({
      title: z.string().min(1, 'Title is required').max(200),
      description: z.string().optional().default(''),
      priority: z.enum(['low', 'medium', 'high']).optional().default('medium'),
      dueDate: z.string().optional().nullable(),
    }),
    execute: async (args, context) => {
      let parsedDate = null;
      if (args.dueDate) {
        const d = new Date(args.dueDate);
        if (!isNaN(d.getTime())) {
          parsedDate = d;
        }
      }

      const task = await Task.create({
        user: context.userId,
        title: args.title,
        description: args.description || '',
        priority: args.priority || 'medium',
        dueDate: parsedDate,
        createdBy: 'ai',
      });

      return {
        success: true,
        message: `Task "${task.title}" has been successfully created with ${task.priority} priority.`,
        task: {
          id: task._id,
          title: task.title,
          priority: task.priority,
          status: task.status,
          dueDate: task.dueDate,
          createdBy: task.createdBy,
        },
      };
    },
  },

  {
    name: 'getTasks',
    description: 'Retrieve the current list of tasks for the user with optional filtering by status or priority.',
    parameters: {
      type: 'object',
      properties: {
        status: {
          type: 'string',
          enum: ['all', 'pending', 'in_progress', 'completed'],
          description: 'Filter tasks by their status',
        },
        priority: {
          type: 'string',
          enum: ['all', 'low', 'medium', 'high'],
          description: 'Filter tasks by priority level',
        },
        limit: {
          type: 'number',
          description: 'Maximum number of tasks to return (default: 10)',
        },
      },
    },
    validationSchema: z.object({
      status: z.enum(['all', 'pending', 'in_progress', 'completed']).optional().default('all'),
      priority: z.enum(['all', 'low', 'medium', 'high']).optional().default('all'),
      limit: z.number().optional().default(10),
    }),
    execute: async (args, context) => {
      const query = { user: context.userId };
      if (args.status && args.status !== 'all') query.status = args.status;
      if (args.priority && args.priority !== 'all') query.priority = args.priority;

      const tasks = await Task.find(query)
        .sort({ createdAt: -1 })
        .limit(args.limit || 10);

      return {
        success: true,
        count: tasks.length,
        tasks: tasks.map((t) => ({
          id: t._id,
          title: t.title,
          status: t.status,
          priority: t.priority,
          dueDate: t.dueDate,
          createdBy: t.createdBy,
        })),
      };
    },
  },

  {
    name: 'updateTask',
    description: 'Update an existing task details like title, priority, status, or description.',
    parameters: {
      type: 'object',
      properties: {
        taskId: { type: 'string', description: 'The MongoDB ObjectId of the task' },
        title: { type: 'string', description: 'Updated title' },
        status: {
          type: 'string',
          enum: ['pending', 'in_progress', 'completed'],
          description: 'Updated status',
        },
        priority: {
          type: 'string',
          enum: ['low', 'medium', 'high'],
          description: 'Updated priority',
        },
      },
      required: ['taskId'],
    },
    validationSchema: z.object({
      taskId: z.string(),
      title: z.string().optional(),
      status: z.enum(['pending', 'in_progress', 'completed']).optional(),
      priority: z.enum(['low', 'medium', 'high']).optional(),
    }),
    execute: async (args, context) => {
      const updateData = {};
      if (args.title) updateData.title = args.title;
      if (args.status) updateData.status = args.status;
      if (args.priority) updateData.priority = args.priority;

      const task = await Task.findOneAndUpdate(
        { _id: args.taskId, user: context.userId },
        updateData,
        { new: true }
      );

      if (!task) {
        return { success: false, message: 'Task not found or unauthorized' };
      }

      return {
        success: true,
        message: `Task "${task.title}" updated successfully.`,
        task,
      };
    },
  },

  {
    name: 'completeTask',
    description: 'Mark a task as completed by task ID or title search.',
    parameters: {
      type: 'object',
      properties: {
        taskId: { type: 'string', description: 'The MongoDB ObjectId of the task to complete' },
        taskTitle: { type: 'string', description: 'Or search for a task by title to complete' },
      },
    },
    validationSchema: z.object({
      taskId: z.string().optional(),
      taskTitle: z.string().optional(),
    }),
    execute: async (args, context) => {
      let query = { user: context.userId };
      if (args.taskId) {
        query._id = args.taskId;
      } else if (args.taskTitle) {
        query.title = { $regex: args.taskTitle, $options: 'i' };
      } else {
        return { success: false, message: 'Please provide either taskId or taskTitle to complete.' };
      }

      const task = await Task.findOneAndUpdate(
        query,
        { status: 'completed' },
        { new: true }
      );

      if (!task) {
        return { success: false, message: 'No matching task found to mark as completed.' };
      }

      return {
        success: true,
        message: `Task "${task.title}" marked as completed!`,
        task,
      };
    },
  },

  {
    name: 'deleteTask',
    description: 'Delete a task from the task manager.',
    parameters: {
      type: 'object',
      properties: {
        taskId: { type: 'string', description: 'The MongoDB ObjectId of the task to delete' },
      },
      required: ['taskId'],
    },
    validationSchema: z.object({
      taskId: z.string(),
    }),
    execute: async (args, context) => {
      const task = await Task.findOneAndDelete({
        _id: args.taskId,
        user: context.userId,
      });

      if (!task) {
        return { success: false, message: 'Task not found or unauthorized.' };
      }

      return {
        success: true,
        message: `Task "${task.title}" was deleted.`,
      };
    },
  },
];

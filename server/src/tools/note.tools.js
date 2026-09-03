import { z } from 'zod';
import { Note } from '../models/Note.js';

export const noteTools = [
  {
    name: 'createNote',
    description: 'Create and save a new note or knowledge snippet in the user notes workspace.',
    parameters: {
      type: 'object',
      properties: {
        title: {
          type: 'string',
          description: 'Title of the note (e.g. "MongoDB Indexing Concepts")',
        },
        content: {
          type: 'string',
          description: 'Markdown content or body text of the note',
        },
        tags: {
          type: 'array',
          items: { type: 'string' },
          description: 'Optional category tags, e.g. ["database", "mongodb"]',
        },
      },
      required: ['title', 'content'],
    },
    validationSchema: z.object({
      title: z.string().min(1, 'Title is required').max(200),
      content: z.string().min(1, 'Content is required'),
      tags: z.array(z.string()).optional().default([]),
    }),
    execute: async (args, context) => {
      const note = await Note.create({
        user: context.userId,
        title: args.title,
        content: args.content,
        tags: args.tags || [],
        createdBy: 'ai',
      });

      return {
        success: true,
        message: `Note "${note.title}" saved successfully.`,
        note: {
          id: note._id,
          title: note.title,
          tags: note.tags,
          pinned: note.pinned,
          createdAt: note.createdAt,
        },
      };
    },
  },

  {
    name: 'getNotes',
    description: 'Fetch the recent saved notes belonging to the user.',
    parameters: {
      type: 'object',
      properties: {
        limit: { type: 'number', description: 'Maximum notes to fetch (default: 10)' },
      },
    },
    validationSchema: z.object({
      limit: z.number().optional().default(10),
    }),
    execute: async (args, context) => {
      const notes = await Note.find({ user: context.userId })
        .sort({ pinned: -1, createdAt: -1 })
        .limit(args.limit || 10);

      return {
        success: true,
        count: notes.length,
        notes: notes.map((n) => ({
          id: n._id,
          title: n.title,
          contentPreview: n.content.substring(0, 150),
          tags: n.tags,
          pinned: n.pinned,
        })),
      };
    },
  },

  {
    name: 'searchNotes',
    description: 'Search user notes by title, keyword, content, or tag.',
    parameters: {
      type: 'object',
      properties: {
        query: {
          type: 'string',
          description: 'The keyword to search for within notes',
        },
      },
      required: ['query'],
    },
    validationSchema: z.object({
      query: z.string().min(1),
    }),
    execute: async (args, context) => {
      const regex = new RegExp(args.query, 'i');
      const notes = await Note.find({
        user: context.userId,
        $or: [{ title: regex }, { content: regex }, { tags: regex }],
      }).limit(5);

      return {
        success: true,
        count: notes.length,
        notes: notes.map((n) => ({
          id: n._id,
          title: n.title,
          content: n.content,
          tags: n.tags,
        })),
      };
    },
  },

  {
    name: 'updateNote',
    description: 'Update the title, content, or pinned state of an existing note.',
    parameters: {
      type: 'object',
      properties: {
        noteId: { type: 'string', description: 'The MongoDB ObjectId of the note' },
        title: { type: 'string', description: 'Updated title' },
        content: { type: 'string', description: 'Updated content' },
        pinned: { type: 'boolean', description: 'Whether to pin note to top' },
      },
      required: ['noteId'],
    },
    validationSchema: z.object({
      noteId: z.string(),
      title: z.string().optional(),
      content: z.string().optional(),
      pinned: z.boolean().optional(),
    }),
    execute: async (args, context) => {
      const updateData = {};
      if (args.title !== undefined) updateData.title = args.title;
      if (args.content !== undefined) updateData.content = args.content;
      if (args.pinned !== undefined) updateData.pinned = args.pinned;

      const note = await Note.findOneAndUpdate(
        { _id: args.noteId, user: context.userId },
        updateData,
        { new: true }
      );

      if (!note) {
        return { success: false, message: 'Note not found or unauthorized' };
      }

      return {
        success: true,
        message: `Note "${note.title}" updated successfully.`,
        note,
      };
    },
  },

  {
    name: 'deleteNote',
    description: 'Delete a note by its noteId.',
    parameters: {
      type: 'object',
      properties: {
        noteId: { type: 'string', description: 'The MongoDB ObjectId of the note to delete' },
      },
      required: ['noteId'],
    },
    validationSchema: z.object({
      noteId: z.string(),
    }),
    execute: async (args, context) => {
      const note = await Note.findOneAndDelete({
        _id: args.noteId,
        user: context.userId,
      });

      if (!note) {
        return { success: false, message: 'Note not found or unauthorized' };
      }

      return {
        success: true,
        message: `Note "${note.title}" was deleted.`,
      };
    },
  },
];

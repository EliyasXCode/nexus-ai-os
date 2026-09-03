import { Note } from '../models/Note.js';
import { geminiService } from '../services/gemini.service.js';

export const getNotes = async (req, res, next) => {
  try {
    const { search, tag } = req.query;
    const query = { user: req.user._id };

    if (tag) {
      query.tags = tag;
    }

    if (search) {
      const regex = new RegExp(search, 'i');
      query.$or = [{ title: regex }, { content: regex }, { tags: regex }];
    }

    const notes = await Note.find(query).sort({ pinned: -1, createdAt: -1 });

    return res.status(200).json({
      success: true,
      count: notes.length,
      notes,
    });
  } catch (error) {
    next(error);
  }
};

export const createNote = async (req, res, next) => {
  try {
    const { title, content, tags, pinned } = req.body;

    if (!title || !content) {
      return res.status(400).json({
        success: false,
        message: 'Title and content are required for a note.',
      });
    }

    const note = await Note.create({
      user: req.user._id,
      title,
      content,
      tags: tags || [],
      pinned: pinned || false,
      createdBy: 'user',
    });

    return res.status(201).json({
      success: true,
      note,
    });
  } catch (error) {
    next(error);
  }
};

export const updateNote = async (req, res, next) => {
  try {
    const note = await Note.findOneAndUpdate(
      { _id: req.params.id, user: req.user._id },
      req.body,
      { new: true, runValidators: true }
    );

    if (!note) {
      return res.status(404).json({
        success: false,
        message: 'Note not found or unauthorized',
      });
    }

    return res.status(200).json({
      success: true,
      note,
    });
  } catch (error) {
    next(error);
  }
};

export const deleteNote = async (req, res, next) => {
  try {
    const note = await Note.findOneAndDelete({
      _id: req.params.id,
      user: req.user._id,
    });

    if (!note) {
      return res.status(404).json({
        success: false,
        message: 'Note not found',
      });
    }

    return res.status(200).json({
      success: true,
      message: 'Note deleted successfully',
    });
  } catch (error) {
    next(error);
  }
};

export const summarizeNote = async (req, res, next) => {
  try {
    const note = await Note.findOne({ _id: req.params.id, user: req.user._id });
    if (!note) {
      return res.status(404).json({ success: false, message: 'Note not found' });
    }

    const prompt = `Please provide a concise, high-impact bulleted summary and 3 key takeaways for this note:
Title: ${note.title}
Content: ${note.content}`;

    const aiRes = await geminiService.generateContent({
      systemInstruction: 'You are the NEXUS Knowledge summarizer. Produce crisp, punchy bullet points.',
      contents: [{ role: 'user', parts: [{ text: prompt }] }],
      temperature: 0.3,
    });

    const summaryText = aiRes.text || (aiRes.candidates?.[0]?.content?.parts?.[0]?.text) || 'Summary unavailable.';

    return res.status(200).json({
      success: true,
      summary: summaryText,
    });
  } catch (error) {
    next(error);
  }
};

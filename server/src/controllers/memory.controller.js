import { Memory } from '../models/Memory.js';

export const getMemories = async (req, res, next) => {
  try {
    const { category, search } = req.query;
    const query = { user: req.user._id };

    if (category && category !== 'all') {
      query.category = category;
    }

    if (search) {
      const regex = new RegExp(search, 'i');
      query.$or = [{ key: regex }, { value: regex }];
    }

    const memories = await Memory.find(query).sort({ updatedAt: -1 });

    return res.status(200).json({
      success: true,
      count: memories.length,
      memories,
    });
  } catch (error) {
    next(error);
  }
};

export const createMemory = async (req, res, next) => {
  try {
    const { key, value, category } = req.body;

    if (!key || !value) {
      return res.status(400).json({
        success: false,
        message: 'Both key and value are required for a memory item.',
      });
    }

    const memory = await Memory.findOneAndUpdate(
      { user: req.user._id, key: key.trim() },
      { value: value.trim(), category: category || 'general' },
      { upsert: true, new: true }
    );

    return res.status(201).json({
      success: true,
      memory,
    });
  } catch (error) {
    next(error);
  }
};

export const updateMemory = async (req, res, next) => {
  try {
    const memory = await Memory.findOneAndUpdate(
      { _id: req.params.id, user: req.user._id },
      req.body,
      { new: true }
    );

    if (!memory) {
      return res.status(404).json({
        success: false,
        message: 'Memory item not found',
      });
    }

    return res.status(200).json({
      success: true,
      memory,
    });
  } catch (error) {
    next(error);
  }
};

export const deleteMemory = async (req, res, next) => {
  try {
    const memory = await Memory.findOneAndDelete({
      _id: req.params.id,
      user: req.user._id,
    });

    if (!memory) {
      return res.status(404).json({
        success: false,
        message: 'Memory item not found',
      });
    }

    return res.status(200).json({
      success: true,
      message: 'Memory item removed successfully',
    });
  } catch (error) {
    next(error);
  }
};

export const clearAllMemory = async (req, res, next) => {
  try {
    const { confirm } = req.body;
    if (confirm !== true) {
      return res.status(400).json({
        success: false,
        message: 'Confirmation flag is required to delete all memory records.',
      });
    }

    const result = await Memory.deleteMany({ user: req.user._id });

    return res.status(200).json({
      success: true,
      message: `Cleared ${result.deletedCount} memory records successfully.`,
    });
  } catch (error) {
    next(error);
  }
};

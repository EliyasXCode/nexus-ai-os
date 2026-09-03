import { Task } from '../models/Task.js';

export const getTasks = async (req, res, next) => {
  try {
    const { status, priority, search } = req.query;
    const query = { user: req.user._id };

    if (status && status !== 'all') {
      if (status === 'today') {
        const startOfDay = new Date();
        startOfDay.setHours(0, 0, 0, 0);
        const endOfDay = new Date();
        endOfDay.setHours(23, 59, 59, 999);
        query.dueDate = { $gte: startOfDay, $lte: endOfDay };
      } else if (status === 'upcoming') {
        query.dueDate = { $gt: new Date() };
        query.status = { $ne: 'completed' };
      } else {
        query.status = status;
      }
    }

    if (priority && priority !== 'all') {
      query.priority = priority;
    }

    if (search) {
      query.title = { $regex: search, $options: 'i' };
    }

    const tasks = await Task.find(query).sort({ createdAt: -1 });

    return res.status(200).json({
      success: true,
      count: tasks.length,
      tasks,
    });
  } catch (error) {
    next(error);
  }
};

export const createTask = async (req, res, next) => {
  try {
    const { title, description, priority, dueDate } = req.body;

    if (!title || title.trim() === '') {
      return res.status(400).json({
        success: false,
        message: 'Task title is required.',
      });
    }

    const task = await Task.create({
      user: req.user._id,
      title,
      description: description || '',
      priority: priority || 'medium',
      dueDate: dueDate ? new Date(dueDate) : null,
      createdBy: 'user',
    });

    return res.status(201).json({
      success: true,
      task,
    });
  } catch (error) {
    next(error);
  }
};

export const updateTask = async (req, res, next) => {
  try {
    const task = await Task.findOneAndUpdate(
      { _id: req.params.id, user: req.user._id },
      req.body,
      { new: true, runValidators: true }
    );

    if (!task) {
      return res.status(404).json({
        success: false,
        message: 'Task not found or unauthorized',
      });
    }

    return res.status(200).json({
      success: true,
      task,
    });
  } catch (error) {
    next(error);
  }
};

export const deleteTask = async (req, res, next) => {
  try {
    const task = await Task.findOneAndDelete({
      _id: req.params.id,
      user: req.user._id,
    });

    if (!task) {
      return res.status(404).json({
        success: false,
        message: 'Task not found',
      });
    }

    return res.status(200).json({
      success: true,
      message: 'Task removed successfully',
    });
  } catch (error) {
    next(error);
  }
};

export const getTaskStats = async (req, res, next) => {
  try {
    const total = await Task.countDocuments({ user: req.user._id });
    const completed = await Task.countDocuments({ user: req.user._id, status: 'completed' });
    const pending = await Task.countDocuments({ user: req.user._id, status: 'pending' });
    const aiCreated = await Task.countDocuments({ user: req.user._id, createdBy: 'ai' });

    return res.status(200).json({
      success: true,
      stats: { total, completed, pending, aiCreated },
    });
  } catch (error) {
    next(error);
  }
};

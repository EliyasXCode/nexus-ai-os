import jwt from 'jsonwebtoken';
import { z } from 'zod';
import { User } from '../models/User.js';

const registerSchema = z.object({
  name: z.string().min(2, 'Name must be at least 2 characters').max(60),
  email: z.string().email('Invalid email address'),
  password: z.string().min(6, 'Password must be at least 6 characters'),
});

const loginSchema = z.object({
  email: z.string().email('Invalid email address'),
  password: z.string().min(1, 'Password is required'),
});

// Helper to generate JWT token and cookie
const sendTokenResponse = (user, statusCode, res) => {
  const token = jwt.sign(
    { userId: user._id, email: user.email },
    process.env.JWT_SECRET || 'nexus_fallback_secret',
    { expiresIn: '7d' }
  );

  const cookieOptions = {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: process.env.NODE_ENV === 'production' ? 'none' : 'lax',
    maxAge: 7 * 24 * 60 * 60 * 1000, // 7 days
  };

  res.cookie('jwt', token, cookieOptions);

  return res.status(statusCode).json({
    success: true,
    token, // Also return in body for Authorization header clients
    user: {
      id: user._id,
      name: user.name,
      email: user.email,
      avatar: user.avatar,
      settings: user.settings,
      createdAt: user.createdAt,
    },
  });
};

export const register = async (req, res, next) => {
  try {
    const parseResult = registerSchema.safeParse(req.body);
    if (!parseResult.success) {
      return res.status(400).json({
        success: false,
        message: parseResult.error.errors.map((e) => e.message).join(', '),
      });
    }

    const { name, email, password } = parseResult.data;

    const existing = await User.findOne({ email: email.toLowerCase() });
    if (existing) {
      return res.status(400).json({
        success: false,
        message: 'An account with this email address already exists.',
      });
    }

    const user = await User.create({
      name,
      email: email.toLowerCase(),
      password,
    });

    return sendTokenResponse(user, 201, res);
  } catch (error) {
    next(error);
  }
};

export const login = async (req, res, next) => {
  try {
    const parseResult = loginSchema.safeParse(req.body);
    if (!parseResult.success) {
      return res.status(400).json({
        success: false,
        message: parseResult.error.errors.map((e) => e.message).join(', '),
      });
    }

    const { email, password } = parseResult.data;

    const user = await User.findOne({ email: email.toLowerCase() }).select('+password');
    if (!user) {
      return res.status(401).json({
        success: false,
        message: 'Invalid credentials. Please verify email and password.',
      });
    }

    const isMatch = await user.matchPassword(password);
    if (!isMatch) {
      return res.status(401).json({
        success: false,
        message: 'Invalid credentials. Please verify email and password.',
      });
    }

    return sendTokenResponse(user, 200, res);
  } catch (error) {
    next(error);
  }
};

export const logout = (req, res) => {
  res.clearCookie('jwt', {
    httpOnly: true,
    sameSite: process.env.NODE_ENV === 'production' ? 'none' : 'lax',
    secure: process.env.NODE_ENV === 'production',
  });

  return res.status(200).json({
    success: true,
    message: 'Logged out of NEXUS AI OS successfully.',
  });
};

export const getMe = async (req, res) => {
  return res.status(200).json({
    success: true,
    user: {
      id: req.user._id,
      name: req.user.name,
      email: req.user.email,
      avatar: req.user.avatar,
      settings: req.user.settings,
      createdAt: req.user.createdAt,
    },
  });
};

export const updateSettings = async (req, res, next) => {
  try {
    const { theme, memoryEnabled, showAgentActivity, responseDetail } = req.body;
    const user = await User.findById(req.user._id);

    if (theme) user.settings.theme = theme;
    if (memoryEnabled !== undefined) user.settings.memoryEnabled = memoryEnabled;
    if (showAgentActivity !== undefined) user.settings.showAgentActivity = showAgentActivity;
    if (responseDetail) user.settings.responseDetail = responseDetail;

    await user.save();

    return res.status(200).json({
      success: true,
      message: 'User settings updated',
      settings: user.settings,
    });
  } catch (error) {
    next(error);
  }
};

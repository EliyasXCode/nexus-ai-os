import express from 'express';
import dotenv from 'dotenv';
import cors from 'cors';
import helmet from 'helmet';
import cookieParser from 'cookie-parser';
import rateLimit from 'express-rate-limit';

import { connectDB } from './config/db.js';
import { notFoundHandler, errorHandler } from './middleware/error.middleware.js';

// Route imports
import authRoutes from './routes/auth.routes.js';
import chatRoutes from './routes/chat.routes.js';
import conversationRoutes from './routes/conversation.routes.js';
import taskRoutes from './routes/task.routes.js';
import noteRoutes from './routes/note.routes.js';
import memoryRoutes from './routes/memory.routes.js';
import agentRoutes from './routes/agent.routes.js';

// Load environment variables
dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;

// Connect to MongoDB
connectDB();

// Security HTTP headers
app.use(helmet({
  crossOriginResourcePolicy: { policy: 'cross-origin' },
}));

// CORS configuration
const allowedOrigins = [
  process.env.CLIENT_URL || 'http://localhost:5173',
  'http://localhost:3000',
  'http://127.0.0.1:5173',
];

app.use(
  cors({
    origin: (origin, callback) => {
      // Allow requests with no origin (like mobile apps, curl, postman)
      if (!origin || allowedOrigins.includes(origin)) {
        callback(null, true);
      } else {
        callback(null, true); // Dev-friendly fallback
      }
    },
    credentials: true,
    methods: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization', 'X-Requested-With'],
  })
);

// Rate limiting
const limiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 300, // limit each IP to 300 requests per windowMs
  standardHeaders: true,
  legacyHeaders: false,
  message: {
    success: false,
    message: 'Too many requests from this IP. Please wait a few minutes before trying again.',
  },
});
app.use('/api/', limiter);

// Cookie Parser
app.use(cookieParser());

// Body Parsers (allow up to 15mb for multimodal image inputs)
app.use(express.json({ limit: '15mb' }));
app.use(express.urlencoded({ extended: true, limit: '15mb' }));

// Health check endpoint
app.get('/api/health', (req, res) => {
  res.status(200).json({
    status: 'online',
    system: 'NEXUS AI OS Backend',
    version: '1.0.0',
    timestamp: new Date().toISOString(),
    geminiConfigured: !!process.env.GEMINI_API_KEY,
    geminiModel: process.env.GEMINI_MODEL || 'gemini-3.5-flash',
  });
});

// Mount Routes
app.use('/api/auth', authRoutes);
app.use('/api/chat', chatRoutes);
app.use('/api/conversations', conversationRoutes);
app.use('/api/tasks', taskRoutes);
app.use('/api/notes', noteRoutes);
app.use('/api/memory', memoryRoutes);
app.use('/api/agents', agentRoutes);

// Error Handling Middlewares
app.use(notFoundHandler);
app.use(errorHandler);

// Start server
app.listen(PORT, () => {
  console.log(`=========================================`);
  console.log(`  🚀 NEXUS AI OS Core Server Running     `);
  console.log(`  🌐 Port: http://localhost:${PORT}      `);
  console.log(`  🤖 AI Model: ${process.env.GEMINI_MODEL || 'gemini-3.5-flash'}`);
  console.log(`  ⚡ Environment: ${process.env.NODE_ENV || 'development'}`);
  console.log(`=========================================`);
});

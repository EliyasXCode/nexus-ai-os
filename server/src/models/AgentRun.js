import mongoose from 'mongoose';

const agentRunSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
      index: true,
    },
    conversation: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Conversation',
    },
    agent: {
      type: String,
      required: true,
    },
    intent: {
      type: String,
      default: '',
    },
    confidence: {
      type: Number,
      default: 1.0,
    },
    status: {
      type: String,
      enum: ['started', 'completed', 'failed'],
      default: 'completed',
    },
    toolsUsed: [
      {
        toolName: String,
        args: mongoose.Schema.Types.Mixed,
        result: mongoose.Schema.Types.Mixed,
        timestamp: { type: Date, default: Date.now },
      },
    ],
    durationMs: {
      type: Number,
      default: 0,
    },
  },
  {
    timestamps: true,
  }
);

export const AgentRun = mongoose.model('AgentRun', agentRunSchema);

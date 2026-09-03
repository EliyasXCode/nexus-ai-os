import mongoose from 'mongoose';

const messageSchema = new mongoose.Schema({
  role: {
    type: String,
    enum: ['user', 'assistant', 'system', 'tool'],
    required: true,
  },
  content: {
    type: String,
    default: '',
  },
  agent: {
    type: String,
    default: 'GENERAL',
  },
  toolCalls: [
    {
      toolName: String,
      args: mongoose.Schema.Types.Mixed,
      result: mongoose.Schema.Types.Mixed,
    },
  ],
  agentActivity: [
    {
      step: String,
      detail: String,
      timestamp: { type: Date, default: Date.now },
    },
  ],
  image: {
    type: String, // base64 or preview metadata if uploaded
    default: null,
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

const conversationSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
      index: true,
    },
    title: {
      type: String,
      default: 'New Conversation',
      trim: true,
    },
    selectedAgent: {
      type: String,
      enum: ['GENERAL', 'CODING', 'PLANNER', 'STUDY', 'TASK', 'NOTES', 'AUTO'],
      default: 'AUTO',
    },
    messages: [messageSchema],
  },
  {
    timestamps: true,
  }
);

export const Conversation = mongoose.model('Conversation', conversationSchema);

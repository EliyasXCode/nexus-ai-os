import mongoose from 'mongoose';

const memorySchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
      index: true,
    },
    key: {
      type: String,
      required: [true, 'Memory key is required'],
      trim: true,
    },
    value: {
      type: String,
      required: [true, 'Memory value is required'],
      trim: true,
    },
    category: {
      type: String,
      enum: ['preference', 'project', 'learning', 'general'],
      default: 'general',
    },
  },
  {
    timestamps: true,
  }
);

// Compound index so a user doesn't have duplicated keys within a category
memorySchema.index({ user: 1, key: 1 });

export const Memory = mongoose.model('Memory', memorySchema);

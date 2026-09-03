import mongoose from 'mongoose';

const noteSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
      index: true,
    },
    title: {
      type: String,
      required: [true, 'Note title is required'],
      trim: true,
      maxLength: [200, 'Title cannot exceed 200 characters'],
    },
    content: {
      type: String,
      required: [true, 'Note content is required'],
    },
    tags: [
      {
        type: String,
        trim: true,
      },
    ],
    pinned: {
      type: Boolean,
      default: false,
    },
    createdBy: {
      type: String,
      enum: ['user', 'ai'],
      default: 'user',
    },
  },
  {
    timestamps: true,
  }
);

export const Note = mongoose.model('Note', noteSchema);

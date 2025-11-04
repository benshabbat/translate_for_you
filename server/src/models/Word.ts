import mongoose, { Document, Schema } from 'mongoose';

export interface IWord extends Document {
  userId: mongoose.Types.ObjectId;
  english: string;
  hebrew: string;
  createdAt: Date;
  lastPracticed?: Date;
  correctCount: number;
  incorrectCount: number;
  searchCount: number; // How many times user searched for this word
  lastSearched?: Date; // Last time user searched for this word
}

const wordSchema = new Schema<IWord>({
  userId: {
    type: Schema.Types.ObjectId,
    ref: 'User',
    required: true,
    index: true
  },
  english: {
    type: String,
    required: true,
    trim: true
  },
  hebrew: {
    type: String,
    required: true,
    trim: true
  },
  createdAt: {
    type: Date,
    default: Date.now
  },
  lastPracticed: {
    type: Date
  },
  correctCount: {
    type: Number,
    default: 0
  },
  incorrectCount: {
    type: Number,
    default: 0
  },
  searchCount: {
    type: Number,
    default: 1
  },
  lastSearched: {
    type: Date,
    default: Date.now
  }
});

// Create compound index for user and english word
wordSchema.index({ userId: 1, english: 1 });

export const Word = mongoose.model<IWord>('Word', wordSchema);

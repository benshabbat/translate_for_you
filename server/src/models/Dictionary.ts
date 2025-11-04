import mongoose, { Document, Schema } from 'mongoose';

export interface IDictionary extends Document {
  english: string;
  hebrew: string;
  category: string;
  frequency?: number; // For common words ranking
  isProgramming?: boolean;
  createdAt: Date;
  updatedAt: Date;
}

const dictionarySchema = new Schema<IDictionary>(
  {
    english: {
      type: String,
      required: true,
      unique: true,
      lowercase: true,
      trim: true,
      index: true
    },
    hebrew: {
      type: String,
      required: true,
      trim: true
    },
    category: {
      type: String,
      required: true,
      enum: [
        'programming',
        'common',
        'greetings',
        'animals',
        'family',
        'home',
        'school',
        'food',
        'nature',
        'colors',
        'numbers',
        'time',
        'adjectives',
        'verbs',
        'places',
        'transport',
        'body',
        'misc',
        'user-contributed'
      ]
    },
    frequency: {
      type: Number,
      default: 0
    },
    isProgramming: {
      type: Boolean,
      default: false
    }
  },
  {
    timestamps: true
  }
);

// Create text index for search
dictionarySchema.index({ english: 'text' });

export const Dictionary = mongoose.model<IDictionary>('Dictionary', dictionarySchema);

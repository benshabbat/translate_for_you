import mongoose, { Document, Schema } from 'mongoose';

export interface ITranslationReport extends Document {
  userId: mongoose.Types.ObjectId;
  english: string;
  currentHebrew: string;
  suggestedHebrew: string;
  reason?: string;
  status: 'pending' | 'approved' | 'rejected';
  createdAt: Date;
  reviewedAt?: Date;
  reviewedBy?: mongoose.Types.ObjectId;
}

const translationReportSchema = new Schema<ITranslationReport>({
  userId: {
    type: Schema.Types.ObjectId,
    ref: 'User',
    required: true,
    index: true
  },
  english: {
    type: String,
    required: true,
    trim: true,
    lowercase: true
  },
  currentHebrew: {
    type: String,
    required: true,
    trim: true
  },
  suggestedHebrew: {
    type: String,
    required: true,
    trim: true
  },
  reason: {
    type: String,
    trim: true
  },
  status: {
    type: String,
    enum: ['pending', 'approved', 'rejected'],
    default: 'pending'
  },
  createdAt: {
    type: Date,
    default: Date.now
  },
  reviewedAt: {
    type: Date
  },
  reviewedBy: {
    type: Schema.Types.ObjectId,
    ref: 'User'
  }
});

// Index for searching reports
translationReportSchema.index({ english: 1, status: 1 });

export const TranslationReport = mongoose.model<ITranslationReport>('TranslationReport', translationReportSchema);

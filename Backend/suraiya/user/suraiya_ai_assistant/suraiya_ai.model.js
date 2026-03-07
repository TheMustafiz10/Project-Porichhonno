import mongoose from 'mongoose';

const suraiyaAiSchema = new mongoose.Schema(
  {
    userId: {
      type: String,
      required: false,
    },
    userQuestion: {
      type: String,
      required: true,
      trim: true,
    },
    aiResponse: {
      type: String,
      required: true,
    },
    wasteCategory: {
      type: String,
      enum: ['organic', 'recyclable', 'hazardous', 'non-recyclable', 'general', 'unknown'],
      default: 'unknown',
    },
    sessionId: {
      type: String,
      required: false,
    },
    ipAddress: {
      type: String,
      required: false,
    },
    responseTime: {
      type: Number, // in milliseconds
      required: false,
    },
    isHelpful: {
      type: Boolean,
      default: null,
    },
  },
  {
    timestamps: true,
  }
);

// Indexes for better query performance
suraiyaAiSchema.index({ userId: 1, createdAt: -1 });
suraiyaAiSchema.index({ wasteCategory: 1 });
suraiyaAiSchema.index({ createdAt: -1 });

const SuraiyaAiAssistant = mongoose.model('SuraiyaAiAssistant', suraiyaAiSchema);

export default SuraiyaAiAssistant;

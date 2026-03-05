import mongoose, { Schema, Document } from 'mongoose';

export interface IEcoTip extends Document {
  title: string;
  content: string;
  category: string;
  icon: string;
  isActive: boolean;
  createdAt: Date;
  updatedAt: Date;
}

const EcoTipSchema = new Schema<IEcoTip>(
  {
    title: {
      type: String,
      required: true,
    },
    content: {
      type: String,
      required: true,
    },
    category: {
      type: String,
      required: true,
      enum: ['Recycling', 'Composting', 'Energy', 'Water', 'Waste Reduction', 'General'],
      default: 'General',
    },
    icon: {
      type: String,
      default: '💡',
    },
    isActive: {
      type: Boolean,
      default: true,
    },
  },
  {
    timestamps: true,
  }
);

export const EcoTip = mongoose.models.EcoTip || mongoose.model<IEcoTip>('EcoTip', EcoTipSchema);

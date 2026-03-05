import mongoose, { Schema, Document } from 'mongoose';

export type MaterialType = 'PAPER' | 'PLASTIC' | 'METAL' | 'GLASS' | 'ELECTRONICS' | 'ORGANIC';
export type DisposalMethod = 'Drop-off Bin' | 'Scheduled Pickup' | 'Community Collection' | 'Self-delivered';

export interface IRecyclingLog extends Document {
  userId: string; // For future multi-user support
  materialType: MaterialType;
  weightKg: number;
  disposalMethod: DisposalMethod;
  pointsEarned: number;
  co2SavedKg: number;
  notes?: string;
  createdAt: Date;
  updatedAt: Date;
}

const RecyclingLogSchema = new Schema<IRecyclingLog>(
  {
    userId: {
      type: String,
      required: true,
      default: 'default-user', // Temporary until auth is implemented
    },
    materialType: {
      type: String,
      required: true,
      enum: ['PAPER', 'PLASTIC', 'METAL', 'GLASS', 'ELECTRONICS', 'ORGANIC'],
    },
    weightKg: {
      type: Number,
      required: true,
      min: 0,
    },
    disposalMethod: {
      type: String,
      required: true,
      enum: ['Drop-off Bin', 'Scheduled Pickup', 'Community Collection', 'Self-delivered'],
    },
    pointsEarned: {
      type: Number,
      required: true,
      default: 0,
    },
    co2SavedKg: {
      type: Number,
      required: true,
      default: 0,
    },
    notes: {
      type: String,
      default: '',
    },
  },
  {
    timestamps: true, // Automatically adds createdAt and updatedAt
  }
);

// Indexes for faster queries
RecyclingLogSchema.index({ userId: 1, createdAt: -1 });
RecyclingLogSchema.index({ materialType: 1 });

export const RecyclingLog = mongoose.models.RecyclingLog || mongoose.model<IRecyclingLog>('RecyclingLog', RecyclingLogSchema);

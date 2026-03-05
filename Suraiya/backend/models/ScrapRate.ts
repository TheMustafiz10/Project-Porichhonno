import mongoose, { Schema, Document } from 'mongoose';
import { MaterialType } from './RecyclingLog';

export interface IScrapRate extends Document {
  materialType: MaterialType;
  pricePerKg: number; // In local currency
  lastUpdated: Date;
}

const ScrapRateSchema = new Schema<IScrapRate>(
  {
    materialType: {
      type: String,
      required: true,
      unique: true,
      enum: ['PAPER', 'PLASTIC', 'METAL', 'GLASS', 'ELECTRONICS', 'ORGANIC'],
    },
    pricePerKg: {
      type: Number,
      required: true,
      min: 0,
    },
    lastUpdated: {
      type: Date,
      default: Date.now,
    },
  },
  {
    timestamps: true,
  }
);

export const ScrapRate = mongoose.models.ScrapRate || mongoose.model<IScrapRate>('ScrapRate', ScrapRateSchema);

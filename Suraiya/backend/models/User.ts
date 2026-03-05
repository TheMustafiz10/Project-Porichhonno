import mongoose, { Schema, Document } from 'mongoose';

export interface IBadge {
  name: string;
  icon: string;
  earnedAt: Date;
}

export interface IUser extends Document {
  username: string;
  email: string;
  password: string; // Will be hashed
  avatar?: string;
  totalPoints: number;
  totalCo2Saved: number;
  totalRecycledKg: number;
  streak: number;
  badges: IBadge[];
  createdAt: Date;
  updatedAt: Date;
}

const BadgeSchema = new Schema({
  name: { type: String, required: true },
  icon: { type: String, required: true },
  earnedAt: { type: Date, default: Date.now },
}, { _id: false });

const UserSchema = new Schema<IUser>(
  {
    username: {
      type: String,
      required: true,
      unique: true,
      trim: true,
    },
    email: {
      type: String,
      required: true,
      unique: true,
      lowercase: true,
      trim: true,
    },
    password: {
      type: String,
      required: true,
    },
    avatar: {
      type: String,
      default: '🌿',
    },
    totalPoints: {
      type: Number,
      default: 0,
    },
    totalCo2Saved: {
      type: Number,
      default: 0,
    },
    totalRecycledKg: {
      type: Number,
      default: 0,
    },
    streak: {
      type: Number,
      default: 0,
    },
    badges: {
      type: [BadgeSchema],
      default: [],
    },
  },
  {
    timestamps: true,
  }
);

export const User = mongoose.models.User || mongoose.model<IUser>('User', UserSchema);

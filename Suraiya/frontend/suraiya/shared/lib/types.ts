// Shared types for পরিচ্ছন্ন application

export type MaterialType = 'PAPER' | 'PLASTIC' | 'METAL' | 'GLASS' | 'ELECTRONICS' | 'ORGANIC';

export type DisposalMethod = 'Drop-off Bin' | 'Scheduled Pickup' | 'Community Collection' | 'Self-delivered';

export interface RecyclingLogEntry {
  _id?: string;
  id?: string;
  materialType: MaterialType;
  weightKg: number;
  disposalMethod: DisposalMethod;
  pointsEarned: number;
  co2SavedKg: number;
  notes?: string;
  createdAt: Date;
  updatedAt?: Date;
}

export interface User {
  _id: string;
  username: string;
  email: string;
  avatar?: string;
  totalPoints: number;
  totalCo2Saved: number;
  totalRecycledKg: number;
  streak: number;
  badges: Badge[];
  createdAt: Date;
  updatedAt: Date;
}

export interface Badge {
  name: string;
  icon: string;
  earnedAt: Date;
}

export interface ScrapRate {
  _id?: string;
  materialType: MaterialType;
  pricePerKg: number;
  lastUpdated: Date;
}

export interface EcoTip {
  _id?: string;
  title: string;
  content: string;
  category: 'Recycling' | 'Composting' | 'Energy' | 'Water' | 'Waste Reduction' | 'General';
  icon: string;
  isActive: boolean;
  createdAt?: Date;
  updatedAt?: Date;
}

export interface ApiResponse<T> {
  success: boolean;
  data?: T;
  error?: string;
  message?: string;
}

export interface StatsResponse {
  totalEntries: number;
  totalKg: number;
  totalPoints: number;
  totalCo2: number;
  materialBreakdown: Record<MaterialType, number>;
}

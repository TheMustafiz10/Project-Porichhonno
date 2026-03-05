// Constants for পরিচ্ছন্ন application
import { MaterialType } from './types';

export const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000/api';

export const MATERIAL_COLORS: Record<MaterialType, string> = {
  PAPER: '#92400e',
  PLASTIC: '#1d4ed8',
  METAL: '#6b7280',
  GLASS: '#0891b2',
  ELECTRONICS: '#7c3aed',
  ORGANIC: '#16a34a',
};

export const MATERIAL_LABELS: Record<MaterialType, string> = {
  PAPER: 'Paper',
  PLASTIC: 'Plastic',
  METAL: 'Metal',
  GLASS: 'Glass',
  ELECTRONICS: 'Electronics',
  ORGANIC: 'Organic',
};

export const MATERIAL_EMOJIS: Record<MaterialType, string> = {
  PAPER: '🟫',
  PLASTIC: '🟦',
  METAL: '⬜',
  GLASS: '🩵',
  ELECTRONICS: '🟣',
  ORGANIC: '🟩',
};

// Points per kg by material
export const POINTS_PER_KG: Record<MaterialType, number> = {
  PAPER: 10,
  PLASTIC: 15,
  METAL: 20,
  GLASS: 8,
  ELECTRONICS: 30,
  ORGANIC: 5,
};

// CO2 saved per kg by material (in kg)
export const CO2_PER_KG: Record<MaterialType, number> = {
  PAPER: 1.2,
  PLASTIC: 2.5,
  METAL: 1.8,
  GLASS: 0.8,
  ELECTRONICS: 3.5,
  ORGANIC: 0.5,
};

export const BADGE_THRESHOLDS = {
  ECO_STARTER: 1,          // First entry
  DEDICATED_RECYCLER: 10,  // 10 entries
  ECO_WARRIOR: 50,         // 50 entries
  GREEN_CHAMPION: 100,     // 100 entries
  PLANET_HERO: 500,        // 500 entries
};

export const POINTS_BADGES = {
  BRONZE: 100,
  SILVER: 500,
  GOLD: 1000,
  PLATINUM: 5000,
  DIAMOND: 10000,
};

import mongoose from 'mongoose';

const SuraiyaProfileSchema = new mongoose.Schema(
  {
    name: { type: String, required: true },
    email: { type: String, required: true },
    phone: { type: String, default: '' },
    location: { type: String, default: '' },
    bio: { type: String, default: 'Eco-warrior in training! 🌿' },
    totalRecycledItems: { type: Number, default: 0 },
    ecoPoints: { type: Number, default: 0 },
  },
  {
    timestamps: true,
  }
);

const SuraiyaProfile = mongoose.model('SuraiyaProfile', SuraiyaProfileSchema);

export default SuraiyaProfile;
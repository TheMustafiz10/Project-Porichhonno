import cors from 'cors';
import dotenv from 'dotenv';
import express from 'express';
import mongoose from 'mongoose';

import suraiyaAiAdminRoutes from './suraiya/admin/suraiya_ai_logs/suraiya_ai_admin.routes.js';
import suraiyaAiRoutes from './suraiya/user/suraiya_ai_assistant/suraiya_ai.routes.js';
import suraiyaProfileRoutes from './suraiya/user/suraiya_profile/Suraiya_profile.routes.js';

dotenv.config();

const app = express();

app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.get('/', (req, res) => {
  res.status(200).json({
    success: true,
    message: 'Porichhonno backend is running',
  });
});

app.use('/api/suraiya/ai-assistant', suraiyaAiRoutes);
app.use('/api/suraiya/admin/ai-logs', suraiyaAiAdminRoutes);
app.use('/api/profile', suraiyaProfileRoutes);

const PORT = Number(process.env.PORT) || 1313;
const MONGODB_URI = process.env.MONGODB_URI;

if (!MONGODB_URI) {
  console.error('MONGODB_URI is missing in Backend/.env');
  process.exit(1);
}

mongoose
  .connect(MONGODB_URI)
  .then(() => {
    console.log('MongoDB connected');
    app.listen(PORT, () => {
      console.log(`Server listening on port ${PORT}`);
    });
  })
  .catch((error) => {
    console.error('MongoDB connection failed:', error.message);
    process.exit(1);
  });

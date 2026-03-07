import express from 'express';
import {
  seedSuraiyaProfile,
  getSuraiyaProfile,
  updateSuraiyaProfile,
} from './Suraiya_profile.controller.js';

const router = express.Router();

router.post('/seed', seedSuraiyaProfile);
router.get('/:id', getSuraiyaProfile);
router.put('/:id', updateSuraiyaProfile);

export default router;
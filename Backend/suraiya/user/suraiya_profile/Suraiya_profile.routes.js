import express from 'express';
import {
  seedSuraiyaProfile,
  getSuraiyaProfile,
  updateSuraiyaProfile,
  createSuraiyaProfile,
} from './Suraiya_profile.controller.js';

const router = express.Router();

router.post('/seed', seedSuraiyaProfile);
router.post('/', createSuraiyaProfile);
router.get('/:id', getSuraiyaProfile);
router.put('/:id', updateSuraiyaProfile);

export default router;
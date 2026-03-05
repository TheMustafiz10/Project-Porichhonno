import express, { Request, Response } from 'express';
import { EcoTip } from '../models/EcoTip';

const router = express.Router();

// GET /api/eco-tips - Get all active eco tips
router.get('/', async (req: Request, res: Response) => {
  try {
    const tips = await EcoTip.find({ isActive: true }).sort({ createdAt: -1 });
    res.json({ success: true, data: tips });
  } catch (error) {
    console.error('Error fetching eco tips:', error);
    res.status(500).json({ success: false, error: 'Failed to fetch eco tips' });
  }
});

// GET /api/eco-tips/random - Get random eco tip
router.get('/random', async (req: Request, res: Response) => {
  try {
    const tips = await EcoTip.find({ isActive: true });
    if (tips.length === 0) {
      return res.status(404).json({ success: false, error: 'No eco tips available' });
    }
    const randomTip = tips[Math.floor(Math.random() * tips.length)];
    res.json({ success: true, data: randomTip });
  } catch (error) {
    console.error('Error fetching random tip:', error);
    res.status(500).json({ success: false, error: 'Failed to fetch random tip' });
  }
});

// GET /api/eco-tips/:id - Get specific eco tip
router.get('/:id', async (req: Request, res: Response) => {
  try {
    const tip = await EcoTip.findById(req.params.id);
    if (!tip) {
      return res.status(404).json({ success: false, error: 'Eco tip not found' });
    }
    res.json({ success: true, data: tip });
  } catch (error) {
    console.error('Error fetching eco tip:', error);
    res.status(500).json({ success: false, error: 'Failed to fetch eco tip' });
  }
});

// POST /api/eco-tips - Create new eco tip (Admin only)
router.post('/', async (req: Request, res: Response) => {
  try {
    const { title, content, category, icon } = req.body;

    if (!title || !content) {
      return res.status(400).json({ success: false, error: 'Missing required fields: title, content' });
    }

    const tip = await EcoTip.create({
      title,
      content,
      category: category || 'General',
      icon: icon || '💡',
      isActive: true,
    });

    res.status(201).json({ success: true, data: tip });
  } catch (error) {
    console.error('Error creating eco tip:', error);
    res.status(500).json({ success: false, error: 'Failed to create eco tip' });
  }
});

// PUT /api/eco-tips/:id - Update eco tip (Admin only)
router.put('/:id', async (req: Request, res: Response) => {
  try {
    const tip = await EcoTip.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true }
    );

    if (!tip) {
      return res.status(404).json({ success: false, error: 'Eco tip not found' });
    }

    res.json({ success: true, data: tip });
  } catch (error) {
    console.error('Error updating eco tip:', error);
    res.status(500).json({ success: false, error: 'Failed to update eco tip' });
  }
});

// DELETE /api/eco-tips/:id - Delete eco tip (Admin only)
router.delete('/:id', async (req: Request, res: Response) => {
  try {
    const tip = await EcoTip.findByIdAndDelete(req.params.id);
    if (!tip) {
      return res.status(404).json({ success: false, error: 'Eco tip not found' });
    }
    res.json({ success: true, message: 'Eco tip deleted successfully' });
  } catch (error) {
    console.error('Error deleting eco tip:', error);
    res.status(500).json({ success: false, error: 'Failed to delete eco tip' });
  }
});

export default router;

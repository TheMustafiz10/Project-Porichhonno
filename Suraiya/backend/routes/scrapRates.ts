import express, { Request, Response } from 'express';
import { ScrapRate } from '../models/ScrapRate';

const router = express.Router();

// GET /api/scrap-rates - Get all scrap rates
router.get('/', async (req: Request, res: Response) => {
  try {
    const rates = await ScrapRate.find().sort({ materialType: 1 });
    res.json({ success: true, data: rates });
  } catch (error) {
    console.error('Error fetching scrap rates:', error);
    res.status(500).json({ success: false, error: 'Failed to fetch scrap rates' });
  }
});

// GET /api/scrap-rates/:materialType - Get rate for specific material
router.get('/:materialType', async (req: Request, res: Response) => {
  try {
    const rate = await ScrapRate.findOne({ materialType: req.params.materialType.toUpperCase() });
    if (!rate) {
      return res.status(404).json({ success: false, error: 'Scrap rate not found' });
    }
    res.json({ success: true, data: rate });
  } catch (error) {
    console.error('Error fetching scrap rate:', error);
    res.status(500).json({ success: false, error: 'Failed to fetch scrap rate' });
  }
});

// POST /api/scrap-rates - Create or update scrap rate (Admin only)
router.post('/', async (req: Request, res: Response) => {
  try {
    const { materialType, pricePerKg } = req.body;

    if (!materialType || pricePerKg === undefined) {
      return res.status(400).json({ success: false, error: 'Missing required fields' });
    }

    const rate = await ScrapRate.findOneAndUpdate(
      { materialType: materialType.toUpperCase() },
      { pricePerKg, lastUpdated: new Date() },
      { upsert: true, new: true }
    );

    res.json({ success: true, data: rate });
  } catch (error) {
    console.error('Error updating scrap rate:', error);
    res.status(500).json({ success: false, error: 'Failed to update scrap rate' });
  }
});

// POST /api/scrap-rates/calculate - Calculate total value
router.post('/calculate', async (req: Request, res: Response) => {
  try {
    const { materialType, weightKg } = req.body;

    if (!materialType || !weightKg) {
      return res.status(400).json({ success: false, error: 'Missing materialType or weightKg' });
    }

    const rate = await ScrapRate.findOne({ materialType: materialType.toUpperCase() });
    if (!rate) {
      return res.status(404).json({ success: false, error: 'Scrap rate not found for this material' });
    }

    const totalValue = weightKg * rate.pricePerKg;

    res.json({
      success: true,
      data: {
        materialType,
        weightKg,
        pricePerKg: rate.pricePerKg,
        totalValue: parseFloat(totalValue.toFixed(2)),
      },
    });
  } catch (error) {
    console.error('Error calculating value:', error);
    res.status(500).json({ success: false, error: 'Failed to calculate value' });
  }
});

export default router;

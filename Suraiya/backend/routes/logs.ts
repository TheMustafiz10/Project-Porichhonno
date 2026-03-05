import express, { Request, Response } from 'express';
import { RecyclingLog } from '../models/RecyclingLog';
import { User } from '../models/User';

const router = express.Router();

// Helper constants
const POINTS_PER_KG: Record<string, number> = {
  PAPER: 10,
  PLASTIC: 15,
  METAL: 20,
  GLASS: 8,
  ELECTRONICS: 30,
  ORGANIC: 5,
};

const CO2_PER_KG: Record<string, number> = {
  PAPER: 1.2,
  PLASTIC: 2.5,
  METAL: 1.8,
  GLASS: 0.8,
  ELECTRONICS: 3.5,
  ORGANIC: 0.5,
};

// GET /api/logs - Get all recycling logs for a user
router.get('/', async (req: Request, res: Response) => {
  try {
    const userId = req.query.userId as string || 'default-user';
    const logs = await RecyclingLog.find({ userId }).sort({ createdAt: -1 });
    res.json({ success: true, data: logs });
  } catch (error) {
    console.error('Error fetching logs:', error);
    res.status(500).json({ success: false, error: 'Failed to fetch logs' });
  }
});

// GET /api/logs/:id - Get single log entry
router.get('/:id', async (req: Request, res: Response) => {
  try {
    const log = await RecyclingLog.findById(req.params.id);
    if (!log) {
      return res.status(404).json({ success: false, error: 'Log not found' });
    }
    res.json({ success: true, data: log });
  } catch (error) {
    console.error('Error fetching log:', error);
    res.status(500).json({ success: false, error: 'Failed to fetch log' });
  }
});

// POST /api/logs - Create new recycling log
router.post('/', async (req: Request, res: Response) => {
  try {
    const { materialType, weightKg, disposalMethod, notes, userId } = req.body;

    // Validate required fields
    if (!materialType || !weightKg || !disposalMethod) {
      return res.status(400).json({ 
        success: false, 
        error: 'Missing required fields: materialType, weightKg, disposalMethod' 
      });
    }

    // Calculate points and CO2
    const pointsEarned = Math.round(weightKg * POINTS_PER_KG[materialType]);
    const co2SavedKg = parseFloat((weightKg * CO2_PER_KG[materialType]).toFixed(2));

    // Create log entry
    const log = await RecyclingLog.create({
      userId: userId || 'default-user',
      materialType,
      weightKg,
      disposalMethod,
      pointsEarned,
      co2SavedKg,
      notes: notes || '',
    });

    // Update user stats
    await User.findOneAndUpdate(
      { _id: userId || 'default-user' },
      {
        $inc: {
          totalPoints: pointsEarned,
          totalCo2Saved: co2SavedKg,
          totalRecycledKg: weightKg,
        },
      },
      { upsert: true } // Create user if doesn't exist
    );

    res.status(201).json({ success: true, data: log });
  } catch (error) {
    console.error('Error creating log:', error);
    res.status(500).json({ success: false, error: 'Failed to create log' });
  }
});

// PUT /api/logs/:id - Update recycling log
router.put('/:id', async (req: Request, res: Response) => {
  try {
    const { materialType, weightKg, disposalMethod, notes } = req.body;

    // Get old values to calculate diff
    const oldLog = await RecyclingLog.findById(req.params.id);
    if (!oldLog) {
      return res.status(404).json({ success: false, error: 'Log not found' });
    }

    // Calculate new points and CO2
    const newPoints = Math.round((weightKg || oldLog.weightKg) * POINTS_PER_KG[materialType || oldLog.materialType]);
    const newCo2 = parseFloat(((weightKg || oldLog.weightKg) * CO2_PER_KG[materialType || oldLog.materialType]).toFixed(2));

    // Update log
    const updatedLog = await RecyclingLog.findByIdAndUpdate(
      req.params.id,
      {
        materialType: materialType || oldLog.materialType,
        weightKg: weightKg || oldLog.weightKg,
        disposalMethod: disposalMethod || oldLog.disposalMethod,
        notes: notes !== undefined ? notes : oldLog.notes,
        pointsEarned: newPoints,
        co2SavedKg: newCo2,
      },
      { new: true }
    );

    // Update user stats (subtract old, add new)
    const pointsDiff = newPoints - oldLog.pointsEarned;
    const co2Diff = newCo2 - oldLog.co2SavedKg;
    const weightDiff = (weightKg || oldLog.weightKg) - oldLog.weightKg;

    await User.findOneAndUpdate(
      { _id: oldLog.userId },
      {
        $inc: {
          totalPoints: pointsDiff,
          totalCo2Saved: co2Diff,
          totalRecycledKg: weightDiff,
        },
      }
    );

    res.json({ success: true, data: updatedLog });
  } catch (error) {
    console.error('Error updating log:', error);
    res.status(500).json({ success: false, error: 'Failed to update log' });
  }
});

// DELETE /api/logs/:id - Delete recycling log
router.delete('/:id', async (req: Request, res: Response) => {
  try {
    const log = await RecyclingLog.findById(req.params.id);
    if (!log) {
      return res.status(404).json({ success: false, error: 'Log not found' });
    }

    // Update user stats (subtract)
    await User.findOneAndUpdate(
      { _id: log.userId },
      {
        $inc: {
          totalPoints: -log.pointsEarned,
          totalCo2Saved: -log.co2SavedKg,
          totalRecycledKg: -log.weightKg,
        },
      }
    );

    await RecyclingLog.findByIdAndDelete(req.params.id);
    res.json({ success: true, message: 'Log deleted successfully' });
  } catch (error) {
    console.error('Error deleting log:', error);
    res.status(500).json({ success: false, error: 'Failed to delete log' });
  }
});

// GET /api/logs/stats/summary - Get summary statistics
router.get('/stats/summary', async (req: Request, res: Response) => {
  try {
    const userId = req.query.userId as string || 'default-user';
    const logs = await RecyclingLog.find({ userId });

    const totalKg = logs.reduce((sum, log) => sum + log.weightKg, 0);
    const totalPoints = logs.reduce((sum, log) => sum + log.pointsEarned, 0);
    const totalCo2 = logs.reduce((sum, log) => sum + log.co2SavedKg, 0);

    // Material breakdown
    const materialBreakdown: Record<string, number> = {};
    logs.forEach(log => {
      materialBreakdown[log.materialType] = (materialBreakdown[log.materialType] || 0) + log.weightKg;
    });

    res.json({
      success: true,
      data: {
        totalEntries: logs.length,
        totalKg: parseFloat(totalKg.toFixed(2)),
        totalPoints,
        totalCo2: parseFloat(totalCo2.toFixed(2)),
        materialBreakdown,
      },
    });
  } catch (error) {
    console.error('Error fetching stats:', error);
    res.status(500).json({ success: false, error: 'Failed to fetch stats' });
  }
});

export default router;

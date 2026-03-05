import express, { Request, Response } from 'express';
import { User } from '../models/User';

const router = express.Router();

// GET /api/users/:id - Get user profile
router.get('/:id', async (req: Request, res: Response) => {
  try {
    const user = await User.findById(req.params.id).select('-password');
    if (!user) {
      return res.status(404).json({ success: false, error: 'User not found' });
    }
    res.json({ success: true, data: user });
  } catch (error) {
    console.error('Error fetching user:', error);
    res.status(500).json({ success: false, error: 'Failed to fetch user' });
  }
});

// GET /api/users/username/:username - Get user by username
router.get('/username/:username', async (req: Request, res: Response) => {
  try {
    const user = await User.findOne({ username: req.params.username }).select('-password');
    if (!user) {
      return res.status(404).json({ success: false, error: 'User not found' });
    }
    res.json({ success: true, data: user });
  } catch (error) {
    console.error('Error fetching user:', error);
    res.status(500).json({ success: false, error: 'Failed to fetch user' });
  }
});

// POST /api/users - Create new user
router.post('/', async (req: Request, res: Response) => {
  try {
    const { username, email, password } = req.body;

    if (!username || !email || !password) {
      return res.status(400).json({ success: false, error: 'Missing required fields' });
    }

    // Check if user exists
    const existingUser = await User.findOne({ $or: [{ email }, { username }] });
    if (existingUser) {
      return res.status(400).json({ success: false, error: 'User already exists' });
    }

    // In production, hash password with bcrypt
    // const hashedPassword = await bcrypt.hash(password, 10);

    const user = await User.create({
      username,
      email,
      password, // TODO: Hash this in production
    });

    const userResponse = user.toObject();
    delete (userResponse as any).password;

    res.status(201).json({ success: true, data: userResponse });
  } catch (error) {
    console.error('Error creating user:', error);
    res.status(500).json({ success: false, error: 'Failed to create user' });
  }
});

// PUT /api/users/:id - Update user profile
router.put('/:id', async (req: Request, res: Response) => {
  try {
    const { password, ...updateData } = req.body;

    // Don't allow direct password updates through this endpoint
    const user = await User.findByIdAndUpdate(
      req.params.id,
      updateData,
      { new: true }
    ).select('-password');

    if (!user) {
      return res.status(404).json({ success: false, error: 'User not found' });
    }

    res.json({ success: true, data: user });
  } catch (error) {
    console.error('Error updating user:', error);
    res.status(500).json({ success: false, error: 'Failed to update user' });
  }
});

// POST /api/users/:id/badges - Add badge to user
router.post('/:id/badges', async (req: Request, res: Response) => {
  try {
    const { name, icon } = req.body;

    if (!name || !icon) {
      return res.status(400).json({ success: false, error: 'Missing badge name or icon' });
    }

    const user = await User.findByIdAndUpdate(
      req.params.id,
      {
        $push: {
          badges: { name, icon, earnedAt: new Date() },
        },
      },
      { new: true }
    ).select('-password');

    if (!user) {
      return res.status(404).json({ success: false, error: 'User not found' });
    }

    res.json({ success: true, data: user });
  } catch (error) {
    console.error('Error adding badge:', error);
    res.status(500).json({ success: false, error: 'Failed to add badge' });
  }
});

// GET /api/users/:id/stats - Get user statistics
router.get('/:id/stats', async (req: Request, res: Response) => {
  try {
    const user = await User.findById(req.params.id).select('totalPoints totalCo2Saved totalRecycledKg streak badges');
    if (!user) {
      return res.status(404).json({ success: false, error: 'User not found' });
    }
    res.json({ success: true, data: user });
  } catch (error) {
    console.error('Error fetching user stats:', error);
    res.status(500).json({ success: false, error: 'Failed to fetch user stats' });
  }
});

export default router;

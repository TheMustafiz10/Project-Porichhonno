const express = require('express');
const router = express.Router();
const { getUserEarnings } = require('../data/store');
const { requireAuth } = require('../middleware/auth');

// GET /api/user/earnings - View current user's earnings/points
router.get('/', requireAuth, (req, res) => {
  const earnings = getUserEarnings(req.userId);
  if (!earnings) {
    return res.status(404).json({ success: false, error: 'User not found' });
  }
  res.json({ success: true, data: earnings });
});

module.exports = router;
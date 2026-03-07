const express = require('express');
const router = express.Router();
const {
  getIndividualLeaderboard,
  getNeighborhoodLeaderboard,
} = require('../data/store');

// GET /api/leaderboard/individuals - Top individual performers
router.get('/individuals', (req, res) => {
  const limit = parseInt(req.query.limit) || 10;
  const leaderboard = getIndividualLeaderboard(limit);
  res.json({ success: true, data: leaderboard });
});

// GET /api/leaderboard/neighborhoods - Top neighborhoods by total points
router.get('/neighborhoods', (req, res) => {
  const limit = parseInt(req.query.limit) || 10;
  const leaderboard = getNeighborhoodLeaderboard(limit);
  res.json({ success: true, data: leaderboard });
});

module.exports = router;
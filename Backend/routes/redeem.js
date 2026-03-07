const express = require('express');
const router = express.Router();
const { redeemPoints } = require('../data/store');
const { requireAuth } = require('../middleware/auth');

// POST /api/redeem-points - Redeem points for rewards
router.post('/', requireAuth, (req, res) => {
  const { amount, reason } = req.body;
  const parsedAmount = parseInt(amount);

  if (!parsedAmount || parsedAmount <= 0) {
    return res.status(400).json({
      success: false,
      error: 'Valid amount is required',
    });
  }

  const result = redeemPoints(req.userId, parsedAmount, reason || 'Points redemption');

  if (!result.success) {
    return res.status(400).json({
      success: false,
      error: result.message,
    });
  }

  res.json({
    success: true,
    data: {
      redeemed: result.record.amount,
      newBalance: result.newBalance,
      record: result.record,
    },
  });
});

module.exports = router;
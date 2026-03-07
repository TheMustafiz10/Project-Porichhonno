import express from 'express';
import {
  askAiAssistant,
  getUserHistory,
  submitFeedback,
} from './suraiya_ai.controller.js';

const router = express.Router();

/**
 * @route   POST /api/suraiya/ai-assistant/ask
 * @desc    Ask the AI assistant a question about waste sorting
 * @access  Public (or Protected - add auth middleware if needed)
 */
router.post('/ask', askAiAssistant);

/**
 * @route   GET /api/suraiya/ai-assistant/history/:userId
 * @desc    Get user's conversation history
 * @access  Protected (add auth middleware to verify userId matches logged-in user)
 */
router.get('/history/:userId', getUserHistory);

/**
 * @route   PATCH /api/suraiya/ai-assistant/feedback/:id
 * @desc    Submit feedback on AI response (helpful/not helpful)
 * @access  Public
 */
router.patch('/feedback/:id', submitFeedback);

export default router;

import express from 'express';
import {
  getAllLogs,
  getAnalytics,
  getLogById,
  deleteLog,
  exportLogsToCSV,
} from './suraiya_ai_admin.controller.js';

const router = express.Router();

/**
 * @route   GET /api/suraiya/admin/ai-logs
 * @desc    Get all AI assistant logs with filtering and pagination
 * @access  Admin only (add admin auth middleware)
 */
router.get('/', getAllLogs);

/**
 * @route   GET /api/suraiya/admin/ai-logs/analytics
 * @desc    Get analytics and statistics about AI assistant usage
 * @access  Admin only (add admin auth middleware)
 */
router.get('/analytics', getAnalytics);

/**
 * @route   GET /api/suraiya/admin/ai-logs/export/csv
 * @desc    Export logs to CSV format
 * @access  Admin only (add admin auth middleware)
 */
router.get('/export/csv', exportLogsToCSV);

/**
 * @route   GET /api/suraiya/admin/ai-logs/:id
 * @desc    Get a single log by ID
 * @access  Admin only (add admin auth middleware)
 */
router.get('/:id', getLogById);

/**
 * @route   DELETE /api/suraiya/admin/ai-logs/:id
 * @desc    Delete a log by ID
 * @access  Admin only (add admin auth middleware)
 */
router.delete('/:id', deleteLog);

export default router;

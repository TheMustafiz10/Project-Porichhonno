import SuraiyaAiAssistant from '../../user/suraiya_ai_assistant/suraiya_ai.model.js';

/**
 * Get all AI assistant logs with filtering and pagination
 * GET /api/suraiya/admin/ai-logs
 */
export const getAllLogs = async (req, res) => {
  try {
    const {
      page = 1,
      limit = 20,
      category,
      isHelpful,
      startDate,
      endDate,
      search,
    } = req.query;

    // Build filter object
    const filter = {};

    if (category && category !== 'all') {
      filter.wasteCategory = category;
    }

    if (isHelpful !== undefined && isHelpful !== 'all') {
      if (isHelpful === 'true') {
        filter.isHelpful = true;
      } else if (isHelpful === 'false') {
        filter.isHelpful = false;
      } else if (isHelpful === 'null') {
        filter.isHelpful = null;
      }
    }

    if (startDate || endDate) {
      filter.createdAt = {};
      if (startDate) {
        filter.createdAt.$gte = new Date(startDate);
      }
      if (endDate) {
        filter.createdAt.$lte = new Date(endDate);
      }
    }

    if (search) {
      filter.$or = [
        { userQuestion: { $regex: search, $options: 'i' } },
        { aiResponse: { $regex: search, $options: 'i' } },
      ];
    }

    const skip = (parseInt(page) - 1) * parseInt(limit);

    // Execute query
    const logs = await SuraiyaAiAssistant.find(filter)
      .populate('userId', 'name email') // Populate user info if User model exists
      .sort({ createdAt: -1 })
      .limit(parseInt(limit))
      .skip(skip);

    const total = await SuraiyaAiAssistant.countDocuments(filter);

    return res.status(200).json({
      success: true,
      data: {
        logs,
        pagination: {
          total,
          page: parseInt(page),
          limit: parseInt(limit),
          pages: Math.ceil(total / parseInt(limit)),
        },
      },
    });
  } catch (error) {
    console.error('Get All Logs Error:', error);
    return res.status(500).json({
      success: false,
      message: 'Failed to retrieve logs',
      error: process.env.NODE_ENV === 'development' ? error.message : undefined,
    });
  }
};

/**
 * Get analytics/statistics about AI assistant usage
 * GET /api/suraiya/admin/ai-logs/analytics
 */
export const getAnalytics = async (req, res) => {
  try {
    const { startDate, endDate } = req.query;

    // Build date filter
    const dateFilter = {};
    if (startDate || endDate) {
      dateFilter.createdAt = {};
      if (startDate) {
        dateFilter.createdAt.$gte = new Date(startDate);
      }
      if (endDate) {
        dateFilter.createdAt.$lte = new Date(endDate);
      }
    }

    // Total queries
    const totalQueries = await SuraiyaAiAssistant.countDocuments(dateFilter);

    // Category breakdown
    const categoryStats = await SuraiyaAiAssistant.aggregate([
      { $match: dateFilter },
      {
        $group: {
          _id: '$wasteCategory',
          count: { $sum: 1 },
        },
      },
      {
        $sort: { count: -1 },
      },
    ]);

    // Feedback stats
    const feedbackStats = await SuraiyaAiAssistant.aggregate([
      { $match: dateFilter },
      {
        $group: {
          _id: null,
          helpful: {
            $sum: { $cond: [{ $eq: ['$isHelpful', true] }, 1, 0] },
          },
          notHelpful: {
            $sum: { $cond: [{ $eq: ['$isHelpful', false] }, 1, 0] },
          },
          noFeedback: {
            $sum: { $cond: [{ $eq: ['$isHelpful', null] }, 1, 0] },
          },
        },
      },
    ]);

    // Average response time
    const avgResponseTime = await SuraiyaAiAssistant.aggregate([
      { $match: { ...dateFilter, responseTime: { $exists: true } } },
      {
        $group: {
          _id: null,
          avgTime: { $avg: '$responseTime' },
          minTime: { $min: '$responseTime' },
          maxTime: { $max: '$responseTime' },
        },
      },
    ]);

    // Daily trends (last 7 days if no date range specified)
    const trendStartDate = startDate
      ? new Date(startDate)
      : new Date(Date.now() - 7 * 24 * 60 * 60 * 1000);
    
    const dailyTrends = await SuraiyaAiAssistant.aggregate([
      {
        $match: {
          createdAt: { $gte: trendStartDate },
        },
      },
      {
        $group: {
          _id: {
            $dateToString: { format: '%Y-%m-%d', date: '$createdAt' },
          },
          count: { $sum: 1 },
        },
      },
      {
        $sort: { _id: 1 },
      },
    ]);

    // Top users (if userId exists)
    const topUsers = await SuraiyaAiAssistant.aggregate([
      {
        $match: {
          ...dateFilter,
          userId: { $ne: null },
        },
      },
      {
        $group: {
          _id: '$userId',
          queryCount: { $sum: 1 },
        },
      },
      {
        $sort: { queryCount: -1 },
      },
      {
        $limit: 10,
      },
    ]);

    return res.status(200).json({
      success: true,
      data: {
        totalQueries,
        categoryBreakdown: categoryStats,
        feedback: feedbackStats[0] || { helpful: 0, notHelpful: 0, noFeedback: 0 },
        responseTime: avgResponseTime[0] || { avgTime: 0, minTime: 0, maxTime: 0 },
        dailyTrends,
        topUsers,
      },
    });
  } catch (error) {
    console.error('Get Analytics Error:', error);
    return res.status(500).json({
      success: false,
      message: 'Failed to retrieve analytics',
      error: process.env.NODE_ENV === 'development' ? error.message : undefined,
    });
  }
};

/**
 * Get a single log by ID
 * GET /api/suraiya/admin/ai-logs/:id
 */
export const getLogById = async (req, res) => {
  try {
    const { id } = req.params;

    const log = await SuraiyaAiAssistant.findById(id).populate(
      'userId',
      'name email'
    );

    if (!log) {
      return res.status(404).json({
        success: false,
        message: 'Log not found',
      });
    }

    return res.status(200).json({
      success: true,
      data: log,
    });
  } catch (error) {
    console.error('Get Log By ID Error:', error);
    return res.status(500).json({
      success: false,
      message: 'Failed to retrieve log',
    });
  }
};

/**
 * Delete a log by ID (for GDPR compliance or data cleanup)
 * DELETE /api/suraiya/admin/ai-logs/:id
 */
export const deleteLog = async (req, res) => {
  try {
    const { id } = req.params;

    const deleted = await SuraiyaAiAssistant.findByIdAndDelete(id);

    if (!deleted) {
      return res.status(404).json({
        success: false,
        message: 'Log not found',
      });
    }

    return res.status(200).json({
      success: true,
      message: 'Log deleted successfully',
      data: {
        id: deleted._id,
      },
    });
  } catch (error) {
    console.error('Delete Log Error:', error);
    return res.status(500).json({
      success: false,
      message: 'Failed to delete log',
    });
  }
};

/**
 * Export logs to CSV
 * GET /api/suraiya/admin/ai-logs/export/csv
 */
export const exportLogsToCSV = async (req, res) => {
  try {
    const { startDate, endDate, category } = req.query;

    // Build filter
    const filter = {};
    if (category && category !== 'all') {
      filter.wasteCategory = category;
    }
    if (startDate || endDate) {
      filter.createdAt = {};
      if (startDate) {
        filter.createdAt.$gte = new Date(startDate);
      }
      if (endDate) {
        filter.createdAt.$lte = new Date(endDate);
      }
    }

    const logs = await SuraiyaAiAssistant.find(filter)
      .sort({ createdAt: -1 })
      .lean();

    // Create CSV header
    const csvHeader =
      'ID,User Question,AI Response,Category,Is Helpful,Response Time (ms),IP Address,Created At\n';

    // Create CSV rows
    const csvRows = logs
      .map((log) => {
        const question = `"${log.userQuestion.replace(/"/g, '""')}"`;
        const response = `"${log.aiResponse.replace(/"/g, '""')}"`;
        const helpful =
          log.isHelpful === null ? 'N/A' : log.isHelpful ? 'Yes' : 'No';
        return `${log._id},${question},${response},${log.wasteCategory},${helpful},${log.responseTime || 'N/A'},${log.ipAddress || 'N/A'},${log.createdAt}`;
      })
      .join('\n');

    const csv = csvHeader + csvRows;

    res.setHeader('Content-Type', 'text/csv');
    res.setHeader(
      'Content-Disposition',
      `attachment; filename=ai-logs-${Date.now()}.csv`
    );

    return res.status(200).send(csv);
  } catch (error) {
    console.error('Export CSV Error:', error);
    return res.status(500).json({
      success: false,
      message: 'Failed to export logs',
    });
  }
};

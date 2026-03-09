import axios from 'axios';

// Base API URL - adjust this to match your backend configuration
const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:1313/api';
const AI_LOGS_URL = `${API_BASE_URL}/suraiya/admin/ai-logs`;

/**
 * Get all AI assistant logs with filtering and pagination
 * @param {Object} params - { page?, limit?, category?, isHelpful?, startDate?, endDate?, search? }
 * @returns {Promise} Paginated logs data
 */
export const getAllLogs = async (params = {}) => {
  try {
    const response = await axios.get(AI_LOGS_URL, { params });
    return response.data;
  } catch (error) {
    console.error('Get All Logs Error:', error);
    throw error.response?.data || { message: 'Failed to retrieve logs' };
  }
};

/**
 * Get analytics and statistics about AI assistant usage
 * @param {Object} params - { startDate?, endDate? }
 * @returns {Promise} Analytics data
 */
export const getAnalytics = async (params = {}) => {
  try {
    const response = await axios.get(`${AI_LOGS_URL}/analytics`, { params });
    return response.data;
  } catch (error) {
    console.error('Get Analytics Error:', error);
    throw error.response?.data || { message: 'Failed to retrieve analytics' };
  }
};

/**
 * Get a single log by ID
 * @param {string} id - Log ID
 * @returns {Promise} Single log data
 */
export const getLogById = async (id) => {
  try {
    const response = await axios.get(`${AI_LOGS_URL}/${id}`);
    return response.data;
  } catch (error) {
    console.error('Get Log By ID Error:', error);
    throw error.response?.data || { message: 'Failed to retrieve log' };
  }
};

/**
 * Delete a log by ID
 * @param {string} id - Log ID
 * @returns {Promise} Deletion result
 */
export const deleteLog = async (id) => {
  try {
    const response = await axios.delete(`${AI_LOGS_URL}/${id}`);
    return response.data;
  } catch (error) {
    console.error('Delete Log Error:', error);
    throw error.response?.data || { message: 'Failed to delete log' };
  }
};

/**
 * Export logs to CSV
 * @param {Object} params - { startDate?, endDate?, category? }
 * @returns {Promise} CSV blob
 */
export const exportLogsToCSV = async (params = {}) => {
  try {
    const response = await axios.get(`${AI_LOGS_URL}/export/csv`, {
      params,
      responseType: 'blob',
    });
    
    // Create download link
    const url = window.URL.createObjectURL(new Blob([response.data]));
    const link = document.createElement('a');
    link.href = url;
    link.setAttribute('download', `ai-logs-${Date.now()}.csv`);
    document.body.appendChild(link);
    link.click();
    link.remove();
    window.URL.revokeObjectURL(url);
    
    return { success: true, message: 'CSV downloaded successfully' };
  } catch (error) {
    console.error('Export CSV Error:', error);
    throw error.response?.data || { message: 'Failed to export logs' };
  }
};

export default {
  getAllLogs,
  getAnalytics,
  getLogById,
  deleteLog,
  exportLogsToCSV,
};

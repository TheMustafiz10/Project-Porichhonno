import axios from 'axios';

// Base API URL - adjust this to match your backend configuration
const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';
const AI_ASSISTANT_URL = `${API_BASE_URL}/suraiya/ai-assistant`;

/**
 * Ask the AI assistant a question about waste sorting
 * @param {Object} questionData - { question, userId?, sessionId? }
 * @returns {Promise} Response with AI answer
 */
export const askQuestion = async (questionData) => {
  try {
    const response = await axios.post(`${AI_ASSISTANT_URL}/ask`, questionData);
    return response.data;
  } catch (error) {
    console.error('Ask Question Error:', error);
    throw error.response?.data || { message: 'Failed to get AI response' };
  }
};

/**
 * Get user's conversation history
 * @param {string} userId - User ID
 * @param {Object} params - { page?, limit? }
 * @returns {Promise} User's conversation history
 */
export const getUserHistory = async (userId, params = {}) => {
  try {
    const response = await axios.get(`${AI_ASSISTANT_URL}/history/${userId}`, {
      params,
    });
    return response.data;
  } catch (error) {
    console.error('Get User History Error:', error);
    throw error.response?.data || { message: 'Failed to retrieve history' };
  }
};

/**
 * Submit feedback on an AI response
 * @param {string} conversationId - Conversation ID
 * @param {boolean} isHelpful - Whether the response was helpful
 * @returns {Promise} Feedback submission result
 */
export const submitFeedback = async (conversationId, isHelpful) => {
  try {
    const response = await axios.patch(
      `${AI_ASSISTANT_URL}/feedback/${conversationId}`,
      { isHelpful }
    );
    return response.data;
  } catch (error) {
    console.error('Submit Feedback Error:', error);
    throw error.response?.data || { message: 'Failed to submit feedback' };
  }
};

export default {
  askQuestion,
  getUserHistory,
  submitFeedback,
};

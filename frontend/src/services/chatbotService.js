import api from './api';

/**
 * Chatbot Service
 * Handles all chatbot-related API calls
 */

const chatbotService = {
  /**
   * Send a message to the chatbot and get AI response
   * @param {string} message - User's message
   * @returns {Promise} Response with bot reply and metadata
   */
  sendMessage: async (message) => {
    try {
      const response = await api.post('/chatbot', { message });
      return {
        success: true,
        data: response.data
      };
    } catch (error) {
      return {
        success: false,
        error: error.response?.data?.error || 'Failed to send message',
        details: error.response?.data?.details || error.message
      };
    }
  },


  /**
   * Get chatbot status and available features
   * @returns {Promise} Bot status information
   */
  getStatus: async () => {
    try {
      const response = await api.get('/chatbot/status');
      return {
        success: true,
        data: response.data
      };
    } catch (error) {
      return {
        success: false,
        error: error.response?.data?.error || 'Failed to get status'
      };
    }
  },

  /**
   * Get suggested questions based on current alerts
   * @returns {Promise} Array of suggested questions
   */
  getSuggestions: async () => {
    try {
      const response = await api.get('/chatbot/suggestions');
      return {
        success: true,
        data: response.data
      };
    } catch (error) {
      return {
        success: false,
        error: error.response?.data?.error || 'Failed to get suggestions'
      };
    }
  },

};

export default chatbotService;
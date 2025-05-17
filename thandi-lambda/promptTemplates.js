// promptTemplates.js
// All prompt templates for Thandi Lambda, as named functions with descriptions

exports.prompts = {
  /**
   * Prompt for document help
   * @param {object} user - User object with full_name
   */
  documentHelp(user) {
    return `Student ${user.full_name} needs help with required documents...`;
  },
  /**
   * Prompt for application status
   * @param {object} user - User object with full_name
   */
  applicationStatus(user) {
    return `Give a friendly explanation of ${user.full_name}'s application status...`;
  },
  /**
   * General Q&A prompt
   * @param {string} question - The user's question
   */
  general(question) {
    return `Answer this clearly: ${question}`;
  }
};

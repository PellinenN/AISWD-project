/**
 * suggestionService.js - API service for suggestions
 * Fetches suggestions based on mood and entry content
 */

const API_BASE = process.env.REACT_APP_API_BASE || 'http://localhost:5000';

/**
 * Get suggestions based on mood and entry content
 * @param {number} moodId - The mood ID
 * @param {string} content - The entry content to analyze for keywords
 * @returns {Promise<Array>} Array of suggestion objects
 */
export const getSuggestions = async (moodId, content) => {
  try {
    if (!moodId || !content) {
      console.warn('getSuggestions requires moodId and content');
      return [];
    }

    // Encode content for URL query parameter
    const encodedContent = encodeURIComponent(content);
    const response = await fetch(
      `${API_BASE}/suggestions?mood_id=${moodId}&content=${encodedContent}`
    );

    if (!response.ok) {
      throw new Error(`Failed to fetch suggestions: ${response.statusText}`);
    }

    const data = await response.json();
    
    // Deduplicate suggestions by ID if needed
    if (Array.isArray(data)) {
      const seen = new Set();
      return data.filter((suggestion) => {
        if (seen.has(suggestion.id)) {
          return false;
        }
        seen.add(suggestion.id);
        return true;
      });
    }

    return data.suggestions || [];
  } catch (error) {
    console.error('Error fetching suggestions:', error);
    throw error;
  }
};

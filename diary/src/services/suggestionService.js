/**
 * suggestionService.js - API service for suggestions
 * Fetches suggestions based on mood and entry content
 */

const API_BASE = process.env.REACT_APP_API_BASE || 'http://localhost:5000';

/**
 * Get suggestions based on moods and entry content
 * @param {Array<number>|number} moodIds - The mood ID(s) (array or single value, optional)
 * @param {string} content - The entry content to analyze for keywords
 * @returns {Promise<Array>} Array of suggestion objects
 */
export const getSuggestions = async (moodIds = [], content = '') => {
  try {
    // Handle empty inputs gracefully
    if (!content) {
      console.warn('getSuggestions requires content');
      return [];
    }

    // Normalize moodIds to array
    const moods = Array.isArray(moodIds) ? moodIds : (moodIds ? [moodIds] : []);
    
    // Build query string with mood IDs
    const moodQueryString = moods.length > 0 
      ? moods.map((id, idx) => `mood_ids[${idx}]=${id}`).join('&')
      : '';
    
    // Encode content for URL query parameter
    const encodedContent = encodeURIComponent(content);
    const separator = moodQueryString ? '&' : '';
    
    const url = moodQueryString
      ? `${API_BASE}/suggestions?${moodQueryString}${separator}content=${encodedContent}`
      : `${API_BASE}/suggestions?content=${encodedContent}`;

    const response = await fetch(url);

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

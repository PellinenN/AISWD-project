/**
 * DiaryStorage.js - API wrapper for frontend calls to backend
 * Centralizes all API communication for diary entries, moods, and suggestions
 */

const API_BASE = process.env.REACT_APP_API_BASE || 'http://localhost:5000';

/**
 * Add a new diary entry
 * @param {string} userId - The user ID
 * @param {string} title - Entry title
 * @param {string} text - Entry content
 * @param {Array<number>} moodIds - Array of mood IDs (can be empty)
 * @returns {Promise<Object>} Created entry object
 */
export const addEntry = async (userId, title, text, moodIds = []) => {
  try {
    const response = await fetch(`${API_BASE}/entries`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        user_id: userId,
        content: text,
        mood_ids: Array.isArray(moodIds) ? moodIds : [],
      }),
    });

    if (!response.ok) {
      throw new Error(`Failed to create entry: ${response.statusText}`);
    }

    const data = await response.json();
    return data;
  } catch (error) {
    console.error('Error adding entry:', error);
    throw error;
  }
};

/**
 * Get all entries for a user
 * @param {string} userId - The user ID
 * @returns {Promise<Array>} Array of entry objects
 */
export const getAllEntries = async (userId) => {
  try {
    const response = await fetch(`${API_BASE}/entries?user_id=${userId}`);

    if (!response.ok) {
      throw new Error(`Failed to fetch entries: ${response.statusText}`);
    }

    const data = await response.json();
    return data.entries || data;
  } catch (error) {
    console.error('Error fetching entries:', error);
    throw error;
  }
};

/**
 * Update an existing entry
 * @param {string} entryId - The entry ID to update
 * @param {string} userId - The user ID
 * @param {string} text - Updated entry content
 * @param {number} mood - Updated mood ID
 * @returns {Promise<Object>} Updated entry object
 */
export const updateEntry = async (entryId, userId, text, mood) => {
  try {
    const response = await fetch(`${API_BASE}/entries/${entryId}`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        user_id: userId,
        content: text,
        mood_id: mood,
      }),
    });

    if (!response.ok) {
      throw new Error(`Failed to update entry: ${response.statusText}`);
    }

    const data = await response.json();
    return data;
  } catch (error) {
    console.error('Error updating entry:', error);
    throw error;
  }
};

/**
 * Delete an entry
 * @param {string} entryId - The entry ID to delete
 * @param {string} userId - The user ID
 * @returns {Promise<Object>} Response from server
 */
export const deleteEntry = async (entryId, userId) => {
  try {
    const response = await fetch(`${API_BASE}/entries/${entryId}`, {
      method: 'DELETE',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        user_id: userId,
      }),
    });

    if (!response.ok) {
      throw new Error(`Failed to delete entry: ${response.statusText}`);
    }

    const data = await response.json();
    return data;
  } catch (error) {
    console.error('Error deleting entry:', error);
    throw error;
  }
};

/**
 * Get mood summaries aggregated by mood for a user
 * Fetches all entries and aggregates counts by mood
 * @param {string} userId - The user ID
 * @returns {Promise<Array>} Array of mood summary objects with count and mood details
 */
export const getMoodSummaries = async (userId) => {
  try {
    const entries = await getAllEntries(userId);
    
    // Aggregate moods
    const moodMap = {};
    if (Array.isArray(entries)) {
      entries.forEach((entry) => {
        const moodId = entry.mood_id;
        if (moodId) {
          if (!moodMap[moodId]) {
            moodMap[moodId] = {
              mood_id: moodId,
              count: 0,
            };
          }
          moodMap[moodId].count += 1;
        }
      });
    }

    return Object.values(moodMap);
  } catch (error) {
    console.error('Error getting mood summaries:', error);
    throw error;
  }
};

/**
 * Get all available moods
 * @returns {Promise<Array>} Array of mood objects
 */
export const getAllMoods = async () => {
  try {
    const response = await fetch(`${API_BASE}/moods`);

    if (!response.ok) {
      throw new Error(`Failed to fetch moods: ${response.statusText}`);
    }

    const data = await response.json();
    return data.moods || data;
  } catch (error) {
    console.error('Error fetching moods:', error);
    throw error;
  }
};

/**
 * Get a specific mood by ID
 * @param {number} moodId - The mood ID
 * @returns {Promise<Object>} Mood object
 */
export const getMoodById = async (moodId) => {
  try {
    const response = await fetch(`${API_BASE}/moods/${moodId}`);

    if (!response.ok) {
      throw new Error(`Failed to fetch mood: ${response.statusText}`);
    }

    const data = await response.json();
    return data.mood || data;
  } catch (error) {
    console.error('Error fetching mood:', error);
    throw error;
  }
};

/**
 * Record user mood selection
 * @param {string} userId - The user ID
 * @param {number} moodId - The mood ID selected
 * @returns {Promise<Object>} Response with user and mood info
 */
export const selectMood = async (userId, moodId) => {
  try {
    const response = await fetch(`${API_BASE}/moods/select`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        user_id: userId,
        mood_id: moodId,
      }),
    });

    if (!response.ok) {
      throw new Error(`Failed to select mood: ${response.statusText}`);
    }

    const data = await response.json();
    return data;
  } catch (error) {
    console.error('Error selecting mood:', error);
    throw error;
  }
};

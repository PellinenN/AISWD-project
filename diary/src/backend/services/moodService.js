import moodRepository from '../repositories/moodRepository.js';

class MoodService {
    /**
     * Get all available moods
     * @returns {object} - Returns { success: boolean, moods: Mood[], count: number, message: string }
     */
    getAllMoods() {
        try {
            const moods = moodRepository.getAllMoods();

            return {
                success: true,
                moods: moods.map(mood => ({
                    id: mood.id,
                    name: mood.name
                })),
                count: moods.length,
                message: 'Moods retrieved successfully'
            };
        } catch (error) {
            console.error('Error retrieving moods:', error);
            return {
                success: false,
                moods: [],
                count: 0,
                message: `Failed to retrieve moods: ${error.message}`
            };
        }
    }

    /**
     * Get a specific mood by ID
     * @param {number} mood_id - The mood ID
     * @returns {object} - Returns { success: boolean, mood: Mood|null, message: string }
     */
    getMoodById(mood_id) {
        try {
            if (!mood_id) {
                return {
                    success: false,
                    mood: null,
                    message: 'Mood ID is required'
                };
            }

            const mood = moodRepository.getMoodById(mood_id);

            if (!mood) {
                return {
                    success: false,
                    mood: null,
                    message: 'Mood not found'
                };
            }

            return {
                success: true,
                mood: {
                    id: mood.id,
                    name: mood.name
                },
                message: 'Mood retrieved successfully'
            };
        } catch (error) {
            console.error('Error retrieving mood:', error);
            return {
                success: false,
                mood: null,
                message: `Failed to retrieve mood: ${error.message}`
            };
        }
    }

    /**
     * Validate if a mood ID exists
     * @param {number} mood_id - The mood ID to validate
     * @returns {boolean} - Returns true if mood exists, false otherwise
     */
    validateMoodId(mood_id) {
        try {
            if (!mood_id) {
                return false;
            }

            const mood = moodRepository.getMoodById(mood_id);
            return mood !== null;
        } catch (error) {
            console.error('Error validating mood ID:', error);
            return false;
        }
    }
}

export default new MoodService();

import moodService from '../services/moodService.js';

class MoodController {
    /**
     * Get all available moods for the user to select from
     * @param {object} req - Express request object
     * @param {object} res - Express response object
     */
    getAllMoods(req, res) {
        try {
            const result = moodService.getAllMoods();

            if (!result.success) {
                return res.status(400).json({ success: false, message: result.message });
            }

            return res.status(200).json({ success: true, moods: result.moods });
        } catch (error) {
            console.error('Error fetching moods:', error);
            return res.status(500).json({ success: false, message: 'Failed to fetch moods' });
        }
    }

    /**
     * Get a specific mood by its ID
     * @param {object} req - Express request object with mood id in params
     * @param {object} res - Express response object
     */
    getMoodById(req, res) {
        try {
            const mood_id = Number(req.params.id);

            if (isNaN(mood_id)) {
                return res.status(400).json({ success: false, message: 'Invalid mood ID' });
            }

            const result = moodService.getMoodById(mood_id);

            if (!result.success) {
                return res.status(404).json({ success: false, message: result.message });
            }

            return res.status(200).json({ success: true, mood: result.mood });
        } catch (error) {
            console.error('Error fetching mood:', error);
            return res.status(500).json({ success: false, message: 'Failed to fetch mood' });
        }
    }

    /**
     * Record user's mood selection
     * Validates the mood ID and prepares data for suggestion controller
     * @param {object} req - Express request object containing user_id and mood_id in body
     * @param {object} res - Express response object
     */
    selectMood(req, res) {
        try {
            const { user_id, mood_id } = req.body;

            // Validate required fields
            if (!user_id || !mood_id) {
                return res.status(400).json({
                    success: false,
                    message: 'User ID and Mood ID are required'
                });
            }

            const parsed_user_id = Number(user_id);
            const parsed_mood_id = Number(mood_id);

            if (isNaN(parsed_user_id) || isNaN(parsed_mood_id)) {
                return res.status(400).json({
                    success: false,
                    message: 'Invalid User ID or Mood ID'
                });
            }

            // Validate that the mood exists
            const moodResult = moodService.getMoodById(parsed_mood_id);
            if (!moodResult.success) {
                return res.status(400).json({
                    success: false,
                    message: moodResult.message
                });
            }

            // Return the selected mood data for use by suggestion controller
            return res.status(200).json({
                success: true,
                user_id: parsed_user_id,
                mood: moodResult.mood,
                message: 'Mood selected successfully'
            });
        } catch (error) {
            console.error('Error selecting mood:', error);
            return res.status(500).json({ success: false, message: 'Failed to select mood' });
        }
    }
}

const moodController = new MoodController();
export default moodController;

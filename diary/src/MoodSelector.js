import React, { useState, useEffect } from 'react';
import { useAuth } from './AuthContext.js';
import { getAllMoods, selectMood } from './DiaryStorage.js';

const MoodSelector = ({ selectedMood, onMoodSelect }) => {
  const { userId } = useAuth();
  const [moods, setMoods] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    fetchMoods();
  }, []);

  const fetchMoods = async () => {
    try {
      setIsLoading(true);
      setError(null);
      const fetchedMoods = await getAllMoods();
      setMoods(fetchedMoods);
    } catch (err) {
      setError('Failed to load moods');
      console.error('Error fetching moods:', err);
    } finally {
      setIsLoading(false);
    }
  };

  const handleMoodChange = async (moodId) => {
    try {
      // Notify parent component
      onMoodSelect(moodId);

      // Record mood selection in backend
      if (userId) {
        await selectMood(userId, moodId);
      }
    } catch (err) {
      console.error('Error selecting mood:', err);
    }
  };

  if (isLoading) {
    return <div className="mood-selector-loading">Loading moods...</div>;
  }

  if (error) {
    return <div className="mood-selector-error">{error}</div>;
  }

  return (
    <div className="mood-selector">
      <label className="entry-field">Today's Mood</label>
      <div className="entry-mood-tracker">
        {moods.length > 0 && (
          <>
            <span className="entry-mood-label">{moods[0]?.name || 'Start'}</span>
            {moods.map((mood) => (
              <input
                key={mood.id}
                className="entry-mood-radio"
                type="radio"
                name="mood"
                value={mood.id}
                checked={selectedMood === String(mood.id)}
                onChange={(e) => handleMoodChange(e.target.value)}
                title={mood.name}
              />
            ))}
            <span className="entry-mood-label">{moods[moods.length - 1]?.name || 'Great'}</span>
          </>
        )}
      </div>
    </div>
  );
};

export default MoodSelector;

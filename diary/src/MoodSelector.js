import React, { useState, useEffect } from 'react';
import { useAuth } from './AuthContext.js';
import { getAllMoods } from './DiaryStorage.js';

const MoodSelector = ({ selectedMoods, onMoodsChange }) => {
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

  const handleMoodToggle = (moodId) => {
    if (selectedMoods.includes(moodId)) {
      // Remove mood if already selected
      onMoodsChange(selectedMoods.filter(id => id !== moodId));
    } else {
      // Add mood if not selected
      onMoodsChange([...selectedMoods, moodId]);
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
      <label className="mood-selector-label">Select Moods (Optional)</label>
      <div className="mood-buttons-container">
        {moods.length > 0 ? (
          moods.map((mood) => (
            <button
              key={mood.id}
              className={`mood-button ${selectedMoods.includes(mood.id) ? 'mood-button-selected' : ''}`}
              onClick={() => handleMoodToggle(mood.id)}
              type="button"
              title={mood.name}
            >
              {mood.name}
            </button>
          ))
        ) : (
          <div className="mood-selector-empty">No moods available</div>
        )}
      </div>
      {selectedMoods.length > 0 && (
        <div className="mood-selector-selected">
          Selected: {selectedMoods.length} mood(s)
        </div>
      )}
    </div>
  );
};

export default MoodSelector;

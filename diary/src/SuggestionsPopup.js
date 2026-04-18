import React from 'react';
import Popup from './Popup.js';
import './SuggestionsPopup.css';

const SuggestionsPopup = ({ isOpen, suggestions, onClose }) => {
  if (!suggestions || suggestions.length === 0) {
    return (
      <Popup isOpen={isOpen} onClose={onClose}>
        <div className="suggestions-popup-content">
          <h2>Suggestions</h2>
          <p>No suggestions available at this time.</p>
          <button onClick={onClose}>Close</button>
        </div>
      </Popup>
    );
  }

  return (
    <Popup isOpen={isOpen} onClose={onClose}>
      <div className="suggestions-popup-content">
        <h2>Suggestions for You</h2>
        <div className="suggestions-list">
          {suggestions.map((suggestion, index) => (
            <div key={suggestion.id || index} className="suggestion-card">
              <p className="suggestion-text">{suggestion.text}</p>
              {suggestion.trigger_keyword && (
                <span className="suggestion-keyword">{suggestion.trigger_keyword}</span>
              )}
            </div>
          ))}
        </div>
        <button onClick={onClose} className="close-suggestions-button">Close</button>
      </div>
    </Popup>
  );
};

export default SuggestionsPopup;

import React, { useState } from "react";
import  "./DiaryStyleSheet.css";
import { useNavigate } from "react-router-dom";
import Popup from "./Popup.js";
import { addEntry } from "./DiaryStorage.js";
import MoodSelector from "./MoodSelector.js";
import SuggestionsPopup from "./SuggestionsPopup.js";
import { useAuth } from "./AuthContext.js";
import { useEffect } from "react";

 function DiaryPageUI() {
    const navigate = useNavigate();
    const { userId, username } = useAuth();
    const [isPopupOpen, setIsPopupOpen] = useState(false);
    const [popupType, setPopupType] = useState(null);
    const [suggestions, setSuggestions] = useState([]);
    const [showSuggestions, setShowSuggestions] = useState(false);
    const [isLoading, setIsLoading] = useState(false);
    const [message, setMessage] = useState('');

    const [leftText, setLeftText] = useState("");
    const [title, setTitle] = useState("");
    const [text, setText] = useState("");
    const [selectedMoods, setSelectedMoods] = useState([]);

    
    useEffect(() => {
        const savedTheme = localStorage.getItem('selectedTheme');
        if (savedTheme) {
            document.body.className = '';
            document.body.classList.add(`theme-${savedTheme}`);
        }
    }, []);

    const navigateToEntry = () => {navigate('/entries')};

    const openTextPopup = () => {
    setPopupType('text');
    setIsPopupOpen(true);
    };

    const openThemePopup = () => {
    setPopupType('theme');
    setIsPopupOpen(true);
    };

    const closePopup = () => {
    setIsPopupOpen(false);
    setPopupType(null);
    };

    const switchTheme = (themeName) => {
        document.body.className = ''; // Clear previous classes
        document.body.classList.add(`theme-${themeName}`);
        localStorage.setItem('selectedTheme', themeName);
        closePopup();
    };

const handleSave = async (event) => {
    event.preventDefault();
  
    // Use the state values directly
    if (!title || !leftText) {
        setMessage('Title and Text are required!');
        return;
    }

    setIsLoading(true);
    setMessage('');

    try {
        await addEntry(userId, title, leftText, selectedMoods);
        
        const params = new URLSearchParams();
        selectedMoods.forEach((id, index) => {
            params.append(`mood_ids[${index}]`, id);
        });
        params.append('content', leftText);

        const response = await fetch(`http://localhost:5000/suggestions?${params.toString()}`);
        
        if (!response.ok) throw new Error('Failed to fetch');
        
        const fetchedSuggestions = await response.json();
        
        if (fetchedSuggestions && fetchedSuggestions.length > 0) {
            setSuggestions(fetchedSuggestions);
            setShowSuggestions(true);
            // NOTICE: We are NOT clearing the form yet! 
            // We want the user to see what they wrote alongside the suggestions.
        }

        setMessage('Entry saved successfully!');
        
        // Optional: Clear only the title/text if you REALLY want to, 
        // but keep moods until popup closes.
        // setTitle('');
        // setLeftText('');

    } catch (error) {
        console.error('Error:', error);
        setMessage('Failed to save entry.');
    } finally {
        setIsLoading(false);
    }
};
    return (
        <div className="diary-container">

            {/*Header*/}
            <div className="diary-header">
            <button className="diary-title" onClick={navigateToEntry}>{username || 'Diary'}</button>
            <div className="customize-section">
                <button onClick={openThemePopup}>Customize page</button> {/*Opens color popup*/}
                <span className="color-indicator"></span>
            </div>
            </div>

            {/*Diary page*/}
            <div className="diary-page">
            <div className="diary-spine"></div>
            <div className="pages">
                
                {/* Left Page */}
                <div className="left-page">
                <div className="entry-form">
                    <input
                    className="entry-field"
                    type="text"
                    id="title"
                    placeholder="Title"
                    value={title}
                    onChange={(e) => setTitle(e.target.value)}
                    />
                    <textarea
                    className="entry-field-text"
                    id="leftText"
                    maxLength="500"
                    placeholder="Maximum 500 characters"
                    value={leftText}
                    onChange={(e) => setLeftText(e.target.value)}
                    />
                </div>
                </div>

                {/* Right Page */}
                <div className="right-page">
                <div className="entry-form">
                    <div className="mood-section">
                    <MoodSelector selectedMoods={selectedMoods} onMoodsChange={setSelectedMoods} />
                    </div> {/* end of mood-section */}
                </div> {/* end of entry-form */}
                </div> {/* end of right-page */}

            </div> {/* end of pages */}
            </div> {/* end of diary-page */}

            {/*Sidebar*/}
            <div className="sidebar-button-container">
            <button className="sidebar-button" onClick={openTextPopup}>T</button>
            <button className="sidebar-button">...</button>
            </div>

            <button className="save-entry-button" onClick={handleSave} disabled={isLoading}>
                {isLoading ? 'Saving...' : 'Save'}
            </button>

            {message && <div className="message">{message}</div>}

            <Popup isOpen={isPopupOpen} onClose={closePopup}>
            {popupType === 'text' && (
                <>
                <h2>Text Tool</h2>
                <p>Test</p>
                <button onClick={closePopup}>Close</button>
                </>
            )}
            {popupType === 'theme' && (
                <>
                <div className="theme-option-container">
                    <h2>Choose a Theme</h2>
                    <div className="theme-option" onClick={() => switchTheme('brown')}>
                    <span className="theme-sphere brown"></span> Brown Theme
                    </div>
                    <div className="theme-option" onClick={() => switchTheme('neapolitan')}>
                    <span className="theme-sphere neapolitan"></span> Neapolitan Theme
                    </div>
                </div>
                </>
            )}
            </Popup>

            <SuggestionsPopup 
                isOpen={showSuggestions} 
                suggestions={suggestions} 
                onClose={() => setShowSuggestions(false)} 
            />

        </div> // end of diary-container
        );
    };
export default DiaryPageUI;
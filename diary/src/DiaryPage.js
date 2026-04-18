import React, { useState } from "react";
import  "./DiaryStyleSheet.css";
import { useNavigate } from "react-router-dom";
import Popup from "./Popup.js";
import { addEntry } from "./DiaryStorage.js";
import MoodSelector from "./MoodSelector.js";
import SuggestionsPopup from "./SuggestionsPopup.js";
import { useAuth } from "./AuthContext.js";
import { getSuggestions } from "./services/suggestionService.js";
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
      
        const title = document.getElementById('title').value; 
        const text = leftText;  // Use state for leftText

        if (!title || !text) {
            setMessage('Title and Text are required!');
            return;
        }

        if (!userId) {
            setMessage('User not authenticated');
            return;
        }

        setIsLoading(true);
        setMessage('');

        try {
            // Add entry to backend with mood_ids array (can be empty)
            await addEntry(userId, title, text, selectedMoods);
            
            // Fetch suggestions based on moods and content
            try {
                const fetchedSuggestions = await getSuggestions(selectedMoods, text);
                setSuggestions(fetchedSuggestions);
                setShowSuggestions(true);
            } catch (err) {
                console.error('Error fetching suggestions:', err);
            }

            // Reset form
            setTitle('');
            setLeftText('');
            setSelectedMoods([]);
            document.getElementById('title').value = '';
            
            setMessage('Entry saved successfully!');
            setTimeout(() => setMessage(''), 3000);
        } catch (error) {
            console.error('Error saving entry:', error);
            setMessage('Failed to save entry. Please try again.');
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
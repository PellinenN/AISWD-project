import React, {useEffect, useState} from "react";
import  "./DiaryStyleSheet.css";
import { useNavigate } from "react-router-dom";
import { getAllEntries, updateEntry, getMoodSummaries } from "./DiaryStorage.js";
import { useAuth } from "./AuthContext.js";

{/*Draw Entry page UI*/}
function EntryPageUI() {
    const { userId, username } = useAuth();
    const [selectedEntry, setSelectedEntry] = useState(null);

    const navigate = useNavigate();
    const navigateToDiary = () => {navigate('/')}

    const [entries, setEntries] = useState([]);
    const [monthSummaries, setMonthSummaries] = useState({});
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState(null);

    // Helper function to format moods display with "+N more" badge
    const getMoodDisplay = (moods) => {
        if (!moods || moods.length === 0) {
            return 'No mood';
        }
        const firstThreeMoods = moods.slice(0, 3).map(m => m.name).join(', ');
        const remaining = moods.length - 3;
        if (remaining > 0) {
            return `${firstThreeMoods} +${remaining}`;
        }
        return firstThreeMoods;
    };

    // Group entries by month and collect moods
    const groupEntriesByMonth = (entries) => {
        const months = {};
        entries.forEach(entry => {
            const date = new Date(entry.created_at);
            const monthKey = `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}`;
            if (!months[monthKey]) {
                months[monthKey] = [];
            }
            months[monthKey].push(entry);
        });
        return months;
    };

    useEffect(() => {
        const fetchEntries = async () => {
            try {
                setIsLoading(true);
                setError(null);
                if (!userId) {
                    setError('User not authenticated');
                    return;
                }
                const fetchedEntries = await getAllEntries(userId);
                setEntries(fetchedEntries || []);
                const grouped = groupEntriesByMonth(fetchedEntries || []);
                setMonthSummaries(grouped);
            } catch (err) {
                console.error('Error fetching entries:', err);
                setError('Failed to load entries');
            } finally {
                setIsLoading(false);
            }
        };

        fetchEntries();
    }, [userId]);

    return (
        <div className="diary-container">
            
        {/*Header*/}
        <div className="diary-header">
            <button className="diary-title" onClick={navigateToDiary}>{username || 'Diary'}</button>
            <div className="customize-section">
                <button>Customize page</button>
                <span className="color-indicator"></span>
            </div>
        </div>

        {/*Diary page*/}
        <div className="diary-page">
        <div className ="diary-spine"></div>
            <div className="pages">
                <div className="left-page">
                    <div className="page-header">Mood Summaries</div>
                    <div className="sub-header">Recent Months</div>
                        <ul>
                            {Object.entries(monthSummaries).sort().reverse().map(([monthKey, monthEntries]) => {
                                const [year, month] = monthKey.split('-');
                                const date = new Date(year, parseInt(month) - 1);
                                const monthName = date.toLocaleString('default', { month: 'long', year: 'numeric'});
                                
                                // Collect all moods from entries in this month
                                const moods = {};
                                monthEntries.forEach(entry => {
                                    if (entry.moods && Array.isArray(entry.moods)) {
                                        entry.moods.forEach(mood => {
                                            moods[mood.id] = mood.name;
                                        });
                                    }
                                });
                                const moodList = Object.values(moods).join(', ') || 'No moods';
                                
                                return (
                                    <li key={monthKey} className="entry-item">
                                        <strong>{monthName}</strong><br/>
                                        Entries: {monthEntries.length}<br/>
                                        <small>{moodList}</small>
                                    </li>
                                )
                            })}
                        </ul>
                </div>
                <div className="right-page">
                    <div className="page-header">Entries</div>
                    <div className="sub-header">This Month</div>
                        <ul>
                            {entries.map(entry => (
                                <li key={entry.id} onClick={() => setSelectedEntry(entry)} className="entry-item">
                                    <strong>{entry.title}</strong><br/>
                                    <small>{new Date(entry.created_at).toLocaleDateString()}</small><br/>
                                    <small className="entry-moods">{getMoodDisplay(entry.moods)}</small>
                                </li>
                            ))}
                        </ul>
                </div>
            </div>
        </div>
        {/*Popup modal*/}
        {selectedEntry && (
            <div className="modal-background" onClick={() => setSelectedEntry(null)}>
                <div className="modal-content" onClick={(e) => e.stopPropagation()}>
                    <h2>Edit Entry</h2>
                    <div>
                        <input 
                            type="text"
                            value={selectedEntry.title || ''}
                            onChange={(e) => setSelectedEntry({...selectedEntry, title: e.target.value})}>
                        </input>
                    </div>
                    <div>
                        <textarea
                            value={selectedEntry.content || ''}
                            onChange={(e) => setSelectedEntry({...selectedEntry, content: e.target.value})}>
                        </textarea>
                    </div>
                    <div>
                        <button onClick={() => {
                            updateEntry(selectedEntry.id, userId, selectedEntry.title, selectedEntry.content); 
                            setSelectedEntry(null);
                            }} className="button">Save</button>
                        <button onClick={() => setSelectedEntry(null)} className="button">Cancel</button>
                    </div>
                </div>
            </div>
        )}
    </div>
   );
}

export default EntryPageUI;
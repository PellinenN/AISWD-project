import React, {useEffect, useState} from "react";
import  "./DiaryStyleSheet.css";
import { useNavigate } from "react-router-dom";
import { getAllEntries, updateEntry, getMoodSummaries } from "./DiaryStorage";
import { useAuth } from "./AuthContext.js";

{/*Draw Entry page UI*/}
function EntryPageUI() {
    const { userId } = useAuth();
    const [selectedEntry, setSelectedEntry] = useState(null);

    const navigate = useNavigate();
    const navigateToDiary = () => {navigate('/')}

    const [entries, setEntries] = useState([]);
    const [moodSummaries, setMoodSummaries] = useState({});
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState(null);

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
                const summaries = await getMoodSummaries(userId);
                setMoodSummaries(summaries || {});
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
            <button className="diary-title" onClick={navigateToDiary}>Diary Entries</button>
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
                            {Object.entries(moodSummaries).map(([month,data]) => {
                                const averageMood = data.count > 0 ? (data.moodSum / data.count).toFixed(2) : "N/A";
                                const date = new Date(month + "-01");
                                const monthName = date.toLocaleString('default', { month: 'long', year: 'numeric'});
                                return (
                                    <li key={month} className="entry-item">
                                        <strong>{monthName}</strong><br/>
                                        Avg Mood: {averageMood}
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
                                    <small>{new Date(entry.timestamp).toLocaleDateString()}</small>
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
                            value={selectedEntry.title}
                            onChange={(e) => setSelectedEntry({...selectedEntry, title: e.target.value})}>
                        </input>
                    </div>
                    <div>
                        <textarea
                            value={selectedEntry.text}
                            onChange={(e) => setSelectedEntry({...selectedEntry, text: e.target.value})}>
                        </textarea>
                    </div>
                    <div>
                        <button onClick={() => {
                            updateEntry(selectedEntry.id,{title: selectedEntry.title,text: selectedEntry.text}); setSelectedEntry(null);
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
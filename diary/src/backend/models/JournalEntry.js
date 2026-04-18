class JournalEntry {
    constructor(id, user_id, title, content, mood_id, created_at, updated_at, moods = []) {
        this.id = id;
        this.user_id = user_id;
        this.title = title;
        this.content = content;
        this.mood_id = mood_id; // kept for backward compatibility
        this.created_at = created_at;
        this.updated_at = updated_at;
        this.moods = moods; // array of {id, name} objects from entry_moods
    }
}

export default JournalEntry;
class JournalEntry {
    constructor(id, user_id, content, mood_id, created_at, updated_at) {
        this.id = id;
        this.user_id = user_id;
        this.content = content;
        this.mood_id = mood_id;
        this.created_at = created_at;
        this.updated_at = updated_at;
    }
}

export default JournalEntry;
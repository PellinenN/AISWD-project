export class JournalEntry {
    constructor(id, userId, content, moodId, createdAt, updatedAt) {
        this.id = id;
        this.userId = userId;
        this.content = content;
        this.moodId = moodId;
        this.createdAt = createdAt;
        this.updatedAt = updatedAt;
    }
}
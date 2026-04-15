import entryRepository from '../repositories/entryRepository.js';

class EntryService {
    createEntry(userId, content, moodId) {
        try {
            if (!userId || !content || !moodId) {
                return { success: false, entry: null, message: 'User ID, content, and mood ID are required' };
            }

            if (typeof content !== 'string') {
                return { success: false, entry: null, message: 'Content must be a string' };
            }

            const trimmedContent = content.trim();
            if (trimmedContent.length === 0) {
                return { success: false, entry: null, message: 'Content cannot be empty' };
            }

            if (trimmedContent.length > 10000) {
                return { success: false, entry: null, message: 'Content cannot exceed 10000 characters' };
            }

            const entry = entryRepository.createEntry(userId, trimmedContent, moodId);
            return { success: true, entry, message: 'Entry created successfully' };
        } catch (error) {
            console.error('Error creating entry:', error);
            return { success: false, entry: null, message: `Failed to create entry: ${error.message}` };
        }
    }

    updateEntry(entryId, userId, content, moodId) {
        try {
            if (!entryId || !userId || !content || !moodId) {
                return { success: false, entry: null, message: 'Entry ID, user ID, content, and mood ID are required' };
            }

            const existingEntry = entryRepository.getEntryById(entryId);
            if (!existingEntry) {
                return { success: false, entry: null, message: 'Entry not found' };
            }

            if (existingEntry.userId !== userId) {
                return { success: false, entry: null, message: 'Unauthorized: You can only update your own entries' };
            }

            const trimmedContent = content.trim();
            if (trimmedContent.length === 0) {
                return { success: false, entry: null, message: 'Content cannot be empty' };
            }

            if (trimmedContent.length > 10000) {
                return { success: false, entry: null, message: 'Content cannot exceed 10000 characters' };
            }

            const updatedEntry = entryRepository.updateEntry(entryId, trimmedContent, moodId);
            return { success: true, entry: updatedEntry, message: 'Entry updated successfully' };
        } catch (error) {
            console.error('Error updating entry:', error);
            return { success: false, entry: null, message: `Failed to update entry: ${error.message}` };
        }
    }

    deleteEntry(entryId, userId) {
        try {
            if (!entryId || !userId) {
                return { success: false, message: 'Entry ID and user ID are required' };
            }

            const entry = entryRepository.getEntryById(entryId);
            if (!entry) {
                return { success: false, message: 'Entry not found' };
            }

            if (entry.userId !== userId) {
                return { success: false, message: 'Unauthorized: You can only delete your own entries' };
            }

            entryRepository.deleteEntry(entryId);
            return { success: true, message: 'Entry deleted successfully' };
        } catch (error) {
            console.error('Error deleting entry:', error);
            return { success: false, message: `Failed to delete entry: ${error.message}` };
        }
    }

    getEntryById(entryId) {
        try {
            if (!entryId) {
                return { success: false, entry: null, message: 'Entry ID is required' };
            }

            const entry = entryRepository.getEntryById(entryId);
            if (!entry) {
                return { success: false, entry: null, message: 'Entry not found' };
            }

            return { success: true, entry, message: 'Entry found' };
        } catch (error) {
            console.error('Error fetching entry:', error);
            return { success: false, entry: null, message: `Failed to fetch entry: ${error.message}` };
        }
    }

    getEntries(userId = null, moodId = null, keyword = null) {
        try {
            let entries = [];

            if (keyword && userId) {
                entries = entryRepository.searchEntriesByKeyword(userId, keyword);
            } else if (userId && moodId) {
                entries = entryRepository.getEntriesByUserId(userId).filter(entry => entry.moodId === moodId);
            } else if (userId) {
                entries = entryRepository.getEntriesByUserId(userId);
            } else if (moodId) {
                entries = entryRepository.getEntriesByMoodId(moodId);
            } else {
                entries = entryRepository.getAllEntries();
            }

            return { success: true, entries, message: 'Entries retrieved successfully' };
        } catch (error) {
            console.error('Error fetching entries:', error);
            return { success: false, entries: [], message: `Failed to retrieve entries: ${error.message}` };
        }
    }

    getUserEntries(userId, limit = 50, offset = 0) {
        try {
            if (!userId) {
                return {
                    success: false,
                    entries: [],
                    total: 0,
                    message: 'User ID is required'
                };
            }

            const entries = entryRepository.getEntriesByUserId(userId);
            const paginatedEntries = entries.slice(offset, offset + limit);

            return {
                success: true,
                entries: paginatedEntries.map(entry => ({
                    id: entry.id,
                    userId: entry.userId,
                    content: entry.content,
                    moodId: entry.moodId,
                    createdAt: entry.createdAt,
                    updatedAt: entry.updatedAt
                })),
                total: entries.length,
                message: 'Entries retrieved successfully'
            };
        } catch (error) {
            console.error('Error retrieving user entries:', error);
            return {
                success: false,
                entries: [],
                total: 0,
                message: `Failed to retrieve entries: ${error.message}`
            };
        }
    }

    searchEntries(userId, keyword) {
        try {
            if (!userId || !keyword) {
                return {
                    success: false,
                    entries: [],
                    count: 0,
                    message: 'User ID and keyword are required'
                };
            }

            if (typeof keyword !== 'string' || keyword.trim().length === 0) {
                return {
                    success: false,
                    entries: [],
                    count: 0,
                    message: 'Keyword must be a non-empty string'
                };
            }

            const entries = entryRepository.searchEntriesByKeyword(userId, keyword.trim());

            return {
                success: true,
                entries: entries.map(entry => ({
                    id: entry.id,
                    userId: entry.userId,
                    content: entry.content,
                    moodId: entry.moodId,
                    createdAt: entry.createdAt,
                    updatedAt: entry.updatedAt
                })),
                count: entries.length,
                message: `Found ${entries.length} entries matching "${keyword}"`
            };
        } catch (error) {
            console.error('Error searching entries:', error);
            return {
                success: false,
                entries: [],
                count: 0,
                message: `Failed to search entries: ${error.message}`
            };
        }
    }

    getEntriesByMood(moodId, userId = null) {
        try {
            if (!moodId) {
                return {
                    success: false,
                    entries: [],
                    count: 0,
                    message: 'Mood ID is required'
                };
            }

            let entries = entryRepository.getEntriesByMoodId(moodId);

            if (userId) {
                entries = entries.filter(entry => entry.userId === userId);
            }

            return {
                success: true,
                entries: entries.map(entry => ({
                    id: entry.id,
                    userId: entry.userId,
                    content: entry.content,
                    moodId: entry.moodId,
                    createdAt: entry.createdAt,
                    updatedAt: entry.updatedAt
                })),
                count: entries.length,
                message: 'Entries retrieved successfully'
            };
        } catch (error) {
            console.error('Error retrieving entries by mood:', error);
            return {
                success: false,
                entries: [],
                count: 0,
                message: `Failed to retrieve entries: ${error.message}`
            };
        }
    }
}

export default new EntryService();


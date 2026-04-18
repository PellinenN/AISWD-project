import entryRepository from '../repositories/entryRepository.js';

class EntryService {
    createEntry(user_id, title, content, mood_ids = []) {
        try {
            // user_id and content are required, title and mood_ids are optional
            if (!user_id || !content) {
                return { success: false, entry: null, message: 'User ID and content are required' };
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

            // Validate title if provided
            let trimmedTitle = null;
            if (title) {
                if (typeof title !== 'string') {
                    return { success: false, entry: null, message: 'Title must be a string' };
                }
                trimmedTitle = title.trim();
                // Convert empty string back to null after trimming
                if (trimmedTitle.length === 0) {
                    trimmedTitle = null;
                } else if (trimmedTitle.length > 500) {
                    return { success: false, entry: null, message: 'Title cannot exceed 500 characters' };
                }
            }

            // Ensure mood_ids is an array
            const moodIdsArray = Array.isArray(mood_ids) ? mood_ids : [];

            const entry = entryRepository.createEntry(user_id, trimmedTitle, trimmedContent, moodIdsArray);
            return { success: true, entry, message: 'Entry created successfully' };
        } catch (error) {
            console.error('Error creating entry:', error);
            return { success: false, entry: null, message: `Failed to create entry: ${error.message}` };
        }
    }

    updateEntry(entryId, user_id, title, content, mood_ids = []) {
        try {
            // user_id and content are required; title and mood_ids are optional
            if (!entryId || !user_id || !content) {
                return { success: false, entry: null, message: 'Entry ID, user ID, and content are required' };
            }

            const existingEntry = entryRepository.getEntryById(entryId);
            if (!existingEntry) {
                return { success: false, entry: null, message: 'Entry not found' };
            }

            if (existingEntry.user_id !== user_id) {
                return { success: false, entry: null, message: 'Unauthorized: You can only update your own entries' };
            }

            const trimmedContent = content.trim();
            if (trimmedContent.length === 0) {
                return { success: false, entry: null, message: 'Content cannot be empty' };
            }

            if (trimmedContent.length > 10000) {
                return { success: false, entry: null, message: 'Content cannot exceed 10000 characters' };
            }

            // Validate title if provided
            let trimmedTitle = null;
            if (title) {
                if (typeof title !== 'string') {
                    return { success: false, entry: null, message: 'Title must be a string' };
                }
                trimmedTitle = title.trim();
                // Convert empty string back to null after trimming
                if (trimmedTitle.length === 0) {
                    trimmedTitle = null;
                } else if (trimmedTitle.length > 500) {
                    return { success: false, entry: null, message: 'Title cannot exceed 500 characters' };
                }
            }

            // Ensure mood_ids is an array
            const moodIdsArray = Array.isArray(mood_ids) ? mood_ids : [];

            const updatedEntry = entryRepository.updateEntry(entryId, trimmedTitle, trimmedContent, moodIdsArray);
            return { success: true, entry: updatedEntry, message: 'Entry updated successfully' };
        } catch (error) {
            console.error('Error updating entry:', error);
            return { success: false, entry: null, message: `Failed to update entry: ${error.message}` };
        }
    }

    deleteEntry(entryId, user_id) {
        try {
            if (!entryId || !user_id) {
                return { success: false, message: 'Entry ID and user ID are required' };
            }

            const entry = entryRepository.getEntryById(entryId);
            if (!entry) {
                return { success: false, message: 'Entry not found' };
            }

            if (entry.user_id !== user_id) {
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

    getEntries(user_id = null, mood_id = null, keyword = null) {
        try {
            let entries = [];

            if (keyword && user_id) {
                entries = entryRepository.searchEntriesByKeyword(user_id, keyword);
            } else if (user_id && mood_id) {
                entries = entryRepository.getEntriesByUserId(user_id).filter(entry => entry.mood_id === mood_id);
            } else if (user_id) {
                entries = entryRepository.getEntriesByUserId(user_id);
            } else if (mood_id) {
                entries = entryRepository.getEntriesByMoodId(mood_id);
            } else {
                entries = entryRepository.getAllEntries();
            }

            return { success: true, entries, message: 'Entries retrieved successfully' };
        } catch (error) {
            console.error('Error fetching entries:', error);
            return { success: false, entries: [], message: `Failed to retrieve entries: ${error.message}` };
        }
    }

    getUserEntries(user_id, limit = 50, offset = 0) {
        try {
            if (!user_id) {
                return {
                    success: false,
                    entries: [],
                    total: 0,
                    message: 'User ID is required'
                };
            }

            const entries = entryRepository.getEntriesByUserId(user_id);
            const paginatedEntries = entries.slice(offset, offset + limit);

            return {
                success: true,
                entries: paginatedEntries.map(entry => ({
                    id: entry.id,
                    user_id: entry.user_id,
                    title: entry.title,
                    content: entry.content,
                    mood_id: entry.mood_id,
                    created_at: entry.created_at,
                    updated_at: entry.updated_at
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

    searchEntries(user_id, keyword) {
        try {
            if (!user_id || !keyword) {
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

            const entries = entryRepository.searchEntriesByKeyword(user_id, keyword.trim());

            return {
                success: true,
                entries: entries.map(entry => ({
                    id: entry.id,
                    user_id: entry.user_id,
                    title: entry.title,
                    content: entry.content,
                    mood_id: entry.mood_id,
                    created_at: entry.created_at,
                    updated_at: entry.updated_at
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

    getEntriesByMood(mood_id, user_id = null) {
        try {
            if (!mood_id) {
                return {
                    success: false,
                    entries: [],
                    count: 0,
                    message: 'Mood ID is required'
                };
            }

            let entries = entryRepository.getEntriesByMoodId(mood_id);

            if (user_id) {
                entries = entries.filter(entry => entry.user_id === user_id);
            }

            return {
                success: true,
                entries: entries.map(entry => ({
                    id: entry.id,
                    user_id: entry.user_id,
                    title: entry.title,
                    content: entry.content,
                    mood_id: entry.mood_id,
                    created_at: entry.created_at,
                    updated_at: entry.updated_at
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


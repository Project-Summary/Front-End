import API from "../api";

export interface CreatePreferencesData {
    title: string;
    description?: string;
    type: string;
    isPublic?: boolean;
    tags?: string[];
    thumbnail?: string;
}

export interface UpdatePreferencesData {
    title?: string;
    description?: string;
    type?: string;
    isPublic?: boolean;
    tags?: string[];
    thumbnail?: string;
}

export interface AddItemData {
    contentId: string;
    contentType: 'Movie' | 'Story';
}

export interface RemoveItemData {
    contentId: string;
    contentType: 'Movie' | 'Story';
}

export interface BulkAddItemsData {
    items: AddItemData[];
}

export interface RemoveItemsData {
    items: RemoveItemData[];
}

export interface SearchPreferencesParams {
    q: string;
    public?: boolean;
    type?: string;
}

export default class PreferencesAPI {
    // Create preferences
    static createPreferences(data: CreatePreferencesData) {
        return API.post('/preferences', data);
    }

    // Get user's preferences
    static getMyPreferences() {
        return API.get('/preferences');
    }

    // Get preferences by ID
    static getPreferencesById(preferencesId: string) {
        return API.get(`/preferences/${preferencesId}`);
    }

    // Update preferences info
    static updatePreferences(preferencesId: string, data: UpdatePreferencesData) {
        return API.patch(`/preferences/${preferencesId}`, data);
    }

    // Delete preferences
    static deletePreferences(preferenceIds: string[]) {
        return API.patch('/preferences/delete', { preferenceIds });
    }

    // Add item to preferences (unified method)
    static addItemToPreferences(preferencesId: string, data: AddItemData) {
        return API.post(`/preferences/${preferencesId}/add-item`, data);
    }

    // Bulk add items to preferences
    static bulkAddItemsToPreferences(preferencesId: string, data: BulkAddItemsData) {
        return API.post(`/preferences/${preferencesId}/bulk-add-items`, data);
    }

    // Remove items from preferences
    static removeItemsFromPreferences(preferencesId: string, data: RemoveItemsData) {
        return API.patch(`/preferences/${preferencesId}/remove-items`, data);
    }

    // Search preferences
    static searchPreferences(params: SearchPreferencesParams) {
        return API.get('/preferences/search', { params });
    }

    // Legacy methods for backward compatibility
    static addMovieToPreferences(preferencesId: string, movieId: string) {
        return this.addItemToPreferences(preferencesId, {
            contentId: movieId,
            contentType: 'Movie'
        });
    }

    static removeMoviesFromPreferences(preferencesId: string, movieIds: string[]) {
        const items = movieIds.map(movieId => ({
            contentId: movieId,
            contentType: 'Movie' as const
        }));
        return this.removeItemsFromPreferences(preferencesId, { items });
    }

    // New methods for stories
    static addStoryToPreferences(preferencesId: string, storyId: string) {
        return this.addItemToPreferences(preferencesId, {
            contentId: storyId,
            contentType: 'Story'
        });
    }

    static removeStoriesFromPreferences(preferencesId: string, storyIds: string[]) {
        const items = storyIds.map(storyId => ({
            contentId: storyId,
            contentType: 'Story' as const
        }));
        return this.removeItemsFromPreferences(preferencesId, { items });
    }
}

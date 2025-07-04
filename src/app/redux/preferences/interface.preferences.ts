export interface PreferenceItem {
    contentId: string;
    content: {
        _id: string;
        title: string;
        poster: string;
        description: string;
        averageRating?: number;
        releaseDate?: string;
        createdAt: string;
        duration?: number;
    };
    contentType: 'Movie' | 'Story';
    addedAt: Date;
}

export interface Preferences {
    _id: string;
    userId: string;
    title: string;
    description?: string;
    type: string;
    items: PreferenceItem[];
    isPublic: boolean;
    tags: string[];
    thumbnail?: string;
    createdAt: Date;
    updatedAt: Date;
}

export interface PreferencesState {
    preferences: Preferences[];
    selectedPreferences: Preferences | null;
    searchResults: Preferences[];
    loading: boolean;
    searchLoading: boolean;
    error: string | null;
}

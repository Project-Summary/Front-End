// redux/playlist/types.ts
export interface PlaylistItem {
    _id: string;
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
    addedAt: string;
}

export interface PlaylistUser {
    _id: string;
    name: string;
    avatar?: string;
}

export interface Playlist {
    _id: string;
    name: string;
    description: string;
    isPublic: boolean;
    tags: string[];
    thumbnail?: string;
    userId: PlaylistUser;
    items: PlaylistItem[];
    totalItems: number;
    createdAt: string;
    updatedAt: string;
}

export interface PlaylistStats {
    totalPlaylists: number;
    publicPlaylists: number;
    privatePlaylists: number;
    totalItems: number;
}

export interface PlaylistsResponse {
    playlists: Playlist[];
    total: number;
    page: number;
    totalPages: number;
}

export interface PlaylistState {
    playlists: Playlist[];
    selectedPlaylist: Playlist | null;
    publicPlaylists: Playlist[];
    stats: PlaylistStats | null;
    loading: boolean;
    error: string | null;
    pagination: {
        page: number;
        totalPages: number;
        total: number;
    };
}

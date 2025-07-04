// api/playlist.api.ts
import API from "../api";

export interface CreatePlaylistData {
    name: string;
    description?: string;
    isPublic?: boolean;
    tags?: string[];
    thumbnail?: string;
}

export interface UpdatePlaylistData {
    name?: string;
    description?: string;
    isPublic?: boolean;
    tags?: string[];
    thumbnail?: string;
}

export interface AddItemData {
    contentId: string;
    contentType: 'Movie' | 'Story';
}

export default class PlayListAPI {
    // Tạo playlist mới
    static createPlaylist(createPlaylistData: CreatePlaylistData) {
        return API.post('/playlists', createPlaylistData);
    }

    // Lấy danh sách playlist của user hiện tại
    static getMyPlaylists() {
        return API.get('/playlists/my-playlists');
    }

    // Lấy playlist công khai
    static getPublicPlaylists(page: number = 1, limit: number = 12) {
        return API.get('/playlists/public', { params: { page, limit } });
    }

    // Lấy chi tiết playlist
    static getPlaylistById(playlistId: string) {
        return API.get(`/playlists/${playlistId}`);
    }

    // Cập nhật playlist
    static updatePlaylist(playlistId: string, updateData: UpdatePlaylistData) {
        return API.put(`/playlists/${playlistId}`, updateData);
    }

    // Xóa playlist
    static deletePlaylist(playlistId: string) {
        return API.delete(`/playlists/${playlistId}`);
    }

    // Xóa nhiều playlists
    static deleteMultiplePlaylists(playlistIds: string[]) {
        return API.delete('/playlists/bulk', { data: { playlistIds } });
    }

    // Thêm item vào playlist
    static addItemToPlaylist(playlistId: string, itemData: AddItemData) {
        return API.post(`/playlists/${playlistId}/items`, itemData);
    }

    // Thêm nhiều items vào playlist
    static addMultipleItemsToPlaylist(playlistId: string, items: AddItemData[]) {
        return API.post(`/playlists/${playlistId}/items/bulk`, { items });
    }

    // Xóa item khỏi playlist
    static removeItemFromPlaylist(playlistId: string, itemId: string) {
        return API.delete(`/playlists/${playlistId}/items/${itemId}`);
    }

    // Xóa nhiều items khỏi playlist
    static removeMultipleItemsFromPlaylist(playlistId: string, itemIds: string[]) {
        return API.delete(`/playlists/${playlistId}/items/bulk`, { data: { itemIds } });
    }

    // Sắp xếp lại items trong playlist
    static reorderPlaylistItems(playlistId: string, itemOrders: { itemId: string; newPosition: number }[]) {
        return API.put(`/playlists/${playlistId}/reorder`, { itemOrders });
    }

    // Tìm kiếm playlists
    static searchPlaylists(query: string, page: number = 1, limit: number = 12) {
        return API.get('/playlists/search', { params: { q: query, page, limit } });
    }

    // Lấy thống kê playlist
    static getPlaylistStats() {
        return API.get('/playlists/stats');
    }
}

// redux/playlist/thunk.playlist.ts
import { createAsyncThunk } from '@reduxjs/toolkit';
import { AxiosError } from 'axios';
import { toast } from 'sonner';
import PlayListAPI, { CreatePlaylistData, UpdatePlaylistData, AddItemData } from './request.playlist';

const handleError = (error: unknown, fallbackMessage: string, rejectWithValue: any) => {
    if (error instanceof AxiosError) {
        const message = error.response?.data?.message || fallbackMessage;
        toast.error(message);
        return rejectWithValue(message);
    }
    toast.error(fallbackMessage);
    return rejectWithValue(fallbackMessage);
};

// Create Playlist
export const createPlaylistThunk = createAsyncThunk(
    'playlist/create',
    async (
        { data, onSuccess }: { data: CreatePlaylistData; onSuccess?: () => void },
        { rejectWithValue }
    ) => {
        try {
            const res = await PlayListAPI.createPlaylist(data);
            toast.success('Danh sách phát đã được tạo thành công!');
            onSuccess?.();
            return res.data;
        } catch (error) {
            return handleError(error, 'Lỗi khi tạo danh sách phát', rejectWithValue);
        }
    }
);

// Get My Playlists
export const getMyPlaylistsThunk = createAsyncThunk(
    'playlist/getMyPlaylists',
    async (_, { rejectWithValue }) => {
        try {
            const res = await PlayListAPI.getMyPlaylists();
            return res.data;
        } catch (error) {
            return handleError(error, 'Lỗi khi tải danh sách phát', rejectWithValue);
        }
    }
);

// Get Public Playlists
export const getPublicPlaylistsThunk = createAsyncThunk(
    'playlist/getPublicPlaylists',
    async ({ page = 1, limit = 12 }: { page?: number; limit?: number }, { rejectWithValue }) => {
        try {
            const res = await PlayListAPI.getPublicPlaylists(page, limit);
            return res.data;
        } catch (error) {
            return handleError(error, 'Lỗi khi tải danh sách phát công khai', rejectWithValue);
        }
    }
);

// Get Playlist By ID
export const getPlaylistByIdThunk = createAsyncThunk(
    'playlist/getById',
    async (playlistId: string, { rejectWithValue }) => {
        try {
            const res = await PlayListAPI.getPlaylistById(playlistId);
            return res.data;
        } catch (error) {
            return handleError(error, 'Lỗi khi tải danh sách phát', rejectWithValue);
        }
    }
);

// Update Playlist
export const updatePlaylistThunk = createAsyncThunk(
    'playlist/update',
    async (
        {
            id,
            data,
            onSuccess,
        }: { id: string; data: UpdatePlaylistData; onSuccess?: () => void },
        { rejectWithValue }
    ) => {
        try {
            const res = await PlayListAPI.updatePlaylist(id, data);
           toast.success('Danh sách phát đã được cập nhật thành công!');
            onSuccess?.();
            return res.data;
        } catch (error) {
            return handleError(error, 'Lỗi khi cập nhật danh sách phát', rejectWithValue);
        }
    }
);

// Delete Playlist
export const deletePlaylistThunk = createAsyncThunk(
    'playlist/delete',
    async (
        { id, onSuccess }: { id: string; onSuccess?: () => void },
        { rejectWithValue }
    ) => {
        try {
            await PlayListAPI.deletePlaylist(id);
            toast.success('Đã xóa danh sách phát thành công!');
            onSuccess?.();
            return { id };
        } catch (error) {
            return handleError(error, 'Lỗi khi xóa danh sách phát', rejectWithValue);
        }
    }
);

// Add Item to Playlist
export const addItemToPlaylistThunk = createAsyncThunk(
    'playlist/addItem',
    async (
        {
            playlistId,
            itemData,
            onSuccess,
        }: { playlistId: string; itemData: AddItemData; onSuccess?: () => void },
        { rejectWithValue }
    ) => {
        try {
            const res = await PlayListAPI.addItemToPlaylist(playlistId, itemData);
           toast.success('Đã thêm mục vào danh sách phát!');
            onSuccess?.();
            return res.data;
        } catch (error) {
            return handleError(error, 'Lỗi khi thêm mục vào danh sách phát', rejectWithValue);
        }
    }
);

// Add Multiple Items to Playlist
export const addMultipleItemsToPlaylistThunk = createAsyncThunk(
    'playlist/addMultipleItems',
    async (
        {
            playlistId,
            items,
            onSuccess,
        }: { playlistId: string; items: AddItemData[]; onSuccess?: () => void },
        { rejectWithValue }
    ) => {
        try {
            const res = await PlayListAPI.addMultipleItemsToPlaylist(playlistId, items);
            toast.success(`${items.length} mục đã được thêm vào danh sách phát!`);
            onSuccess?.();
            return res.data;
        } catch (error) {
            return handleError(error, 'Lỗi khi thêm mục vào danh sách phát', rejectWithValue);
        }
    }
);

// Remove Item from Playlist
export const removeFromPlaylistThunk = createAsyncThunk(
    'playlist/removeItem',
    async (
        {
            playlistId,
            itemId,
            onSuccess,
        }: { playlistId: string; itemId: string; onSuccess?: () => void },
        { rejectWithValue }
    ) => {
        try {
            const res = await PlayListAPI.removeItemFromPlaylist(playlistId, itemId);
            toast.success('Đã xóa mục khỏi danh sách phát!');
            onSuccess?.();
            return res.data;
        } catch (error) {
            return handleError(error, 'Lỗi khi xóa mục khỏi danh sách phát', rejectWithValue);
        }
    }
);

// Search Playlists
export const searchPlaylistsThunk = createAsyncThunk(
    'playlist/search',
    async (
        { query, page = 1, limit = 12 }: { query: string; page?: number; limit?: number },
        { rejectWithValue }
    ) => {
        try {
            const res = await PlayListAPI.searchPlaylists(query, page, limit);
            return res.data;
        } catch (error) {
            return handleError(error, 'Lỗi khi tìm kiếm danh sách phát', rejectWithValue);
        }
    }
);

// Get Playlist Stats
export const getPlaylistStatsThunk = createAsyncThunk(
    'playlist/getStats',
    async (_, { rejectWithValue }) => {
        try {
            const res = await PlayListAPI.getPlaylistStats();
            return res.data;
        } catch (error) {
            return handleError(error,'Lỗi khi tìm nạp số liệu thống kê danh sách phát', rejectWithValue);
        }
    }
);

// Reorder Playlist Items
export const reorderPlaylistItemsThunk = createAsyncThunk(
    'playlist/reorderItems',
    async (
        {
            playlistId,
            itemOrders,
            onSuccess,
        }: { 
            playlistId: string; 
            itemOrders: { itemId: string; newPosition: number }[];
            onSuccess?: () => void;
        },
        { rejectWithValue }
    ) => {
        try {
            const res = await PlayListAPI.reorderPlaylistItems(playlistId, itemOrders);
            toast.success('Đã sắp xếp lại các mục trong danh sách phát!');
            onSuccess?.();
            return res.data;
        } catch (error) {
            return handleError(error, 'Lỗi khi sắp xếp lại các mục danh sách phát', rejectWithValue);
        }
    }
);

import { createAsyncThunk } from '@reduxjs/toolkit';
import { toast } from 'sonner';
import PreferencesAPI, {
    CreatePreferencesData,
    UpdatePreferencesData,
    AddItemData,
    BulkAddItemsData,
    RemoveItemsData,
    SearchPreferencesParams
} from './request.preferences';

// Create preferences
export const createPreferencesThunk = createAsyncThunk(
    'preferences/create',
    async (
        { data, onSuccess }: { data: CreatePreferencesData; onSuccess?: () => void },
        { rejectWithValue }
    ) => {
        try {
            const response = await PreferencesAPI.createPreferences(data);
            toast.success('Đã tạo tùy chọn thành công');
            onSuccess?.();
            return response.data;
        } catch (error: any) {
            const message = error.response?.data?.message || 'Không tạo được tùy chọn';
            toast.error(message);
            return rejectWithValue(message);
        }
    }
);

// Get my preferences
export const getMyPreferencesThunk = createAsyncThunk(
    'preferences/getMyPreferences',
    async (_, { rejectWithValue }) => {
        try {
            const response = await PreferencesAPI.getMyPreferences();
            return response.data;
        } catch (error: any) {
            const message = error.response?.data?.message || 'Không tạo được tùy chọn';
            return rejectWithValue(message);
        }
    }
);

// Get preferences by ID
export const getPreferencesByIdThunk = createAsyncThunk(
    'preferences/getById',
    async (preferencesId: string, { rejectWithValue }) => {
        try {
            const response = await PreferencesAPI.getPreferencesById(preferencesId);
            return response.data;
        } catch (error: any) {
            const message = error.response?.data?.message || 'Không tạo được tùy chọn';
            return rejectWithValue(message);
        }
    }
);

// Update preferences
export const updatePreferencesThunk = createAsyncThunk(
    'preferences/update',
    async (
        {
            preferencesId,
            data,
            onSuccess
        }: {
            preferencesId: string;
            data: UpdatePreferencesData;
            onSuccess?: () => void
        },
        { rejectWithValue }
    ) => {
        try {
            const response = await PreferencesAPI.updatePreferences(preferencesId, data);
            toast.success('Tùy chọn đã được cập nhật thành công');
            onSuccess?.();
            return { preferencesId, data: response.data };
        } catch (error: any) {
            const message = error.response?.data?.message || 'Không cập nhật được tùy chọn';
            toast.error(message);
            return rejectWithValue(message);
        }
    }
);

// Delete preferences
export const deletePreferencesThunk = createAsyncThunk(
    'preferences/delete',
    async (
        { preferenceIds, onSuccess }: { preferenceIds: string[]; onSuccess?: () => void },
        { rejectWithValue }
    ) => {
        try {
            await PreferencesAPI.deletePreferences(preferenceIds);
            toast.success('Đã xóa tùy chọn thành công');
            onSuccess?.();
            return { preferenceIds };
        } catch (error: any) {
            const message = error.response?.data?.message || 'Không xóa được tùy chọn';
            toast.error(message);
            return rejectWithValue(message);
        }
    }
);

// Add item to preferences (unified)
export const addItemToPreferencesThunk = createAsyncThunk(
    'preferences/addItem',
    async (
        {
            preferencesId,
            data,
            onSuccess
        }: {
            preferencesId: string;
            data: AddItemData;
            onSuccess?: () => void
        },
        { rejectWithValue }
    ) => {
        try {
            const response = await PreferencesAPI.addItemToPreferences(preferencesId, data);
            toast.success(`${data.contentType} đã thêm vào tùy chọn`);
            onSuccess?.();
            return { preferencesId, data, result: response.data };
        } catch (error: any) {
            const message = error.response?.data?.message || `Không thể thêm ${data.contentType.toLowerCase()} vào tùy chọn`;
            toast.error(message);
            return rejectWithValue(message);
        }
    }
);

// Bulk add items to preferences
export const bulkAddItemsToPreferencesThunk = createAsyncThunk(
    'preferences/bulkAddItems',
    async (
        {
            preferencesId,
            data,
            onSuccess
        }: {
            preferencesId: string;
            data: BulkAddItemsData;
            onSuccess?: () => void
        },
        { rejectWithValue }
    ) => {
        try {
            const response = await PreferencesAPI.bulkAddItemsToPreferences(preferencesId, data);
            toast.success(`${data.items.length} các mục được thêm vào tùy chọn`);
            onSuccess?.();
            return { preferencesId, data, result: response.data };
        } catch (error: any) {
            const message = error.response?.data?.message || 'Không thể thêm mục vào tùy chọn';
            toast.error(message);
            return rejectWithValue(message);
        }
    }
);

// Remove items from preferences
export const removeItemsFromPreferencesThunk = createAsyncThunk(
    'preferences/removeItems',
    async (
        {
            preferencesId,
            data,
            onSuccess
        }: {
            preferencesId: string;
            data: RemoveItemsData;
            onSuccess?: () => void
        },
        { rejectWithValue }
    ) => {
        try {
            const response = await PreferencesAPI.removeItemsFromPreferences(preferencesId, data);
            toast.success(`${data.items.length} các mục đã xóa khỏi tùy chọn`);
            onSuccess?.();
            return { preferencesId, data, result: response.data };
        } catch (error: any) {
            const message = error.response?.data?.message || 'Không thể xóa mục khỏi tùy chọn';
            toast.error(message);
            return rejectWithValue(message);
        }
    }
);

// Search preferences
export const searchPreferencesThunk = createAsyncThunk(
    'preferences/search',
    async (params: SearchPreferencesParams, { rejectWithValue }) => {
        try {
            const response = await PreferencesAPI.searchPreferences(params);
            return response.data;
        } catch (error: any) {
            const message = error.response?.data?.message || 'Không tìm thấy tùy chọn';
            return rejectWithValue(message);
        }
    }
);

// Legacy thunks for backward compatibility
export const addMovieToPreferencesThunk = createAsyncThunk(
    'preferences/addMovie',
    async (
        {
            preferencesId,
            movieId,
            onSuccess
        }: {
            preferencesId: string;
            movieId: string;
            onSuccess?: () => void
        },
        { rejectWithValue }
    ) => {
        try {
            const response = await PreferencesAPI.addMovieToPreferences(preferencesId, movieId);
            toast.success('Phim đã được thêm vào tùy chọn');
            onSuccess?.();
            return { preferencesId, movieId, result: response.data };
        } catch (error: any) {
            const message = error.response?.data?.message || 'Không thể thêm phim vào tùy chọn';
            toast.error(message);
            return rejectWithValue(message);
        }
    }
);

export const removeMoviesFromPreferencesThunk = createAsyncThunk(
    'preferences/removeMovies',
    async (
        {
            preferencesId,
            movieIds,
            onSuccess
        }: {
            preferencesId: string;
            movieIds: string[];
            onSuccess?: () => void
        },
        { rejectWithValue }
    ) => {
        try {
            const response = await PreferencesAPI.removeMoviesFromPreferences(preferencesId, movieIds);
            toast.success('Phim đã bị xóa khỏi danh sách tùy chọn');
            onSuccess?.();
            return { preferencesId, movieIds, result: response.data };
        } catch (error: any) {
            const message = error.response?.data?.message || 'Không xóa được phim khỏi mục tùy chọn';
            toast.error(message);
            return rejectWithValue(message);
        }
    }
);

// New thunks for stories
export const addStoryToPreferencesThunk = createAsyncThunk(
    'preferences/addStory',
    async (
        {
            preferencesId,
            storyId,
            onSuccess
        }: {
            preferencesId: string;
            storyId: string;
            onSuccess?: () => void
        },
        { rejectWithValue }
    ) => {
        try {
            const response = await PreferencesAPI.addStoryToPreferences(preferencesId, storyId);
            toast.success('Đã thêm câu chuyện vào tùy chọn');
            onSuccess?.();
            return { preferencesId, storyId, result: response.data };
        } catch (error: any) {
            const message = error.response?.data?.message || 'Không thể thêm câu chuyện vào tùy chọn';
            toast.error(message);
            return rejectWithValue(message);
        }
    }
);

export const removeStoriesFromPreferencesThunk = createAsyncThunk(
    'preferences/removeStories',
    async (
        {
            preferencesId,
            storyIds,
            onSuccess
        }: {
            preferencesId: string;
            storyIds: string[];
            onSuccess?: () => void
        },
        { rejectWithValue }
    ) => {
        try {
            const response = await PreferencesAPI.removeStoriesFromPreferences(preferencesId, storyIds);
            toast.success('Những câu chuyện đã bị xóa khỏi mục tùy chọn');
            onSuccess?.();
            return { preferencesId, storyIds, result: response.data };
        } catch (error: any) {
            const message = error.response?.data?.message || 'Không xóa được câu chuyện khỏi mục tùy chọn';
            toast.error(message);
            return rejectWithValue(message);
        }
    }
);

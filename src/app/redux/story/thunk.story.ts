import { createAsyncThunk } from '@reduxjs/toolkit';
import { AxiosError } from 'axios';
import { toast } from 'react-toastify'; // hoặc thư viện toast bạn đang dùng
import { CreateStoryData, StoryFilterData, UpdateStoryData } from './interface.story';
import StoryAPI from './request.story';

// CRUD Operations
export const createStoryThunk = createAsyncThunk('stories/create', async (
    { data, onSuccess }: { data: CreateStoryData; onSuccess: () => void },
    { rejectWithValue }
) => {
    try {
        const response = await StoryAPI.createStory(data);
        onSuccess();
        return response.data;
    } catch (error) {
        if (error instanceof AxiosError) {
            toast.error(error.response?.data.message);
            return rejectWithValue(error.response?.data.message);
        }
        toast.error('Error creating story');
        return rejectWithValue('Error creating story');
    }
});

export const getAllStoriesThunk = createAsyncThunk('stories/getAll', async (
    { filterDto }: { filterDto?: StoryFilterData }, { rejectWithValue }
) => {
    try {
        const response = await StoryAPI.getAllStories(filterDto);
        return response.data;
    } catch (error) {
        if (error instanceof AxiosError) {
            toast.error(error.response?.data.message);
            return rejectWithValue(error.response?.data.message);
        }
        toast.error('Error fetching stories');
        return rejectWithValue('Error fetching stories');
    }
});

export const getStoryByIdThunk = createAsyncThunk('stories/getById', async (
    id: string,
    { rejectWithValue }
) => {
    try {
        const response = await StoryAPI.getStoryById(id);
        return response.data;
    } catch (error) {
        if (error instanceof AxiosError) {
            toast.error(error.response?.data.message);
            return rejectWithValue(error.response?.data.message);
        }
        toast.error('Error fetching story');
        return rejectWithValue('Error fetching story');
    }
});

export const updateStoryThunk = createAsyncThunk('stories/update', async (
    { id, data, onSuccess }: { id: string; data: UpdateStoryData; onSuccess: () => void },
    { rejectWithValue }
) => {
    try {
        const response = await StoryAPI.updateStory(id, data);
        onSuccess();
        return response.data;
    } catch (error) {
        if (error instanceof AxiosError) {
            toast.error(error.response?.data.message);
            return rejectWithValue(error.response?.data.message);
        }
        toast.error('Error updating story');
        return rejectWithValue('Error updating story');
    }
});

export const deleteStoryThunk = createAsyncThunk('stories/delete', async (
    { id, onSuccess }: { id: string; onSuccess: () => void },
    { rejectWithValue }
) => {
    try {
        const response = await StoryAPI.deleteStory(id);
        onSuccess();
        return response.data;
    } catch (error) {
        if (error instanceof AxiosError) {
            toast.error(error.response?.data.message);
            return rejectWithValue(error.response?.data.message);
        }
        toast.error('Error deleting story');
        return rejectWithValue('Error deleting story');
    }
});

export const deleteStoriesThunk = createAsyncThunk('stories/deleteMultiple', async (
    { storyIds, onSuccess }: { storyIds: string | string[]; onSuccess: () => void },
    { rejectWithValue }
) => {
    try {
        const response = await StoryAPI.deleteStories(storyIds);
        onSuccess();
        return response.data;
    } catch (error) {
        if (error instanceof AxiosError) {
            toast.error(error.response?.data.message);
            return rejectWithValue(error.response?.data.message);
        }
        toast.error('Error deleting stories');
        return rejectWithValue('Error deleting stories');
    }
});

// Get Stories by Category and Filters
export const getPopularStoriesThunk = createAsyncThunk('stories/getPopular', async (
    { limit, category }: { limit?: number; category?: string } = {},
    { rejectWithValue }
) => {
    try {
        const response = await StoryAPI.getPopularStories(limit, category);
        return response.data;
    } catch (error) {
        if (error instanceof AxiosError) {
            toast.error(error.response?.data.message);
            return rejectWithValue(error.response?.data.message);
        }
        toast.error('Error fetching popular stories');
        return rejectWithValue('Error fetching popular stories');
    }
});

export const getRecentStoriesThunk = createAsyncThunk('stories/getRecent', async (
    { limit, category }: { limit?: number; category?: string } = {},
    { rejectWithValue }
) => {
    try {
        const response = await StoryAPI.getRecentStories(limit, category);
        return response.data;
    } catch (error) {
        if (error instanceof AxiosError) {
            toast.error(error.response?.data.message);
            return rejectWithValue(error.response?.data.message);
        }
        toast.error('Error fetching recent stories');
        return rejectWithValue('Error fetching recent stories');
    }
});

export const getTopRatedStoriesThunk = createAsyncThunk('stories/getTopRated', async (
    { limit, category }: { limit?: number; category?: string } = {},
    { rejectWithValue }
) => {
    try {
        const response = await StoryAPI.getTopRatedStories(limit, category);
        return response.data;
    } catch (error) {
        if (error instanceof AxiosError) {
            toast.error(error.response?.data.message);
            return rejectWithValue(error.response?.data.message);
        }
        toast.error('Error fetching top rated stories');
        return rejectWithValue('Error fetching top rated stories');
    }
});

export const getStoriesByCategoryThunk = createAsyncThunk('stories/getByCategory', async (
    { categoryId, limit, page }: { categoryId: string; limit?: number; page?: number },
    { rejectWithValue }
) => {
    try {
        const response = await StoryAPI.getStoriesByCategory(categoryId, limit, page);
        return response.data;
    } catch (error) {
        if (error instanceof AxiosError) {
            toast.error(error.response?.data.message);
            return rejectWithValue(error.response?.data.message);
        }
        toast.error('Error fetching stories by category');
        return rejectWithValue('Error fetching stories by category');
    }
});

// Summary Operations
export const generateSummaryThunk = createAsyncThunk('stories/generateSummary', async (
    { id, onSuccess }: { id: string; onSuccess?: () => void },
    { rejectWithValue }
) => {
    try {
        const response = await StoryAPI.generateSummary(id);
        onSuccess?.();
        return response.data;
    } catch (error) {
        if (error instanceof AxiosError) {
            toast.error(error.response?.data.message);
            return rejectWithValue(error.response?.data.message);
        }
        toast.error('Error generating summary');
        return rejectWithValue('Error generating summary');
    }
});

export const getSummaryThunk = createAsyncThunk('stories/getSummary', async (
    id: string,
    { rejectWithValue }
) => {
    try {
        const response = await StoryAPI.getSummary(id);
        return response.data;
    } catch (error) {
        if (error instanceof AxiosError) {
            toast.error(error.response?.data.message);
            return rejectWithValue(error.response?.data.message);
        }
        toast.error('Error fetching summary');
        return rejectWithValue('Error fetching summary');
    }
});

export const updateSummaryThunk = createAsyncThunk('stories/updateSummary', async (
    { id, content, onSuccess }: { id: string; content: string; onSuccess: () => void },
    { rejectWithValue }
) => {
    try {
        const response = await StoryAPI.updateSummary(id, content);
        onSuccess();
        return response.data;
    } catch (error) {
        if (error instanceof AxiosError) {
            toast.error(error.response?.data.message);
            return rejectWithValue(error.response?.data.message);
        }
        toast.error('Error updating summary');
        return rejectWithValue('Error updating summary');
    }
});

export const deleteSummaryThunk = createAsyncThunk('stories/deleteSummary', async (
    { id, onSuccess }: { id: string; onSuccess: () => void },
    { rejectWithValue }
) => {
    try {
        const response = await StoryAPI.deleteSummary(id);
        onSuccess();
        return response.data;
    } catch (error) {
        if (error instanceof AxiosError) {
            toast.error(error.response?.data.message);
            return rejectWithValue(error.response?.data.message);
        }
        toast.error('Error deleting summary');
        return rejectWithValue('Error deleting summary');
    }
});

// Statistics Operations
export const incrementViewCountThunk = createAsyncThunk('stories/incrementView', async (
    id: string,
    { rejectWithValue }
) => {
    try {
        const response = await StoryAPI.incrementViewCount(id);
        return response.data;
    } catch (error) {
        if (error instanceof AxiosError) {
            toast.error(error.response?.data.message);
            return rejectWithValue(error.response?.data.message);
        }
        toast.error('Error incrementing view count');
        return rejectWithValue('Error incrementing view count');
    }
});

export const likeStoryThunk = createAsyncThunk('stories/like', async (
    { id, onSuccess }: { id: string; onSuccess?: () => void },
    { rejectWithValue }
) => {
    try {
        const response = await StoryAPI.likeStory(id);
        onSuccess?.();
        return response.data;
    } catch (error) {
        if (error instanceof AxiosError) {
            toast.error(error.response?.data.message);
            return rejectWithValue(error.response?.data.message);
        }
        toast.error('Error liking story');
        return rejectWithValue('Error liking story');
    }
});

export const rateStoryThunk = createAsyncThunk('stories/rate', async (
    { id, rating, onSuccess }: { id: string; rating: number; onSuccess?: () => void },
    { rejectWithValue }
) => {
    try {
        const response = await StoryAPI.rateStory(id, rating);
        onSuccess?.();
        return response.data;
    } catch (error) {
        if (error instanceof AxiosError) {
            toast.error(error.response?.data.message);
            return rejectWithValue(error.response?.data.message);
        }
        toast.error('Error rating story');
        return rejectWithValue('Error rating story');
    }
});


export const summaryStoryThunk = createAsyncThunk('stories/summary', async (
    { id, script , onSuccess}: { id: string, script: string, onSuccess: () => void },
    { rejectWithValue }
) => {
    try {
        const response = await StoryAPI.summaryStory(id, script);
        return response.data;
        onSuccess();
    } catch (error) {
        if (error instanceof AxiosError) {
            toast.error(error.response?.data.message);
            return rejectWithValue(error.response?.data.message);
        }
        toast.error('Error rating story');
        return rejectWithValue('Error rating story');
    }
})
import { createAsyncThunk } from '@reduxjs/toolkit';
import { AxiosError } from 'axios';
import { toast } from 'react-toastify';
import { CreateScriptData, UpdateScriptData } from '@/interface/script.interface';
import ScriptAPI from './request.script';

// GET ALL SCRIPTS
export const getAllScriptsThunk = createAsyncThunk('scripts/getAll', async (_, { rejectWithValue }) => {
    try {
        const response = await ScriptAPI.getAllScript();
        return response.data;
    } catch (error) {
        if (error instanceof AxiosError) {
            toast.error(error.response?.data.message);
            return rejectWithValue(error.response?.data.message);
        }
        toast.error('Lỗi khi tải tập lệnh');
        return rejectWithValue('Lỗi khi tải tập lệnh');
    }
});

// GET SCRIPT BY MOVIE
export const getScriptByMovieThunk = createAsyncThunk('scripts/getByMovie', async (movieId: string, { rejectWithValue }) => {
    try {
        const response = await ScriptAPI.getScriptByMovie(movieId);
        return response.data;
    } catch (error) {
        if (error instanceof AxiosError) {
            toast.error(error.response?.data.message);
            return rejectWithValue(error.response?.data.message);
        }
        toast.error('Lỗi khi tải tập lệnh theo phim');
        return rejectWithValue('Lỗi khi tải tập lệnh theo phim');
    }
});

// GET SCRIPT BY ID
export const getScriptByIdThunk = createAsyncThunk('scripts/getById', async (id: string, { rejectWithValue }) => {
    try {
        const response = await ScriptAPI.getScriptById(id);
        return response.data;
    } catch (error) {
        if (error instanceof AxiosError) {
            toast.error(error.response?.data.message);
            return rejectWithValue(error.response?.data.message);
        }
       toast.error('Lỗi khi tải tập lệnh');
        return rejectWithValue('Lỗi khi tải tập lệnh');
    }
});

// CREATE SCRIPT
export const createScriptThunk = createAsyncThunk('scripts/create', async (
    { data, onSuccess }: { data: CreateScriptData; onSuccess: () => void },
    { rejectWithValue }
) => {
    try {
        const response = await ScriptAPI.createScript(data);
        onSuccess();
        return response.data;
    } catch (error) {
        if (error instanceof AxiosError) {
            toast.error(error.response?.data.message);
            return rejectWithValue(error.response?.data.message);
        }
        toast.error('Lỗi khi tạo tập lệnh');
        return rejectWithValue('Lỗi khi tạo tập lệnh');
    }
});

// UPDATE SCRIPT
export const updateScriptThunk = createAsyncThunk('scripts/update', async (
    { id, data, onSuccess }: { id: string; data: UpdateScriptData; onSuccess: () => void },
    { rejectWithValue }
) => {
    try {
        const response = await ScriptAPI.updateScript(id, data);
        onSuccess();
        return response.data;
    } catch (error) {
        if (error instanceof AxiosError) {
            toast.error(error.response?.data.message);
            return rejectWithValue(error.response?.data.message);
        }
        toast.error('Lỗi khi cập nhật tập lệnh');
        return rejectWithValue('Lỗi khi cập nhật tập lệnh');
    }
});

// DELETE SCRIPT (bulk)
export const deleteScriptThunk = createAsyncThunk('scripts/delete', async (
    { ids, onSuccess }: { ids: string[]; onSuccess?: () => void },
    { rejectWithValue }
) => {
    try {
        const response = await ScriptAPI.deleteScript(ids);
        if (onSuccess) onSuccess();
        return { ids, ...response.data };
    } catch (error) {
        if (error instanceof AxiosError) {
            toast.error(error.response?.data.message);
            return rejectWithValue(error.response?.data.message);
        }
        toast.error('Lỗi khi xóa tập lệnh');
        return rejectWithValue('Lỗi khi xóa tập lệnh');
    }
});

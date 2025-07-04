// app/redux/user/thunk.user.ts
import { createAsyncThunk } from '@reduxjs/toolkit';
import { AxiosError } from 'axios';
import { toast } from 'sonner';
import { UserRole } from './enum.users';
import { User, UserPreferences } from './slice.users';
import { UsersAPI } from './request.users';


// Get all users (admin)
export const getUsersThunk = createAsyncThunk(
  'user/getUsers',
  async (
    params: {
      page?: number;
      limit?: number;
      search?: string;
      role?: UserRole | 'all';
      isActive?: boolean | 'all';
      sortBy?: string;
      sortOrder?: 'asc' | 'desc';
    },
    { rejectWithValue }
  ) => {
    try {
      const response = await UsersAPI.getAllUsers(params);
      return response.data;
    } catch (error: unknown) {
      if (error instanceof AxiosError) {
        toast.error(error.response?.data.message || 'Failed to fetch users');
        return rejectWithValue(error.response?.data.message);
      }
      toast.error('Error fetching users');
      return rejectWithValue('Error fetching users');
    }
  }
);

// Get user by ID
export const getUserByIdThunk = createAsyncThunk(
  'user/getUserById',
  async (userId: string, { rejectWithValue }) => {
    try {
      const response = await UsersAPI.findOneUser(userId);
      return response.data;
    } catch (error: unknown) {
      if (error instanceof AxiosError) {
        toast.error(error.response?.data.message || 'Failed to fetch user');
        return rejectWithValue(error.response?.data.message);
      }
      toast.error('Error fetching user');
      return rejectWithValue('Error fetching user');
    }
  }
);

// Get current user profile
export const getCurrentUserThunk = createAsyncThunk(
  'user/getCurrentUser',
  async (_, { rejectWithValue }) => {
    try {
      const response = await UsersAPI.getCurrentUser();
      return response.data;
    } catch (error: unknown) {
      if (error instanceof AxiosError) {
        return rejectWithValue(error.response?.data.message);
      }
      return rejectWithValue('Error fetching current user');
    }
  }
);

// Update user profile
export const updateUserProfileThunk = createAsyncThunk(
  'user/updateProfile',
  async (
    {
      userId,
      data,
      onSuccess,
    }: {
      userId: string;
      data: Partial<User>;
      onSuccess?: () => void;
    },
    { rejectWithValue }
  ) => {
    try {
      const response = await UsersAPI.updateUser(userId, data);
      toast.success('Hồ sơ đã được cập nhật thành công');
      onSuccess?.();
      return response.data;
    } catch (error: unknown) {
      if (error instanceof AxiosError) {
        toast.error(error.response?.data.message || 'Failed to update profile');
        return rejectWithValue(error.response?.data.message);
      }
      toast.error('Error updating profile');
      return rejectWithValue('Error updating profile');
    }
  }
);

// Update user preferences
export const updateUserPreferencesThunk = createAsyncThunk(
  'user/updatePreferences',
  async (
    {
      userId,
      preferences,
      onSuccess,
    }: {
      userId: string;
      preferences: Partial<UserPreferences>;
      onSuccess?: () => void;
    },
    { rejectWithValue }
  ) => {
    try {
      const response = await UsersAPI.updateUserPreferences(userId, preferences);
      toast.success('Tùy chọn đã được cập nhật thành công');
      onSuccess?.();
      return { userId, preferences: response.data.preferences };
    } catch (error: unknown) {
      if (error instanceof AxiosError) {
        toast.error(error.response?.data.message || 'Failed to update preferences');
        return rejectWithValue(error.response?.data.message);
      }
      toast.error('Error updating preferences');
      return rejectWithValue('Error updating preferences');
    }
  }
);

// Update user role (admin only)
export const updateUserRoleThunk = createAsyncThunk(
  'user/updateRole',
  async (
    {
      userId,
      role,
      onSuccess,
    }: {
      userId: string;
      role: UserRole;
      onSuccess?: () => void;
    },
    { rejectWithValue }
  ) => {
    try {
      const response = await UsersAPI.updateUserRole(userId, role);
      toast.success('Đã cập nhật vai trò người dùng thành công');
      onSuccess?.();
      return response.data;
    } catch (error: unknown) {
      if (error instanceof AxiosError) {
        toast.error(error.response?.data.message || 'Không cập nhật được vai trò người dùng');
        return rejectWithValue(error.response?.data.message);
      }
      toast.error('Error updating user role');
      return rejectWithValue('Error updating user role');
    }
  }
);

// Toggle user active status (admin only)
export const toggleUserStatusThunk = createAsyncThunk(
  'user/toggleStatus',
  async (
    {
      userId,
      isActive,
      onSuccess,
    }: {
      userId: string;
      isActive: boolean;
      onSuccess?: () => void;
    },
    { rejectWithValue }
  ) => {
    try {
      const response = await UsersAPI.toggleUserStatus(userId, isActive);
      toast.success(`Người dùng ${isActive ? 'đã kích hoạt' : 'đã hủy kích hoạt'} thành công`);
      onSuccess?.();
      return response.data;
    } catch (error: unknown) {
      if (error instanceof AxiosError) {
        toast.error(error.response?.data.message || 'Failed to update user status');
        return rejectWithValue(error.response?.data.message);
      }
      toast.error('Error updating user status');
      return rejectWithValue('Error updating user status');
    }
  }
);

// Delete user (admin only)
export const deleteUserThunk = createAsyncThunk(
  'user/deleteUser',
  async (
    {
      userId,
      onSuccess,
    }: {
      userId: string;
      onSuccess?: () => void;
    },
    { rejectWithValue }
  ) => {
    try {
      await UsersAPI.deleteUser(userId);
      toast.success('User deleted successfully');
      onSuccess?.();
      return userId;
    } catch (error: unknown) {
      if (error instanceof AxiosError) {
        toast.error(error.response?.data.message || 'Failed to delete user');
        return rejectWithValue(error.response?.data.message);
      }
      toast.error('Error deleting user');
      return rejectWithValue('Error deleting user');
    }
  }
);

// Watchlist operations
export const addToWatchlistThunk = createAsyncThunk(
  'user/addToWatchlist',
  async (
    {
      contentId,
      onSuccess,
    }: {
      contentId: string;
      onSuccess?: () => void;
    },
    { rejectWithValue }
  ) => {
    try {
      const response = await UsersAPI.addToWatchList(contentId);
      toast.success('Added to watchlist');
      onSuccess?.();
      return { contentId, userId: response.data.userId };
    } catch (error: unknown) {
      if (error instanceof AxiosError) {
        toast.error(error.response?.data.message || 'Failed to add to watchlist');
        return rejectWithValue(error.response?.data.message);
      }
      toast.error('Error adding to watchlist');
      return rejectWithValue('Error adding to watchlist');
    }
  }
);

export const removeFromWatchlistThunk = createAsyncThunk(
  'user/removeFromWatchlist',
  async (
    {
      contentId,
      onSuccess,
    }: {
      contentId: string;
      onSuccess?: () => void;
    },
    { rejectWithValue }
  ) => {
    try {
      const response = await UsersAPI.removeFromWatchList(contentId);
      toast.success('Removed from watchlist');
      onSuccess?.();
      return { contentId, userId: response.data.userId };
    } catch (error: unknown) {
      if (error instanceof AxiosError) {
        toast.error(error.response?.data.message || 'Failed to remove from watchlist');
        return rejectWithValue(error.response?.data.message);
      }
      toast.error('Error removing from watchlist');
      return rejectWithValue('Error removing from watchlist');
    }
  }
);

// View history
export const addToViewHistoryThunk = createAsyncThunk(
  'user/addToViewHistory',
  async (
    {
      contentId,
      contentType,
    }: {
      contentId: string;
      contentType: string;
    },
    { rejectWithValue }
  ) => {
    try {
      const response = await UsersAPI.addToViewHistory(contentId, contentType);
      return { contentId, contentType, userId: response.data.userId };
    } catch (error: unknown) {
      if (error instanceof AxiosError) {
        return rejectWithValue(error.response?.data.message);
      }
      return rejectWithValue('Error adding to view history');
    }
  }
);

// Upload avatar
export const uploadAvatarThunk = createAsyncThunk(
  'user/uploadAvatar',
  async (
    {
      file,
      onSuccess,
    }: {
      file: File;
      onSuccess?: () => void;
    },
    { rejectWithValue }
  ) => {
    try {
      const response = await UsersAPI.uploadAvatar(file);
      toast.success('Avatar updated successfully');
      onSuccess?.();
      return response.data;
    } catch (error: unknown) {
      if (error instanceof AxiosError) {
        toast.error(error.response?.data.message || 'Failed to upload avatar');
        return rejectWithValue(error.response?.data.message);
      }
      toast.error('Error uploading avatar');
      return rejectWithValue('Error uploading avatar');
    }
  }
);

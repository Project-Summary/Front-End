// app/redux/user/slice.user.ts
import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { UserRole } from './enum.users';
import {
  getCurrentUserThunk,
  updateUserProfileThunk,
  updateUserPreferencesThunk,
  addToWatchlistThunk,
  removeFromWatchlistThunk,
  addToViewHistoryThunk,
  uploadAvatarThunk,
} from "./thunk.users";

export interface UserStatistics {
  totalViews: number;
  totalLikes: number;
  totalComments: number;
  watchlist: string[];
  viewHistory: {
    contentId: string;
    contentType: string;
    viewedAt: string;
  }[];
}

export interface UserPreferences {
  emailNotifications: boolean;
  pushNotifications: boolean;
  newsletter: boolean;
}

export interface User {
  _id: string;
  name: string;
  email: string;
  role: UserRole;
  avatar?: string;
  isActive: boolean;
  lastLoginAt?: string;
  statistics: UserStatistics;
  preferences: UserPreferences;
  createdAt: string;
  updatedAt: string;
}

interface Pagination {
  page: number;
  limit: number;
  total: number;
  totalPages: number;
}

interface Filters {
  search: string;
  role: UserRole | 'all';
  isActive: boolean | 'all';
  sortBy: string;
  sortOrder: 'asc' | 'desc';
}

export interface UserState {
  currentUser: User | null;
  users: User[];
  selectedUser: User | null;
  isLoading: boolean;
  isUpdating: boolean;
  isDeleting: boolean;
  error: string | null;
  totalUsers: number;
  pagination: Pagination;
  filters: Filters;
}

const initialState: UserState = {
  currentUser: null,
  users: [],
  selectedUser: null,
  isLoading: false,
  isUpdating: false,
  isDeleting: false,
  error: null,
  totalUsers: 0,
  pagination: {
    page: 1,
    limit: 10,
    total: 0,
    totalPages: 0,
  },
  filters: {
    search: '',
    role: 'all',
    isActive: 'all',
    sortBy: 'createdAt',
    sortOrder: 'desc',
  },
};

const userSlice = createSlice({
  name: 'user',
  initialState,
  reducers: {
    setFilters(state, action: PayloadAction<Partial<Filters>>) {
      state.filters = { ...state.filters, ...action.payload };
    },
  },
  extraReducers: (builder) => {
    builder
      // 🔵 Get current user
      .addCase(getCurrentUserThunk.fulfilled, (state, action) => {
        state.currentUser = action.payload.data.data;
      })
      .addCase(getCurrentUserThunk.rejected, (state, action) => {
        state.currentUser = null;
        state.error = action.payload as string;
      })

      // ✏️ Update profile
      .addCase(updateUserProfileThunk.pending, (state) => {
        state.isUpdating = true;
        state.error = null;
      })
      .addCase(updateUserProfileThunk.fulfilled, (state, action) => {
        state.isUpdating = false;
        state.currentUser = action.payload.data.data;
      })
      .addCase(updateUserProfileThunk.rejected, (state, action) => {
        state.isUpdating = false;
        state.error = action.payload as string;
      })

      // ✏️ Update preferences
      .addCase(updateUserPreferencesThunk.fulfilled, (state, action) => {

        console.log("ACtion payload: ", action.payload);

        if (state.currentUser && state.currentUser._id === action.payload.userId) {
          state.currentUser.preferences = action.payload.preferences;
        }
      })
      // ⭐ Add to watchlist
      .addCase(addToWatchlistThunk.fulfilled, (state, action) => {
        if (state.currentUser) {
          state.currentUser.statistics.watchlist.push(action.payload.contentId);
        }
      })

      // ⭐ Remove from watchlist
      .addCase(removeFromWatchlistThunk.fulfilled, (state, action) => {
        if (state.currentUser) {
          state.currentUser.statistics.watchlist = state.currentUser.statistics.watchlist.filter(
            id => id !== action.payload.contentId
          );
        }
      })

      // 📺 Add to view history
      .addCase(addToViewHistoryThunk.fulfilled, (state, action) => {
        if (state.currentUser) {
          state.currentUser.statistics.viewHistory.push({
            contentId: action.payload.contentId,
            contentType: action.payload.contentType,
            viewedAt: new Date().toISOString(),
          });
        }
      })

      // 🖼 Upload avatar
      .addCase(uploadAvatarThunk.fulfilled, (state, action) => {
        if (state.currentUser) {
          state.currentUser.avatar = action.payload.avatar;
        }
      });
  },
});

export const { setFilters } = userSlice.actions;
export default userSlice.reducer;

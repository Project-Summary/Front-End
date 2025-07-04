import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import {
    createPreferencesThunk,
    getMyPreferencesThunk,
    getPreferencesByIdThunk,
    updatePreferencesThunk,
    deletePreferencesThunk,
    addItemToPreferencesThunk,
    bulkAddItemsToPreferencesThunk,
    removeItemsFromPreferencesThunk,
    searchPreferencesThunk,
    // Legacy thunks
    addMovieToPreferencesThunk,
    removeMoviesFromPreferencesThunk,
    addStoryToPreferencesThunk,
    removeStoriesFromPreferencesThunk
} from './thunk.preferences';
import { PreferencesState, Preferences } from './interface.preferences';

const initialState: PreferencesState = {
    preferences: [],
    selectedPreferences: null,
    searchResults: [],
    loading: false,
    searchLoading: false,
    error: null,
};

const preferencesSlice = createSlice({
    name: 'preferences',
    initialState,
    reducers: {
        clearError: (state) => {
            state.error = null;
        },
        setSelectedPreferences: (state, action: PayloadAction<Preferences | null>) => {
            state.selectedPreferences = action.payload;
        },
        clearSearchResults: (state) => {
            state.searchResults = [];
        },
    },
    extraReducers: (builder) => {
        builder
            // Create preferences
            .addCase(createPreferencesThunk.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(createPreferencesThunk.fulfilled, (state, action) => {
                console.log("ACtion payload: ", action.payload.data.data);
                state.loading = false;
                state.preferences.unshift(action.payload.data.data);
            })
            .addCase(createPreferencesThunk.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload as string;
            })

            // Get preferences
            .addCase(getMyPreferencesThunk.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(getMyPreferencesThunk.fulfilled, (state, action) => {
                state.loading = false;
                state.preferences = action.payload.data.data;
            })
            .addCase(getMyPreferencesThunk.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload as string;
            })

            // Get preferences by ID
            .addCase(getPreferencesByIdThunk.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(getPreferencesByIdThunk.fulfilled, (state, action) => {
                state.loading = false;
                state.selectedPreferences = action.payload.data.data;
            })
            .addCase(getPreferencesByIdThunk.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload as string;
            })

            // Update preferences
            .addCase(updatePreferencesThunk.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(updatePreferencesThunk.fulfilled, (state, action) => {
                state.loading = false;
                const { preferencesId, data } = action.payload;
                const index = state.preferences.findIndex(p => p._id === preferencesId);
                if (index !== -1) {
                    state.preferences[index] = { ...state.preferences[index], ...data.data.data };
                }
                if (state.selectedPreferences?._id === preferencesId) {
                    state.selectedPreferences = { ...state.selectedPreferences, ...data.data.data };
                }
            })
            .addCase(updatePreferencesThunk.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload as string;
            })

            // Delete preferences
            .addCase(deletePreferencesThunk.fulfilled, (state, action) => {
                const deletedIds = action.payload.preferenceIds;
                state.preferences = state.preferences.filter(p => !deletedIds.includes(p._id));
                if (state.selectedPreferences && deletedIds.includes(state.selectedPreferences._id)) {
                    state.selectedPreferences = null;
                }
            })

            // Add item to preferences
            .addCase(addItemToPreferencesThunk.fulfilled, (state, action) => {
                const { preferencesId, result } = action.payload;
                const index = state.preferences.findIndex(p => p._id === preferencesId);
                if (index !== -1) {
                    state.preferences[index] = result.data.data;
                }
                if (state.selectedPreferences?._id === preferencesId) {
                    state.selectedPreferences = result.data.data;
                }
            })

            // Bulk add items
            .addCase(bulkAddItemsToPreferencesThunk.fulfilled, (state, action) => {
                const { preferencesId, result } = action.payload;
                const index = state.preferences.findIndex(p => p._id === preferencesId);
                if (index !== -1) {
                    state.preferences[index] = result.data.data;
                }
                if (state.selectedPreferences?._id === preferencesId) {
                    state.selectedPreferences = result.data.data;
                }
            })

            // Remove items from preferences
            .addCase(removeItemsFromPreferencesThunk.fulfilled, (state, action) => {
                console.log("Action payload: ", action.payload);
                const { preferencesId, result } = action.payload;
                const index = state.preferences.findIndex(p => p._id === preferencesId);
                if (index !== -1) {
                    state.preferences[index] = result.data.data;
                }
                if (state.selectedPreferences?._id === preferencesId) {
                    state.selectedPreferences = result.data.data;
                }
            })

            // Search preferences
            .addCase(searchPreferencesThunk.pending, (state) => {
                state.searchLoading = true;
            })
            .addCase(searchPreferencesThunk.fulfilled, (state, action) => {
                state.searchLoading = false;
                state.searchResults = action.payload.data.data.data;
            })
            .addCase(searchPreferencesThunk.rejected, (state, action) => {
                state.searchLoading = false;
                state.error = action.payload as string;
            })

            // Legacy thunks - backward compatibility
            .addCase(addMovieToPreferencesThunk.fulfilled, (state, action) => {
                const { preferencesId, result } = action.payload;
                const index = state.preferences.findIndex(p => p._id === preferencesId);
                if (index !== -1) {
                    state.preferences[index] = result.data.data;
                }
                if (state.selectedPreferences?._id === preferencesId) {
                    state.selectedPreferences = result.data.data;
                }
            })

            .addCase(removeMoviesFromPreferencesThunk.fulfilled, (state, action) => {
                const { preferencesId, result } = action.payload;
                const index = state.preferences.findIndex(p => p._id === preferencesId);
                if (index !== -1) {
                    state.preferences[index] = result.data.data;
                }
                if (state.selectedPreferences?._id === preferencesId) {
                    state.selectedPreferences = result.data.data;
                }
            })

            .addCase(addStoryToPreferencesThunk.fulfilled, (state, action) => {
                const { preferencesId, result } = action.payload;
                const index = state.preferences.findIndex(p => p._id === preferencesId);
                if (index !== -1) {
                    state.preferences[index] = result.data.data;
                }
                if (state.selectedPreferences?._id === preferencesId) {
                    state.selectedPreferences = result.data.data;
                }
            })

            .addCase(removeStoriesFromPreferencesThunk.fulfilled, (state, action) => {
                const { preferencesId, result } = action.payload;
                const index = state.preferences.findIndex(p => p._id === preferencesId);
                if (index !== -1) {
                    state.preferences[index] = result.data.data;
                }
                if (state.selectedPreferences?._id === preferencesId) {
                    state.selectedPreferences = result.data.data;
                }
            });
    }
});

export const { clearError, setSelectedPreferences, clearSearchResults } = preferencesSlice.actions;
export default preferencesSlice.reducer;

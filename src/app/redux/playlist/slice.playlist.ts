// redux/playlist/slice.playlist.ts
import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { PlaylistState, PlaylistsResponse } from './interface.playlist';
import { createPlaylistThunk, getMyPlaylistsThunk, getPublicPlaylistsThunk, getPlaylistByIdThunk, updatePlaylistThunk, deletePlaylistThunk, addItemToPlaylistThunk, removeFromPlaylistThunk, searchPlaylistsThunk, getPlaylistStatsThunk } from './thunk.playlist';

const initialState: PlaylistState = {
    playlists: [],
    selectedPlaylist: null,
    publicPlaylists: [],
    stats: null,
    loading: false,
    error: null,
    pagination: {
        page: 1,
        totalPages: 1,
        total: 0
    }
};

const playlistSlice = createSlice({
    name: 'playlist',
    initialState,
    reducers: {
        clearError: (state) => {
            state.error = null;
        },
        clearSelectedPlaylist: (state) => {
            state.selectedPlaylist = null;
        },
        setLoading: (state, action: PayloadAction<boolean>) => {
            state.loading = action.payload;
        }
    },
    extraReducers: (builder) => {
        builder
            // Create playlist
            .addCase(createPlaylistThunk.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(createPlaylistThunk.fulfilled, (state, action) => {
                state.loading = false;
                state.playlists.unshift(action.payload.data.data);
            })
            .addCase(createPlaylistThunk.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload as string;
            })

            // Get my playlists
            .addCase(getMyPlaylistsThunk.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(getMyPlaylistsThunk.fulfilled, (state, action) => {
                state.loading = false;
                state.playlists = action.payload.data.data;
            })
            .addCase(getMyPlaylistsThunk.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload as string;
            })

            // Get public playlists
            .addCase(getPublicPlaylistsThunk.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(getPublicPlaylistsThunk.fulfilled, (state, action) => {
                state.loading = false;
                const response = action.payload.data.data as PlaylistsResponse;
                state.publicPlaylists = response.playlists;
                state.pagination = {
                    page: response.page,
                    totalPages: response.totalPages,
                    total: response.total
                };
            })
            .addCase(getPublicPlaylistsThunk.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload as string;
            })

            // Get playlist by ID
            .addCase(getPlaylistByIdThunk.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(getPlaylistByIdThunk.fulfilled, (state, action) => {
                state.loading = false;
                state.selectedPlaylist = action.payload.data.data;
            })
            .addCase(getPlaylistByIdThunk.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload as string;
                state.selectedPlaylist = null;
            })

            // Update playlist
            .addCase(updatePlaylistThunk.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(updatePlaylistThunk.fulfilled, (state, action) => {
                state.loading = false;
                // Update in playlists array
                const index = state.playlists.findIndex(p => p._id === action.payload._id);
                if (index !== -1) {
                    state.playlists[index] = action.payload;
                }
                // Update selected playlist if it's the same
                if (state.selectedPlaylist && state.selectedPlaylist._id === action.payload.data.data._id) {
                    state.selectedPlaylist = action.payload;
                }
            })
            .addCase(updatePlaylistThunk.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload as string;
            })

            // Delete playlist
            .addCase(deletePlaylistThunk.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(deletePlaylistThunk.fulfilled, (state, action) => {
                state.loading = false;
                const playlistId = action.meta.arg.id;
                state.playlists = state.playlists.filter(p => p._id !== playlistId);
                if (state.selectedPlaylist && state.selectedPlaylist._id === playlistId) {
                    state.selectedPlaylist = null;
                }
            })
            .addCase(deletePlaylistThunk.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload as string;
            })

            // Add item to playlist
            .addCase(addItemToPlaylistThunk.fulfilled, (state, action) => {
                // Refresh the playlist data after adding item
                // This will be handled by refetching the playlist
            })

            // Remove item from playlist
            .addCase(removeFromPlaylistThunk.fulfilled, (state, action) => {
                // Refresh the playlist data after removing item
                // This will be handled by refetching the playlist
            })

            // Search playlists
            .addCase(searchPlaylistsThunk.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(searchPlaylistsThunk.fulfilled, (state, action) => {
                state.loading = false;
                const response = action.payload.data.data as PlaylistsResponse;
                state.publicPlaylists = response.playlists;
                state.pagination = {
                    page: response.page,
                    totalPages: response.totalPages,
                    total: response.total
                };
            })
            .addCase(searchPlaylistsThunk.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload as string;
            })

            // Get playlist stats
            .addCase(getPlaylistStatsThunk.fulfilled, (state, action) => {
                state.stats = action.payload;
            });
    }
});

export const { clearError, clearSelectedPlaylist, setLoading } = playlistSlice.actions;
export default playlistSlice.reducer;

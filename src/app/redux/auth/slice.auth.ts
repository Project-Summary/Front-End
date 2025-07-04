// app/redux/auth/slice.auth.ts
import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { User } from '../users/slice.users';

export interface AuthState {
  user: User | null;
  accessToken: string | null;
  refreshToken: string | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  isRegistering: boolean;
  isRefreshing: boolean;
  error: string | null;
  rememberMe: boolean;
}

const initialState: AuthState = {
  user: null,
  accessToken: null,
  refreshToken: null,
  isAuthenticated: false,
  isLoading: false,
  isRegistering: false,
  isRefreshing: false,
  error: null,
  rememberMe: false,
};

const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    // Loading states
    setLoading: (state, action: PayloadAction<boolean>) => {
      state.isLoading = action.payload;
    },
    setRegistering: (state, action: PayloadAction<boolean>) => {
      state.isRegistering = action.payload;
    },
    setRefreshing: (state, action: PayloadAction<boolean>) => {
      state.isRefreshing = action.payload;
    },
    setError: (state, action: PayloadAction<string | null>) => {
      state.error = action.payload;
    },

    // Auth actions
    loginSuccess: (state, action: PayloadAction<{
      user: User;
      accessToken: string;
      refreshToken: string;
      rememberMe?: boolean;
    }>) => {
      state.user = action.payload.user;
      state.accessToken = action.payload.accessToken;
      state.refreshToken = action.payload.refreshToken;
      state.isAuthenticated = true;
      state.rememberMe = action.payload.rememberMe || false;
      state.error = null;

      // Save to localStorage
      localStorage.setItem('accessToken', action.payload.accessToken);
      localStorage.setItem('refreshToken', action.payload.refreshToken);
      if (action.payload.rememberMe) {
        localStorage.setItem('rememberMe', 'true');
      }
    },

    registerSuccess: (state, action: PayloadAction<User>) => {
      state.user = action.payload;
      state.error = null;
    },

    refreshTokenSuccess: (state, action: PayloadAction<string>) => {
      state.accessToken = action.payload;
      localStorage.setItem('accessToken', action.payload);
    },

    logout: (state) => {
      state.user = null;
      state.accessToken = null;
      state.refreshToken = null;
      state.isAuthenticated = false;
      state.rememberMe = false;
      state.error = null;

      // Clear localStorage
      localStorage.removeItem('accessToken');
      localStorage.removeItem('refreshToken');
      localStorage.removeItem('rememberMe');
    },

    updateUser: (state, action: PayloadAction<User>) => {
      state.user = action.payload;
    },

    // Initialize auth from localStorage
    initializeAuth: (state) => {
      const accessToken = localStorage.getItem('accessToken');
      const refreshToken = localStorage.getItem('refreshToken');
      const rememberMe = localStorage.getItem('rememberMe') === 'true';

      if (accessToken && refreshToken) {
        state.accessToken = accessToken;
        state.refreshToken = refreshToken;
        state.rememberMe = rememberMe;
        // Note: We should validate the token and get user info
        // This will be handled in the thunk
      }
    },

    clearAuthState: (state) => {
      return initialState;
    },
  },
});

export const {
  setLoading,
  setRegistering,
  setRefreshing,
  setError,
  loginSuccess,
  registerSuccess,
  refreshTokenSuccess,
  logout,
  updateUser,
  initializeAuth,
  clearAuthState,
} = authSlice.actions;

export default authSlice.reducer;

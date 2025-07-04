// app/redux/auth/thunk.auth.ts
import { createAsyncThunk } from "@reduxjs/toolkit";
import { ILoginData, IRegisterData } from "./interface.auth";
import { AxiosError } from "axios";
import { toast } from "sonner";
import AuthAPI from "./request.auth";
import { loginSuccess, registerSuccess, refreshTokenSuccess, logout, setLoading, setRegistering, setRefreshing } from "./slice.auth";

// Utility functions for remember me
const REMEMBER_ME_KEY = 'cinecritique_remember_me';
const SAVED_EMAIL_KEY = 'cinecritique_saved_email';

export const saveLoginCredentials = (email: string, rememberMe: boolean) => {
  if (rememberMe) {
    localStorage.setItem(REMEMBER_ME_KEY, 'true');
    localStorage.setItem(SAVED_EMAIL_KEY, email);
  } else {
    localStorage.removeItem(REMEMBER_ME_KEY);
    localStorage.removeItem(SAVED_EMAIL_KEY);
  }
};

export const getSavedCredentials = () => {
  const rememberMe = localStorage.getItem(REMEMBER_ME_KEY) === 'true';
  const savedEmail = localStorage.getItem(SAVED_EMAIL_KEY) || '';
  return { rememberMe, savedEmail };
};

export const loginThunk = createAsyncThunk('auth/login', async (
    { data, onSuccess }: { data: ILoginData, onSuccess: () => void },
    { dispatch, rejectWithValue }
) => {
    try {
        dispatch(setLoading(true));
        const response = await AuthAPI.login(data);
        
        // Save credentials if remember me is checked
        saveLoginCredentials(data.email, data.rememberMe || false);
        
        // Dispatch success actions
        dispatch(loginSuccess({
            user: response.data.data.user,
            accessToken: response.data.data.accessToken,
            refreshToken: response.data.data.refreshToken,
            rememberMe: data.rememberMe,
        }));
        
        onSuccess();
        return response.data;
    } catch (error: unknown) {
        if (error instanceof AxiosError) {
            toast.error(error.response?.data.message);
            return rejectWithValue(error.response?.data.message);
        }

        toast.error("Lỗi đăng nhập người dùng");
        return rejectWithValue("Lỗi đăng nhập người dùng");
    } finally {
        dispatch(setLoading(false));
    }
});

// app/redux/auth/thunk.auth.ts (tiếp tục)
export const registerThunk = createAsyncThunk('auth/register', async (
    { data, onSuccess }: { data: IRegisterData, onSuccess: () => void },
    { dispatch, rejectWithValue }
) => {
    try {
        dispatch(setRegistering(true));
        const response = await AuthAPI.register(data);
        
        dispatch(registerSuccess(response.data));
        
        onSuccess();
        return response.data.data;
    } catch (error: unknown) {
        if (error instanceof AxiosError) {
            toast.error(error.response?.data.message);
            return rejectWithValue(error.response?.data.message);
        }

        toast.error("Lỗi khi đăng ký người dùng");
        return rejectWithValue("Lỗi khi đăng ký người dùng");
    } finally {
        dispatch(setRegistering(false));
    }
});

// export const refreshTokenThunk = createAsyncThunk('auth/refreshToken', async (
//     refreshToken: string,
//     { dispatch, rejectWithValue }
// ) => {
//     try {
//         dispatch(setRefreshing(true));
//         const response = await AuthAPI.refreshToken(refreshToken);
        
//         dispatch(refreshTokenSuccess(response.data.accessToken));
        
//         return response.data;
//     } catch (error: unknown) {
//         // If refresh fails, logout user
//         dispatch(logout());
        
//         if (error instanceof AxiosError) {
//             return rejectWithValue(error.response?.data.message);
//         }
//         return rejectWithValue("Error refreshing token");
//     } finally {
//         dispatch(setRefreshing(false));
//     }
// });

export const logoutThunk = createAsyncThunk('auth/logout', async (
    {onSuccess} : {onSuccess: () => void},
    { dispatch }
) => {
    try {
        onSuccess();
        await AuthAPI.logout();
    } catch (error) {
        console.error('Logout error:', error);
    } finally {
        dispatch(logout());
    }
});

export const forgotPasswordThunk = createAsyncThunk('auth/forgotPassword', async (
    { email, onSuccess }: { email: string, onSuccess: () => void },
    { rejectWithValue }
) => {
    try {
        const response = await AuthAPI.forgotPassword(email);
        toast.success("Liên kết đặt lại mật khẩu đã được gửi đến email của bạn");
        onSuccess();
        return response.data;
    } catch (error: unknown) {
        if (error instanceof AxiosError) {
            toast.error(error.response?.data.message);
            return rejectWithValue(error.response?.data.message);
        }

        toast.error("Lỗi khi gửi email đặt lại");
        return rejectWithValue("Error sending reset email");
    }
});

export const resetPasswordThunk = createAsyncThunk('auth/resetPassword', async (
    { token, newPassword, confirmPassword, onSuccess }: { token: string, newPassword: string, confirmPassword: string, onSuccess: () => void },
    { rejectWithValue }
) => {
    try {
        const response = await AuthAPI.resetPassword(token, newPassword, confirmPassword);
        toast.success("Đặt lại mật khẩu thành công");
        onSuccess();
        return response.data;
    } catch (error: unknown) {
        if (error instanceof AxiosError) {
            toast.error(error.response?.data.message);
            return rejectWithValue(error.response?.data.message);
        }

        toast.error("Lỗi khi đặt lại mật khẩu");
        return rejectWithValue("Error resetting password");
    }
});

// export const verifyTokenThunk = createAsyncThunk('auth/verifyToken', async (
//     _,
//     { dispatch, rejectWithValue }
// ) => {
//     try {
//         const response = await AuthAPI.verifyToken();
        
//         dispatch(setCurrentUser(response.data));
        
//         return response.data;
//     } catch (error: unknown) {
//         dispatch(logout());
        
//         if (error instanceof AxiosError) {
//             return rejectWithValue(error.response?.data.message);
//         }
//         return rejectWithValue("Token verification failed");
//     }
// });

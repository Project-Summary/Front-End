// app/redux/user/request.user.ts
import API from '../api';
import { CreateUserDto, UpdateUserDto } from '@/interface/user.interface';
import { UserRole } from './enum.users';

export class UsersAPI {
  // User CRUD
  static getAllUsers(params?: {
    page?: number;
    limit?: number;
    search?: string;
    role?: UserRole | 'all';
    isActive?: boolean | 'all';
    sortBy?: string;
    sortOrder?: 'asc' | 'desc';
  }) {
    return API.get('/users', { params });
  }

  static createUser(data: CreateUserDto) {
    return API.post('/users', data);
  }

  static findOneUser(id: string) {
    return API.get(`/users/${id}`);
  }

  static updateUser(id: string, data: UpdateUserDto) {
    return API.patch(`/users/${id}`, data);
  }

  static deleteUser(id: string) {
    return API.delete(`/users/${id}`);
  }

  // Current User
  static getCurrentUser() {
    return API.get('/users/me');
  }

  static updateCurrentUser(data: UpdateUserDto) {
    return API.patch('/users/me', data);
  }

  static changePassword(data: { currentPassword: string; newPassword: string }) {
    return API.put('/users/change-password', data);
  }

  static deactivateAccount() {
    return API.put('/users/deactivate');
  }

  // Preferences
  static updateUserPreferences(userId: string, preferences: any) {
    return API.put(`/users/${userId}/preferences`, { preferences });
  }

  // Role and status (admin)
  static updateUserRole(userId: string, role: UserRole) {
    return API.put(`/users/${userId}/role`, { role });
  }

  static toggleUserStatus(userId: string, isActive: boolean) {
    return API.put(`/users/${userId}/status`, { isActive });
  }

  // Watchlist
  static getWatchList() {
    return API.get('/users/me/watchlist');
  }

  static addToWatchList(contentId: string) {
    return API.post(`/users/me/watchlist/${contentId}`);
  }

  static removeFromWatchList(contentId: string) {
    return API.delete(`/users/me/watchlist/${contentId}`);
  }

  // View History
  static getViewHistory(params?: { page?: number; limit?: number }) {
    return API.get('/users/me/view-history', { params });
  }

  static addToViewHistory(contentId: string, contentType: string) {
    return API.post('/users/me/view-history', { contentId, contentType });
  }

  static clearViewHistory() {
    return API.delete('/users/me/view-history');
  }

  // Statistics
  static getUserStatistics(userId?: string) {
    const url = userId ? `/users/${userId}/statistics` : '/users/me/statistics';
    return API.get(url);
  }

  // Upload avatar
  static uploadAvatar(file: File) {
    const formData = new FormData();
    formData.append('avatar', file);
    return API.post('/users/avatar', formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });
  }
}

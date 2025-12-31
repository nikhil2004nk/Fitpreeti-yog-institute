import { apiRequestWithRefresh } from './api';
import type { User } from '../types';

export interface UpdateUserRoleData {
  role: 'customer' | 'admin' | 'trainer';
}

class UserService {
  async getAllUsers(): Promise<User[]> {
    const response = await apiRequestWithRefresh<User[]>('/users', {
      method: 'GET',
    });
    return Array.isArray(response.data) ? response.data : (Array.isArray(response) ? response : []);
  }

  async getUserByPhone(phone: string): Promise<User> {
    const response = await apiRequestWithRefresh<User>(`/users/${phone}`, {
      method: 'GET',
    });
    return response.data || response as unknown as User;
  }

  async updateUserRole(phone: string, role: 'customer' | 'admin' | 'trainer'): Promise<User> {
    const response = await apiRequestWithRefresh<User>(`/users/${phone}/role`, {
      method: 'PATCH',
      body: JSON.stringify({ role }),
    });
    return response.data || response as unknown as User;
  }
}

export const userService = new UserService();


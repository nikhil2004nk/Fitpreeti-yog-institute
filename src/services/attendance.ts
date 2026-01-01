import { apiRequestWithRefresh } from './api';
import type { Attendance, CreateAttendanceData, UpdateAttendanceData, AttendanceFilter } from '../types';

class AttendanceService {
  // Mark own attendance (for customer/trainer)
  async markOwnAttendance(data: { date: string; status: 'present' | 'absent'; notes?: string }): Promise<Attendance> {
    const response = await apiRequestWithRefresh<Attendance>('/attendance/mark', {
      method: 'POST',
      body: JSON.stringify(data),
    });
    return response.data || response as unknown as Attendance;
  }

  // Get own attendance records
  async getOwnAttendance(startDate?: string, endDate?: string): Promise<Attendance[]> {
    let url = '/attendance/own';
    const params = new URLSearchParams();
    if (startDate) params.append('start_date', startDate);
    if (endDate) params.append('end_date', endDate);
    if (params.toString()) url += `?${params.toString()}`;
    
    const response = await apiRequestWithRefresh<Attendance[]>(url, {
      method: 'GET',
    });
    return Array.isArray(response.data) ? response.data : (Array.isArray(response) ? response : []);
  }

  // Admin: Mark attendance for any user
  async markAttendanceForUser(data: CreateAttendanceData): Promise<Attendance> {
    const response = await apiRequestWithRefresh<Attendance>('/attendance', {
      method: 'POST',
      body: JSON.stringify(data),
    });
    return response.data || response as unknown as Attendance;
  }

  // Admin: Mark attendance for multiple users on a date
  async markBulkAttendance(data: { user_ids: string[]; date: string; status: 'present' | 'absent'; notes?: string }): Promise<Attendance[]> {
    const response = await apiRequestWithRefresh<Attendance[]>('/attendance/bulk', {
      method: 'POST',
      body: JSON.stringify(data),
    });
    return Array.isArray(response.data) ? response.data : (Array.isArray(response) ? response : []);
  }

  // Admin: Get all attendance records with filters
  async getAllAttendance(filters?: AttendanceFilter): Promise<Attendance[]> {
    let url = '/attendance';
    if (filters) {
      const params = new URLSearchParams();
      if (filters.user_id) params.append('user_id', filters.user_id);
      if (filters.user_role) params.append('user_role', filters.user_role);
      if (filters.start_date) params.append('start_date', filters.start_date);
      if (filters.end_date) params.append('end_date', filters.end_date);
      if (filters.status) params.append('status', filters.status);
      if (params.toString()) url += `?${params.toString()}`;
    }
    
    const response = await apiRequestWithRefresh<Attendance[]>(url, {
      method: 'GET',
    });
    return Array.isArray(response.data) ? response.data : (Array.isArray(response) ? response : []);
  }

  // Admin: Get attendance by user ID
  async getAttendanceByUserId(userId: string, startDate?: string, endDate?: string): Promise<Attendance[]> {
    let url = `/attendance/user/${userId}`;
    const params = new URLSearchParams();
    if (startDate) params.append('start_date', startDate);
    if (endDate) params.append('end_date', endDate);
    if (params.toString()) url += `?${params.toString()}`;
    
    const response = await apiRequestWithRefresh<Attendance[]>(url, {
      method: 'GET',
    });
    return Array.isArray(response.data) ? response.data : (Array.isArray(response) ? response : []);
  }

  // Admin: Update attendance
  async updateAttendance(id: string, data: UpdateAttendanceData): Promise<Attendance> {
    const response = await apiRequestWithRefresh<Attendance>(`/attendance/${id}`, {
      method: 'PATCH',
      body: JSON.stringify(data),
    });
    return response.data || response as unknown as Attendance;
  }

  // Admin: Delete attendance
  async deleteAttendance(id: string): Promise<void> {
    await apiRequestWithRefresh(`/attendance/${id}`, {
      method: 'DELETE',
    });
  }

  // Get attendance statistics
  async getAttendanceStats(userId?: string, startDate?: string, endDate?: string): Promise<{
    total_days: number;
    present_days: number;
    absent_days: number;
    attendance_percentage: number;
  }> {
    let url = '/attendance/stats';
    const params = new URLSearchParams();
    if (userId) params.append('user_id', userId);
    if (startDate) params.append('start_date', startDate);
    if (endDate) params.append('end_date', endDate);
    if (params.toString()) url += `?${params.toString()}`;
    
    const response = await apiRequestWithRefresh(url, {
      method: 'GET',
    });
    return response.data || response as unknown as {
      total_days: number;
      present_days: number;
      absent_days: number;
      attendance_percentage: number;
    };
  }
}

export const attendanceService = new AttendanceService();


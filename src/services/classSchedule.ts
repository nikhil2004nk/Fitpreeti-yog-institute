import { apiRequest, apiRequestWithRefresh, type ApiResponse } from './api';

export interface ClassSchedule {
  id: string;
  title: string;
  description?: string;
  start_time: string;
  end_time: string;
  status: 'scheduled' | 'cancelled' | 'completed' | 'in_progress';
  max_participants: number;
  current_participants: number;
  trainer_id: string;
  service_id: string;
  is_recurring: boolean;
  recurrence_pattern?: string;
  recurrence_end_date?: string;
  created_at?: string;
  updated_at?: string;
}

export interface CreateClassScheduleData {
  title: string;
  description?: string;
  start_time: string;
  end_time: string;
  status?: 'scheduled' | 'cancelled' | 'completed' | 'in_progress';
  max_participants?: number;
  current_participants?: number;
  trainer_id: string;
  service_id: string;
  is_recurring?: boolean;
  recurrence_pattern?: string;
  recurrence_end_date?: string;
}

export interface UpdateClassScheduleData {
  title?: string;
  description?: string;
  start_time?: string;
  end_time?: string;
  status?: 'scheduled' | 'cancelled' | 'completed' | 'in_progress';
  max_participants?: number;
  current_participants?: number;
  trainer_id?: string;
  service_id?: string;
  is_recurring?: boolean;
  recurrence_pattern?: string;
  recurrence_end_date?: string;
}

export interface TrainerAvailability {
  available: boolean;
  availableSlots?: Array<{ start: string; end: string }>;
}

class ClassScheduleService {
  async createSchedule(data: CreateClassScheduleData): Promise<ClassSchedule> {
    const response = await apiRequestWithRefresh<ClassSchedule>('/class-schedule', {
      method: 'POST',
      body: JSON.stringify(data),
    });
    return response.data || response as unknown as ClassSchedule;
  }

  async getAllSchedules(filters?: {
    trainerId?: string;
    serviceId?: string;
    startDate?: string;
    endDate?: string;
    status?: string;
  }): Promise<ClassSchedule[]> {
    let url = '/class-schedule';
    const params = new URLSearchParams();
    if (filters?.trainerId) params.append('trainerId', filters.trainerId);
    if (filters?.serviceId) params.append('serviceId', filters.serviceId);
    if (filters?.startDate) params.append('startDate', filters.startDate);
    if (filters?.endDate) params.append('endDate', filters.endDate);
    if (filters?.status) params.append('status', filters.status);
    if (params.toString()) url += `?${params.toString()}`;

    const response = await apiRequestWithRefresh<ClassSchedule[]>(url, {
      method: 'GET',
    });
    return Array.isArray(response.data) ? response.data : (Array.isArray(response) ? response : []);
  }

  async getScheduleById(id: string): Promise<ClassSchedule> {
    const response = await apiRequestWithRefresh<ClassSchedule>(`/class-schedule/${id}`, {
      method: 'GET',
    });
    return response.data || response as unknown as ClassSchedule;
  }

  async getTrainerAvailability(
    trainerId: string,
    date: string,
    duration: number
  ): Promise<TrainerAvailability> {
    const response = await apiRequestWithRefresh<TrainerAvailability>(
      `/class-schedule/trainer/${trainerId}/availability?date=${date}&duration=${duration}`,
      {
        method: 'GET',
      }
    );
    return response.data || response as unknown as TrainerAvailability;
  }

  async updateSchedule(id: string, data: UpdateClassScheduleData): Promise<ClassSchedule> {
    const response = await apiRequestWithRefresh<ClassSchedule>(`/class-schedule/${id}`, {
      method: 'PUT',
      body: JSON.stringify(data),
    });
    return response.data || response as unknown as ClassSchedule;
  }

  async deleteSchedule(id: string): Promise<void> {
    await apiRequestWithRefresh(`/class-schedule/${id}`, {
      method: 'DELETE',
    });
  }
}

export const classScheduleService = new ClassScheduleService();


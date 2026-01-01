import { apiRequest, apiRequestWithRefresh } from './api';

export interface Service {
  id: string;
  service_name: string;
  description: string;
  price: number;
  type: string;
  duration_minutes: number;
  trainer_id?: string;
  category?: string;
  image_url?: string;
  is_active: boolean;
  created_at?: string;
  updated_at?: string;
}

export interface CreateServiceData {
  service_name: string;
  description: string;
  price: number;
  type: string;
  duration_minutes: number;
  trainer_id?: string;
  category?: string;
  image_url?: string;
  is_active?: boolean;
}

export interface UpdateServiceData {
  service_name?: string;
  description?: string;
  price?: number;
  type?: string;
  duration_minutes?: number;
  trainer_id?: string;
  category?: string;
  image_url?: string;
  is_active?: boolean;
}

class ServiceService {
  async createService(data: CreateServiceData): Promise<Service> {
    const response = await apiRequestWithRefresh<Service>('/services', {
      method: 'POST',
      body: JSON.stringify(data),
    });
    return response.data || response as unknown as Service;
  }

  async getAllServices(type?: string): Promise<Service[]> {
    const url = type ? `/services?type=${type}` : '/services';
    const response = await apiRequest<Service[]>(url, {
      method: 'GET',
    });
    return Array.isArray(response.data) ? response.data : (Array.isArray(response) ? response : []);
  }

  async getPopularServices(): Promise<Service[]> {
    const response = await apiRequest<Service[]>('/services/popular', {
      method: 'GET',
    });
    return Array.isArray(response.data) ? response.data : (Array.isArray(response) ? response : []);
  }

  async getServiceById(id: string): Promise<Service> {
    const response = await apiRequest<Service>(`/services/${id}`, {
      method: 'GET',
    });
    return response.data || response as unknown as Service;
  }

  async getServicesByType(type: string): Promise<Service[]> {
    const response = await apiRequest<Service[]>(`/services/type/${type}`, {
      method: 'GET',
    });
    return Array.isArray(response.data) ? response.data : (Array.isArray(response) ? response : []);
  }

  async updateService(id: string, data: UpdateServiceData): Promise<Service> {
    const response = await apiRequestWithRefresh<Service>(`/services/${id}`, {
      method: 'PATCH',
      body: JSON.stringify(data),
    });
    return response.data || response as unknown as Service;
  }

  async deleteService(id: string): Promise<void> {
    await apiRequestWithRefresh(`/services/${id}`, {
      method: 'DELETE',
    });
  }
}

export const serviceService = new ServiceService();


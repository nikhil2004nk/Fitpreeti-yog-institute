import { apiRequestWithRefresh } from './api';

export interface Booking {
  id: string;
  user_id: string;
  user_phone: string;
  service_id: string;
  booking_date: string;
  booking_time: string;
  special_requests?: string;
  full_name: string;
  email: string;
  phone: string;
  status: 'pending' | 'confirmed' | 'cancelled' | 'completed';
  created_at: string;
}

export interface CreateBookingData {
  service_id: string;
  booking_date: string;
  booking_time: string;
  full_name: string;
  email: string;
  phone: string;
  special_requests?: string;
}

export interface UpdateBookingData {
  status?: 'pending' | 'confirmed' | 'cancelled' | 'completed';
  booking_date?: string;
  booking_time?: string;
  special_requests?: string;
}

class BookingService {
  async createBooking(data: CreateBookingData): Promise<Booking> {
    const response = await apiRequestWithRefresh<Booking>('/bookings', {
      method: 'POST',
      body: JSON.stringify(data),
    });
    return response.data || response as unknown as Booking;
  }

  async getUserBookings(): Promise<Booking[]> {
    const response = await apiRequestWithRefresh<Booking[]>('/bookings', {
      method: 'GET',
    });
    return Array.isArray(response.data) ? response.data : (Array.isArray(response) ? response : []);
  }

  async getBookingById(id: string): Promise<Booking> {
    const response = await apiRequestWithRefresh<Booking>(`/bookings/${id}`, {
      method: 'GET',
    });
    return response.data || response as unknown as Booking;
  }

  async getAvailableSlots(serviceId: string, date: string): Promise<string[]> {
    const response = await apiRequestWithRefresh<string[]>(`/bookings/available/${serviceId}/${date}`, {
      method: 'GET',
    });
    return Array.isArray(response.data) ? response.data : (Array.isArray(response) ? response : []);
  }

  async getAllBookings(): Promise<Booking[]> {
    const response = await apiRequestWithRefresh<Booking[]>('/bookings/admin/all', {
      method: 'GET',
    });
    return Array.isArray(response.data) ? response.data : (Array.isArray(response) ? response : []);
  }

  async updateBooking(id: string, data: UpdateBookingData): Promise<Booking> {
    const response = await apiRequestWithRefresh<Booking>(`/bookings/${id}`, {
      method: 'PATCH',
      body: JSON.stringify(data),
    });
    return response.data || response as unknown as Booking;
  }

  async deleteBooking(id: string): Promise<void> {
    await apiRequestWithRefresh(`/bookings/${id}`, {
      method: 'DELETE',
    });
  }
}

export const bookingService = new BookingService();


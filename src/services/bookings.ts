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
  amount?: number;
  payment_status?: string;
  payment_id?: string;
  start_time?: string;
  end_time?: string;
  notes?: string;
  created_at: string;
  updated_at?: string;
}

export interface CreateBookingData {
  service_id: string;
  booking_date: string;
  booking_time: string;
  full_name: string;
  email: string;
  phone: string;
  special_requests?: string;
  amount?: number;
}

export interface UpdateBookingData {
  status?: 'pending' | 'confirmed' | 'cancelled' | 'completed';
  booking_date?: string;
  booking_time?: string;
  special_requests?: string;
}

class BookingService {
  async createBooking(data: CreateBookingData): Promise<Booking> {
    console.log('=== BOOKING REQUEST ===');
    console.log('Sending booking request to API:', JSON.stringify(data, null, 2));
    console.log('Request body will be:', JSON.stringify(data));
    
    const response = await apiRequestWithRefresh<Booking>('/bookings', {
      method: 'POST',
      body: JSON.stringify(data),
    });
    
    const booking = response.data || response as unknown as Booking;
    console.log('=== BOOKING RESPONSE ===');
    console.log('Booking API response:', JSON.stringify(booking, null, 2));
    
    // Check and warn if the backend didn't save the provided fields
    const missingFields: string[] = [];
    
    if (booking && data.full_name && !booking.full_name) {
      console.warn('❌ Backend did not save full_name. Sent:', data.full_name, 'Received:', booking.full_name);
      missingFields.push('full_name');
    }
    if (booking && data.email && !booking.email) {
      console.warn('❌ Backend did not save email. Sent:', data.email, 'Received:', booking.email);
      missingFields.push('email');
    }
    if (booking && data.phone && !booking.phone) {
      console.warn('❌ Backend did not save phone. Sent:', data.phone, 'Received:', booking.phone);
      missingFields.push('phone');
    }
    if (booking && data.special_requests && !booking.special_requests) {
      console.warn('❌ Backend did not save special_requests. Sent:', data.special_requests, 'Received:', booking.special_requests);
      missingFields.push('special_requests');
    }
    if (booking && data.amount !== undefined && booking.amount === 0 && data.amount !== 0) {
      console.warn('❌ Backend did not save amount. Sent:', data.amount, 'Received:', booking.amount);
      missingFields.push('amount');
    }
    
    if (missingFields.length > 0) {
      console.error('⚠️ BACKEND ISSUE: The following fields were sent but not saved:', missingFields.join(', '));
      console.error('This is a backend API issue. Please check the backend code to ensure these fields are being persisted.');
    }
    
    return booking;
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

  async getAvailableSlots(serviceId: string, date: string): Promise<{ available_slots: string[]; booked_slots: string[] }> {
    try {
      const response = await apiRequestWithRefresh<string[] | { available_slots: string[]; booked_slots: string[] }>(`/bookings/available/${serviceId}/${date}`, {
        method: 'GET',
      });
      
      // Handle response where data is a direct array of slots (your backend format)
      if (response.data && Array.isArray(response.data)) {
        return {
          available_slots: response.data,
          booked_slots: []
        };
      }
      
      // Handle response where data is an object with available_slots
      if (response.data && typeof response.data === 'object' && !Array.isArray(response.data)) {
        if ('available_slots' in response.data) {
          return response.data as { available_slots: string[]; booked_slots: string[] };
        }
      }
      
      // If response itself is an array (fallback)
      if (Array.isArray(response)) {
        return {
          available_slots: response,
          booked_slots: []
        };
      }
      
      // If response itself is the slots object
      if (typeof response === 'object' && 'available_slots' in response) {
        return response as unknown as { available_slots: string[]; booked_slots: string[] };
      }
      
      // Fallback
      console.warn('Unexpected response format for available slots:', response);
      return { available_slots: [], booked_slots: [] };
    } catch (error: any) {
      console.error('Error fetching available slots:', error);
      throw error;
    }
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



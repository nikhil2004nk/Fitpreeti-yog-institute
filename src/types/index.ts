export interface Service {
  id: string;
  name: string;
  description: string;
  duration: string;
  price: number;
  image: string;
  category: 'yoga' | 'zumba' | 'dance' | 'fitness';
}

export interface BookingPayload {
  name: string;
  email: string;
  phone: string;
  serviceId: string;
  date: string;
  time: string;
  notes?: string;
  additionalNotes?: string;
  message?: string;
}

export interface Testimonial {
  quote: string;
  author: string;
  role: string;
  image: string;
}

export interface InstituteData {
  name: string;
  location: string;
  phone: string;
  email: string;
  address: string;
}

export interface User {
  id?: string;
  sub?: string; // User ID from JWT
  name: string;
  email?: string;
  phone: string;
  role: 'customer' | 'admin' | 'trainer';
  profile_image?: string | null;
  is_active?: boolean;
  last_login?: string | null;
  created_at?: string;
  updated_at?: string;
}

export interface RegisterData {
  name: string;
  email?: string;
  phone: string;
  pin: string;
  role?: 'customer' | 'admin' | 'trainer';
}

export interface LoginData {
  phone: string;
  pin: string;
}

export interface Attendance {
  id: string;
  user_id: string;
  user_name?: string;
  user_role?: 'customer' | 'admin' | 'trainer';
  date: string;
  status: 'present' | 'absent';
  marked_by?: string; // User ID who marked the attendance
  marked_by_name?: string;
  notes?: string;
  created_at?: string;
  updated_at?: string;
}

export interface CreateAttendanceData {
  user_id: string;
  date: string;
  status: 'present' | 'absent';
  notes?: string;
}

export interface UpdateAttendanceData {
  status?: 'present' | 'absent';
  notes?: string;
}

export interface AttendanceFilter {
  user_id?: string;
  user_role?: 'customer' | 'admin' | 'trainer';
  start_date?: string;
  end_date?: string;
  status?: 'present' | 'absent';
}
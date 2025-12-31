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
  created_at?: string;
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
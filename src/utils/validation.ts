import type { BookingPayload, RegisterData, LoginData } from '../types';

export const validateBooking = (data: Partial<BookingPayload>): string[] => {
  const errors: string[] = [];
  
  if (!data.name?.trim()) errors.push('Full name is required');
  if (!data.email?.match(/^\S+@\S+\.\S+$/)) errors.push('Valid email is required');
  if (!data.phone?.match(/^(\+91)?[6-9]\d{9}$/)) errors.push('Valid 10-digit phone number required');
  if (!data.serviceId) errors.push('Please select a service');
  if (!data.date) errors.push('Please select a date');
  if (!data.time) errors.push('Please select a time slot');
  
  return errors;
};

export const validateRegister = (data: Partial<RegisterData>): string[] => {
  const errors: string[] = [];
  
  if (!data.name?.trim()) errors.push('Full name is required');
  if (data.email && !data.email.match(/^\S+@\S+\.\S+$/)) {
    errors.push('Valid email format required');
  }
  if (!data.phone?.trim()) {
    errors.push('Phone number is required');
  } else if (!data.phone.match(/^[6-9]\d{9}$/)) {
    errors.push('Valid 10-digit phone number required (starting with 6-9)');
  }
  if (!data.pin) {
    errors.push('PIN is required');
  } else if (!data.pin.match(/^\d{6,8}$/)) {
    errors.push('PIN must be 6-8 digits');
  }
  
  return errors;
};

export const validateLogin = (data: Partial<LoginData>): string[] => {
  const errors: string[] = [];
  
  if (!data.phone?.trim()) {
    errors.push('Phone number is required');
  } else if (!data.phone.match(/^[6-9]\d{9}$/)) {
    errors.push('Valid 10-digit phone number required');
  }
  if (!data.pin) {
    errors.push('PIN is required');
  } else if (!data.pin.match(/^\d{6,8}$/)) {
    errors.push('PIN must be 6-8 digits');
  }
  
  return errors;
};

export const formatPhone = (phone: string): string => {
  const cleaned = phone.replace(/\D/g, '');
  return cleaned.startsWith('91') ? `+${cleaned}` : `+91${cleaned}`;
};

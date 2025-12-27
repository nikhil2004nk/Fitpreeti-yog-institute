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

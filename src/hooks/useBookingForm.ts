import { useState } from 'react';
import type { BookingPayload } from '../types';
import { validateBooking } from '../utils/validation';

export const useBookingForm = () => {
  const [formData, setFormData] = useState<Partial<BookingPayload>>({});
  const [errors, setErrors] = useState<string[]>([]);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);

  const handleChange = (field: keyof BookingPayload, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
    if (errors.length > 0) {
      const newErrors = validateBooking({ ...formData, [field]: value });
      setErrors(newErrors);
    }
  };

  const handleSubmit = async () => {
    const validationErrors = validateBooking(formData as BookingPayload);
    if (validationErrors.length > 0) {
      setErrors(validationErrors);
      return false;
    }

    setIsSubmitting(true);
    setErrors([]);

    await new Promise(resolve => setTimeout(resolve, 1500));
    
    setIsSubmitting(false);
    setIsSuccess(true);
    return true;
  };

  return {
    formData,
    errors,
    isSubmitting,
    isSuccess,
    handleChange,
    handleSubmit,
    resetForm: () => {
      setFormData({});
      setErrors([]);
      setIsSuccess(false);
    }
  };
};

import { useState, useEffect } from 'react';
import { Navbar } from '../components/layout/Navbar';
import { Footer } from '../components/layout/Footer';
import { Button } from '../components/ui/Button';
import { Modal } from '../components/ui/Modal';
import { useAuth } from '../contexts/AuthContext';
import { bookingService } from '../services/bookings';
import { serviceService, type Service } from '../services/services';
import { useNavigate } from 'react-router-dom';
import { ROUTES } from '../constants/routes';
import { AlertCircle } from 'lucide-react';

export const Booking: React.FC = () => {
  const { user, isAuthenticated } = useAuth();
  const navigate = useNavigate();
  
  const [services, setServices] = useState<Service[]>([]);
  const [selectedService, setSelectedService] = useState<Service | null>(null);
  const [selectedDate, setSelectedDate] = useState('');
  const [selectedTime, setSelectedTime] = useState('');
  const [availableSlots, setAvailableSlots] = useState<string[]>([]);
  const [loadingSlots, setLoadingSlots] = useState(false);
  const [notes, setNotes] = useState('');
  const [showSuccessModal, setShowSuccessModal] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string>('');
  const [showAllServices, setShowAllServices] = useState(false);
  
  // Form data
  const [formData, setFormData] = useState({
    full_name: user?.name || '',
    email: user?.email || '',
    phone: user?.phone || '',
  });

  // Fetch services on mount (only once)
  useEffect(() => {
    let isMounted = true;
    const fetchServices = async () => {
      try {
        const data = await serviceService.getAllServices();
        // Filter only active services
        if (isMounted) {
          setServices(data.filter(s => s.is_active));
        }
      } catch (err: any) {
        console.error('Failed to load services:', err);
        if (isMounted) {
          if (err?.message?.includes('429') || err?.statusCode === 429) {
            setError('Too many requests. Please wait a moment and refresh the page.');
          } else {
            setError('Failed to load services. Please refresh the page.');
          }
        }
      }
    };
    fetchServices();
    return () => {
      isMounted = false;
    };
  }, []);

  // Pre-select service from URL params
  useEffect(() => {
    const urlParams = new URLSearchParams(window.location.search);
    const serviceId = urlParams.get('service');
    if (serviceId && services.length > 0) {
      const service = services.find(s => s.id === serviceId);
      if (service) {
        setSelectedService(service);
        setTimeout(() => {
          const formElement = document.getElementById('booking-form');
          if (formElement) {
            formElement.scrollIntoView({ behavior: 'smooth', block: 'start' });
          }
        }, 100);
      }
    }
  }, [services]);

  // Fetch available slots when service and date are selected (with debouncing)
  useEffect(() => {
    if (!selectedService || !selectedDate) {
      setAvailableSlots([]);
      setSelectedTime('');
      return;
    }

    // Debounce API calls to prevent rate limiting
    const timeoutId = setTimeout(async () => {
      setLoadingSlots(true);
      setError(''); // Clear previous errors
      try {
        console.log('Fetching slots for:', {
          serviceId: selectedService.id,
          serviceName: selectedService.service_name,
          date: selectedDate,
          dateFormatted: new Date(selectedDate).toISOString()
        });
        
        const slotsData = await bookingService.getAvailableSlots(selectedService.id, selectedDate);
        console.log('Available slots response:', slotsData);
        console.log('Available slots array:', slotsData?.available_slots);
        console.log('Booked slots array:', slotsData?.booked_slots);
        
        if (slotsData && slotsData.available_slots && Array.isArray(slotsData.available_slots)) {
          if (slotsData.available_slots.length > 0) {
            setAvailableSlots(slotsData.available_slots);
            setError(''); // Clear any previous errors
          } else {
            setAvailableSlots([]);
            setError('No time slots available for this date. The class schedule may not have slots configured for this date, or all slots may be booked. Please try another date or contact us.');
          }
        } else {
          console.warn('Unexpected slots data format:', slotsData);
          setAvailableSlots([]);
          setError('No time slots available for this date. Please try another date.');
        }
        setSelectedTime(''); // Reset time when slots change
      } catch (err: any) {
        console.error('Failed to load available slots:', err);
        console.error('Error details:', {
          message: err?.message,
          statusCode: err?.statusCode,
          data: err?.data,
          stack: err?.stack
        });
        setAvailableSlots([]);
        
        // Handle different error cases
        if (err?.statusCode === 429 || err?.message?.includes('429')) {
          setError('Too many requests. Please wait a moment and try again.');
        } else if (err?.statusCode === 401 || err?.message?.includes('401') || err?.message?.includes('Unauthorized')) {
          setError('Please login to view available time slots.');
        } else if (err?.statusCode === 404 || err?.message?.includes('404') || err?.message?.includes('not found')) {
          setError('Service not found. Please refresh the page.');
        } else if (err?.message) {
          setError(`Unable to load time slots: ${err.message}`);
        } else {
          setError('Unable to load available time slots. Please check the console for details or contact support.');
        }
      } finally {
        setLoadingSlots(false);
      }
    }, 500); // 500ms debounce

    return () => clearTimeout(timeoutId);
  }, [selectedService, selectedDate]);

  // Update form data when user changes
  useEffect(() => {
    if (user) {
      setFormData({
        full_name: user.name || '',
        email: user.email || '',
        phone: user.phone || '',
      });
    }
  }, [user]);

  // Convert time from "HH:mm" to "HH:mm AM/PM" format for display
  const formatTimeForDisplay = (time: string): string => {
    if (!time) return '';
    const [hours, minutes] = time.split(':');
    const hour = parseInt(hours, 10);
    const ampm = hour >= 12 ? 'PM' : 'AM';
    const displayHour = hour % 12 || 12;
    return `${displayHour.toString().padStart(2, '0')}:${minutes} ${ampm}`;
  };

  // Convert time from "HH:mm AM/PM" to "HH:mm" format for API
  const convertTimeTo24Hour = (timeStr: string): string => {
    if (!timeStr) return '';
    // If already in 24-hour format, return as is
    if (/^\d{2}:\d{2}$/.test(timeStr)) {
      return timeStr;
    }
    // Convert from 12-hour format
    const [time, period] = timeStr.split(' ');
    const [hours, minutes] = time.split(':');
    let hour = parseInt(hours, 10);
    if (period === 'PM' && hour !== 12) hour += 12;
    if (period === 'AM' && hour === 12) hour = 0;
    return `${hour.toString().padStart(2, '0')}:${minutes}`;
  };

  const validateForm = (): string[] => {
    const errors: string[] = [];
    
    if (!selectedService) {
      errors.push('Please select a service');
    }
    if (!selectedDate) {
      errors.push('Please select a date');
    }
    if (!selectedTime) {
      errors.push('Please select a time');
    }
    if (!formData.full_name.trim()) {
      errors.push('Full name is required');
    }
    if (!formData.email.trim()) {
      errors.push('Email is required');
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      errors.push('Please enter a valid email address');
    }
    if (!formData.phone.trim()) {
      errors.push('Phone number is required');
    } else if (!/^\d{10}$/.test(formData.phone.replace(/\D/g, ''))) {
      errors.push('Please enter a valid 10-digit phone number');
    }

    return errors;
  };

  const handleInputChange = (field: string, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
    if (error) setError('');
  };

  const handleSubmit = async () => {
    const errors = validateForm();
    if (errors.length > 0) {
      setError(errors.join('. '));
      return;
    }

    if (!selectedService || !selectedDate || !selectedTime) {
      setError('Please complete all required fields');
      return;
    }

    setIsSubmitting(true);
    setError('');

    try {
      // Convert time to 24-hour format for API
      const bookingTime = convertTimeTo24Hour(selectedTime);
      
      if (!selectedService) {
        setError('Please select a service');
        setIsSubmitting(false);
        return;
      }
      
      const bookingData = {
        service_id: selectedService.id,
        booking_date: selectedDate,
        booking_time: bookingTime,
        full_name: formData.full_name.trim(),
        email: formData.email.trim(),
        phone: formData.phone.replace(/\D/g, ''), // Remove non-digits
        special_requests: notes.trim() || undefined,
        amount: selectedService.price || 0, // Include service price as amount
      };
      
      console.log('Creating booking with data:', bookingData);
      
      const result = await bookingService.createBooking(bookingData);
      console.log('Booking created successfully:', result);

      setShowSuccessModal(true);
    } catch (err: any) {
      console.error('Booking error:', err);
      if (err?.message?.includes('429') || err?.statusCode === 429) {
        setError('Too many requests. Please wait a moment and try again.');
      } else if (err?.message?.includes('Time slot already booked')) {
        setError('This time slot is already booked. Please select another time.');
        // Refresh available slots
        if (selectedService && selectedDate) {
          try {
            const slotsData = await bookingService.getAvailableSlots(selectedService.id, selectedDate);
            setAvailableSlots(slotsData.available_slots || []);
          } catch (refreshErr) {
            console.error('Failed to refresh slots:', refreshErr);
          }
        }
      } else {
        setError(err?.message || 'Failed to create booking. Please try again.');
      }
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleReset = () => {
    setSelectedService(null);
    setSelectedDate('');
    setSelectedTime('');
    setNotes('');
    setError('');
    setShowSuccessModal(false);
    if (user) {
      setFormData({
        full_name: user.name || '',
        email: user.email || '',
        phone: user.phone || '',
      });
    } else {
      setFormData({
        full_name: '',
        email: '',
        phone: '',
      });
    }
  };

  // Get minimum date (today)
  const today = new Date().toISOString().split('T')[0];

  return (
    <>
      <Navbar />
      
      <section id="book" className="py-16 md:py-32 bg-gradient-to-br from-emerald-900/10 via-white to-emerald-500/10 min-h-screen">
        <div className="container mx-auto px-6 lg:px-12 max-w-4xl">
          <div className="text-center mb-12 md:mb-20">
            <h1 className="text-5xl md:text-7xl font-bold bg-gradient-to-r from-emerald-900 to-emerald-500 bg-clip-text text-transparent mb-6">
              Book Your Class
            </h1>
            <p className="text-xl text-slate-600 max-w-2xl mx-auto">
              Secure your spot in less than 2 minutes
            </p>
            {!isAuthenticated && (
              <p className="text-sm text-slate-500 mt-2">
                <button
                  onClick={() => navigate(ROUTES.LOGIN)}
                  className="text-red-600 hover:text-red-700 underline"
                >
                  Login
                </button>
                {' or '}
                <button
                  onClick={() => navigate(ROUTES.REGISTER)}
                  className="text-red-600 hover:text-red-700 underline"
                >
                  Register
                </button>
                {' to pre-fill your information'}
              </p>
            )}
          </div>

          {error && (
            <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-2xl flex items-start space-x-2">
              <AlertCircle className="h-5 w-5 text-red-600 mt-0.5 flex-shrink-0" />
              <p className="text-red-700 text-sm">{error}</p>
            </div>
          )}

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-12">
            {/* Service Selection */}
            <div className="space-y-6 mt-8 md:mt-0 mb-12 lg:mb-0">
              <h2 className="text-3xl font-bold text-slate-900 mb-8">Select Service</h2>
              {services.length === 0 ? (
                <div className="text-center py-12">
                  <div className="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-red-600"></div>
                  <p className="mt-4 text-gray-600">Loading services...</p>
                </div>
              ) : (
                <div className="space-y-4">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {(showAllServices ? services : services.slice(0, 4)).map((service) => (
                    <button
                      key={service.id}
                      onClick={() => {
                        setSelectedService(service);
                        setSelectedDate('');
                        setSelectedTime('');
                        setTimeout(() => {
                          const formElement = document.getElementById('booking-form');
                          if (formElement) {
                            formElement.scrollIntoView({ behavior: 'smooth', block: 'start' });
                          }
                        }, 100);
                      }}
                      className={`p-6 rounded-3xl border-2 transition-all group hover:shadow-2xl hover:-translate-y-2 ${
                        selectedService?.id === service.id
                          ? 'border-accent bg-pink-500/10 shadow-2xl scale-105'
                          : 'border-slate-200 hover:border-emerald-900'
                      }`}
                    >
                      {service.image_url && (
                        <img 
                          src={service.image_url} 
                          alt={service.service_name}
                          className="w-full h-32 object-cover rounded-2xl mb-4 group-hover:scale-105 transition-transform"
                          onError={(e) => {
                            const target = e.target as HTMLImageElement;
                            // Prevent infinite loop - only set fallback once
                            if (!target.dataset.fallbackSet) {
                              target.dataset.fallbackSet = 'true';
                              // Use a data URI instead of external URL to avoid network errors
                              target.src = 'data:image/svg+xml,%3Csvg xmlns="http://www.w3.org/2000/svg" width="300" height="128"%3E%3Crect fill="%23e5e7eb" width="300" height="128"/%3E%3Ctext fill="%239ca3af" font-family="sans-serif" font-size="14" dy="10.5" font-weight="bold" x="50%25" y="50%25" text-anchor="middle"%3ENo Image%3C/text%3E%3C/svg%3E';
                            } else {
                              // If fallback also fails, hide the image
                              target.style.display = 'none';
                            }
                          }}
                        />
                      )}
                      <h3 className="font-bold text-xl mb-2">{service.service_name}</h3>
                      <div className="flex items-center justify-between">
                        <span className="text-2xl font-bold text-pink-500">₹{service.price}</span>
                        <span className="text-sm text-emerald-600 font-medium">
                          {service.duration_minutes} min
                        </span>
                      </div>
                    </button>
                    ))}
                  </div>
                  {services.length > 4 && (
                    <button
                      onClick={() => setShowAllServices(!showAllServices)}
                      className="w-full py-3 px-4 mt-4 bg-gradient-to-r from-emerald-600 to-emerald-500 text-white font-semibold rounded-xl hover:from-emerald-700 hover:to-emerald-600 transition-all duration-300 shadow-lg hover:shadow-xl"
                    >
                      {showAllServices ? 'Show Less' : `Show All (${services.length} services)`}
                    </button>
                  )}
                </div>
              )}
            </div>

            {/* Booking Form */}
            <div id="booking-form" className="space-y-6">
              <h2 className="text-3xl font-bold text-slate-900">Booking Details</h2>
              
              {selectedService && (
                <div className="p-6 bg-gradient-to-r from-pink-500/5 to-amber-500/5 rounded-3xl border border-accent/20 mb-6">
                  <h3 className="text-2xl font-bold text-slate-900 mb-2">{selectedService.service_name}</h3>
                  <p className="text-slate-600 mb-4">{selectedService.description}</p>
                  <div className="flex justify-between text-lg">
                    <span>₹{selectedService.price}</span>
                    <span className="font-semibold text-emerald-600">{selectedService.duration_minutes} min</span>
                  </div>
                </div>
              )}

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
                <div>
                  <label className="block text-sm font-semibold text-slate-700 mb-2">
                    Date <span className="text-red-600">*</span>
                  </label>
                  <input 
                    type="date" 
                    min={today}
                    className="w-full px-4 py-4 rounded-2xl border-2 border-slate-200 focus:outline-none focus:ring-4 focus:ring-accent/30 bg-white/50"
                    value={selectedDate}
                    onChange={(e) => {
                      setSelectedDate(e.target.value);
                      setSelectedTime(''); // Reset time when date changes
                    }}
                  />
                </div>
                <div>
                  <label className="block text-sm font-semibold text-slate-700 mb-2">
                    Time <span className="text-red-600">*</span>
                  </label>
                  <select 
                    className="w-full px-4 py-4 rounded-2xl border-2 border-slate-200 focus:outline-none focus:ring-4 focus:ring-accent/30 bg-white/50 disabled:opacity-50 disabled:cursor-not-allowed"
                    value={selectedTime}
                    onChange={(e) => setSelectedTime(e.target.value)}
                    disabled={!selectedDate || loadingSlots}
                  >
                    <option value="">
                      {loadingSlots 
                        ? 'Loading slots...' 
                        : !selectedDate 
                          ? 'Select date first' 
                          : availableSlots.length === 0 
                            ? 'No slots available' 
                            : 'Select Time'}
                    </option>
                    {availableSlots.map(slot => (
                      <option key={slot} value={slot}>
                        {formatTimeForDisplay(slot)}
                      </option>
                    ))}
                  </select>
                  {!loadingSlots && selectedDate && availableSlots.length === 0 && error && (
                    <p className="mt-2 text-sm text-amber-600">
                      {error}
                    </p>
                  )}
                  {!loadingSlots && selectedDate && availableSlots.length === 0 && !error && (
                    <p className="mt-2 text-sm text-gray-500">
                      No time slots available for this date. Please try another date or contact us.
                    </p>
                  )}
                </div>
              </div>

              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-semibold text-slate-700 mb-2">
                    Special Requests
                  </label>
                  <textarea
                    value={notes}
                    onChange={(e) => setNotes(e.target.value)}
                    placeholder="Any special requests or notes?"
                    className="w-full px-4 py-3 rounded-2xl border-2 border-slate-200 focus:outline-none focus:ring-4 focus:ring-accent/30 bg-white/50 min-h-[100px]"
                  />
                </div>
                <input 
                  type="text" 
                  placeholder="Full Name *"
                  className="w-full px-4 py-4 rounded-2xl border-2 border-slate-200 focus:outline-none focus:ring-4 focus:ring-accent/30 bg-white/50"
                  value={formData.full_name}
                  onChange={(e) => handleInputChange('full_name', e.target.value)}
                />
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <input 
                    type="email" 
                    placeholder="Email *"
                    className="w-full px-4 py-4 rounded-2xl border-2 border-slate-200 focus:outline-none focus:ring-4 focus:ring-accent/30 bg-white/50"
                    value={formData.email}
                    onChange={(e) => handleInputChange('email', e.target.value)}
                  />
                  <input 
                    type="tel" 
                    placeholder="Phone (+91) *"
                    className="w-full px-4 py-4 rounded-2xl border-2 border-slate-200 focus:outline-none focus:ring-4 focus:ring-accent/30 bg-white/50"
                    value={formData.phone}
                    onChange={(e) => handleInputChange('phone', e.target.value)}
                  />
                </div>
              </div>

              <Button 
                variant="accent" 
                size="lg" 
                fullWidth
                onClick={handleSubmit}
                isLoading={isSubmitting}
                disabled={!selectedService || !selectedDate || !selectedTime || isSubmitting}
              >
                {isSubmitting ? 'Confirming...' : 'Confirm Booking'}
              </Button>
            </div>
          </div>
        </div>
      </section>

      <Footer />

      <Modal 
        isOpen={showSuccessModal}
        onClose={() => {
          setShowSuccessModal(false);
          handleReset();
          navigate(ROUTES.CUSTOMER_BOOKINGS);
        }}
        title="Booking Confirmed! 🎉"
      >
        <div className="text-center">
          <div className="w-24 h-24 bg-green-100 rounded-3xl mx-auto mb-6 flex items-center justify-center">
            <span className="text-3xl">✅</span>
          </div>
          <h3 className="text-2xl font-bold text-slate-900 mb-4">Your spot is secured!</h3>
          <p className="text-lg text-slate-600 mb-8">
            We've sent a confirmation to {formData.email}. Please check your inbox for details about your upcoming class.
            {notes && (
              <span className="block mt-2 text-sm">
                <strong>Your note:</strong> {notes}
              </span>
            )}
          </p>
          <div className="text-sm text-slate-500 mb-8 space-y-1">
            <p><strong>Class:</strong> {selectedService?.service_name}</p>
            <p><strong>Date:</strong> {selectedDate && new Date(selectedDate).toLocaleDateString('en-US', { 
              weekday: 'long', 
              year: 'numeric', 
              month: 'long', 
              day: 'numeric' 
            })}</p>
            <p><strong>Time:</strong> {selectedTime && formatTimeForDisplay(selectedTime)}</p>
          </div>
        </div>
      </Modal>
    </>
  );
};

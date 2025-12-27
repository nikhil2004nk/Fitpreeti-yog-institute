import { useState, useEffect } from 'react';
import type { Service } from '../types';  // ✅ FIXED: type-only import
import { Navbar } from '../components/layout/Navbar';
import { Footer } from '../components/layout/Footer';  // ✅ FIXED: Added import
import { Button } from '../components/ui/Button';
import { Modal } from '../components/ui/Modal';
import { useBookingForm } from '../hooks/useBookingForm';
import services from '../data/services';

export const Booking: React.FC = () => {
  const [selectedService, setSelectedService] = useState<Service | null>(null);
  const [selectedDate, setSelectedDate] = useState('');
  const [selectedTime, setSelectedTime] = useState('');
  const [notes, setNotes] = useState('');
  const [showSuccessModal, setShowSuccessModal] = useState(false);
  
  const { formData, errors, isSubmitting, handleChange, handleSubmit, resetForm } = useBookingForm();

  const timeSlots = ['07:00 AM', '08:30 AM', '10:00 AM', '04:30 PM', '06:00 PM', '07:30 PM'];

  useEffect(() => {
    // Pre-select service from URL params
    const urlParams = new URLSearchParams(window.location.search);
    const serviceId = urlParams.get('service');
    if (serviceId) {
      const service = (services as Service[]).find(s => s.id === serviceId); // ✅ FIXED: type assertion
      if (service) setSelectedService(service);
    }
  }, []);

  const onSubmit = async () => {
    if (!selectedService || !selectedDate || !selectedTime) return;
    
    // Update formData with selected values before validation
    handleChange('serviceId', selectedService.id);
    handleChange('date', selectedDate);
    handleChange('time', selectedTime);
    handleChange('notes', notes);
    
    const success = await handleSubmit();
    if (success) {
      setShowSuccessModal(true);
    }
  };

  return (
    <>
      <Navbar />
      
      <section id="book" className="py-32 bg-gradient-to-br from-emerald-900/10 via-white to-emerald-500/10 min-h-screen">
        <div className="container mx-auto px-6 lg:px-12 max-w-4xl">
          <div className="text-center mb-20">
            <h1 className="text-5xl md:text-7xl font-bold bg-gradient-to-r from-emerald-900 to-emerald-500 bg-clip-text text-transparent mb-6">
              Book Your Class
            </h1>
            <p className="text-xl text-slate-600 max-w-2xl mx-auto">
              Secure your spot in less than 2 minutes
            </p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
            {/* Service Selection */}
            <div className="space-y-6">
              <h2 className="text-3xl font-bold text-slate-900 mb-8">Select Service</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {(services as Service[]).map((service) => (  // ✅ FIXED: type assertion for map
                  <button
                    key={service.id}
                    onClick={() => {
                      setSelectedService(service);
                      // Smooth scroll to the booking form
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
                    <img 
                      src={service.image} 
                      alt={service.name}
                      className="w-full h-32 object-cover rounded-2xl mb-4 group-hover:scale-105 transition-transform"
                      onError={(e) => {
                        // Fallback to a placeholder if the image fails to load
                        (e.target as HTMLImageElement).src = 'https://via.placeholder.com/300x128';
                      }}
                    />
                    <h3 className="font-bold text-xl mb-2">{service.name}</h3>
                    <div className="flex items-center justify-between">
                      <span className="text-2xl font-bold text-pink-500">₹{service.price}</span>
                      <span className="text-sm text-emerald-600 font-medium">{service.duration}</span>
                    </div>
                  </button>
                ))}
              </div>
            </div>

            {/* Booking Form */}
            <div id="booking-form" className="space-y-6">
              <h2 className="text-3xl font-bold text-slate-900">Booking Details</h2>
              
              {selectedService && (
                <div className="p-6 bg-gradient-to-r from-pink-500/5 to-amber-500/5 rounded-3xl border border-accent/20 mb-6">
                  <h3 className="text-2xl font-bold text-slate-900 mb-2">{selectedService.name}</h3>
                  <p className="text-slate-600 mb-4">{selectedService.description}</p>
                  <div className="flex justify-between text-lg">
                    <span>₹{selectedService.price}</span>
                    <span className="font-semibold text-emerald-600">{selectedService.duration}</span>
                  </div>
                </div>
              )}

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
                <div>
                  <label className="block text-sm font-semibold text-slate-700 mb-2">Date</label>
                  <input 
                    type="date" 
                    className="w-full px-4 py-4 rounded-2xl border-2 border-slate-200 focus:outline-none focus:ring-4 focus:ring-accent/30 bg-white/50"
                    value={selectedDate}
                    onChange={(e) => setSelectedDate(e.target.value)}
                  />
                </div>
                <div>
                  <label className="block text-sm font-semibold text-slate-700 mb-2">Time</label>
                  <select 
                    className="w-full px-4 py-4 rounded-2xl border-2 border-slate-200 focus:outline-none focus:ring-4 focus:ring-accent/30 bg-white/50"
                    value={selectedTime}
                    onChange={(e) => setSelectedTime(e.target.value)}
                  >
                    <option value="">Select Time</option>
                    {timeSlots.map(time => (
                      <option key={time} value={time}>{time}</option>
                    ))}
                  </select>
                </div>
              </div>

              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-semibold text-slate-700 mb-2">Special Requests</label>
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
                  value={formData.name || ''}
                  onChange={(e) => handleChange('name' as const, e.target.value)}
                />
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <input 
                    type="email" 
                    placeholder="Email *"
                    className="w-full px-4 py-4 rounded-2xl border-2 border-slate-200 focus:outline-none focus:ring-4 focus:ring-accent/30 bg-white/50"
                    value={formData.email || ''}
                    onChange={(e) => handleChange('email' as const, e.target.value)}
                  />
                  <input 
                    type="tel" 
                    placeholder="Phone (+91) *"
                    className="w-full px-4 py-4 rounded-2xl border-2 border-slate-200 focus:outline-none focus:ring-4 focus:ring-accent/30 bg-white/50"
                    value={formData.phone || ''}
                    onChange={(e) => handleChange('phone' as const, e.target.value)}
                  />
                </div>
              </div>

              {errors.length > 0 && (
                <div className="bg-red-50 border border-red-200 rounded-2xl p-4">
                  <ul className="text-red-700 text-sm space-y-1">
                    {errors.map((error, i) => <li key={i}>• {error}</li>)}
                  </ul>
                </div>
              )}

              <Button 
                variant="accent" 
                size="lg" 
                fullWidth
                onClick={onSubmit}
                isLoading={isSubmitting}
                // ✅ FIXED: removed 'disabled' prop - handled internally
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
          resetForm();
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
          <div className="text-sm text-slate-500 mb-8">
            <p><strong>Class:</strong> {selectedService?.name}</p>
            <p><strong>Date:</strong> {selectedDate}</p>
            <p><strong>Time:</strong> {selectedTime}</p>
          </div>
        </div>
      </Modal>
    </>
  );
};

import { useState, useEffect } from 'react';
import { Navbar } from '../../components/layout/Navbar';
import { Footer } from '../../components/layout/Footer';
import { classScheduleService, type ClassSchedule, type CreateClassScheduleData, type UpdateClassScheduleData } from '../../services/classSchedule';
import { trainerService, type Trainer } from '../../services/trainers';
import { serviceService, type Service } from '../../services/services';
import { Calendar, Plus, Edit, Trash2, Search, Users, Clock, CheckCircle, X } from 'lucide-react';

export const ClassScheduleManagement: React.FC = () => {
  const [schedules, setSchedules] = useState<ClassSchedule[]>([]);
  const [filteredSchedules, setFilteredSchedules] = useState<ClassSchedule[]>([]);
  const [trainers, setTrainers] = useState<Trainer[]>([]);
  const [services, setServices] = useState<Service[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string>('');
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState<'all' | 'scheduled' | 'cancelled' | 'completed' | 'in_progress'>('all');
  const [showForm, setShowForm] = useState(false);
  const [editingSchedule, setEditingSchedule] = useState<ClassSchedule | null>(null);
  const [formData, setFormData] = useState<CreateClassScheduleData & { status: 'scheduled' | 'cancelled' | 'completed' | 'in_progress' }>({
    title: '',
    description: '',
    start_time: '',
    end_time: '',
    status: 'scheduled',
    max_participants: 20,
    current_participants: 0,
    trainer_id: '',
    service_id: '',
    is_recurring: false,
    recurrence_pattern: '',
    recurrence_end_date: ''
  });
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    fetchSchedules();
    fetchTrainersAndServices();
  }, []);

  useEffect(() => {
    filterSchedules();
  }, [searchTerm, statusFilter, schedules]);

  const fetchTrainersAndServices = async () => {
    try {
      const [trainersData, servicesData] = await Promise.all([
        trainerService.getAllTrainers(),
        serviceService.getAllServices()
      ]);
      setTrainers(trainersData);
      setServices(servicesData);
    } catch (err: any) {
      console.error('Failed to load trainers/services:', err);
    }
  };

  const fetchSchedules = async () => {
    try {
      setLoading(true);
      const data = await classScheduleService.getAllSchedules();
      setSchedules(data);
      setFilteredSchedules(data);
    } catch (err: any) {
      setError(err?.message || 'Failed to load class schedules');
    } finally {
      setLoading(false);
    }
  };

  const filterSchedules = () => {
    let filtered = schedules;

    // Filter by status
    if (statusFilter !== 'all') {
      filtered = filtered.filter(s => s.status === statusFilter);
    }

    // Filter by search term
    if (searchTerm) {
      const term = searchTerm.toLowerCase();
      filtered = filtered.filter(s =>
        s.title.toLowerCase().includes(term) ||
        (s.description && s.description.toLowerCase().includes(term))
      );
    }

    setFilteredSchedules(filtered);
  };

  const handleDelete = async (id: string) => {
    if (!window.confirm('Are you sure you want to delete this class schedule?')) return;

    try {
      await classScheduleService.deleteSchedule(id);
      setSchedules(schedules.filter(s => s.id !== id));
      alert('Class schedule deleted successfully');
    } catch (err: any) {
      alert(err?.message || 'Failed to delete class schedule');
    }
  };

  const resetForm = () => {
    setFormData({
      title: '',
      description: '',
      start_time: '',
      end_time: '',
      status: 'scheduled',
      max_participants: 20,
      current_participants: 0,
      trainer_id: '',
      service_id: '',
      is_recurring: false,
      recurrence_pattern: '',
      recurrence_end_date: ''
    });
    setEditingSchedule(null);
  };

  const openEditForm = (schedule: ClassSchedule) => {
    setEditingSchedule(schedule);
    // Format dates for input (YYYY-MM-DDTHH:mm)
    const startDate = new Date(schedule.start_time).toISOString().slice(0, 16);
    const endDate = new Date(schedule.end_time).toISOString().slice(0, 16);
    const recurrenceEnd = schedule.recurrence_end_date
      ? new Date(schedule.recurrence_end_date).toISOString().slice(0, 16)
      : '';

    setFormData({
      title: schedule.title,
      description: schedule.description || '',
      start_time: startDate,
      end_time: endDate,
      status: schedule.status,
      max_participants: schedule.max_participants,
      current_participants: schedule.current_participants,
      trainer_id: schedule.trainer_id,
      service_id: schedule.service_id,
      is_recurring: schedule.is_recurring,
      recurrence_pattern: schedule.recurrence_pattern || '',
      recurrence_end_date: recurrenceEnd
    });
    setShowForm(true);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.title.trim() || !formData.trainer_id || !formData.service_id) {
      alert('Title, trainer, and service are required');
      return;
    }
    if (!formData.start_time || !formData.end_time) {
      alert('Start and end times are required');
      return;
    }
    if (new Date(formData.end_time) <= new Date(formData.start_time)) {
      alert('End time must be after start time');
      return;
    }

    setIsSubmitting(true);
    try {
      const baseData = {
        title: formData.title,
        description: formData.description || undefined,
        start_time: new Date(formData.start_time).toISOString(),
        end_time: new Date(formData.end_time).toISOString(),
        status: formData.status,
        max_participants: formData.max_participants,
        current_participants: formData.current_participants,
        trainer_id: formData.trainer_id,
        service_id: formData.service_id,
        is_recurring: formData.is_recurring,
        recurrence_pattern: formData.is_recurring ? (formData.recurrence_pattern || undefined) : undefined,
        recurrence_end_date: formData.is_recurring && formData.recurrence_end_date
          ? new Date(formData.recurrence_end_date).toISOString()
          : undefined
      };

      if (editingSchedule && editingSchedule.id) {
        await classScheduleService.updateSchedule(editingSchedule.id, baseData as UpdateClassScheduleData);
        alert('Class schedule updated successfully');
      } else {
        await classScheduleService.createSchedule(baseData as CreateClassScheduleData);
        alert('Class schedule created successfully');
      }

      await fetchSchedules();
      setShowForm(false);
      resetForm();
    } catch (err: any) {
      alert(err?.message || 'Failed to save class schedule');
    } finally {
      setIsSubmitting(false);
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'scheduled':
        return 'bg-blue-100 text-blue-700';
      case 'in_progress':
        return 'bg-yellow-100 text-yellow-700';
      case 'completed':
        return 'bg-green-100 text-green-700';
      case 'cancelled':
        return 'bg-red-100 text-red-700';
      default:
        return 'bg-gray-100 text-gray-700';
    }
  };

  const formatDateTime = (dateTime: string) => {
    const date = new Date(dateTime);
    return {
      date: date.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' }),
      time: date.toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' })
    };
  };

  return (
    <>
      <Navbar />
      <div className="min-h-screen bg-gradient-to-br from-gray-50 via-white to-gray-100 pt-20 pb-12">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          {/* Header */}
          <div className="mb-8 flex justify-between items-center">
            <div>
              <h1 className="text-4xl font-bold text-gray-900 mb-2">Class Schedule Management</h1>
              <p className="text-gray-600">Manage class schedules and timings</p>
            </div>
            <button
              onClick={() => {
                resetForm();
                setShowForm(true);
              }}
              className="px-6 py-3 bg-red-600 text-white font-semibold rounded-lg hover:bg-red-700 transition-colors flex items-center space-x-2"
            >
              <Plus className="h-5 w-5" />
              <span>Add Schedule</span>
            </button>
          </div>

          {/* Stats */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
            <div className="bg-white rounded-xl shadow-lg p-6 border-l-4 border-blue-600">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-gray-600 text-sm font-medium">Total Classes</p>
                  <p className="text-3xl font-bold text-gray-900 mt-2">{schedules.length}</p>
                </div>
                <Calendar className="h-12 w-12 text-blue-600 opacity-20" />
              </div>
            </div>

            <div className="bg-white rounded-xl shadow-lg p-6 border-l-4 border-green-600">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-gray-600 text-sm font-medium">Scheduled</p>
                  <p className="text-3xl font-bold text-gray-900 mt-2">
                    {schedules.filter(s => s.status === 'scheduled').length}
                  </p>
                </div>
                <CheckCircle className="h-12 w-12 text-green-600 opacity-20" />
              </div>
            </div>

            <div className="bg-white rounded-xl shadow-lg p-6 border-l-4 border-yellow-600">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-gray-600 text-sm font-medium">In Progress</p>
                  <p className="text-3xl font-bold text-gray-900 mt-2">
                    {schedules.filter(s => s.status === 'in_progress').length}
                  </p>
                </div>
                <Clock className="h-12 w-12 text-yellow-600 opacity-20" />
              </div>
            </div>

            <div className="bg-white rounded-xl shadow-lg p-6 border-l-4 border-purple-600">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-gray-600 text-sm font-medium">Total Participants</p>
                  <p className="text-3xl font-bold text-gray-900 mt-2">
                    {schedules.reduce((sum, s) => sum + s.current_participants, 0)}
                  </p>
                </div>
                <Users className="h-12 w-12 text-purple-600 opacity-20" />
              </div>
            </div>
          </div>

          {/* Filters */}
          <div className="bg-white rounded-xl shadow-lg p-6 mb-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
                <input
                  type="text"
                  placeholder="Search class schedules..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-600 focus:border-transparent"
                />
              </div>

              <div>
                <select
                  value={statusFilter}
                  onChange={(e) => setStatusFilter(e.target.value as any)}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-600 focus:border-transparent"
                >
                  <option value="all">All Status</option>
                  <option value="scheduled">Scheduled</option>
                  <option value="in_progress">In Progress</option>
                  <option value="completed">Completed</option>
                  <option value="cancelled">Cancelled</option>
                </select>
              </div>
            </div>
          </div>

          {/* Schedules List */}
          {loading ? (
            <div className="text-center py-12">
              <div className="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-red-600"></div>
              <p className="mt-4 text-gray-600">Loading class schedules...</p>
            </div>
          ) : error ? (
            <div className="text-center py-12">
              <p className="text-red-600">{error}</p>
              <button
                onClick={fetchSchedules}
                className="mt-4 px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700"
              >
                Retry
              </button>
            </div>
          ) : filteredSchedules.length === 0 ? (
            <div className="text-center py-12">
              <Calendar className="h-16 w-16 text-gray-400 mx-auto mb-4" />
              <p className="text-gray-600">No class schedules found</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 max-h-[600px] overflow-y-auto pr-2">
              {filteredSchedules.map((schedule) => {
                const startDateTime = formatDateTime(schedule.start_time);
                const endDateTime = formatDateTime(schedule.end_time);

                return (
                  <div key={schedule.id} className="bg-white rounded-xl shadow-lg p-6">
                    <div className="flex items-start justify-between mb-4">
                      <div className="flex-1">
                        <h3 className="text-xl font-bold text-gray-900 mb-2">{schedule.title}</h3>
                        <span className={`px-3 py-1 text-xs font-semibold rounded-full inline-block ${getStatusColor(schedule.status)}`}>
                          {schedule.status.replace('_', ' ').toUpperCase()}
                        </span>
                      </div>
                    </div>

                    {schedule.description && (
                      <p className="text-sm text-gray-600 mb-4 line-clamp-2">{schedule.description}</p>
                    )}

                    <div className="space-y-3 mb-4">
                      <div className="flex items-center text-sm text-gray-600">
                        <Calendar className="h-4 w-4 mr-2 text-gray-400" />
                        <span><strong>Start:</strong> {startDateTime.date} at {startDateTime.time}</span>
                      </div>
                      <div className="flex items-center text-sm text-gray-600">
                        <Clock className="h-4 w-4 mr-2 text-gray-400" />
                        <span><strong>End:</strong> {endDateTime.date} at {endDateTime.time}</span>
                      </div>
                      <div className="flex items-center text-sm text-gray-600">
                        <Users className="h-4 w-4 mr-2 text-gray-400" />
                        <span>
                          <strong>Participants:</strong> {schedule.current_participants} / {schedule.max_participants}
                        </span>
                      </div>
                      {schedule.is_recurring && (
                        <div className="text-sm text-gray-600">
                          <strong>Recurring:</strong> {schedule.recurrence_pattern || 'Yes'}
                        </div>
                      )}
                    </div>

                    <div className="flex space-x-2 pt-4 border-t">
                      <button
                        onClick={() => openEditForm(schedule)}
                        className="flex-1 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors flex items-center justify-center space-x-2"
                      >
                        <Edit className="h-4 w-4" />
                        <span>Edit</span>
                      </button>
                      <button
                        onClick={() => handleDelete(schedule.id)}
                        className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors flex items-center space-x-2"
                      >
                        <Trash2 className="h-4 w-4" />
                      </button>
                    </div>
                  </div>
                );
              })}
            </div>
          )}

          {/* Class Schedule Form Modal */}
          {showForm && (
            <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
              <div className="bg-white rounded-xl shadow-xl max-w-3xl w-full max-h-[90vh] overflow-y-auto">
                <div className="sticky top-0 bg-white border-b border-gray-200 px-6 py-4 flex justify-between items-center">
                  <h2 className="text-2xl font-bold text-gray-900">
                    {editingSchedule ? 'Edit Class Schedule' : 'Add New Class Schedule'}
                  </h2>
                  <button
                    onClick={() => {
                      setShowForm(false);
                      resetForm();
                    }}
                    className="p-2 hover:bg-gray-100 rounded-lg"
                  >
                    <X className="h-5 w-5" />
                  </button>
                </div>

                <form onSubmit={handleSubmit} className="p-6">
                  <div className="space-y-6">
                    {/* Title */}
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Title <span className="text-red-600">*</span>
                      </label>
                      <input
                        type="text"
                        required
                        value={formData.title}
                        onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-600 focus:border-transparent"
                        placeholder="Class title"
                      />
                    </div>

                    {/* Description */}
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">Description</label>
                      <textarea
                        value={formData.description}
                        onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                        rows={3}
                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-600 focus:border-transparent"
                        placeholder="Class description"
                      />
                    </div>

                    {/* Trainer and Service */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          Trainer <span className="text-red-600">*</span>
                        </label>
                        <select
                          required
                          value={formData.trainer_id}
                          onChange={(e) => setFormData({ ...formData, trainer_id: e.target.value })}
                          className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-600 focus:border-transparent"
                        >
                          <option value="">Select trainer</option>
                          {trainers.map((trainer) => (
                            <option key={trainer.id} value={trainer.id}>
                              {trainer.name}
                            </option>
                          ))}
                        </select>
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          Service <span className="text-red-600">*</span>
                        </label>
                        <select
                          required
                          value={formData.service_id}
                          onChange={(e) => setFormData({ ...formData, service_id: e.target.value })}
                          className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-600 focus:border-transparent"
                        >
                          <option value="">Select service</option>
                          {services.map((service) => (
                            <option key={service.id} value={service.id}>
                              {service.service_name}
                            </option>
                          ))}
                        </select>
                      </div>
                    </div>

                    {/* Start and End Time */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          Start Time <span className="text-red-600">*</span>
                        </label>
                        <input
                          type="datetime-local"
                          required
                          value={formData.start_time}
                          onChange={(e) => setFormData({ ...formData, start_time: e.target.value })}
                          className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-600 focus:border-transparent"
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          End Time <span className="text-red-600">*</span>
                        </label>
                        <input
                          type="datetime-local"
                          required
                          value={formData.end_time}
                          onChange={(e) => setFormData({ ...formData, end_time: e.target.value })}
                          className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-600 focus:border-transparent"
                        />
                      </div>
                    </div>

                    {/* Status and Max Participants */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">Status</label>
                        <select
                          value={formData.status}
                          onChange={(e) => setFormData({ ...formData, status: e.target.value as any })}
                          className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-600 focus:border-transparent"
                        >
                          <option value="scheduled">Scheduled</option>
                          <option value="in_progress">In Progress</option>
                          <option value="completed">Completed</option>
                          <option value="cancelled">Cancelled</option>
                        </select>
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">Max Participants</label>
                        <input
                          type="number"
                          min="1"
                          value={formData.max_participants}
                          onChange={(e) => setFormData({ ...formData, max_participants: parseInt(e.target.value) || 20 })}
                          className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-600 focus:border-transparent"
                        />
                      </div>
                    </div>

                    {/* Current Participants (only for edit) */}
                    {editingSchedule && (
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">Current Participants</label>
                        <input
                          type="number"
                          min="0"
                          max={formData.max_participants}
                          value={formData.current_participants}
                          onChange={(e) => setFormData({ ...formData, current_participants: parseInt(e.target.value) || 0 })}
                          className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-600 focus:border-transparent"
                        />
                      </div>
                    )}

                    {/* Recurring */}
                    <div className="space-y-4">
                      <div className="flex items-center">
                        <input
                          type="checkbox"
                          id="isRecurring"
                          checked={formData.is_recurring}
                          onChange={(e) => setFormData({ ...formData, is_recurring: e.target.checked })}
                          className="h-4 w-4 text-red-600 focus:ring-red-500 border-gray-300 rounded"
                        />
                        <label htmlFor="isRecurring" className="ml-2 text-sm text-gray-700">
                          Recurring Class
                        </label>
                      </div>

                      {formData.is_recurring && (
                        <>
                          <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">Recurrence Pattern</label>
                            <select
                              value={formData.recurrence_pattern}
                              onChange={(e) => setFormData({ ...formData, recurrence_pattern: e.target.value })}
                              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-600 focus:border-transparent"
                            >
                              <option value="">Select pattern</option>
                              <option value="daily">Daily</option>
                              <option value="weekly">Weekly</option>
                              <option value="monthly">Monthly</option>
                            </select>
                          </div>
                          <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">Recurrence End Date</label>
                            <input
                              type="datetime-local"
                              value={formData.recurrence_end_date}
                              onChange={(e) => setFormData({ ...formData, recurrence_end_date: e.target.value })}
                              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-600 focus:border-transparent"
                            />
                          </div>
                        </>
                      )}
                    </div>
                  </div>

                  <div className="flex justify-end space-x-4 mt-6 pt-6 border-t">
                    <button
                      type="button"
                      onClick={() => {
                        setShowForm(false);
                        resetForm();
                      }}
                      className="px-6 py-2 border border-gray-300 rounded-lg hover:bg-gray-50"
                      disabled={isSubmitting}
                    >
                      Cancel
                    </button>
                    <button
                      type="submit"
                      disabled={isSubmitting}
                      className="px-6 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                      {isSubmitting ? 'Saving...' : editingSchedule ? 'Update Schedule' : 'Create Schedule'}
                    </button>
                  </div>
                </form>
              </div>
            </div>
          )}
        </div>
      </div>
      <Footer />
    </>
  );
};


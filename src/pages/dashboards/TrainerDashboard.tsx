import { useState, useEffect } from 'react';
import { Navbar } from '../../components/layout/Navbar';
import { Footer } from '../../components/layout/Footer';
import { useAuth } from '../../contexts/AuthContext';
import { classScheduleService, type ClassSchedule } from '../../services/classSchedule';
import { bookingService, type Booking } from '../../services/bookings';
import { Calendar, Users, Clock, TrendingUp, User, Phone, Mail } from 'lucide-react';

export const TrainerDashboard: React.FC = () => {
  const { user } = useAuth();
  const [schedules, setSchedules] = useState<ClassSchedule[]>([]);
  const [bookings, setBookings] = useState<Booking[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string>('');

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        // Note: In a real app, you'd filter by trainer_id from user.id
        // For now, we'll get all schedules and filter client-side
        const [schedulesData, bookingsData] = await Promise.all([
          classScheduleService.getAllSchedules(),
          bookingService.getAllBookings().catch(() => []) // May not have access
        ]);
        
        // Filter schedules for this trainer (if trainer_id matches user.id)
        // For now, show all schedules
        setSchedules(schedulesData);
        setBookings(bookingsData);
      } catch (err: any) {
        setError(err?.message || 'Failed to load data');
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  const today = new Date().toISOString().split('T')[0];
  const todaySchedules = schedules.filter(s => {
    const scheduleDate = new Date(s.start_time).toISOString().split('T')[0];
    return scheduleDate === today && s.status === 'scheduled';
  });

  const upcomingSchedules = schedules.filter(s => {
    const scheduleDate = new Date(s.start_time);
    return scheduleDate >= new Date() && s.status === 'scheduled';
  });

  const totalStudents = new Set(bookings.map(b => b.user_id)).size;
  const totalClasses = schedules.length;

  const formatDateTime = (dateTime: string) => {
    const date = new Date(dateTime);
    return {
      date: date.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' }),
      time: date.toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' })
    };
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

  return (
    <>
      <Navbar />
      <div className="min-h-screen bg-gradient-to-br from-gray-50 via-white to-gray-100 pt-20 pb-12">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          {/* Header */}
          <div className="mb-8">
            <h1 className="text-4xl font-bold text-gray-900 mb-2">Trainer Dashboard</h1>
            <p className="text-gray-600">Manage your classes and schedule</p>
          </div>

          {/* Stats Cards */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
            <div className="bg-white rounded-xl shadow-lg p-6 border-l-4 border-red-600">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-gray-600 text-sm font-medium">Today's Classes</p>
                  <p className="text-3xl font-bold text-gray-900 mt-2">{todaySchedules.length}</p>
                </div>
                <Calendar className="h-12 w-12 text-red-600 opacity-20" />
              </div>
            </div>

            <div className="bg-white rounded-xl shadow-lg p-6 border-l-4 border-blue-600">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-gray-600 text-sm font-medium">Total Students</p>
                  <p className="text-3xl font-bold text-gray-900 mt-2">{totalStudents}</p>
                </div>
                <Users className="h-12 w-12 text-blue-600 opacity-20" />
              </div>
            </div>

            <div className="bg-white rounded-xl shadow-lg p-6 border-l-4 border-green-600">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-gray-600 text-sm font-medium">Upcoming Sessions</p>
                  <p className="text-3xl font-bold text-gray-900 mt-2">{upcomingSchedules.length}</p>
                </div>
                <Clock className="h-12 w-12 text-green-600 opacity-20" />
              </div>
            </div>

            <div className="bg-white rounded-xl shadow-lg p-6 border-l-4 border-purple-600">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-gray-600 text-sm font-medium">Total Classes</p>
                  <p className="text-3xl font-bold text-gray-900 mt-2">{totalClasses}</p>
                </div>
                <TrendingUp className="h-12 w-12 text-purple-600 opacity-20" />
              </div>
            </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Profile Card */}
            <div className="lg:col-span-1">
              <div className="bg-white rounded-xl shadow-lg p-6">
                <h2 className="text-xl font-bold text-gray-900 mb-4">Profile Information</h2>
                <div className="space-y-4">
                  <div className="flex items-center space-x-3">
                    <div className="bg-red-100 rounded-full p-3">
                      <User className="h-6 w-6 text-red-600" />
                    </div>
                    <div>
                      <p className="text-sm text-gray-600">Name</p>
                      <p className="font-semibold text-gray-900">{user?.name}</p>
                    </div>
                  </div>

                  {user?.email && (
                    <div className="flex items-center space-x-3">
                      <div className="bg-blue-100 rounded-full p-3">
                        <Mail className="h-6 w-6 text-blue-600" />
                      </div>
                      <div>
                        <p className="text-sm text-gray-600">Email</p>
                        <p className="font-semibold text-gray-900">{user.email}</p>
                      </div>
                    </div>
                  )}

                  <div className="flex items-center space-x-3">
                    <div className="bg-green-100 rounded-full p-3">
                      <Phone className="h-6 w-6 text-green-600" />
                    </div>
                    <div>
                      <p className="text-sm text-gray-600">Phone</p>
                      <p className="font-semibold text-gray-900">{user?.phone}</p>
                    </div>
                  </div>

                  <div className="pt-4 border-t">
                    <p className="text-sm text-gray-600 mb-2">Role</p>
                    <span className="inline-block px-3 py-1 bg-purple-100 text-purple-700 rounded-full text-sm font-semibold capitalize">
                      {user?.role}
                    </span>
                  </div>
                </div>
              </div>
            </div>

            {/* Main Content */}
            <div className="lg:col-span-2 space-y-6">
              {/* Today's Schedule */}
              <div className="bg-white rounded-xl shadow-lg p-6">
                <h2 className="text-xl font-bold text-gray-900 mb-4">Today's Schedule</h2>
                {loading ? (
                  <div className="text-center py-12">
                    <div className="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-purple-600"></div>
                    <p className="mt-4 text-gray-600">Loading schedule...</p>
                  </div>
                ) : error ? (
                  <div className="text-center py-12">
                    <p className="text-red-600">{error}</p>
                  </div>
                ) : todaySchedules.length === 0 ? (
                  <div className="text-center py-12">
                    <Calendar className="h-16 w-16 text-gray-400 mx-auto mb-4" />
                    <p className="text-gray-600">No classes scheduled for today</p>
                  </div>
                ) : (
                  <div className="space-y-4">
                    {todaySchedules.map((schedule) => {
                      const { date, time } = formatDateTime(schedule.start_time);
                      const endTime = new Date(schedule.end_time).toLocaleTimeString('en-US', {
                        hour: '2-digit',
                        minute: '2-digit'
                      });
                      return (
                        <div
                          key={schedule.id}
                          className="border border-gray-200 rounded-lg p-4 hover:shadow-md transition-shadow"
                        >
                          <div className="flex items-start justify-between">
                            <div className="flex-1">
                              <div className="flex items-center space-x-3 mb-2">
                                <h3 className="font-semibold text-gray-900">{schedule.title}</h3>
                                <span className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(schedule.status)}`}>
                                  {schedule.status}
                                </span>
                              </div>
                              {schedule.description && (
                                <p className="text-sm text-gray-600 mb-2">{schedule.description}</p>
                              )}
                              <div className="space-y-1 text-sm text-gray-600">
                                <p className="flex items-center space-x-2">
                                  <Clock className="h-4 w-4" />
                                  <span>{time} - {endTime}</span>
                                </p>
                                <p className="flex items-center space-x-2">
                                  <Users className="h-4 w-4" />
                                  <span>
                                    {schedule.current_participants} / {schedule.max_participants} participants
                                  </span>
                                </p>
                              </div>
                            </div>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                )}
              </div>

              {/* Upcoming Classes */}
              {upcomingSchedules.length > todaySchedules.length && (
                <div className="bg-white rounded-xl shadow-lg p-6">
                  <h2 className="text-xl font-bold text-gray-900 mb-4">Upcoming Classes</h2>
                  <div className="space-y-4">
                    {upcomingSchedules.slice(0, 3).map((schedule) => {
                      const { date, time } = formatDateTime(schedule.start_time);
                      return (
                        <div
                          key={schedule.id}
                          className="border border-gray-200 rounded-lg p-4 hover:shadow-md transition-shadow"
                        >
                          <div className="flex items-start justify-between">
                            <div className="flex-1">
                              <h3 className="font-semibold text-gray-900 mb-1">{schedule.title}</h3>
                              <p className="text-sm text-gray-600">
                                {date} at {time}
                              </p>
                              <span className={`inline-block mt-2 px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(schedule.status)}`}>
                                {schedule.status}
                              </span>
                            </div>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
      <Footer />
    </>
  );
};

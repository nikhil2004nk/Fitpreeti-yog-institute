import { useState, useEffect } from 'react';
import { Navbar } from '../../components/layout/Navbar';
import { Footer } from '../../components/layout/Footer';
import { useAuth } from '../../contexts/AuthContext';
import { userService } from '../../services/users';
import type { User } from '../../types';
import { bookingService, type Booking } from '../../services/bookings';
import { serviceService, type Service } from '../../services/services';
import { Users, Calendar, TrendingUp, DollarSign, User as UserIcon, Phone, Mail, Shield, X, CheckCircle } from 'lucide-react';

export const AdminDashboard: React.FC = () => {
  const { user } = useAuth();
  const [users, setUsers] = useState<User[]>([]);
  const [bookings, setBookings] = useState<Booking[]>([]);
  const [services, setServices] = useState<Service[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string>('');

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        const [usersData, bookingsData, servicesData] = await Promise.all([
          userService.getAllUsers(),
          bookingService.getAllBookings(),
          serviceService.getAllServices()
        ]);
        setUsers(usersData);
        setBookings(bookingsData);
        setServices(servicesData);
      } catch (err: any) {
        setError(err?.message || 'Failed to load data');
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  const handleUpdateBookingStatus = async (id: string, status: Booking['status']) => {
    try {
      await bookingService.updateBooking(id, { status });
      setBookings(bookings.map(b => b.id === id ? { ...b, status } : b));
    } catch (err: any) {
      alert(err?.message || 'Failed to update booking');
    }
  };

  const handleUpdateUserRole = async (phone: string, role: 'customer' | 'admin' | 'trainer') => {
    if (!window.confirm(`Are you sure you want to change this user's role to ${role}?`)) return;
    
    try {
      const updatedUser = await userService.updateUserRole(phone, role);
      setUsers(users.map(u => u.phone === phone ? updatedUser : u));
    } catch (err: any) {
      alert(err?.message || 'Failed to update user role');
    }
  };

  const totalUsers = users.length;
  const totalBookings = bookings.length;
  const activeServices = services.filter(s => s.is_active).length;
  const revenue = bookings
    .filter(b => b.status === 'confirmed' || b.status === 'completed')
    .reduce((sum, booking) => {
      const service = services.find(s => s.id === booking.service_id);
      return sum + (service?.price || 0);
    }, 0);

  const recentBookings = bookings.slice(0, 5).sort((a, b) => 
    new Date(b.created_at).getTime() - new Date(a.created_at).getTime()
  );

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'confirmed':
        return 'bg-green-100 text-green-700';
      case 'pending':
        return 'bg-yellow-100 text-yellow-700';
      case 'cancelled':
        return 'bg-red-100 text-red-700';
      case 'completed':
        return 'bg-blue-100 text-blue-700';
      default:
        return 'bg-gray-100 text-gray-700';
    }
  };

  const getRoleColor = (role: string) => {
    switch (role) {
      case 'admin':
        return 'bg-red-100 text-red-700';
      case 'trainer':
        return 'bg-purple-100 text-purple-700';
      case 'customer':
        return 'bg-blue-100 text-blue-700';
      default:
        return 'bg-gray-100 text-gray-700';
    }
  };

  const formatDate = (date: string) => {
    return new Date(date).toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric'
    });
  };

  return (
    <>
      <Navbar />
      <div className="min-h-screen bg-gradient-to-br from-gray-50 via-white to-gray-100 pt-20 pb-12">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          {/* Header */}
          <div className="mb-8">
            <h1 className="text-4xl font-bold text-gray-900 mb-2">Admin Dashboard</h1>
            <p className="text-gray-600">Manage your institute</p>
          </div>

          {/* Stats Cards */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
            <div className="bg-white rounded-xl shadow-lg p-6 border-l-4 border-red-600">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-gray-600 text-sm font-medium">Total Users</p>
                  <p className="text-3xl font-bold text-gray-900 mt-2">{totalUsers}</p>
                </div>
                <Users className="h-12 w-12 text-red-600 opacity-20" />
              </div>
            </div>

            <div className="bg-white rounded-xl shadow-lg p-6 border-l-4 border-blue-600">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-gray-600 text-sm font-medium">Total Bookings</p>
                  <p className="text-3xl font-bold text-gray-900 mt-2">{totalBookings}</p>
                </div>
                <Calendar className="h-12 w-12 text-blue-600 opacity-20" />
              </div>
            </div>

            <div className="bg-white rounded-xl shadow-lg p-6 border-l-4 border-green-600">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-gray-600 text-sm font-medium">Revenue</p>
                  <p className="text-3xl font-bold text-gray-900 mt-2">₹{revenue.toLocaleString()}</p>
                </div>
                <DollarSign className="h-12 w-12 text-green-600 opacity-20" />
              </div>
            </div>

            <div className="bg-white rounded-xl shadow-lg p-6 border-l-4 border-purple-600">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-gray-600 text-sm font-medium">Active Services</p>
                  <p className="text-3xl font-bold text-gray-900 mt-2">{activeServices}</p>
                </div>
                <TrendingUp className="h-12 w-12 text-purple-600 opacity-20" />
              </div>
            </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Profile Card */}
            <div className="lg:col-span-1">
              <div className="bg-white rounded-xl shadow-lg p-6">
                <h2 className="text-xl font-bold text-gray-900 mb-4">Admin Profile</h2>
                <div className="space-y-4">
                  <div className="flex items-center space-x-3">
                      <div className="bg-red-100 rounded-full p-3">
                      <UserIcon className="h-6 w-6 text-red-600" />
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
                    <span className="inline-flex items-center space-x-2 px-3 py-1 bg-red-100 text-red-700 rounded-full text-sm font-semibold">
                      <Shield className="h-4 w-4" />
                      <span className="capitalize">{user?.role}</span>
                    </span>
                  </div>
                </div>
              </div>
            </div>

            {/* Main Content */}
            <div className="lg:col-span-2 space-y-6">
              {/* Recent Bookings */}
              <div className="bg-white rounded-xl shadow-lg p-6">
                <h2 className="text-xl font-bold text-gray-900 mb-4">Recent Bookings</h2>
                {loading ? (
                  <div className="text-center py-12">
                    <div className="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-red-600"></div>
                    <p className="mt-4 text-gray-600">Loading...</p>
                  </div>
                ) : error ? (
                  <div className="text-center py-12">
                    <p className="text-red-600">{error}</p>
                  </div>
                ) : recentBookings.length === 0 ? (
                  <div className="text-center py-12">
                    <Calendar className="h-16 w-16 text-gray-400 mx-auto mb-4" />
                    <p className="text-gray-600">No bookings yet</p>
                  </div>
                ) : (
                  <div className="space-y-4">
                    {recentBookings.map((booking) => (
                      <div
                        key={booking.id}
                        className="border border-gray-200 rounded-lg p-4 hover:shadow-md transition-shadow"
                      >
                        <div className="flex items-start justify-between">
                          <div className="flex-1">
                            <div className="flex items-center space-x-3 mb-2">
                              <h3 className="font-semibold text-gray-900">{booking.full_name}</h3>
                              <span className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(booking.status)}`}>
                                {booking.status}
                              </span>
                            </div>
                            <div className="space-y-1 text-sm text-gray-600">
                              <p>{formatDate(booking.booking_date)} at {booking.booking_time}</p>
                              <p>{booking.email} • {booking.phone}</p>
                            </div>
                          </div>
                          <div className="flex items-center space-x-2">
                            {booking.status === 'pending' && (
                              <>
                                <button
                                  onClick={() => handleUpdateBookingStatus(booking.id, 'confirmed')}
                                  className="p-2 text-green-600 hover:bg-green-50 rounded-lg transition-colors"
                                  title="Confirm booking"
                                >
                                  <CheckCircle className="h-5 w-5" />
                                </button>
                                <button
                                  onClick={() => handleUpdateBookingStatus(booking.id, 'cancelled')}
                                  className="p-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                                  title="Cancel booking"
                                >
                                  <X className="h-5 w-5" />
                                </button>
                              </>
                            )}
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>

              {/* Users Overview */}
              <div className="bg-white rounded-xl shadow-lg p-6">
                <h2 className="text-xl font-bold text-gray-900 mb-4">Users Overview</h2>
                {loading ? (
                  <div className="text-center py-8">
                    <div className="inline-block animate-spin rounded-full h-6 w-6 border-b-2 border-red-600"></div>
                  </div>
                ) : (
                  <div className="space-y-3">
                    {users.slice(0, 5).map((u) => (
                      <div
                        key={u.phone}
                        className="flex items-center justify-between p-3 border border-gray-200 rounded-lg hover:shadow-md transition-shadow"
                      >
                        <div className="flex items-center space-x-3">
                          <div className="bg-gray-100 rounded-full p-2">
                            <UserIcon className="h-5 w-5 text-gray-600" />
                          </div>
                          <div>
                            <p className="font-semibold text-gray-900">{u.name}</p>
                            <p className="text-sm text-gray-600">{u.phone}</p>
                          </div>
                        </div>
                        <div className="flex items-center space-x-2">
                          <span className={`px-2 py-1 rounded-full text-xs font-medium ${getRoleColor(u.role)}`}>
                            {u.role}
                          </span>
                          {u.phone !== user?.phone && (
                            <select
                              value={u.role}
                              onChange={(e) => handleUpdateUserRole(u.phone, e.target.value as 'customer' | 'admin' | 'trainer')}
                              className="text-xs border border-gray-300 rounded px-2 py-1"
                            >
                              <option value="customer">Customer</option>
                              <option value="trainer">Trainer</option>
                              <option value="admin">Admin</option>
                            </select>
                          )}
                        </div>
                      </div>
                    ))}
                    {users.length > 5 && (
                      <p className="text-sm text-gray-600 text-center pt-2">
                        And {users.length - 5} more users...
                      </p>
                    )}
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
      <Footer />
    </>
  );
};

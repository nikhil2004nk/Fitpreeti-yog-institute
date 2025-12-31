import { Navbar } from '../../components/layout/Navbar';
import { Footer } from '../../components/layout/Footer';
import { useAuth } from '../../contexts/AuthContext';
import { Calendar, Clock, MapPin, Phone, Mail, User } from 'lucide-react';
import { Link } from 'react-router-dom';
import { ROUTES } from '../../constants/routes';

export const CustomerDashboard: React.FC = () => {
  const { user } = useAuth();

  return (
    <>
      <Navbar />
      <div className="min-h-screen bg-gradient-to-br from-gray-50 via-white to-gray-100 pt-20 pb-12">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          {/* Header */}
          <div className="mb-8">
            <h1 className="text-4xl font-bold text-gray-900 mb-2">Welcome back, {user?.name}!</h1>
            <p className="text-gray-600">Manage your bookings and activities</p>
          </div>

          {/* Stats Cards */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
            <div className="bg-white rounded-xl shadow-lg p-6 border-l-4 border-red-600">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-gray-600 text-sm font-medium">Upcoming Bookings</p>
                  <p className="text-3xl font-bold text-gray-900 mt-2">0</p>
                </div>
                <Calendar className="h-12 w-12 text-red-600 opacity-20" />
              </div>
            </div>

            <div className="bg-white rounded-xl shadow-lg p-6 border-l-4 border-blue-600">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-gray-600 text-sm font-medium">Total Bookings</p>
                  <p className="text-3xl font-bold text-gray-900 mt-2">0</p>
                </div>
                <Clock className="h-12 w-12 text-blue-600 opacity-20" />
              </div>
            </div>

            <div className="bg-white rounded-xl shadow-lg p-6 border-l-4 border-green-600">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-gray-600 text-sm font-medium">Classes Attended</p>
                  <p className="text-3xl font-bold text-gray-900 mt-2">0</p>
                </div>
                <MapPin className="h-12 w-12 text-green-600 opacity-20" />
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
                    <span className="inline-block px-3 py-1 bg-red-100 text-red-700 rounded-full text-sm font-semibold capitalize">
                      {user?.role}
                    </span>
                  </div>
                </div>
              </div>
            </div>

            {/* Main Content */}
            <div className="lg:col-span-2 space-y-6">
              {/* Quick Actions */}
              <div className="bg-white rounded-xl shadow-lg p-6">
                <h2 className="text-xl font-bold text-gray-900 mb-4">Quick Actions</h2>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <Link
                    to={ROUTES.BOOKING}
                    className="flex items-center space-x-4 p-4 border-2 border-gray-200 rounded-xl hover:border-red-600 hover:bg-red-50 transition-all group"
                  >
                    <div className="bg-red-600 text-white p-3 rounded-lg group-hover:scale-110 transition-transform">
                      <Calendar className="h-6 w-6" />
                    </div>
                    <div>
                      <p className="font-semibold text-gray-900">Book a Class</p>
                      <p className="text-sm text-gray-600">Schedule a new session</p>
                    </div>
                  </Link>

                  <Link
                    to={ROUTES.SERVICES}
                    className="flex items-center space-x-4 p-4 border-2 border-gray-200 rounded-xl hover:border-red-600 hover:bg-red-50 transition-all group"
                  >
                    <div className="bg-blue-600 text-white p-3 rounded-lg group-hover:scale-110 transition-transform">
                      <MapPin className="h-6 w-6" />
                    </div>
                    <div>
                      <p className="font-semibold text-gray-900">View Services</p>
                      <p className="text-sm text-gray-600">Explore our offerings</p>
                    </div>
                  </Link>
                </div>
              </div>

              {/* Recent Bookings */}
              <div className="bg-white rounded-xl shadow-lg p-6">
                <h2 className="text-xl font-bold text-gray-900 mb-4">Recent Bookings</h2>
                <div className="text-center py-12">
                  <Calendar className="h-16 w-16 text-gray-400 mx-auto mb-4" />
                  <p className="text-gray-600 mb-2">No bookings yet</p>
                  <Link
                    to={ROUTES.BOOKING}
                    className="inline-block px-6 py-2 bg-red-600 text-white rounded-xl font-semibold hover:bg-red-700 transition-colors"
                  >
                    Book Your First Class
                  </Link>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
      <Footer />
    </>
  );
};


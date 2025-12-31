import { Navbar } from '../../components/layout/Navbar';
import { Footer } from '../../components/layout/Footer';
import { useAuth } from '../../contexts/AuthContext';
import { Users, Calendar, TrendingUp, DollarSign, Settings, User, Phone, Mail, Shield } from 'lucide-react';

export const AdminDashboard: React.FC = () => {
  const { user } = useAuth();

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
                  <p className="text-3xl font-bold text-gray-900 mt-2">0</p>
                </div>
                <Users className="h-12 w-12 text-red-600 opacity-20" />
              </div>
            </div>

            <div className="bg-white rounded-xl shadow-lg p-6 border-l-4 border-blue-600">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-gray-600 text-sm font-medium">Total Bookings</p>
                  <p className="text-3xl font-bold text-gray-900 mt-2">0</p>
                </div>
                <Calendar className="h-12 w-12 text-blue-600 opacity-20" />
              </div>
            </div>

            <div className="bg-white rounded-xl shadow-lg p-6 border-l-4 border-green-600">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-gray-600 text-sm font-medium">Revenue</p>
                  <p className="text-3xl font-bold text-gray-900 mt-2">₹0</p>
                </div>
                <DollarSign className="h-12 w-12 text-green-600 opacity-20" />
              </div>
            </div>

            <div className="bg-white rounded-xl shadow-lg p-6 border-l-4 border-purple-600">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-gray-600 text-sm font-medium">Active Services</p>
                  <p className="text-3xl font-bold text-gray-900 mt-2">0</p>
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
              {/* Quick Actions */}
              <div className="bg-white rounded-xl shadow-lg p-6">
                <h2 className="text-xl font-bold text-gray-900 mb-4">Admin Actions</h2>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <button className="flex items-center space-x-4 p-4 border-2 border-gray-200 rounded-xl hover:border-red-600 hover:bg-red-50 transition-all group">
                    <div className="bg-red-600 text-white p-3 rounded-lg group-hover:scale-110 transition-transform">
                      <Users className="h-6 w-6" />
                    </div>
                    <div>
                      <p className="font-semibold text-gray-900">Manage Users</p>
                      <p className="text-sm text-gray-600">View and manage all users</p>
                    </div>
                  </button>

                  <button className="flex items-center space-x-4 p-4 border-2 border-gray-200 rounded-xl hover:border-red-600 hover:bg-red-50 transition-all group">
                    <div className="bg-blue-600 text-white p-3 rounded-lg group-hover:scale-110 transition-transform">
                      <Calendar className="h-6 w-6" />
                    </div>
                    <div>
                      <p className="font-semibold text-gray-900">Manage Bookings</p>
                      <p className="text-sm text-gray-600">View all bookings</p>
                    </div>
                  </button>

                  <button className="flex items-center space-x-4 p-4 border-2 border-gray-200 rounded-xl hover:border-red-600 hover:bg-red-50 transition-all group">
                    <div className="bg-green-600 text-white p-3 rounded-lg group-hover:scale-110 transition-transform">
                      <TrendingUp className="h-6 w-6" />
                    </div>
                    <div>
                      <p className="font-semibold text-gray-900">Manage Services</p>
                      <p className="text-sm text-gray-600">Add and edit services</p>
                    </div>
                  </button>

                  <button className="flex items-center space-x-4 p-4 border-2 border-gray-200 rounded-xl hover:border-red-600 hover:bg-red-50 transition-all group">
                    <div className="bg-purple-600 text-white p-3 rounded-lg group-hover:scale-110 transition-transform">
                      <Settings className="h-6 w-6" />
                    </div>
                    <div>
                      <p className="font-semibold text-gray-900">Settings</p>
                      <p className="text-sm text-gray-600">Configure system</p>
                    </div>
                  </button>
                </div>
              </div>

              {/* Recent Activity */}
              <div className="bg-white rounded-xl shadow-lg p-6">
                <h2 className="text-xl font-bold text-gray-900 mb-4">Recent Activity</h2>
                <div className="text-center py-12">
                  <Settings className="h-16 w-16 text-gray-400 mx-auto mb-4" />
                  <p className="text-gray-600">No recent activity</p>
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


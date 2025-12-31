import { Navigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { CustomerDashboard } from './dashboards/CustomerDashboard';
import { TrainerDashboard } from './dashboards/TrainerDashboard';
import { AdminDashboard } from './dashboards/AdminDashboard';
import { ROUTES } from '../constants/routes';

export const Dashboard: React.FC = () => {
  const { user, isAuthenticated, loading } = useAuth();

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="text-center">
          <div className="inline-block animate-spin rounded-full h-12 w-12 border-b-2 border-red-600"></div>
          <p className="mt-4 text-gray-600">Loading...</p>
        </div>
      </div>
    );
  }

  if (!isAuthenticated) {
    return <Navigate to={ROUTES.LOGIN} replace />;
  }

  // Route to appropriate dashboard based on user role
  switch (user?.role) {
    case 'admin':
      return <AdminDashboard />;
    case 'trainer':
      return <TrainerDashboard />;
    case 'customer':
    default:
      return <CustomerDashboard />;
  }
};


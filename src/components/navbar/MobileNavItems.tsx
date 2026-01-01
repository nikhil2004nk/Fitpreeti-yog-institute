import { NavLink } from 'react-router-dom';
import { LogOut, User, Shield, Users, UserCheck, Package, Star, Calendar, BookOpen, FileText, CalendarCheck } from 'lucide-react';
import { ROUTES } from '../../constants/routes';
import type { User as UserType } from '../../types';
import { BookNowButton } from './BookNowButton';

interface MobileNavItemsProps {
  isAuthenticated: boolean;
  user: UserType | null;
  onNavClick: (to: string) => void;
  onLogout: () => Promise<void>;
  isLoggingOut: boolean;
}

export const MobileNavItems: React.FC<MobileNavItemsProps> = ({ 
  isAuthenticated, 
  user, 
  onNavClick,
  onLogout,
  isLoggingOut
}) => {
  const handleNavClick = (to: string) => {
    onNavClick(to);
  };

  const handleLogout = async () => {
    await onLogout();
    handleNavClick(ROUTES.HOME);
  };

  const handleBookNowClick = () => {
    handleNavClick(ROUTES.BOOKING);
  };

  const navItems = [
    { to: ROUTES.HOME, label: 'Home', end: true },
    { to: ROUTES.SERVICES, label: 'Services' },
    { to: ROUTES.ONLINE, label: 'Online Studio' },
    { to: ROUTES.CORPORATE, label: 'Corporate' },
    { to: ROUTES.ABOUT, label: 'About' },
    { to: ROUTES.CONTACT, label: 'Contact' },
  ];

  // Admin menu items
  const adminMenuItems = [
    { to: ROUTES.ADMIN_USERS, label: 'User Management', icon: Users },
    { to: ROUTES.ADMIN_TRAINERS, label: 'Trainer Management', icon: UserCheck },
    { to: ROUTES.ADMIN_SERVICES, label: 'Service Management', icon: Package },
    { to: ROUTES.ADMIN_REVIEWS, label: 'Review Management', icon: Star },
    { to: ROUTES.ADMIN_CLASS_SCHEDULES, label: 'Class Schedule', icon: Calendar },
    { to: ROUTES.ADMIN_BOOKINGS, label: 'Booking Management', icon: BookOpen },
    { to: ROUTES.ADMIN_CMS, label: 'CMS Management', icon: FileText },
  ];

  // Customer menu items
  const customerMenuItems = [
    { to: ROUTES.CUSTOMER_BOOKINGS, label: 'My Bookings', icon: Calendar },
    { to: ROUTES.CUSTOMER_ATTENDANCE, label: 'My Attendance', icon: CalendarCheck },
    { to: ROUTES.CUSTOMER_PROFILE, label: 'My Profile', icon: User },
    { to: ROUTES.BOOKING, label: 'Book a Class', icon: BookOpen },
  ];

  return (
    <>
      {navItems.map((item) => (
        <li key={item.to} className="border-b border-gray-100 last:border-0">
          <NavLink
            to={item.to}
            end={item.end}
            onClick={() => handleNavClick(item.to)}
            className={({ isActive }) =>
              `block py-4 px-6 font-medium transition-colors text-base ${
                isActive 
                  ? 'text-red-600 bg-red-50 font-semibold' 
                  : 'text-gray-800 hover:bg-gray-50 hover:text-red-600'
              }`
            }
          >
            {item.label}
          </NavLink>
        </li>
      ))}
      
      {/* Role-based navigation section */}
      {isAuthenticated && user && (
        <>
          {user.role === 'admin' && (
            <>
              <li className="border-t-2 border-gray-200 mt-2 pt-2">
                <div className="px-6 py-2 text-xs font-semibold text-gray-500 uppercase tracking-wider">
                  Admin Panel
                </div>
              </li>
              {adminMenuItems.map((item) => {
                const Icon = item.icon;
                return (
                  <li key={item.to} className="border-b border-gray-100 last:border-0">
                    <NavLink
                      to={item.to}
                      onClick={() => handleNavClick(item.to)}
                      className={({ isActive }) =>
                        `block py-3 px-6 pl-12 font-medium transition-colors text-sm ${
                          isActive 
                            ? 'text-red-600 bg-red-50 font-semibold' 
                            : 'text-gray-700 hover:bg-gray-50 hover:text-red-600'
                        }`
                      }
                    >
                      <div className="flex items-center space-x-3">
                        <Icon className="h-4 w-4" />
                        <span>{item.label}</span>
                      </div>
                    </NavLink>
                  </li>
                );
              })}
            </>
          )}
          
          {user.role === 'customer' && (
            <>
              <li className="border-t-2 border-gray-200 mt-2 pt-2">
                <div className="px-6 py-2 text-xs font-semibold text-gray-500 uppercase tracking-wider">
                  My Account
                </div>
              </li>
              {customerMenuItems.map((item) => {
                const Icon = item.icon;
                return (
                  <li key={item.to} className="border-b border-gray-100 last:border-0">
                    <NavLink
                      to={item.to}
                      onClick={() => handleNavClick(item.to)}
                      className={({ isActive }) =>
                        `block py-3 px-6 pl-12 font-medium transition-colors text-sm ${
                          isActive 
                            ? 'text-red-600 bg-red-50 font-semibold' 
                            : 'text-gray-700 hover:bg-gray-50 hover:text-red-600'
                        }`
                      }
                    >
                      <div className="flex items-center space-x-3">
                        <Icon className="h-4 w-4" />
                        <span>{item.label}</span>
                      </div>
                    </NavLink>
                  </li>
                );
              })}
            </>
          )}
          
          {user.role === 'trainer' && (
            <>
              <li className="border-t-2 border-gray-200 mt-2 pt-2">
                <div className="px-6 py-2 text-xs font-semibold text-gray-500 uppercase tracking-wider">
                  Trainer Panel
                </div>
              </li>
              <li className="border-b border-gray-100 last:border-0">
                <NavLink
                  to={ROUTES.TRAINER_ATTENDANCE}
                  onClick={() => handleNavClick(ROUTES.TRAINER_ATTENDANCE)}
                  className={({ isActive }) =>
                    `block py-3 px-6 pl-12 font-medium transition-colors text-sm ${
                      isActive 
                        ? 'text-red-600 bg-red-50 font-semibold' 
                        : 'text-gray-700 hover:bg-gray-50 hover:text-red-600'
                    }`
                  }
                >
                  <div className="flex items-center space-x-3">
                    <CalendarCheck className="h-4 w-4" />
                    <span>My Attendance</span>
                  </div>
                </NavLink>
              </li>
            </>
          )}
        </>
      )}

      <li className="mt-2 px-4 pb-4 space-y-2 border-t-2 border-gray-200 pt-4">
        {/* Show Book Now button for customers and non-authenticated users */}
        {(!isAuthenticated || user?.role === 'customer') && (
          <BookNowButton variant="mobile" onNavClick={handleBookNowClick} />
        )}
        
        {isAuthenticated ? (
          <>
            <NavLink
              to={ROUTES.DASHBOARD}
              onClick={() => handleNavClick(ROUTES.DASHBOARD)}
              className="block py-3 px-6 bg-purple-600 text-white font-semibold rounded-xl text-center 
                         hover:bg-purple-700 hover:shadow-lg transition-all duration-300 mb-2"
            >
              Dashboard
            </NavLink>
            {user?.name && (
              <div className="py-2 px-6 text-sm text-gray-700 text-center">
                {user.name}
                {user.role && (
                  <span className="ml-2 text-xs text-gray-500 capitalize">({user.role})</span>
                )}
              </div>
            )}
            <button
              onClick={handleLogout}
              disabled={isLoggingOut}
              className="w-full py-3 px-6 bg-gray-600 text-white font-semibold rounded-xl text-center 
                         hover:bg-gray-700 hover:shadow-lg transition-all duration-300 disabled:opacity-50 flex items-center justify-center space-x-2"
            >
              <LogOut className="h-4 w-4" />
              <span>Logout</span>
            </button>
          </>
        ) : (
          <NavLink
            to={ROUTES.LOGIN}
            onClick={() => handleNavClick(ROUTES.LOGIN)}
            className="block py-3 px-6 bg-gray-600 text-white font-semibold rounded-xl text-center 
                       hover:bg-gray-700 hover:shadow-lg transition-all duration-300 flex items-center justify-center space-x-2"
          >
            <User className="h-4 w-4" />
            <span>Login</span>
          </NavLink>
        )}
      </li>
    </>
  );
};


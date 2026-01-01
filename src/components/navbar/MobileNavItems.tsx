import { NavLink } from 'react-router-dom';
import { LogOut, User, Users, UserCheck, Package, Star, Calendar, BookOpen, FileText, CalendarCheck } from 'lucide-react';
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
    { to: ROUTES.ADMIN_ATTENDANCE, label: 'Attendance Management', icon: CalendarCheck },
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
      {/* Public Navigation Items */}
      {navItems.map((item) => (
        <li key={item.to} className="border-b border-gray-100">
          <NavLink
            to={item.to}
            end={item.end}
            onClick={() => handleNavClick(item.to)}
            className={({ isActive }) =>
              `block py-3.5 px-4 sm:px-6 font-medium transition-colors text-sm sm:text-base active:bg-gray-100 touch-manipulation ${
                isActive 
                  ? 'text-red-600 bg-red-50 font-semibold border-l-4 border-red-600' 
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
          {/* Admin Role */}
          {user.role === 'admin' && (
            <>
              <li className="border-t-2 border-gray-300 mt-1">
                <div className="px-4 sm:px-6 py-3 text-xs font-bold text-gray-600 uppercase tracking-wider bg-gray-50">
                  Admin Panel
                </div>
              </li>
              {adminMenuItems.map((item) => {
                const Icon = item.icon;
                return (
                  <li key={item.to} className="border-b border-gray-100">
                    <NavLink
                      to={item.to}
                      onClick={() => handleNavClick(item.to)}
                      className={({ isActive }) =>
                        `block py-3.5 px-4 sm:px-6 pl-10 sm:pl-12 font-medium transition-colors text-sm sm:text-base active:bg-gray-100 touch-manipulation ${
                          isActive 
                            ? 'text-red-600 bg-red-50 font-semibold border-l-4 border-red-600' 
                            : 'text-gray-700 hover:bg-gray-50 hover:text-red-600'
                        }`
                      }
                    >
                      <div className="flex items-center space-x-3">
                        <Icon className="h-4 w-4 sm:h-5 sm:w-5 flex-shrink-0" />
                        <span className="truncate">{item.label}</span>
                      </div>
                    </NavLink>
                  </li>
                );
              })}
            </>
          )}
          
          {/* Customer Role */}
          {user.role === 'customer' && (
            <>
              <li className="border-t-2 border-gray-300 mt-1">
                <div className="px-4 sm:px-6 py-3 text-xs font-bold text-gray-600 uppercase tracking-wider bg-gray-50">
                  My Account
                </div>
              </li>
              {customerMenuItems.map((item) => {
                const Icon = item.icon;
                return (
                  <li key={item.to} className="border-b border-gray-100">
                    <NavLink
                      to={item.to}
                      onClick={() => handleNavClick(item.to)}
                      className={({ isActive }) =>
                        `block py-3.5 px-4 sm:px-6 pl-10 sm:pl-12 font-medium transition-colors text-sm sm:text-base active:bg-gray-100 touch-manipulation ${
                          isActive 
                            ? 'text-red-600 bg-red-50 font-semibold border-l-4 border-red-600' 
                            : 'text-gray-700 hover:bg-gray-50 hover:text-red-600'
                        }`
                      }
                    >
                      <div className="flex items-center space-x-3">
                        <Icon className="h-4 w-4 sm:h-5 sm:w-5 flex-shrink-0" />
                        <span className="truncate">{item.label}</span>
                      </div>
                    </NavLink>
                  </li>
                );
              })}
            </>
          )}
          
          {/* Trainer Role */}
          {user.role === 'trainer' && (
            <>
              <li className="border-t-2 border-gray-300 mt-1">
                <div className="px-4 sm:px-6 py-3 text-xs font-bold text-gray-600 uppercase tracking-wider bg-gray-50">
                  Trainer Panel
                </div>
              </li>
              <li className="border-b border-gray-100">
                <NavLink
                  to={ROUTES.TRAINER_ATTENDANCE}
                  onClick={() => handleNavClick(ROUTES.TRAINER_ATTENDANCE)}
                  className={({ isActive }) =>
                    `block py-3.5 px-4 sm:px-6 pl-10 sm:pl-12 font-medium transition-colors text-sm sm:text-base active:bg-gray-100 touch-manipulation ${
                      isActive 
                        ? 'text-red-600 bg-red-50 font-semibold border-l-4 border-red-600' 
                        : 'text-gray-700 hover:bg-gray-50 hover:text-red-600'
                    }`
                  }
                >
                  <div className="flex items-center space-x-3">
                    <CalendarCheck className="h-4 w-4 sm:h-5 sm:w-5 flex-shrink-0" />
                    <span className="truncate">My Attendance</span>
                  </div>
                </NavLink>
              </li>
            </>
          )}
        </>
      )}

      {/* Footer Section - Fixed at bottom */}
      <li className="mt-auto border-t-2 border-gray-300 pt-4 pb-4 px-4 sm:px-6 bg-gray-50 space-y-3">
        {/* Show Book Now button for customers and non-authenticated users */}
        {(!isAuthenticated || user?.role === 'customer') && (
          <div>
            <BookNowButton variant="mobile" onNavClick={handleBookNowClick} />
          </div>
        )}
        
        {isAuthenticated ? (
          <>
            <NavLink
              to={ROUTES.DASHBOARD}
              onClick={() => handleNavClick(ROUTES.DASHBOARD)}
              className="block py-3 px-4 sm:px-6 bg-purple-600 text-white font-semibold rounded-xl text-center 
                         hover:bg-purple-700 active:bg-purple-800 hover:shadow-lg transition-all duration-300 
                         text-sm sm:text-base touch-manipulation"
            >
              Dashboard
            </NavLink>
            {user?.name && (
              <div className="py-2 px-2 text-xs sm:text-sm text-gray-700 text-center break-words">
                <span className="font-semibold text-gray-800">{user.name}</span>
                {user.role && (
                  <span className="ml-2 text-gray-500 capitalize text-xs">({user.role})</span>
                )}
              </div>
            )}
            <button
              onClick={handleLogout}
              disabled={isLoggingOut}
              className="w-full py-3 px-4 sm:px-6 bg-gray-600 text-white font-semibold rounded-xl text-center 
                         hover:bg-gray-700 active:bg-gray-800 hover:shadow-lg transition-all duration-300 
                         disabled:opacity-50 disabled:cursor-not-allowed
                         flex items-center justify-center space-x-2 text-sm sm:text-base touch-manipulation"
            >
              <LogOut className="h-4 w-4 flex-shrink-0" />
              <span>{isLoggingOut ? 'Logging out...' : 'Logout'}</span>
            </button>
          </>
        ) : (
          <NavLink
            to={ROUTES.LOGIN}
            onClick={() => handleNavClick(ROUTES.LOGIN)}
            className="block py-3 px-4 sm:px-6 bg-gray-600 text-white font-semibold rounded-xl text-center 
                       hover:bg-gray-700 active:bg-gray-800 hover:shadow-lg transition-all duration-300 
                       flex items-center justify-center space-x-2 text-sm sm:text-base touch-manipulation"
          >
            <User className="h-4 w-4 flex-shrink-0" />
            <span>Login</span>
          </NavLink>
        )}
      </li>
    </>
  );
};


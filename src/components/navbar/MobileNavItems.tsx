import { NavLink } from 'react-router-dom';
import { LogOut, User } from 'lucide-react';
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
      <li className="mt-2 px-4 pb-4 space-y-2">
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


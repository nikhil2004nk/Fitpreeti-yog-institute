import { NavLink, useNavigate } from 'react-router-dom';
import { LogOut, User } from 'lucide-react';
import { ROUTES } from '../../constants/routes';
import type { User as UserType } from '../../types';

interface UserMenuProps {
  user: UserType | null;
  isScrolled: boolean;
  isAuthenticated: boolean;
  onLogout: () => Promise<void>;
  isLoggingOut: boolean;
  onNavClick?: () => void;
}

export const UserMenu: React.FC<UserMenuProps> = ({ 
  user, 
  isScrolled, 
  isAuthenticated, 
  onLogout,
  isLoggingOut,
  onNavClick 
}) => {
  const navigate = useNavigate();

  const handleLogout = async () => {
    await onLogout();
    navigate(ROUTES.HOME);
    if (onNavClick) {
      onNavClick();
    }
  };

  if (!isAuthenticated) {
    return (
      <li className="ml-4">
        <NavLink
          to={ROUTES.LOGIN}
          className="px-4 xl:px-6 py-2 xl:py-3 bg-gray-600 text-white font-semibold rounded-xl text-sm xl:text-base
                     hover:bg-gray-700 hover:shadow-lg transition-all duration-300 flex items-center space-x-2"
          onClick={onNavClick}
        >
          <User className="h-4 w-4" />
          <span>Login</span>
        </NavLink>
      </li>
    );
  }

  if (!user) return null;

  return (
    <li className="ml-4 flex items-center space-x-3">
      <NavLink
        to={ROUTES.DASHBOARD}
        className={`text-sm hidden xl:block font-semibold hover:underline transition-all ${
          isScrolled ? 'text-gray-700 hover:text-red-600' : 'text-white hover:text-red-400'
        }`}
        onClick={onNavClick}
      >
        Dashboard
      </NavLink>
      <span className={`text-sm hidden xl:block ${isScrolled ? 'text-gray-700' : 'text-white'}`}>
        {user.name}
      </span>
      <button
        onClick={handleLogout}
        disabled={isLoggingOut}
        className="px-4 xl:px-6 py-2 xl:py-3 bg-gray-600 text-white font-semibold rounded-xl text-sm xl:text-base
                   hover:bg-gray-700 hover:shadow-lg transition-all duration-300 disabled:opacity-50 flex items-center space-x-2"
      >
        <LogOut className="h-4 w-4" />
        <span>Logout</span>
      </button>
    </li>
  );
};


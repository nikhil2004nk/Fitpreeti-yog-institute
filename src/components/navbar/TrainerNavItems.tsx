import { NavLink } from 'react-router-dom';
import { Calendar } from 'lucide-react';
import { ROUTES } from '../../constants/routes';

interface TrainerNavItemsProps {
  isScrolled: boolean;
  onNavClick?: () => void;
}

export const TrainerNavItems: React.FC<TrainerNavItemsProps> = ({ isScrolled, onNavClick }) => {
  const handleClick = () => {
    if (onNavClick) {
      onNavClick();
    }
    window.scrollTo({
      top: 0,
      behavior: 'smooth'
    });
  };

  const navItemClass = `px-3 xl:px-4 py-2 xl:py-2.5 font-semibold text-xs xl:text-sm
                        rounded-xl transition-all duration-300 flex items-center space-x-2
                        ${isScrolled 
                          ? 'text-gray-700 hover:bg-gray-100 hover:text-red-600' 
                          : 'text-white hover:bg-white/10 hover:text-red-400'
                        }`;

  return (
    <>
      <li>
        <NavLink
          to={ROUTES.DASHBOARD}
          className={({ isActive }) => 
            `${navItemClass} ${
              isActive 
                ? isScrolled ? 'bg-red-50 text-red-600' : 'bg-red-600/20 text-red-400'
                : ''
            }`
          }
          onClick={handleClick}
        >
          <Calendar className="h-4 w-4" />
          <span>Dashboard</span>
        </NavLink>
      </li>
      {/* Future: Add more trainer-specific menu items here */}
      {/* Example:
      <li>
        <NavLink
          to="/trainer/schedule"
          className={navItemClass}
          onClick={handleClick}
        >
          <Calendar className="h-4 w-4" />
          <span>Schedule</span>
        </NavLink>
      </li>
      */}
    </>
  );
};


import { NavLink } from 'react-router-dom';
import { ROUTES } from '../../constants/routes';

interface PublicNavItemsProps {
  isScrolled: boolean;
  onNavClick?: () => void;
}

export const PublicNavItems: React.FC<PublicNavItemsProps> = ({ isScrolled, onNavClick }) => {
  const navLinkBase = 'relative py-2 px-2 xl:px-3 text-sm xl:text-base 2xl:text-lg font-semibold transition-all duration-300 group whitespace-nowrap';

  const getNavClass = ({ isActive }: { isActive: boolean }) =>
    `${navLinkBase} ${
      isActive 
        ? isScrolled
          ? 'text-red-600 font-semibold relative after:absolute after:bottom-0 after:left-1/2 after:-translate-x-1/2 after:w-6 after:h-0.5 after:bg-red-600 after:rounded-full'
          : 'text-red-400 font-semibold relative after:absolute after:bottom-0 after:left-1/2 after:-translate-x-1/2 after:w-6 after:h-0.5 after:bg-red-400 after:rounded-full'
        : isScrolled
          ? 'text-gray-700 hover:text-red-600 hover:after:absolute hover:after:bottom-0 hover:after:left-1/2 hover:after:-translate-x-1/2 hover:after:w-3 hover:after:h-0.5 hover:after:bg-gray-400 hover:after:rounded-full'
          : 'text-white hover:text-red-400 hover:after:absolute hover:after:bottom-0 hover:after:left-1/2 hover:after:-translate-x-1/2 hover:after:w-3 hover:after:h-0.5 hover:after:bg-red-400 hover:after:rounded-full'
    }`;

  const navItems = [
    { to: ROUTES.HOME, label: 'Home', end: true },
    { to: ROUTES.SERVICES, label: 'Services' },
    { to: ROUTES.ONLINE, label: 'Online Studio' },
    { to: ROUTES.CORPORATE, label: 'Corporate' },
    { to: ROUTES.ABOUT, label: 'About' },
    { to: ROUTES.CONTACT, label: 'Contact' },
  ];

  const handleClick = () => {
    if (onNavClick) {
      onNavClick();
    }
    window.scrollTo({
      top: 0,
      behavior: 'smooth'
    });
  };

  return (
    <>
      {navItems.map((item) => (
        <li key={item.to}>
          <NavLink 
            to={item.to} 
            end={item.end}
            className={({ isActive }) => getNavClass({ isActive })}
            onClick={handleClick}
          >
            {item.label}
          </NavLink>
        </li>
      ))}
    </>
  );
};


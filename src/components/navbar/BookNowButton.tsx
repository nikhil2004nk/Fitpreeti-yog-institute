import { NavLink, Link } from 'react-router-dom';
import { ROUTES } from '../../constants/routes';

interface BookNowButtonProps {
  variant?: 'desktop' | 'tablet' | 'mobile';
  onNavClick?: () => void;
}

export const BookNowButton: React.FC<BookNowButtonProps> = ({ variant = 'desktop', onNavClick }) => {
  const handleClick = () => {
    if (onNavClick) {
      onNavClick();
    }
    window.scrollTo({
      top: 0,
      behavior: 'smooth'
    });
  };

  if (variant === 'desktop') {
    return (
      <NavLink
        to={ROUTES.BOOKING}
        className="px-4 xl:px-6 2xl:px-8 py-2 xl:py-2.5 bg-red-600 text-white font-bold text-sm xl:text-base 2xl:text-lg
                   hover:bg-red-700 hover:text-white hover:shadow-2xl hover:scale-105 transition-all duration-300
                   rounded-xl leading-tight flex items-center justify-center whitespace-nowrap"
        onClick={handleClick}
      >
        <span>Book Now</span>
      </NavLink>
    );
  }

  if (variant === 'tablet') {
    return (
      <Link
        to={ROUTES.BOOKING}
        className="px-4 py-2 bg-red-600 text-white font-semibold rounded-xl text-sm
                   hover:bg-red-700 hover:shadow-lg transition-all duration-300 whitespace-nowrap"
        onClick={handleClick}
      >
        Book Now
      </Link>
    );
  }

  // mobile variant
  return (
    <NavLink
      to={ROUTES.BOOKING}
      onClick={handleClick}
      className="block py-3 px-6 bg-red-600 text-white font-semibold rounded-xl text-center 
                 hover:bg-red-700 hover:shadow-lg transition-all duration-300"
    >
      Book Now
    </NavLink>
  );
};


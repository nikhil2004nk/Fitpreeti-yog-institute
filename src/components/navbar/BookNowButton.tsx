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
      <li>
        <NavLink
          to={ROUTES.BOOKING}
          className="ml-4 px-3 xl:px-4 py-2 xl:py-2.5 bg-red-600 text-white font-bold text-xs xl:text-sm
                     hover:bg-red-700 hover:text-white hover:shadow-2xl hover:scale-105 transition-all duration-300
                     rounded-tl-[18px] rounded-tr-[12px] rounded-bl-[12px] rounded-br-[18px]
                     leading-tight flex flex-col items-center justify-center min-w-[60px] xl:min-w-[70px]"
          onClick={handleClick}
        >
          <span className="block">Book</span>
          <span className="block">Now</span>
        </NavLink>
      </li>
    );
  }

  if (variant === 'tablet') {
    return (
      <li>
        <Link
          to={ROUTES.BOOKING}
          className="ml-2 px-4 py-2 bg-red-600 text-white font-semibold rounded-xl text-sm
                     hover:bg-red-700 hover:shadow-lg transition-all duration-300"
          onClick={handleClick}
        >
          Book Now
        </Link>
      </li>
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


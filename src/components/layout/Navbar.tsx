// src/components/layout/Navbar.tsx
import { useState, useEffect } from 'react';
import { NavLink, Link, useNavigate } from 'react-router-dom';
import { Menu, X, LogOut, User } from 'lucide-react';
import { ROUTES } from '../../constants/routes';
import { getAssetUrl } from '../../utils/url';
import { useAuth } from '../../contexts/AuthContext';

export const Navbar: React.FC = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);
  const navigate = useNavigate();
  const { isAuthenticated, user, logout } = useAuth();
  const [isLoggingOut, setIsLoggingOut] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      const scrolled = window.scrollY > 50;
      setIsScrolled(scrolled);
      if (scrolled && isOpen) {
        setIsOpen(false);
      }
    };
    
    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, [isOpen]);

  const navLinkBase = 'relative py-3 px-3 text-lg font-semibold transition-all duration-300 group';

  const getNavClass = ({ isActive, isPrimary, isScrolled }: { isActive: boolean; isPrimary?: boolean; isScrolled: boolean }) =>
    `${navLinkBase} ${
      isPrimary 
        ? 'bg-red-600 text-white hover:bg-red-700 px-6 py-2 rounded-full hover:shadow-lg hover:-translate-y-0.5 transition-transform'
        : isActive 
          ? isScrolled
            ? 'text-red-600 font-semibold relative after:absolute after:bottom-1 after:left-1/2 after:-translate-x-1/2 after:w-6 after:h-0.5 after:bg-red-600 after:rounded-full'
            : 'text-red-400 font-semibold relative after:absolute after:bottom-1 after:left-1/2 after:-translate-x-1/2 after:w-6 after:h-0.5 after:bg-red-400 after:rounded-full'
          : isScrolled
            ? 'text-gray-700 hover:text-red-600 hover:after:absolute hover:after:bottom-1 hover:after:left-1/2 hover:after:-translate-x-1/2 hover:after:w-3 hover:after:h-0.5 hover:after:bg-gray-400 hover:after:rounded-full'
            : 'text-white hover:text-red-400 hover:after:absolute hover:after:bottom-1 hover:after:left-1/2 hover:after:-translate-x-1/2 hover:after:w-3 hover:after:h-0.5 hover:after:bg-red-400 hover:after:rounded-full'
    }`;

  const navItems = [
    { to: ROUTES.HOME, label: 'Home', end: true },
    { to: ROUTES.SERVICES, label: 'Services' },
    { to: ROUTES.ONLINE, label: 'Online Studio' },
    { to: ROUTES.CORPORATE, label: 'Corporate' },
    { to: ROUTES.ABOUT, label: 'About' },
    { to: ROUTES.CONTACT, label: 'Contact' },
  ];

  const handleNavClick = (to: string) => {
    navigate(to);
    setIsOpen(false);
    window.scrollTo({
      top: 0,
      behavior: 'smooth'
    });
  };

  const handleLogout = async () => {
    setIsLoggingOut(true);
    try {
      await logout();
      navigate(ROUTES.HOME);
      setIsOpen(false);
    } catch (error) {
      console.error('Logout error:', error);
    } finally {
      setIsLoggingOut(false);
    }
  };

  return (
    <nav
      className={`fixed top-0 w-full transition-all duration-500 z-50 ${
        isScrolled 
          ? 'bg-white/95 backdrop-blur-xl shadow-2xl text-neutral-900' 
          : 'bg-neutral-900/90 text-white'
      }`}
    >
      <div className="container mx-auto px-4 sm:px-6 lg:px-12">
        <div className="flex h-16 sm:h-20 items-center justify-between">
          
          {/* Logo */}
          <div className="flex items-center space-x-1 sm:space-x-2 flex-shrink-0 min-w-0">
            <Link to={ROUTES.HOME} className="flex items-center space-x-1 sm:space-x-2 min-w-0">
              <img
                src={getAssetUrl('/logo.png')}
                alt="FitPreeti Logo"
                className="h-8 w-8 sm:h-10 sm:w-10 object-contain flex-shrink-0"
                onError={(e) => {
                  // Fallback to a placeholder if the image fails to load
                  (e.target as HTMLImageElement).src = 'https://via.placeholder.com/40';
                }}
              />
              <div className="flex flex-col items-start sm:items-center leading-tight font-bold font-sans min-w-0">
                <span className={`text-lg sm:text-xl lg:text-2xl font-bold truncate ${isScrolled ? 'text-neutral-900' : 'text-white'}`}>
                  <span className="text-red-600">F</span>
                  it
                  <span className="text-red-600">P</span>
                  reeti
                </span>
                <span className={`text-xs sm:text-sm uppercase font-semibold truncate ${isScrolled ? 'text-neutral-900' : 'text-white'}`}>
                  YOG INSTITUTE
                </span>
              </div>
            </Link>
          </div>

          {/* Desktop Nav */}
          <ul className="hidden lg:flex items-center space-x-4 xl:space-x-8">
            {navItems.map((item) => (
              <li key={item.to}>
                <NavLink 
                  to={item.to} 
                  end={item.end}
                  className={({ isActive }) => 
                    getNavClass({ 
                      isActive, 
                      isPrimary: item.label === 'Book Now',
                      isScrolled
                    })
                  }
                  onClick={() => {
                    window.scrollTo({
                      top: 0,
                      behavior: 'smooth'
                    });
                  }}
                >
                  {item.label}
                </NavLink>
              </li>
            ))}
            <li>
              <NavLink
                to={ROUTES.BOOKING}
                className="ml-4 px-3 xl:px-4 py-2 xl:py-2.5 bg-red-600 text-white font-bold text-xs xl:text-sm
                           hover:bg-red-700 hover:text-white hover:shadow-2xl hover:scale-105 transition-all duration-300
                           rounded-tl-[18px] rounded-tr-[12px] rounded-bl-[12px] rounded-br-[18px]
                           leading-tight flex flex-col items-center justify-center min-w-[60px] xl:min-w-[70px]"
              >
                <span className="block">Book</span>
                <span className="block">Now</span>
              </NavLink>
            </li>
            {isAuthenticated ? (
              <li className="ml-4 flex items-center space-x-3">
                <NavLink
                  to={ROUTES.DASHBOARD}
                  className={`text-sm hidden xl:block font-semibold hover:underline transition-all ${
                    isScrolled ? 'text-gray-700 hover:text-red-600' : 'text-white hover:text-red-400'
                  }`}
                >
                  Dashboard
                </NavLink>
                <span className={`text-sm hidden xl:block ${isScrolled ? 'text-gray-700' : 'text-white'}`}>
                  {user?.name}
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
            ) : (
              <li className="ml-4">
                <NavLink
                  to={ROUTES.LOGIN}
                  className="px-4 xl:px-6 py-2 xl:py-3 bg-gray-600 text-white font-semibold rounded-xl text-sm xl:text-base
                             hover:bg-gray-700 hover:shadow-lg transition-all duration-300 flex items-center space-x-2"
                >
                  <User className="h-4 w-4" />
                  <span>Login</span>
                </NavLink>
              </li>
            )}
          </ul>

          {/* Tablet Nav (hidden on mobile and desktop) */}
          <ul className="hidden md:flex lg:hidden items-center space-x-2">
            {navItems.slice(0, 3).map((item) => (
              <li key={item.to}>
                <NavLink 
                  to={item.to} 
                  end={item.end}
                  className={({ isActive }) => 
                    `relative py-2 px-2 text-sm font-semibold transition-all duration-300 ${
                      isActive 
                        ? isScrolled
                          ? 'text-red-600 font-semibold relative after:absolute after:bottom-0 after:left-1/2 after:-translate-x-1/2 after:w-6 after:h-0.5 after:bg-red-600 after:rounded-full'
                          : 'text-red-400 font-semibold relative after:absolute after:bottom-0 after:left-1/2 after:-translate-x-1/2 after:w-6 after:h-0.5 after:bg-red-400 after:rounded-full'
                        : isScrolled
                          ? 'text-gray-700 hover:text-red-600'
                          : 'text-white hover:text-red-400'
                    }`
                  }
                  onClick={() => {
                    window.scrollTo({
                      top: 0,
                      behavior: 'smooth'
                    });
                  }}
                >
                  {item.label}
                </NavLink>
              </li>
            ))}
            <li>
              <NavLink
                to={ROUTES.BOOKING}
                className="ml-2 px-4 py-2 bg-red-600 text-white font-semibold rounded-xl text-sm
                           hover:bg-red-700 hover:shadow-lg transition-all duration-300"
              >
                Book Now
              </NavLink>
            </li>
            {isAuthenticated ? (
              <li className="ml-2">
                <button
                  onClick={handleLogout}
                  disabled={isLoggingOut}
                  className="px-4 py-2 bg-gray-600 text-white font-semibold rounded-xl text-sm
                             hover:bg-gray-700 hover:shadow-lg transition-all duration-300 disabled:opacity-50 flex items-center space-x-2"
                >
                  <LogOut className="h-4 w-4" />
                  <span>Logout</span>
                </button>
              </li>
            ) : (
              <li className="ml-2">
                <NavLink
                  to={ROUTES.LOGIN}
                  className="px-4 py-2 bg-gray-600 text-white font-semibold rounded-xl text-sm
                             hover:bg-gray-700 hover:shadow-lg transition-all duration-300 flex items-center space-x-2"
                >
                  <User className="h-4 w-4" />
                  <span>Login</span>
                </NavLink>
              </li>
            )}
          </ul>

          {/* Mobile menu button */}
          <button
            className={`md:hidden p-2 rounded-xl transition-all duration-300 ${
              isScrolled 
                ? 'text-neutral-900 hover:bg-neutral-100' 
                : 'text-white hover:bg-neutral-800'
            }`}
            onClick={() => setIsOpen(!isOpen)}
            aria-label="Toggle menu"
            aria-expanded={isOpen}
          >
            {isOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
          </button>
        </div>

        {/* Mobile Menu */}
        <div 
          className={`fixed inset-0 md:hidden transition-all duration-300 ease-in-out ${
            isOpen ? 'opacity-100 visible' : 'opacity-0 invisible'
          }`}
          style={{ zIndex: 90 }}
        >
          {/* Overlay */}
          <div 
            className={`fixed inset-0 bg-black/50 transition-opacity duration-300 ${
              isOpen ? 'opacity-100' : 'opacity-0'
            }`}
            onClick={() => setIsOpen(false)}
            style={{ zIndex: 91 }}
          />
          
          {/* Menu Panel */}
          <div 
            className={`relative mt-16 sm:mt-20 bg-white shadow-2xl rounded-b-2xl mx-4 overflow-hidden transition-all duration-300 ease-in-out ${
              isOpen ? 'translate-y-0 opacity-100' : '-translate-y-4 opacity-0'
            }`}
            style={{ zIndex: 95 }}
          >
            <ul className="flex flex-col py-2">
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
                <NavLink
                  to={ROUTES.BOOKING}
                  onClick={() => handleNavClick(ROUTES.BOOKING)}
                  className="block py-3 px-6 bg-red-600 text-white font-semibold rounded-xl text-center 
                             hover:bg-red-700 hover:shadow-lg transition-all duration-300"
                >
                  Book Now
                </NavLink>
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
            </ul>
          </div>
        </div>
      </div>
    </nav>
  );
};

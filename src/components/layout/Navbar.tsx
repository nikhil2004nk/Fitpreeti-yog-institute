// src/components/layout/Navbar.tsx
import { useState, useEffect } from 'react';
import { NavLink, Link, useNavigate } from 'react-router-dom';
import { Menu, X } from 'lucide-react';
import { ROUTES } from '../../constants/routes';
import { getAssetUrl } from '../../utils/url';

export const Navbar: React.FC = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);
  const navigate = useNavigate();

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

  const getNavClass = ({ isActive, isPrimary }: { isActive: boolean; isPrimary?: boolean }) =>
    `${navLinkBase} ${
      isPrimary 
        ? 'bg-red-600 text-white hover:bg-red-700 px-6 py-2 rounded-full hover:shadow-lg hover:-translate-y-0.5 transition-transform'
        : isActive 
          ? 'text-red-600 font-semibold relative after:absolute after:bottom-1 after:left-1/2 after:-translate-x-1/2 after:w-6 after:h-0.5 after:bg-red-600 after:rounded-full'
          : 'text-gray-700 hover:text-red-600 hover:after:absolute hover:after:bottom-1 hover:after:left-1/2 hover:after:-translate-x-1/2 hover:after:w-3 hover:after:h-0.5 hover:after:bg-gray-400 hover:after:rounded-full'
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

  return (
    <nav
      className={`fixed top-0 w-full transition-all duration-500 z-50 ${
        isScrolled 
          ? 'bg-white/95 backdrop-blur-xl shadow-2xl text-neutral-900' 
          : 'bg-neutral-900/90 text-white'
      }`}
    >
      <div className="container mx-auto px-6 lg:px-12">
        <div className="flex h-20 items-center justify-between">
          
          {/* Logo */}
          <div className="flex items-center space-x-2">
            <Link to={ROUTES.HOME} className="flex items-center space-x-2">
              <img
                src={getAssetUrl('/logo.png')}
                alt="FitPreeti Logo"
                className="h-10 w-10 object-contain"
                onError={(e) => {
                  // Fallback to a placeholder if the image fails to load
                  (e.target as HTMLImageElement).src = 'https://via.placeholder.com/40';
                }}
              />
              <div className="flex flex-col items-center leading-tight font-bold font-sans">
                <span className={`text-2xl font-bold ${isScrolled ? 'text-neutral-900' : 'text-white'}`}>
                  <span className="text-red-600">F</span>
                  it
                  <span className="text-red-600">P</span>
                  reeti
                </span>
                <span className={`text-sm uppercase font-semibold ${isScrolled ? 'text-neutral-900' : 'text-white'}`}>
                  YOG INSTITUTE
                </span>
              </div>
            </Link>
          </div>

          {/* Desktop Nav */}
          <ul className="hidden md:flex items-center space-x-2 lg:space-x-8">
            {navItems.map((item) => (
              <li key={item.to}>
                <NavLink 
                  to={item.to} 
                  end={item.end}
                  className={({ isActive }) => 
                    getNavClass({ 
                      isActive, 
                      isPrimary: item.label === 'Book Now' 
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
                  <span className="absolute bottom-0 left-3 w-full h-0.5 bg-primary-500 scale-x-0 group-hover:scale-x-100 transition-transform origin-left duration-300" />
                </NavLink>
              </li>
            ))}
            <li>
              <NavLink
                to={ROUTES.BOOKING}
                className="ml-4 px-6 py-3 bg-red-600 text-white font-semibold rounded-2xl 
                           hover:bg-red-700 hover:text-white hover:shadow-2xl hover:scale-105 transition-all duration-300"
              >
                Book Now
              </NavLink>
            </li>
          </ul>

          {/* Mobile menu button */}
          <button
            className={`md:hidden p-2 rounded-xl hover:bg-neutral-800 transition-colors ${isScrolled ? 'text-neutral-900' : 'text-white'}`}
            onClick={() => setIsOpen(!isOpen)}
            aria-label="Toggle menu"
          >
            {isOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
          </button>
        </div>

        {/* Mobile Menu */}
        {isOpen && (
          <div className="fixed inset-0 md:hidden" style={{ zIndex: 90 }}>
            {/* Overlay without blur */}
            <div 
              className="fixed inset-0 bg-black/50"
              onClick={() => setIsOpen(false)}
              style={{ zIndex: 91 }}
            />
            
            {/* Menu Panel */}
            <div className="relative mt-20 bg-white shadow-2xl rounded-b-2xl mx-4 overflow-hidden" style={{ zIndex: 95 }}>
              <ul className="flex flex-col py-2">
                {navItems.map((item) => (
                  <li key={item.to} className="border-b border-gray-100 last:border-0">
                    <NavLink
                      to={item.to}
                      end={item.end}
                      onClick={() => handleNavClick(item.to)}
                      className={({ isActive }) =>
                        `block py-4 px-6 font-medium transition-colors ${
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
                <li className="mt-2 px-4 pb-4">
                  <NavLink
                    to={ROUTES.BOOKING}
                    onClick={() => handleNavClick(ROUTES.BOOKING)}
                    className="block py-3 px-6 bg-red-600 text-white font-semibold rounded-xl text-center 
                               hover:bg-red-700 hover:shadow-lg transition-all duration-300"
                  >
                    Book Now
                  </NavLink>
                </li>
              </ul>
            </div>
          </div>
        )}
      </div>
    </nav>
  );
};

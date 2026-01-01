// src/components/layout/Navbar.tsx
import { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Menu, X } from 'lucide-react';
import { ROUTES } from '../../constants/routes';
import { getAssetUrl } from '../../utils/url';
import { useAuth } from '../../contexts/AuthContext';
import { PublicNavItems } from '../navbar/PublicNavItems';
import { AdminNavItems } from '../navbar/AdminNavItems';
import { TrainerNavItems } from '../navbar/TrainerNavItems';
import { CustomerNavItems } from '../navbar/CustomerNavItems';
import { UserMenu } from '../navbar/UserMenu';
import { MobileNavItems } from '../navbar/MobileNavItems';
import { BookNowButton } from '../navbar/BookNowButton';

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

  // Prevent body scroll when mobile menu is open
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }
    return () => {
      document.body.style.overflow = '';
    };
  }, [isOpen]);

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

  // Get role-specific navigation items
  const renderRoleNavItems = () => {
    if (!isAuthenticated || !user) return null;

    switch (user.role) {
      case 'admin':
        return <AdminNavItems isScrolled={isScrolled} />;
      case 'trainer':
        return <TrainerNavItems isScrolled={isScrolled} />;
      case 'customer':
        return <CustomerNavItems isScrolled={isScrolled} />;
      default:
        return null;
    }
  };

  return (
    <nav
      className={`fixed top-0 w-full transition-all duration-500 z-[10000] ${
        isScrolled 
          ? 'bg-white/95 backdrop-blur-xl shadow-2xl text-neutral-900' 
          : 'bg-neutral-900/90 text-white'
      }`}
    >
      <div className="w-full px-4 sm:px-6 lg:px-8 xl:px-12 2xl:px-16">
        <div className="flex h-16 sm:h-20 items-center justify-between max-w-[1920px] mx-auto">
          
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

          {/* Desktop Nav - Full Width Layout */}
          <div className="hidden lg:flex items-center justify-end flex-1 gap-4 xl:gap-6 2xl:gap-8">
            <ul className="flex items-center gap-4 xl:gap-6 2xl:gap-8">
              <PublicNavItems isScrolled={isScrolled} />
            </ul>
            
            {/* Show Book Now only for non-authenticated users */}
            {!isAuthenticated && (
              <BookNowButton variant="desktop" />
            )}
            
            {/* Role-specific navigation items */}
            {isAuthenticated && (
              <ul className="flex items-center gap-4 xl:gap-6">
                {renderRoleNavItems()}
              </ul>
            )}
            
            {/* User menu (Dashboard link, user name, logout button) */}
            <UserMenu
              user={user}
              isScrolled={isScrolled}
              isAuthenticated={isAuthenticated}
              onLogout={handleLogout}
              isLoggingOut={isLoggingOut}
            />
          </div>

          {/* Tablet Nav (hidden on mobile and desktop) */}
          <div className="hidden md:flex lg:hidden items-center justify-end flex-1 gap-3">
            <ul className="flex items-center gap-3">
              <PublicNavItems isScrolled={isScrolled} />
            </ul>
            
            {/* Show Book Now only for non-authenticated users */}
            {!isAuthenticated && (
              <BookNowButton variant="tablet" />
            )}
            
            {/* Role-specific navigation items */}
            {isAuthenticated && (
              <ul className="flex items-center gap-3">
                {renderRoleNavItems()}
              </ul>
            )}
            
            {/* User menu */}
            <UserMenu
              user={user}
              isScrolled={isScrolled}
              isAuthenticated={isAuthenticated}
              onLogout={handleLogout}
              isLoggingOut={isLoggingOut}
            />
          </div>

          {/* Mobile menu button */}
          <button
            type="button"
            className={`lg:hidden relative z-[10001] p-2.5 rounded-xl transition-all duration-300 touch-manipulation active:scale-95 focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-offset-2 ${
              isScrolled 
                ? 'text-neutral-900 hover:bg-neutral-100 active:bg-neutral-200' 
                : 'text-white hover:bg-neutral-800 active:bg-neutral-700'
            } ${isOpen ? 'bg-neutral-800/20' : ''}`}
            onClick={(e) => {
              e.stopPropagation();
              setIsOpen(!isOpen);
            }}
            onTouchStart={(e) => {
              e.stopPropagation();
            }}
            aria-label={isOpen ? 'Close menu' : 'Open menu'}
            aria-expanded={isOpen}
          >
            {isOpen ? (
              <X className="h-6 w-6 transition-transform duration-300 rotate-0" />
            ) : (
              <Menu className="h-6 w-6 transition-transform duration-300" />
            )}
          </button>
        </div>

        {/* Mobile Menu */}
        {isOpen && (
          <>
            {/* Overlay - below header */}
            <div 
              className="mobile-menu-overlay fixed inset-0 top-16 sm:top-20 lg:hidden bg-black/50 backdrop-blur-sm z-[9998]"
              onClick={() => setIsOpen(false)}
              onTouchStart={() => setIsOpen(false)}
              aria-hidden="true"
            />
            
            {/* Menu Panel - below header */}
            <div 
              className="mobile-menu-panel fixed top-16 sm:top-20 left-0 right-0 bottom-0 lg:hidden bg-white shadow-2xl z-[9999] flex flex-col"
              onClick={(e) => e.stopPropagation()}
              onTouchStart={(e) => e.stopPropagation()}
              role="dialog"
              aria-modal="true"
              aria-label="Navigation menu"
            >
              <div className="flex-1 overflow-y-auto overscroll-contain -webkit-overflow-scrolling-touch">
                <ul className="flex flex-col min-h-full">
                  <MobileNavItems
                    isAuthenticated={isAuthenticated}
                    user={user}
                    onNavClick={handleNavClick}
                    onLogout={handleLogout}
                    isLoggingOut={isLoggingOut}
                  />
                </ul>
              </div>
            </div>
          </>
        )}
      </div>
    </nav>
  );
};

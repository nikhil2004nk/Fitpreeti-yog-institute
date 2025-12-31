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
            <PublicNavItems isScrolled={isScrolled} />
            {/* Show Book Now only for non-authenticated users */}
            {!isAuthenticated && (
              <BookNowButton variant="desktop" />
            )}
            {/* Role-specific navigation items */}
            {isAuthenticated && renderRoleNavItems()}
            {/* User menu (Dashboard link, user name, logout button) */}
            <UserMenu
              user={user}
              isScrolled={isScrolled}
              isAuthenticated={isAuthenticated}
              onLogout={handleLogout}
              isLoggingOut={isLoggingOut}
            />
          </ul>

          {/* Tablet Nav (hidden on mobile and desktop) */}
          <ul className="hidden md:flex lg:hidden items-center space-x-2">
            <PublicNavItems isScrolled={isScrolled} />
            {/* Show Book Now only for non-authenticated users */}
            {!isAuthenticated && (
              <BookNowButton variant="tablet" />
            )}
            {/* Role-specific navigation items */}
            {isAuthenticated && renderRoleNavItems()}
            {/* User menu */}
            <UserMenu
              user={user}
              isScrolled={isScrolled}
              isAuthenticated={isAuthenticated}
              onLogout={handleLogout}
              isLoggingOut={isLoggingOut}
            />
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
      </div>
    </nav>
  );
};

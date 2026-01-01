import { useState, useRef, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { ChevronDown, Calendar, CalendarCheck, User, Clock } from 'lucide-react';
import { ROUTES } from '../../constants/routes';

interface TrainerNavDropdownProps {
  isScrolled: boolean;
}

export const TrainerNavDropdown: React.FC<TrainerNavDropdownProps> = ({ isScrolled }) => {
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);
  const navigate = useNavigate();

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };

    if (isOpen) {
      document.addEventListener('mousedown', handleClickOutside);
    }

    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [isOpen]);

  const menuItems = [
    { to: ROUTES.DASHBOARD, label: 'Dashboard', icon: Calendar },
    { to: ROUTES.TRAINER_ATTENDANCE, label: 'My Attendance', icon: CalendarCheck },
    { to: ROUTES.TRAINER_SCHEDULE, label: 'My Schedule', icon: Clock },
    { to: ROUTES.TRAINER_PROFILE, label: 'My Profile', icon: User },
  ];

  const handleNavClick = (to: string) => {
    navigate(to);
    setIsOpen(false);
    window.scrollTo({
      top: 0,
      behavior: 'smooth'
    });
  };

  const buttonClass = `px-3 xl:px-4 py-2 xl:py-2.5 font-semibold text-xs xl:text-sm 2xl:text-base
                       rounded-xl transition-all duration-300 flex items-center space-x-2 whitespace-nowrap
                       ${isScrolled 
                         ? 'text-gray-700 hover:bg-gray-100 hover:text-red-600' 
                         : 'text-white hover:bg-white/10 hover:text-red-400'
                       }`;

  return (
    <div className="relative" ref={dropdownRef}>
      <button
        onClick={() => setIsOpen(!isOpen)}
        className={buttonClass}
      >
        <User className="h-4 w-4" />
        <span>Trainer</span>
        <ChevronDown className={`h-4 w-4 transition-transform ${isOpen ? 'rotate-180' : ''}`} />
      </button>

      {isOpen && (
        <div
          className={`absolute top-full left-0 mt-2 w-56 rounded-lg shadow-xl z-50 ${
            isScrolled ? 'bg-white border border-gray-200' : 'bg-neutral-800 border border-neutral-700'
          }`}
        >
          <div className="py-2">
            {menuItems.map((item) => {
              const Icon = item.icon;
              return (
                <button
                  key={item.to}
                  onClick={() => handleNavClick(item.to)}
                  className={`w-full px-4 py-2 text-left flex items-center space-x-3 transition-colors ${
                    isScrolled
                      ? 'text-gray-700 hover:bg-gray-100 hover:text-red-600'
                      : 'text-white hover:bg-neutral-700 hover:text-red-400'
                  }`}
                >
                  <Icon className="h-4 w-4" />
                  <span className="text-sm font-medium">{item.label}</span>
                </button>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
};


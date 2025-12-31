import { AdminNavDropdown } from './AdminNavDropdown';

interface AdminNavItemsProps {
  isScrolled: boolean;
  onNavClick?: () => void;
}

export const AdminNavItems: React.FC<AdminNavItemsProps> = ({ isScrolled }) => {
  return (
    <li>
      <AdminNavDropdown isScrolled={isScrolled} />
    </li>
  );
};


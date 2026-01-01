import { CustomerNavDropdown } from './CustomerNavDropdown';

interface CustomerNavItemsProps {
  isScrolled: boolean;
  onNavClick?: () => void;
}

export const CustomerNavItems: React.FC<CustomerNavItemsProps> = ({ isScrolled }) => {
  return <CustomerNavDropdown isScrolled={isScrolled} />;
};


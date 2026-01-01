import { TrainerNavDropdown } from './TrainerNavDropdown';

interface TrainerNavItemsProps {
  isScrolled: boolean;
  onNavClick?: () => void;
}

export const TrainerNavItems: React.FC<TrainerNavItemsProps> = ({ isScrolled }) => {
  return <TrainerNavDropdown isScrolled={isScrolled} />;
};


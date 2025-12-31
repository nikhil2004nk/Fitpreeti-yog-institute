// CustomerNavItems - Currently empty as customer-specific items are handled by BookNowButton
// This component can be extended in the future for customer-specific navigation items
import React from 'react';

interface CustomerNavItemsProps {
  isScrolled: boolean;
  onNavClick?: () => void;
}

export const CustomerNavItems: React.FC<CustomerNavItemsProps> = () => {
  // Future: Add customer-specific navigation items here
  // For example: My Bookings, My Profile, etc.
  return null;
};


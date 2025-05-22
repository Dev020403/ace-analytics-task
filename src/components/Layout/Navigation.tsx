import React from 'react';
import { StyledNavBar, StyledNavButton } from './DashboardStyles';

interface NavigationProps {
  tabValue: number;
  isAdmin: boolean;
  onTabChange: (newValue: number) => void;
}

const Navigation: React.FC<NavigationProps> = ({ 
  tabValue, 
  isAdmin, 
  onTabChange 
}) => {
  return (
    <StyledNavBar>
      <StyledNavButton
        isActive={tabValue === 0}
        onClick={() => onTabChange(0)}
        id="nav-button-0"
        aria-label="Navigate to Voting section"
      >
        Vote
      </StyledNavButton>
      <StyledNavButton
        isActive={tabValue === 1}
        onClick={() => onTabChange(1)}
        id="nav-button-1"
        aria-label="Navigate to Results section"
      >
        Results
      </StyledNavButton>
      {isAdmin && (
        <StyledNavButton
          isActive={tabValue === 2}
          onClick={() => onTabChange(2)}
          id="nav-button-2"
          aria-label="Navigate to Admin Panel section"
        >
          Admin Panel
        </StyledNavButton>
      )}
    </StyledNavBar>
  );
};

export default Navigation;
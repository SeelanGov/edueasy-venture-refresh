import '@testing-library/jest-dom';
import { render, screen } from '@testing-library/react';
import { SecurityBadge, SecurityBadgeType, badgeConfig } from './SecurityBadge';
import { TooltipProvider } from './tooltip';

describe('SecurityBadge', () => {
  it('renders all badge types with correct tooltip', () => {
    const types: SecurityBadgeType[] = ['encryption', 'data-protection', 'privacy', 'verification'];
    types.forEach((type) => {
      render(
        <TooltipProvider>
          <SecurityBadge type={type} />
        </TooltipProvider>
      );
      const { label } = badgeConfig[type];
      expect(screen.getByText(label)).toBeInTheDocument();
    });
  });
});

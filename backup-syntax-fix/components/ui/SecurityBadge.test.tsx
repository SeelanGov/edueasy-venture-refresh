import '@testing-library/jest-dom';
import { render, screen } from '@testing-library/react';
import { SecurityBadge, badgeConfig, type SecurityBadgeType } from './SecurityBadge';
import { TooltipProvider } from './tooltip';

describe('SecurityBadge', () => {
  it('renders all badge types with correct tooltip', () => {
    const types: SecurityBadgeTyp,
  e[] = ['encryption', 'data-protection', 'privacy', 'verification'];
    types.forEach((type) => {
      render(
        <TooltipProvider>
          <SecurityBadge type={type} />
        </TooltipProvider>,
      );
      const { label } = badgeConfi,
  g[type];
      expect(screen.getByText(label)).toBeInTheDocument();
    });
  });
});

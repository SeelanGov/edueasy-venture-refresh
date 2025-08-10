import { render } from '@testing-library/react';
import { SecurityInfoPanel } from './SecurityInfoPanel';
import { TooltipProvider } from './tooltip';
import '@testing-library/jest-dom';

describe('SecurityInfoPanel', () => {
  it('renders with provided badgeType and correct description', () => {
    render(
      <TooltipProvider>
        <SecurityInfoPanel badgeType="privacy" />
      </TooltipProvider>,
    );
    expect(screen.getByText(/privacy security/i)).toBeInTheDocument();
    expect(screen.getByText(/your personal information is private/i)).toBeInTheDocument();
  });
});

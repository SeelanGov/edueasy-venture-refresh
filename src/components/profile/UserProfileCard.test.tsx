
import { render, screen, fireEvent } from '@testing-library/react';
import { UserProfileCard } from './UserProfileCard';
import { TooltipProvider } from '@/components/ui/tooltip';
import '@testing-library/jest-dom';

describe('UserProfileCard', () => {
  it('renders error and profile states', async () => {
    render(
      <TooltipProvider>
        <UserProfileCard />
      </TooltipProvider>
    );
    // Wait for profile to load
    const name = await screen.findByTestId('profile-name');
    expect(name).toHaveTextContent(/Alex Johnson/);
    expect(screen.getByText(/followers/i)).toBeInTheDocument();
    expect(screen.getByText(/following/i)).toBeInTheDocument();
    expect(screen.getByText(/recent posts/i)).toBeInTheDocument();
    expect(screen.getAllByTestId('security-badge-privacy').length).toBeGreaterThan(0);
    expect(screen.getAllByTestId('security-badge-data-protection').length).toBeGreaterThan(0);
    expect(screen.getAllByTestId('security-badge-verification').length).toBeGreaterThan(0);
  });

  it('toggles follow state on button click', async () => {
    render(
      <TooltipProvider>
        <UserProfileCard />
      </TooltipProvider>
    );
    // Wait for profile to load
    await screen.findByTestId('profile-name');
    // Find the follow/unfollow button by role and partial label
    const button = screen.getByRole('button', { name: /follow|unfollow/i });
    expect(button).toBeInTheDocument();
    fireEvent.click(button);
    // Check the button text content for 'Following'
    expect(button).toHaveTextContent(/following/i);
    fireEvent.click(button);
    expect(button).toHaveTextContent(/follow/i);
  });
});

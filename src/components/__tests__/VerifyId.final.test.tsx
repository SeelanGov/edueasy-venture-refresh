import { fireEvent, render, screen, waitFor } from '@testing-library/react';
import { BrowserRouter } from 'react-router-dom';
import { beforeEach, describe, expect, it, vi } from 'vitest';
import { VerifyId } from '../VerifyId';

// Mock the feature flags module
vi.mock('../config/feature-flags', () => ({
  isFeatureEnabled: vi.fn(() => true), // Default to enabled
  featureFlags: {
    VERIFYID_ENABLED: true,
  },
}));

// Mock the action tracking hook
vi.mock('../hooks/useActionTracking', () => ({
  useActionTracking: () => ({
    trackAction: vi.fn(),
  }),
}));

// Mock react-toastify
vi.mock('react-toastify', () => ({
  toast: {
    success: vi.fn(),
    error: vi.fn(),
  },
}));

// Mock fetch
global.fetch = vi.fn();

const renderVerifyId = (props = { userId: 'test-user-123' }) => {
  return render(
    <BrowserRouter>
      <VerifyId {...props} />
    </BrowserRouter>,
  );
};

describe('VerifyId Component - Final Tests', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('should render the main component when feature is enabled', () => {
    renderVerifyId();

    expect(screen.getByText('Verify Your South African ID')).toBeInTheDocument();
    expect(screen.getByPlaceholderText('Enter 13-digit SA ID')).toBeInTheDocument();
    expect(screen.getByText('Verify ID')).toBeInTheDocument();
  });

  it('should validate ID number input correctly', () => {
    renderVerifyId();

    const input = screen.getByPlaceholderText('Enter 13-digit SA ID');
    const button = screen.getByText('Verify ID');

    // Initially disabled
    expect(button).toBeDisabled();

    // Enter valid 13-digit number
    fireEvent.change(input, { target: { value: '9202204720083' } });
    expect(button).not.toBeDisabled();

    // Enter invalid number
    fireEvent.change(input, { target: { value: '123' } });
    expect(button).toBeDisabled();
  });

  it('should show consent dialog on first click', () => {
    renderVerifyId();

    const input = screen.getByPlaceholderText('Enter 13-digit SA ID');
    const button = screen.getByText('Verify ID');

    fireEvent.change(input, { target: { value: '9202204720083' } });
    fireEvent.click(button);

    expect(
      screen.getByText('By proceeding, you consent to verify your South African ID number'),
    ).toBeInTheDocument();
    expect(screen.getByText('Confirm & Verify')).toBeInTheDocument();
    expect(screen.getByText('Cancel')).toBeInTheDocument();
  });

  it('should handle successful verification', async () => {
    const mockFetch = vi.mocked(fetch);
    mockFetch.mockResolvedValueOnce({
      ok: true,
      json: async () => ({ verified: true, auditLogId: 'audit-123' }),
    } as Response);

    renderVerifyId();

    const input = screen.getByPlaceholderText('Enter 13-digit SA ID');
    const button = screen.getByText('Verify ID');

    fireEvent.change(input, { target: { value: '9202204720083' } });
    fireEvent.click(button);

    const confirmButton = screen.getByText('Confirm & Verify');
    fireEvent.click(confirmButton);

    await waitFor(() => {
      expect(screen.getByText('✅ Your ID has been successfully verified!')).toBeInTheDocument();
    });
  });

  it('should handle verification failure', async () => {
    const mockFetch = vi.mocked(fetch);
    mockFetch.mockResolvedValueOnce({
      ok: true,
      json: async () => ({ verified: false, error: 'Invalid ID number' }),
    } as Response);

    renderVerifyId();

    const input = screen.getByPlaceholderText('Enter 13-digit SA ID');
    const button = screen.getByText('Verify ID');

    fireEvent.change(input, { target: { value: '9202204720083' } });
    fireEvent.click(button);

    const confirmButton = screen.getByText('Confirm & Verify');
    fireEvent.click(confirmButton);

    await waitFor(() => {
      expect(
        screen.getByText('❌ ID verification failed. Please check your ID number and try again.'),
      ).toBeInTheDocument();
    });
  });

  it('should handle network errors', async () => {
    const mockFetch = vi.mocked(fetch);
    mockFetch.mockRejectedValueOnce(new Error('Network error'));

    renderVerifyId();

    const input = screen.getByPlaceholderText('Enter 13-digit SA ID');
    const button = screen.getByText('Verify ID');

    fireEvent.change(input, { target: { value: '9202204720083' } });
    fireEvent.click(button);

    const confirmButton = screen.getByText('Confirm & Verify');
    fireEvent.click(confirmButton);

    await waitFor(() => {
      expect(
        screen.getByText('❌ ID verification failed. Please check your ID number and try again.'),
      ).toBeInTheDocument();
    });
  });

  it('should show loading state during verification', async () => {
    const mockFetch = vi.mocked(fetch);
    mockFetch.mockImplementationOnce(() => new Promise((resolve) => setTimeout(resolve, 100)));

    renderVerifyId();

    const input = screen.getByPlaceholderText('Enter 13-digit SA ID');
    const button = screen.getByText('Verify ID');

    fireEvent.change(input, { target: { value: '9202204720083' } });
    fireEvent.click(button);

    const confirmButton = screen.getByText('Confirm & Verify');
    fireEvent.click(confirmButton);

    expect(screen.getByText('Verifying...')).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /verifying/i })).toBeDisabled();
  });
});

import { fireEvent, render, screen, waitFor } from '@testing-library/react';
import { BrowserRouter } from 'react-router-dom';
import { ToastContainer } from 'react-toastify';
import { beforeEach, describe, expect, it, vi } from 'vitest';
import { VerifyId } from '../VerifyId';

// Mock dependencies
const mockIsFeatureEnabled = vi.fn();
vi.mock('../config/feature-flags', () => ({
  isFeatureEnabled: mockIsFeatureEnabled,
}));

vi.mock('../hooks/useActionTracking', () => ({
  useActionTracking: () => ({
    trackAction: vi.fn(),
  }),
}));

vi.mock('react-toastify', () => ({
  toast: {
    success: vi.fn(),
    error: vi.fn(),
  },
  ToastContainer: vi.fn(() => null),
}));

// Mock fetch
global.fetch = vi.fn();

const renderVerifyId = (props = { userId: 'test-user-123' }) => {
  return render(
    <BrowserRouter>
      <VerifyId {...props} />
      <ToastContainer />
    </BrowserRouter>,
  );
};

describe('VerifyId Component', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    mockIsFeatureEnabled.mockReturnValue(true);
  });

  afterEach(() => {
    vi.resetAllMocks();
  });

  describe('Feature Flag Tests', () => {
    it('should hide component when feature flag is disabled', () => {
      mockIsFeatureEnabled.mockReturnValue(false);

      renderVerifyId();

      expect(
        screen.getByText('ID verification is currently unavailable. Please try again later.'),
      ).toBeInTheDocument();
      expect(screen.queryByText('Verify Your South African ID')).not.toBeInTheDocument();
    });

    it('should show component when feature flag is enabled', () => {
      mockIsFeatureEnabled.mockReturnValue(true);

      renderVerifyId();

      expect(screen.getByText('Verify Your South African ID')).toBeInTheDocument();
      expect(
        screen.queryByText('ID verification is currently unavailable'),
      ).not.toBeInTheDocument();
    });
  });

  describe('ID Number Validation', () => {
    it('should only accept numeric input', () => {
      renderVerifyId();

      const input = screen.getByPlaceholderText('Enter 13-digit SA ID');
      fireEvent.change(input, { target: { value: 'abc123def456' } });

      expect(input).toHaveValue('123456');
    });

    it('should limit input to 13 digits', () => {
      renderVerifyId();

      const input = screen.getByPlaceholderText('Enter 13-digit SA ID');
      fireEvent.change(input, { target: { value: '12345678901234567890' } });

      expect(input).toHaveValue('1234567890123');
    });

    it('should enable button only with valid 13-digit ID', () => {
      renderVerifyId();

      const input = screen.getByPlaceholderText('Enter 13-digit SA ID');
      const button = screen.getByText('Verify ID');

      // Initially disabled
      expect(button).toBeDisabled();

      // Invalid length
      fireEvent.change(input, { target: { value: '123' } });
      expect(button).toBeDisabled();

      // Valid length
      fireEvent.change(input, { target: { value: '9202204720083' } });
      expect(button).not.toBeDisabled();
    });
  });

  describe('Consent Flow', () => {
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

    it('should return to idle state when cancel is clicked', () => {
      renderVerifyId();

      const input = screen.getByPlaceholderText('Enter 13-digit SA ID');
      const button = screen.getByText('Verify ID');

      fireEvent.change(input, { target: { value: '9202204720083' } });
      fireEvent.click(button);

      const cancelButton = screen.getByText('Cancel');
      fireEvent.click(cancelButton);

      expect(
        screen.queryByText('By proceeding, you consent to verify your South African ID number'),
      ).not.toBeInTheDocument();
    });
  });

  describe('API Integration Tests', () => {
    it('should successfully verify a valid SA ID', async () => {
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
        expect(mockFetch).toHaveBeenCalledWith('/api/verify-id', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            idNumber: '9202204720083',
            userId: 'test-user-123',
          }),
        });
      });

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
  });

  describe('Loading States', () => {
    it('should show loading spinner during verification', async () => {
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

  describe('Accessibility', () => {
    it('should have proper ARIA labels', () => {
      renderVerifyId();

      const input = screen.getByLabelText('South African ID Number');
      expect(input).toBeInTheDocument();
      expect(input).toHaveAttribute('id', 'idNumber');
    });

    it('should have proper form structure', () => {
      renderVerifyId();

      const input = screen.getByPlaceholderText('Enter 13-digit SA ID');
      const label = screen.getByText('South African ID Number');

      expect(label).toHaveAttribute('for', 'idNumber');
      expect(input).toHaveAttribute('id', 'idNumber');
    });
  });
});

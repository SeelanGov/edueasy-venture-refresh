import '@testing-library/jest-dom';
import React from 'react';
import { vi } from 'vitest';

// Mock Supabase
vi.mock('@/integrations/supabase/client', () => ({
  supabase: {
    auth: {
      signInWithPassword: vi.fn(),
      signUp: vi.fn(),
      signOut: vi.fn(),
      getUser: vi.fn(),
      onAuthStateChange: vi.fn(),
    },
    from: vi.fn(() => ({
      select: vi.fn().mockReturnThis(),
      insert: vi.fn().mockReturnThis(),
      update: vi.fn().mockReturnThis(),
      delete: vi.fn().mockReturnThis(),
      eq: vi.fn().mockReturnThis(),
      single: vi.fn(),
    })),
  },
}));

// Mock React Router
vi.mock('react-router-dom', () => ({
  useNavigate: () => vi.fn(),
  useLocation: () => ({ pathname: '/', search: '', state: null }),
  useSearchParams: () => [new URLSearchParams(), vi.fn()],
  Link: ({ children, to }: { children: React.ReactNode; to: string }) => 
    React.createElement('a', { href: to }, children),
  Navigate: ({ to }: { to: string }) => 
    React.createElement('div', { 'data-testid': 'navigate', 'data-to': to }),
}));

// Mock useAuth hook
vi.mock('@/hooks/useAuth', () => ({
  useAuth: () => ({
    user: null,
    loading: false,
    userType: null,
  }),
}));

// Mock window.matchMedia
Object.defineProperty(window, 'matchMedia', {
  writable: true,
  value: vi.fn().mockImplementation((query: string) => ({
    matches: false,
    media: query,
    onchange: null,
    addListener: vi.fn(),
    removeListener: vi.fn(),
    addEventListener: vi.fn(),
    removeEventListener: vi.fn(),
    dispatchEvent: vi.fn(),
  })),
});
import { describe, it, expect, vi, beforeEach } from 'vitest';
import { createClient } from '@supabase/supabase-js';

// Mock the createClient function
vi.mock('@supabase/supabase-js', () => ({
  createClient: vi.fn(() => ({
    auth: {
      onAuthStateChange: vi.fn(),
      getSession: vi.fn(),
    },
    from: vi.fn(),
  })),
}));

// Mock environment variables
vi.mock(
  'import.meta.env',
  () => ({
    env: {
      MODE: 'development',
      VITE_SUPABASE_URL: 'https://example.supabase.co',
      VITE_SUPABASE_ANON_KEY: 'mock-key',
    },
  }),
  { virtual: true }
);

describe('Supabase Client', () => {
  beforeEach(() => {
    // Clear all mocks before each test
    vi.clearAllMocks();

    // Reset console methods
    vi.spyOn(console, 'log').mockImplementation(() => {});
    vi.spyOn(console, 'warn').mockImplementation(() => {});
    vi.spyOn(console, 'error').mockImplementation(() => {});
  });

  it('should initialize the Supabase client with correct parameters', async () => {
    // Import the client (which will execute the initialization code)
    const { supabase } = await import('../client');

    // Verify that createClient was called with the correct parameters
    expect(createClient).toHaveBeenCalledWith('https://example.supabase.co', 'mock-key', {
      auth: {
        persistSession: true,
        autoRefreshToken: true,
      },
    });

    // Verify that the client was initialized
    expect(supabase).toBeDefined();
  });

  it('should use mock client in preview mode', async () => {
    // Mock environment for preview mode
    vi.mock(
      'import.meta.env',
      () => ({
        env: {
          MODE: 'preview',
          VITE_SUPABASE_URL: undefined,
          VITE_SUPABASE_ANON_KEY: undefined,
        },
      }),
      { virtual: true }
    );

    // Reset module cache to force re-initialization
    vi.resetModules();

    // Import the client again (which will execute the initialization code)
    const { supabase } = await import('../client');

    // Verify that createClient was not called
    expect(createClient).not.toHaveBeenCalled();

    // Verify that the mock client was created
    expect(supabase).toBeDefined();
    expect(console.log).toHaveBeenCalledWith('Using mock Supabase client for preview environment');
  });

  it('should throw an error when environment variables are missing in development mode', async () => {
    // Mock environment without Supabase variables
    vi.mock(
      'import.meta.env',
      () => ({
        env: {
          MODE: 'development',
          VITE_SUPABASE_URL: undefined,
          VITE_SUPABASE_ANON_KEY: undefined,
        },
      }),
      { virtual: true }
    );

    // Reset module cache to force re-initialization
    vi.resetModules();

    // Expect an error when importing the client
    await expect(import('../client')).rejects.toThrow('Supabase environment variables are not set');
  });
});

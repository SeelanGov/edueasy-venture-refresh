// This file is automatically generated. Do not edit it directly.
import { createClient, SupabaseClient } from '@supabase/supabase-js';
import type { Database } from './types';

// Use environment variables for Supabase config (Vite style)
const SUPABASE_URL = import.meta.env.VITE_SUPABASE_URL;
const SUPABASE_PUBLISHABLE_KEY = import.meta.env.VITE_SUPABASE_ANON_KEY;

// Create a properly typed mock client for preview environments
const createMockClient = (): SupabaseClient<Database> => {
  return {
    auth: {
      onAuthStateChange: () => ({
        data: null,
        error: null,
        subscription: { unsubscribe: () => {} },
      }),
      getSession: () => Promise.resolve({ data: { session: null }, error: null }),
      getUser: () => Promise.resolve({ data: { user: null }, error: null }),
      signOut: () => Promise.resolve({ error: null }),
      // Add other required auth methods as needed
    },
    // Mock database methods with proper typing
    from: (table: string) => ({
      select: (query?: string) => ({
        eq: (column: string, value: unknown) => ({
          single: () => Promise.resolve({ data: null, error: null }),
          order: (column: string, options?: { ascending?: boolean }) =>
            Promise.resolve({ data: [], error: null }),
          limit: (count: number) => Promise.resolve({ data: [], error: null }),
          range: (from: number, to: number) => Promise.resolve({ data: [], error: null }),
        }),
        single: () => Promise.resolve({ data: null, error: null }),
        order: (column: string, options?: { ascending?: boolean }) =>
          Promise.resolve({ data: [], error: null }),
        limit: (count: number) => Promise.resolve({ data: [], error: null }),
        range: (from: number, to: number) => Promise.resolve({ data: [], error: null }),
        in: (column: string, values: unknown[]) => ({
          single: () => Promise.resolve({ data: null, error: null }),
          order: (column: string, options?: { ascending?: boolean }) =>
            Promise.resolve({ data: [], error: null }),
        }),
        or: (query: string) => ({
          single: () => Promise.resolve({ data: null, error: null }),
          order: (column: string, options?: { ascending?: boolean }) =>
            Promise.resolve({ data: [], error: null }),
        }),
        filter: (column: string, operator: string, value: unknown) => ({
          single: () => Promise.resolve({ data: null, error: null }),
          order: (column: string, options?: { ascending?: boolean }) =>
            Promise.resolve({ data: [], error: null }),
        }),
      }),
      insert: (data: unknown) => ({
        select: (query?: string) => ({
          single: () => Promise.resolve({ data: null, error: null }),
        }),
      }),
      update: (data: unknown) => ({
        eq: (column: string, value: unknown) => ({
          select: (query?: string) => ({
            single: () => Promise.resolve({ data: null, error: null }),
          }),
        }),
      }),
      delete: () => ({
        eq: (column: string, value: unknown) => Promise.resolve({ data: null, error: null }),
        in: (column: string, values: unknown[]) => Promise.resolve({ data: null, error: null }),
      }),
      upsert: (data: unknown) => ({
        select: (query?: string) => ({
          single: () => Promise.resolve({ data: null, error: null }),
        }),
      }),
    }),
    storage: {
      from: (bucket: string) => ({
        upload: (path: string, file: File) => Promise.resolve({ data: null, error: null }),
        download: (path: string) => Promise.resolve({ data: null, error: null }),
        getPublicUrl: (path: string) => ({ data: { publicUrl: '' }, error: null }),
        remove: (paths: string[]) => Promise.resolve({ data: null, error: null }),
      }),
      // Add other required storage methods as needed
    },
    // Add other required client methods as needed
  } as unknown as SupabaseClient<Database>; // Type assertion needed due to mock implementation
};

// Initialize supabase client with proper typing
let supabaseClient: SupabaseClient<Database>;

// Add better error handling and logging
if (!SUPABASE_URL || !SUPABASE_PUBLISHABLE_KEY) {
  console.warn('Supabase environment variables missing:', {
    SUPABASE_URL_SET: !!SUPABASE_URL,
    SUPABASE_KEY_SET: !!SUPABASE_PUBLISHABLE_KEY,
    ENV_KEYS: Object.keys(import.meta.env).filter((key) => key.startsWith('VITE_')),
  });

  // For preview environments, use dummy values instead of throwing an error
  const isPreviewing =
    import.meta.env.MODE === 'preview' ||
    (typeof window !== 'undefined' && window.location.hostname.includes('loveable.dev'));

  if (isPreviewing) {
    console.log('Using mock Supabase client for preview environment');
    supabaseClient = createMockClient();
  } else {
    // Only throw in development and production, not in preview
    throw new Error(
      'Supabase environment variables are not set. Please check your .env file and ensure ' +
        'VITE_SUPABASE_URL and VITE_SUPABASE_ANON_KEY are properly configured.'
    );
  }
} else {
  try {
    // Log successful initialization (without exposing sensitive values)
    console.log('Initializing Supabase client with URL:', SUPABASE_URL);
    supabaseClient = createClient<Database>(SUPABASE_URL, SUPABASE_PUBLISHABLE_KEY, {
      auth: {
        persistSession: true,
        autoRefreshToken: true,
      },
    });
    console.log('Supabase client initialized successfully');
  } catch (error) {
    console.error('Failed to initialize Supabase client:', error);
    throw new Error(
      'Failed to initialize Supabase client. Please check your environment variables and network connection.'
    );
  }
}

// Import the supabase client like this:
// import { supabase } from "@/integrations/supabase/client";

export const supabase = supabaseClient;

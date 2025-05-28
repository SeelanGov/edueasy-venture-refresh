# Supabase Integration

This directory contains the Supabase client integration for the EduEasy application.

## Overview

The Supabase client is used to interact with the Supabase backend services, including:

- Authentication
- Database operations
- Storage operations

## Files

- `client.ts`: The main Supabase client initialization file
- `types.ts`: TypeScript types for the Supabase database schema
- `__tests__/client.test.ts`: Tests for the Supabase client

## Usage

Import the Supabase client in your components or services:

```typescript
import { supabase } from '@/integrations/supabase/client';

// Example: Query data
const { data, error } = await supabase.from('applications').select('*').eq('user_id', userId);

// Example: Authentication
const { data, error } = await supabase.auth.signInWithPassword({
  email: 'user@example.com',
  password: 'password123',
});
```

## Environment Variables

The Supabase client requires the following environment variables:

- `VITE_SUPABASE_URL`: The URL of your Supabase project
- `VITE_SUPABASE_ANON_KEY`: The anonymous/public key for your Supabase project

These should be defined in your `.env` file:

```
VITE_SUPABASE_URL=https://your-project.supabase.co
VITE_SUPABASE_ANON_KEY=your-anon-key
```

## Preview Mode

In preview environments (determined by `import.meta.env.MODE === 'preview'` or when the hostname includes 'loveable.dev'), a mock Supabase client is used to prevent errors due to missing environment variables.

## Type Safety

The Supabase client is fully typed using the database schema defined in `types.ts`. This provides type safety and autocompletion when interacting with the database.

## Error Handling

The client includes error handling for common issues:

- Missing environment variables
- Initialization failures

Errors are logged to the console and, in non-preview environments, will throw exceptions to prevent the application from running with an improperly configured Supabase client.

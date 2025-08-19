import React from 'react';
import { hasSupabaseEnv } from '@/lib/env';

export const EnvGate = ({ children }: { children: React.ReactNode }) => {
  if (!hasSupabaseEnv()) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background">
        <div className="max-w-md p-8 text-center space-y-4">
          <div className="text-destructive text-lg font-semibold">
            Configuration Required
          </div>
          <div className="text-muted-foreground">
            Supabase environment variables are missing. Please set{' '}
            <code className="mx-1 px-2 py-1 bg-muted rounded text-sm">VITE_SUPABASE_URL</code>{' '}
            and{' '}
            <code className="mx-1 px-2 py-1 bg-muted rounded text-sm">VITE_SUPABASE_ANON_KEY</code>{' '}
            in project settings.
          </div>
          <div className="text-sm text-muted-foreground">
            Go to Project → Settings → Environment variables in Lovable to configure these values.
          </div>
        </div>
      </div>
    );
  }
  return <>{children}</>;
};
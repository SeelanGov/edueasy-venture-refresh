import { useEffect, useState } from 'react';
import { SUPABASE_URL, SUPABASE_ANON_KEY } from '@/lib/env';

type Props = { children: React.ReactNode };

export default function EnvGate({ children }: Props) {
  const [status, setStatus] = useState<'checking' | 'ready' | 'missing'>('checking');

  // Allow bypass for Preview diagnostics
  const params = new URLSearchParams(window.location.search);
  if (params.get('skipEnvGate') === '1') {
    console.warn('[EnvGate] bypass via skipEnvGate=1');
    return <>{children}</>;
  }

  useEffect(() => {
    // Check if env vars are available
    if (SUPABASE_URL && SUPABASE_ANON_KEY) {
      setStatus('ready');
      return;
    }
    
    // If not immediately available, wait briefly for runtime-config
    const timer = setTimeout(() => {
      if (SUPABASE_URL && SUPABASE_ANON_KEY) {
        setStatus('ready');
      } else {
        setStatus('missing');
      }
    }, 1500);

    return () => clearTimeout(timer);
  }, []);

  if (status === 'checking') {
    return (
      <div className="p-6 text-center">
        <div className="animate-pulse text-sm opacity-70">Loading configuration…</div>
      </div>
    );
  }

  if (status === 'missing') {
    const mask = (s?: string) => (s ? `${s.slice(0, 16)}…${s.slice(-6)}` : '—');

    return (
      <div className="max-w-xl mx-auto p-6 space-y-4">
        <h1 className="text-xl font-semibold">Configuration required</h1>
        <p className="text-sm opacity-80">
          Supabase env not detected.
        </p>
        <ul className="text-sm space-y-1">
          <li>• Expected URL (masked): {mask(SUPABASE_URL)}</li>
          <li>• Expected anon key (masked): {mask(SUPABASE_ANON_KEY)}</li>
        </ul>
        <div className="text-sm">
          <p className="mt-3 font-medium">Quick fixes:</p>
          <ol className="list-decimal ml-5 space-y-1">
            <li>
              Ensure <code>public/runtime-config.js</code> is loading before the app (check DevTools → Network).
            </li>
            <li>
              Try URL override:&nbsp;
              <code>?sbUrl=&lt;url&gt;&amp;sbAnon=&lt;key&gt;</code>
            </li>
            <li>
              Run <a className="underline" href="/env-self-test.html">/env-self-test.html</a> to diagnose.
            </li>
          </ol>
        </div>
      </div>
    );
  }

  // ready
  return <>{children}</>;
};
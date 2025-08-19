import { useEffect, useState } from 'react';
import { hasSupabaseEnv, getEnvSource, getSupabaseEnv } from '@/lib/env';

type Props = { children: React.ReactNode };

export default function EnvGate({ children }: Props) {
  const [status, setStatus] = useState<'checking' | 'ready' | 'missing'>('checking');
  const [source, setSource] = useState<string>('checking');

  useEffect(() => {
    // Try immediately…
    if (hasSupabaseEnv()) {
      setSource(getEnvSource());
      setStatus('ready');
      return;
    }
    // …otherwise poll briefly in case runtime-config loads late
    const started = performance.now();
    const timer = setInterval(() => {
      if (hasSupabaseEnv()) {
        setSource(getEnvSource());
        setStatus('ready');
        clearInterval(timer);
      } else if (performance.now() - started > 1500) {
        // after 1.5s, give a friendly config screen
        setSource(getEnvSource());
        setStatus('missing');
        clearInterval(timer);
      }
    }, 100);

    return () => clearInterval(timer);
  }, []);

  if (status === 'checking') {
    return (
      <div className="p-6 text-center">
        <div className="animate-pulse text-sm opacity-70">Loading configuration…</div>
      </div>
    );
  }

  if (status === 'missing') {
    const { url, key } = getSupabaseEnv();
    const mask = (s?: string) => (s ? `${s.slice(0, 16)}…${s.slice(-6)}` : '—');

    return (
      <div className="max-w-xl mx-auto p-6 space-y-4">
        <h1 className="text-xl font-semibold">Configuration required</h1>
        <p className="text-sm opacity-80">
          Supabase env not detected. Active source:&nbsp;
          <code className="px-1 py-0.5 bg-gray-100 rounded">{source}</code>
        </p>
        <ul className="text-sm space-y-1">
          <li>• Expected URL (masked): {mask(url)}</li>
          <li>• Expected anon key (masked): {mask(key)}</li>
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
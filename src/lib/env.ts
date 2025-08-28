// Centralized env resolution with runtime + query param overrides for Lovable Preview.
declare global {
  interface Window {
    __RUNTIME_CONFIG__?: Record<string, string | undefined>;
  }
}

function fromQuery() {
  try {
    const p = new URLSearchParams(window.location.search);
    const sbUrl = p.get("sbUrl") ?? undefined;
    const sbAnon = p.get("sbAnon") ?? undefined;
    return { sbUrl, sbAnon };
  } catch {
    return { sbUrl: undefined, sbAnon: undefined };
  }
}

const qp = fromQuery();
const rc = (typeof window !== "undefined" && window.__RUNTIME_CONFIG__) || {};
const vite = (import.meta as any).env || {};

// Resolution order (most to least specific):
// 1) URL params (?sbUrl=...&sbAnon=...)
// 2) runtime-config.js (window.__RUNTIME_CONFIG__)
// 3) Vite env (import.meta.env)
const SUPABASE_URL =
  qp.sbUrl ||
  rc.VITE_SUPABASE_URL ||
  vite.VITE_SUPABASE_URL;

const SUPABASE_ANON_KEY =
  qp.sbAnon ||
  rc.VITE_SUPABASE_ANON_KEY ||
  vite.VITE_SUPABASE_ANON_KEY;

if (!SUPABASE_URL || !SUPABASE_ANON_KEY) {
  throw new Error(
    "Missing Supabase client env. Set VITE_SUPABASE_URL and VITE_SUPABASE_ANON_KEY via:\n" +
      "  • URL params ?sbUrl=&sbAnon=\n" +
      "  • public/runtime-config.js (window.__RUNTIME_CONFIG__)\n" +
      "  • or Vite env (import.meta.env)\n"
  );
}

export { SUPABASE_ANON_KEY, SUPABASE_URL };


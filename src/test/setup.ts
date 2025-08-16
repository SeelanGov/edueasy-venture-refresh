// Storage mocks
const makeStore = () => {
  let store: Record<string, string> = {};
  return {
    getItem: (k: string) => (k in store ? store[k] : null),
    setItem: (k: string, v: string) => { store[k] = String(v); },
    removeItem: (k: string) => { delete store[k]; },
    clear: () => { store = {}; },
    key: (i: number) => Object.keys(store)[i] ?? null,
    get length() { return Object.keys(store).length; },
  };
};
(globalThis as any).localStorage = makeStore();
(globalThis as any).sessionStorage = makeStore();

// Crypto + randomUUID (if needed)
if (!(globalThis.crypto as any)?.randomUUID) {
  (globalThis as any).crypto = { 
    ...(globalThis.crypto || {}), 
    randomUUID: () => `uuid_${Date.now()}_${Math.random().toString(16).slice(2)}` 
  };
}

// matchMedia
if (!(globalThis as any).matchMedia) {
  (globalThis as any).matchMedia = () => ({ 
    matches: false, 
    addListener() {}, 
    removeListener() {}, 
    addEventListener() {}, 
    removeEventListener() {}, 
    dispatchEvent() { return false; } 
  });
}

// IntersectionObserver / ResizeObserver
class NoopObserver { 
  observe(){} 
  unobserve(){} 
  disconnect(){} 
}
if (!(globalThis as any).IntersectionObserver) (globalThis as any).IntersectionObserver = NoopObserver as any;
if (!(globalThis as any).ResizeObserver) (globalThis as any).ResizeObserver = NoopObserver as any;
// Make TS happy in tests where DOM APIs may be partial
interface Window { 
  __TEST__?: boolean;
}
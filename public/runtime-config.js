// Runtime configuration for EduEasy Lovable Preview
// This file provides Supabase credentials for environments without .env support
// SECURITY: Only public keys - no service role or private credentials

window.__RUNTIME_CONFIG__ = {
  VITE_SUPABASE_URL: "https://pensvamtfjtpsaoeflbx.supabase.co",
  VITE_SUPABASE_ANON_KEY: "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InBlbnN2YW10Zmp0cHNhb2VmbGJ4Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDM4MzcyOTcsImV4cCI6MjA1OTQxMzI5N30.ZGFT9bcxwFuDVRF7ZYtLTQDPP3LKmt5Yo8BsJAFQyPM"
};

// Debug helper
console.log('[Runtime Config] Loaded Supabase configuration from runtime-config.js');
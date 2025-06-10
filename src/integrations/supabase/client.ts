
import { createClient } from '@supabase/supabase-js';

const supabaseUrl = 'https://pensvamtfjtpsaoeflbx.supabase.co';
const supabaseAnonKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InBlbnN2YW10Zmp0cHNhb2VmbGJ4Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDM4MzcyOTcsImV4cCI6MjA1OTQxMzI5N30.ZGFT9bcxwFuDVRF7ZYtLTQDPP3LKmt5Yo8BsJAFQyPM';

export const supabase = createClient(supabaseUrl, supabaseAnonKey, {
  auth: {
    storage: typeof window !== 'undefined' ? window.localStorage : undefined,
    persistSession: true,
    autoRefreshToken: true,
  }
});

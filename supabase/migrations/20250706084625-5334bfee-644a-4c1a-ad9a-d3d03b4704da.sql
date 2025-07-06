-- Phase 1: Add rate limiting columns to users table
ALTER TABLE public.users
ADD COLUMN IF NOT EXISTS query_count_today INTEGER DEFAULT 0,
ADD COLUMN IF NOT EXISTS query_limit INTEGER DEFAULT 5,
ADD COLUMN IF NOT EXISTS last_query_date DATE;
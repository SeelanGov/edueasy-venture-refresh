-- Phase 1: Create missing analytics tables with proper schema and RLS policies

-- Create analytics_events table
CREATE TABLE IF NOT EXISTS public.analytics_events (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  event_type TEXT NOT NULL,
  event_name TEXT NOT NULL,
  user_id UUID,
  session_id TEXT NOT NULL,
  properties JSONB DEFAULT '{}',
  timestamp TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  page_url TEXT,
  user_agent TEXT,
  ip_address INET,
  referrer TEXT
);

-- Create user_analytics table
CREATE TABLE IF NOT EXISTS public.user_analytics (
  user_id UUID NOT NULL PRIMARY KEY,
  total_sessions INTEGER DEFAULT 0,
  total_page_views INTEGER DEFAULT 0,
  last_active TIMESTAMP WITH TIME ZONE,
  first_seen TIMESTAMP WITH TIME ZONE DEFAULT now(),
  applications_submitted INTEGER DEFAULT 0,
  payments_completed INTEGER DEFAULT 0,
  features_used TEXT[] DEFAULT '{}',
  conversion_rate NUMERIC DEFAULT 0
);

-- Create application_analytics table
CREATE TABLE IF NOT EXISTS public.application_analytics (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  total_applications INTEGER DEFAULT 0,
  applications_by_status JSONB DEFAULT '{}',
  applications_by_program JSONB DEFAULT '{}',
  average_completion_time INTEGER DEFAULT 0,
  conversion_funnel JSONB DEFAULT '{}',
  top_programs JSONB DEFAULT '[]',
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

-- Create revenue_analytics table
CREATE TABLE IF NOT EXISTS public.revenue_analytics (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  total_revenue NUMERIC DEFAULT 0,
  revenue_by_month JSONB DEFAULT '{}',
  revenue_by_tier JSONB DEFAULT '{}',
  average_order_value NUMERIC DEFAULT 0,
  conversion_rate NUMERIC DEFAULT 0,
  top_revenue_sources JSONB DEFAULT '[]',
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

-- Enable RLS on all analytics tables
ALTER TABLE public.analytics_events ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.user_analytics ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.application_analytics ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.revenue_analytics ENABLE ROW LEVEL SECURITY;

-- RLS policies for analytics_events
CREATE POLICY "Users can view their own analytics events" 
ON public.analytics_events 
FOR SELECT 
USING (auth.uid() = user_id);

CREATE POLICY "Users can insert their own analytics events" 
ON public.analytics_events 
FOR INSERT 
WITH CHECK (auth.uid() = user_id OR user_id IS NULL);

CREATE POLICY "Admins can view all analytics events" 
ON public.analytics_events 
FOR ALL 
USING (is_admin(auth.uid()));

-- RLS policies for user_analytics
CREATE POLICY "Users can view their own user analytics" 
ON public.user_analytics 
FOR SELECT 
USING (auth.uid() = user_id);

CREATE POLICY "Users can update their own user analytics" 
ON public.user_analytics 
FOR UPDATE 
USING (auth.uid() = user_id);

CREATE POLICY "Users can insert their own user analytics" 
ON public.user_analytics 
FOR INSERT 
WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Admins can view all user analytics" 
ON public.user_analytics 
FOR ALL 
USING (is_admin(auth.uid()));

-- RLS policies for application_analytics
CREATE POLICY "Admins can manage application analytics" 
ON public.application_analytics 
FOR ALL 
USING (is_admin(auth.uid()));

-- RLS policies for revenue_analytics
CREATE POLICY "Admins can manage revenue analytics" 
ON public.revenue_analytics 
FOR ALL 
USING (is_admin(auth.uid()));

-- Create indexes for performance
CREATE INDEX IF NOT EXISTS idx_analytics_events_user_id ON public.analytics_events(user_id);
CREATE INDEX IF NOT EXISTS idx_analytics_events_timestamp ON public.analytics_events(timestamp);
CREATE INDEX IF NOT EXISTS idx_analytics_events_event_type ON public.analytics_events(event_type);
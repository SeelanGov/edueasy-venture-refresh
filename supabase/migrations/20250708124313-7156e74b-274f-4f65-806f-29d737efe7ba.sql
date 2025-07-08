-- Phase 1: Create thandi_knowledge_index table with proper RLS policies

-- Drop table if exists to ensure clean setup
DROP TABLE IF EXISTS public.thandi_knowledge_index;

-- Create the main knowledge index table
CREATE TABLE public.thandi_knowledge_index (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  module text NOT NULL UNIQUE,
  title text NOT NULL,
  tags text[] NOT NULL,
  source_links text[] NOT NULL,
  json_path text NOT NULL,
  html_path text NOT NULL,
  created_at timestamp with time zone NOT NULL DEFAULT now(),
  updated_at timestamp with time zone NOT NULL DEFAULT now()
);

-- Enable RLS
ALTER TABLE public.thandi_knowledge_index ENABLE ROW LEVEL SECURITY;

-- Create RLS policies for knowledge index
-- Anyone can read knowledge index (public content)
CREATE POLICY "Anyone can view knowledge index" 
ON public.thandi_knowledge_index 
FOR SELECT 
USING (true);

-- Only admins can insert/update knowledge index
CREATE POLICY "Admins can insert knowledge index" 
ON public.thandi_knowledge_index 
FOR INSERT 
WITH CHECK (is_admin(auth.uid()));

CREATE POLICY "Admins can update knowledge index" 
ON public.thandi_knowledge_index 
FOR UPDATE 
USING (is_admin(auth.uid()));

-- Create trigger for updated_at
CREATE TRIGGER update_thandi_knowledge_index_updated_at
BEFORE UPDATE ON public.thandi_knowledge_index
FOR EACH ROW
EXECUTE FUNCTION public.update_updated_at_column();

-- Create storage bucket for thandi knowledge base if it doesn't exist
INSERT INTO storage.buckets (id, name, public) 
VALUES ('thandi-knowledge', 'thandi-knowledge', true)
ON CONFLICT (id) DO NOTHING;

-- Create storage policies for thandi knowledge bucket
CREATE POLICY "Anyone can view knowledge files" 
ON storage.objects 
FOR SELECT 
USING (bucket_id = 'thandi-knowledge');

CREATE POLICY "Admins can upload knowledge files" 
ON storage.objects 
FOR INSERT 
WITH CHECK (bucket_id = 'thandi-knowledge' AND is_admin(auth.uid()));

CREATE POLICY "Admins can update knowledge files" 
ON storage.objects 
FOR UPDATE 
USING (bucket_id = 'thandi-knowledge' AND is_admin(auth.uid()));

-- Insert initial index record for validation
INSERT INTO public.thandi_knowledge_index (
  module,
  title,
  tags,
  source_links,
  json_path,
  html_path
) VALUES (
  'test_module',
  'Test Knowledge Module',
  ARRAY['test', 'validation'],
  ARRAY['https://example.com'],
  'thandi-knowledge/test/test.json',
  'thandi-knowledge/test/test.html'
) ON CONFLICT (module) DO NOTHING;

import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';

export interface Institution {
  id: string;
  name: string;
  short_name?: string;
  type: string;
  location?: string;
  student_count?: string;
  established?: string;
  ranking?: string;
  programs?: string;
  description?: string;
  website?: string;
  email?: string;
  phone?: string;
  province?: string;
  active: boolean;
  partner_id?: string;
}

export const useInstitutions = () => {
  const [institutions, setInstitutions] = useState<Institution[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchInstitutions = async () => {
      try {
        setLoading(true);
        setError(null);
        
        const { data, error: fetchError } = await supabase
          .from('institutions')
          .select('*')
          .eq('active', true)
          .order('name');

        if (fetchError) throw fetchError;
        
        setInstitutions(data || []);
      } catch (err) {
        console.error('Error fetching institutions:', err);
        setError('Failed to load institutions');
      } finally {
        setLoading(false);
      }
    };

    fetchInstitutions();
  }, []);

  return { institutions, loading, error };
};

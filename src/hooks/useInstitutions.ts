import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';

export interface Institution {
  id: string;
  name: string;
  short_name?: string | null;
  type: string;
  location?: string | null;
  student_count?: string | null;
  established?: string | null;
  ranking?: string | null;
  programs?: string | null;
  description?: string | null;
  website?: string | null;
  email?: string | null;
  phone?: string | null;
  province?: string | null;
  active: boolean;
  partner_id?: string | null;
}

/**
 * useInstitutions
 * @description Function
 */
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

        // Type assertion since we know the structure matches our interface
        setInstitutions((data as Institution[]) || []);
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

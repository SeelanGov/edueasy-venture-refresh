import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';



export interface SponsorAllocation {
  id: string;
  sponsor_id: string;
  plan: string;
  status: string;
  allocated_on: string;
  expires_on: string | null;
  notes: string | null;
}

/**
 * useSponsorAllocations
 * @description Function
 */
export function useSponsorAllocations(userId?: any): {
  allocations: SponsorAllocation[];
  loading: boolean;
} {
  const [allocations, setAllocations] = useState<SponsorAllocation[]>([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (!userId) return;
    setLoading(true);
    supabase
      .from('sponsor_allocations')
      .select('*')
      .eq('student_id', userId)
      .order('allocated_on', { ascending: false })
      .then(({ data, error }) => {
        if (!error && data) {
          setAllocations(data as SponsorAllocation[]);
        }
        setLoading(false);
      });
  }, [userId]);

  return { allocations, loading };
}

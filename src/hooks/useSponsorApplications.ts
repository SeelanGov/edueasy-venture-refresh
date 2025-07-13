import { useAuth } from '@/hooks/useAuth';
import { supabase } from '@/integrations/supabase/client';
import { useCallback, useEffect, useState } from 'react';

export function useSponsorApplications({ asSponsor = false } = {}) {
  const { user } = useAuth();
  const [applications, setApplications] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  const fetch = useCallback(async () => {
    if (!user) return;
    setLoading(true);
    let resp;
    if (asSponsor) {
      // Get sponsor record for authenticated user
      const { data: sponsorData, error: sponsorError } = await supabase
        .from('sponsors')
        .select('id')
        .eq('user_id', user.id)
        .single();

      if (sponsorError || !sponsorData) {
        // User doesn't have a sponsor record
        setApplications([]);
        setLoading(false);
        return;
      }

      resp = await supabase
        .from('application_fee_sponsorships')
        .select('*, sponsor_applications(*, student_id), sponsor_id')
        .eq('sponsor_id', sponsorData.id);
    } else {
      resp = await supabase.from('sponsor_applications').select('*').eq('student_id', user.id);
    }
    setApplications(resp.data || []);
    setLoading(false);
  }, [user, asSponsor]);

  useEffect(() => {
    fetch();
  }, [fetch]);
  return { applications, loading, refresh: fetch };
}

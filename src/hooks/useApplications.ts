import { useAuth } from '@/hooks/useAuth';
import { supabase } from '@/integrations/supabase/client';
import { useEffect } from 'react';

interface Application {
  id: string;
  user_id: string;
  created_at: string | null;
  institution_id: string | null;
  program_id: string | null;
  grade12_results: string | null;
  university: string | null;
  program: string | null;
  status: string | null;
  documents?: unknown[];
}

/**
 * useApplications
 * @description Function
 */
export const useApplications = () => {
  const { user } = useAuth();
  const [applications, setApplications] = useState<Application[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchApplications = async () => {
      if (!user) {
        setLoading(false);
        return;
      }

      try {
        const { data } = await supabase
          .from('applications')
          .select('*')
          .eq('user_id', user.id)
          .order('created_at', { ascending: false });

        if (error) throw error;

        setApplications(data || []);
      } catch {
        setApplications([]);
      } finally {
        setLoading(false);
      }
    };

    fetchApplications();
  }, [user]);

  return { applications };
};

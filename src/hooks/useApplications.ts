import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';
import { useAuth } from '@/hooks/useAuth';

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
export const useApplications = (): void => {
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
        const { data, error } = await supabase
          .from('applications')
          .select('*')
          .eq('user_id', user.id)
          .order('created_at', { ascending: false });

        if (error) throw error;

        // Fetch documents for each application
        const appsWithDocs: Application[] = await Promise.all(
          (data || []).map(async (app: unknown) => {
            const { data: documents, error: docsError } = await supabase
              .from('documents')
              .select('*')
              .eq('application_id', app.id);

            if (docsError) console.error('Error fetching documents:', docsError);

            return {
              ...app,
              documents: documents || [],
            };
          }),
        );

        setApplications(appsWithDocs);
      } catch (error) {
        console.error('Error fetching applications:', error);
        toast.error('Failed to load your applications');
      } finally {
        setLoading(false);
      }
    };

    fetchApplications();

    // Set up subscription for real-time updates to documents
    const documentsChannel = supabase
      .channel('documents-changes')
      .on(
        'postgres_changes',
        {
          event: '*',
          schema: 'public',
          table: 'documents',
        },
        () => {
          fetchApplications();
        },
      )
      .subscribe();

    return () => {
      supabase.removeChannel(documentsChannel);
    };
  }, [user]);

  return { applications, loading };
};

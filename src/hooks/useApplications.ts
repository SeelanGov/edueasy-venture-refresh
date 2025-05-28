import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { toast } from '@/components/ui/use-toast';
import { useAuth } from '@/contexts/AuthContext';
import type { Application } from '@/types/ApplicationTypes';

export const useApplications = () => {
  const { user } = useAuth();
  const [applications, setApplications] = useState<Application[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchApplications = async () => {
      try {
        if (!user?.id) {
          console.error('User ID is undefined');
          setLoading(false);
          return;
        }

        const { data, error } = await supabase
          .from('applications')
          .select('*')
          .eq('user_id', user.id)
          .order('created_at', { ascending: false });

        if (error) throw error;

        // Fetch documents for each application
        const appsWithDocs: Application[] = await Promise.all(
          (data || []).map(async (app: any) => {
            const { data: documents, error: docsError } = await supabase
              .from('documents')
              .select('*')
              .eq('application_id', app.id);

            if (docsError) console.error('Error fetching documents:', docsError);

            return {
              ...app,
              institution_id: app.institution_id ?? null,
              program_id: app.program_id ?? null,
              documents: documents || [],
            };
          })
        );

        setApplications(appsWithDocs);
      } catch (error) {
        console.error('Error fetching applications:', error);
        toast({
          title: 'Error',
          description: 'Failed to load your applications',
          variant: 'destructive',
        });
      } finally {
        setLoading(false);
      }
    };

    if (user) {
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
          }
        )
        .subscribe();

      return () => {
        supabase.removeChannel(documentsChannel);
      };
    }
  }, [user]);

  return { applications, loading };
};

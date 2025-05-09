
import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "@/components/ui/use-toast";
import { useAuth } from "@/contexts/AuthContext";

interface Document {
  id: string;
  file_path: string;
  created_at: string;
  document_type: string | null;
  verification_status: string | null;
}

interface Application {
  id: string;
  institution_id: string;
  program_id: string;
  status: string;
  created_at: string;
  documents: Document[];
}

export const useApplications = () => {
  const { user } = useAuth();
  const [applications, setApplications] = useState<Application[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchApplications = async () => {
      try {
        const { data, error } = await supabase
          .from("applications")
          .select("*")
          .eq("user_id", user?.id)
          .order("created_at", { ascending: false });

        if (error) throw error;

        // Fetch documents for each application
        const appsWithDocs = await Promise.all(
          (data || []).map(async (app) => {
            const { data: documents, error: docsError } = await supabase
              .from("documents")
              .select("*")
              .eq("application_id", app.id);

            if (docsError) console.error("Error fetching documents:", docsError);

            return {
              ...app,
              documents: documents || [],
            };
          })
        );

        setApplications(appsWithDocs);
      } catch (error) {
        console.error("Error fetching applications:", error);
        toast({
          title: "Error",
          description: "Failed to load your applications",
          variant: "destructive",
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
            table: 'documents'
          },
          (payload) => {
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

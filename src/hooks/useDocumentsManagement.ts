
import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "@/components/ui/use-toast";

export interface Document {
  id: string;
  file_path: string;
  document_type: string | null;
  verification_status: string | null;
  created_at: string;
  user_id: string | null;
  application_id: string;
}

export interface DocumentWithUserInfo extends Document {
  user_name: string;
  user_email: string;
}

export const useDocumentsManagement = () => {
  const [documents, setDocuments] = useState<DocumentWithUserInfo[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchDocuments = async () => {
    setLoading(true);
    setError(null);
    
    try {
      // Fetch documents with user info
      const { data, error } = await supabase
        .from("documents")
        .select(`
          *,
          users:user_id (
            full_name,
            email
          )
        `)
        .order("created_at", { ascending: false });

      if (error) throw error;

      // Transform the data to include user info
      const docsWithUserInfo = data.map((doc: any) => ({
        ...doc,
        user_name: doc.users?.full_name || "Unknown",
        user_email: doc.users?.email || "Unknown"
      }));

      setDocuments(docsWithUserInfo);
    } catch (err: any) {
      console.error("Error fetching documents:", err);
      setError(err.message);
      toast({
        title: "Error",
        description: "Failed to load documents",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const updateDocumentStatus = async (id: string, status: string) => {
    try {
      const { error } = await supabase
        .from("documents")
        .update({ verification_status: status })
        .eq("id", id);

      if (error) throw error;

      // Refresh documents
      fetchDocuments();

      toast({
        title: "Status updated",
        description: `Document status changed to ${status}`,
      });
    } catch (err: any) {
      console.error("Error updating document status:", err);
      toast({
        title: "Error",
        description: "Failed to update document status",
        variant: "destructive",
      });
    }
  };

  const getDocumentUrl = async (filePath: string) => {
    try {
      const { data, error } = await supabase.storage
        .from("user_documents")
        .createSignedUrl(filePath, 60); // URL valid for 60 seconds

      if (error) throw error;
      return data.signedUrl;
    } catch (error) {
      console.error("Error creating signed URL:", error);
      toast({
        title: "Error",
        description: "Could not generate document link",
        variant: "destructive",
      });
      return null;
    }
  };

  useEffect(() => {
    fetchDocuments();
  }, []);

  return {
    documents,
    loading,
    error,
    updateDocumentStatus,
    getDocumentUrl,
    refreshDocuments: fetchDocuments,
  };
};

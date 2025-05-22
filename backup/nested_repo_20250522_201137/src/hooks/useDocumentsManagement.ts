
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
  rejection_reason: string | null;
}

export interface DocumentWithUserInfo extends Document {
  user_name: string;
  user_email: string;
}

export const useDocumentsManagement = () => {
  const [documents, setDocuments] = useState<DocumentWithUserInfo[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalCount, setTotalCount] = useState(0);
  const pageSize = 10;

  const fetchDocuments = async () => {
    setLoading(true);
    setError(null);
    
    try {
      // First get the total count
      const { count, error: countError } = await supabase
        .from("documents")
        .select("id", { count: "exact", head: true });
        
      if (countError) throw countError;
      
      setTotalCount(count || 0);

      // Fetch documents with pagination
      const from = (currentPage - 1) * pageSize;
      const to = from + pageSize - 1;
      
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
        .order("created_at", { ascending: false })
        .range(from, to);

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

  const updateDocumentStatus = async (id: string, status: string, rejectionReason?: string) => {
    try {
      const updateData: {
        verification_status: string;
        rejection_reason?: string | null;
      } = {
        verification_status: status
      };
      
      // Add or clear rejection reason based on status
      if (status === 'rejected' || status === 'request_resubmission') {
        updateData.rejection_reason = rejectionReason || null;
      } else if (status === 'approved') {
        updateData.rejection_reason = null;
      }

      const { error } = await supabase
        .from("documents")
        .update(updateData)
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
  }, [currentPage]);

  return {
    documents,
    loading,
    error,
    updateDocumentStatus,
    getDocumentUrl,
    refreshDocuments: fetchDocuments,
    currentPage,
    setCurrentPage,
    totalCount,
    pageSize
  };
};

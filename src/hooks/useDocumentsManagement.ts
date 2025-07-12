import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { toast } from '@/hooks/use-toast';
import { useAuditLogging } from '@/hooks/admin/useAuditLogging';

export interface DocumentWithUserInfo {
  id: string;
  user_id: string;
  file_path: string;
  document_type: string | null;
  verification_status: string | null;
  created_at: string;
  rejection_reason: string | null;
  user_name: string;
  user_email: string;
}

export function useDocumentsManagement() {
  const [documents, setDocuments] = useState<DocumentWithUserInfo[]>([]);
  const [loading, setLoading] = useState(true);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalCount, setTotalCount] = useState(0);
  const pageSize = 20;
  const { logAdminAction } = useAuditLogging();

  const fetchDocuments = async () => {
    setLoading(true);
    try {
      const startIndex = (currentPage - 1) * pageSize;

      // Get total count
      const { count } = await supabase
        .from('documents')
        .select('*', { count: 'exact', head: true });

      setTotalCount(count || 0);

      // Get paginated documents with user info - using proper join
      const { data, error } = await supabase
        .from('documents')
        .select(
          `
          id,
          user_id,
          file_path,
          document_type,
          verification_status,
          created_at,
          rejection_reason,
          users!inner (
            full_name,
            email,
            contact_email
          )
        `,
        )
        .order('created_at', { ascending: false })
        .range(startIndex, startIndex + pageSize - 1);

      if (error) throw error;

      // Transform the data with proper type checking and null handling
      const documentsWithUserInfo: DocumentWithUserInfo[] = (data || [])
        .filter((doc) => doc.user_id) // Filter out documents without user_id
        .map((doc) => {
          // Type guard to ensure users data exists and has the right structure
          const userData = doc.users as any;
          return {
            id: doc.id,
            user_id: doc.user_id as string,
            file_path: doc.file_path,
            document_type: doc.document_type,
            verification_status: doc.verification_status,
            created_at: doc.created_at || new Date().toISOString(), // Handle null created_at
            rejection_reason: doc.rejection_reason,
            user_name: userData?.full_name || 'Unknown User',
            user_email: userData?.email || userData?.contact_email || 'No email',
          };
        });

      setDocuments(documentsWithUserInfo);
    } catch (error) {
      console.error('Error fetching documents:', error);
      toast({
        title: 'Error',
        description: 'Failed to load documents',
        variant: 'destructive',
      });
    } finally {
      setLoading(false);
    }
  };

  const updateDocumentStatus = async (
    documentId: string,
    status: string,
    rejectionReason?: string,
  ) => {
    try {
      const { error } = await supabase
        .from('documents')
        .update({
          verification_status: status,
          rejection_reason: rejectionReason || null,
          verified_at: status === 'approved' ? new Date().toISOString() : null,
        })
        .eq('id', documentId);

      if (error) throw error;

      // Log admin action for audit trail
      await logAdminAction({
        action: `DOCUMENT_${status.toUpperCase()}`,
        target_type: 'document',
        target_id: documentId,
        details: {
          new_status: status,
          rejection_reason: rejectionReason,
          verified_at: status === 'approved' ? new Date().toISOString() : null,
        },
        reason: rejectionReason,
      });

      toast({
        title: 'Success',
        description: `Document ${status} successfully`,
        variant: 'default',
      });

      // Refresh the documents list
      fetchDocuments();
    } catch (error) {
      console.error('Error updating document status:', error);
      toast({
        title: 'Error',
        description: 'Failed to update document status',
        variant: 'destructive',
      });
    }
  };

  const getDocumentUrl = async (filePath: string): Promise<string | null> => {
    try {
      const { data } = await supabase.storage.from('documents').createSignedUrl(filePath, 300); // 5 minutes

      return data?.signedUrl || null;
    } catch (error) {
      console.error('Error getting document URL:', error);
      return null;
    }
  };

  const refreshDocuments = () => {
    fetchDocuments();
  };

  useEffect(() => {
    fetchDocuments();
  }, [currentPage]);

  return {
    documents,
    loading,
    updateDocumentStatus,
    getDocumentUrl,
    refreshDocuments,
    totalCount,
    pageSize,
    currentPage,
    setCurrentPage,
  };
}

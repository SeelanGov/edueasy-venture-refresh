
import { useEffect, useState } from "react";
import { useAuth } from "@/contexts/AuthContext";
import { supabase } from "@/integrations/supabase/client";
import { CheckCircle, XCircle, RefreshCw } from "lucide-react";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Button } from "@/components/ui/button";

interface DocumentStatus {
  id: string;
  document_type: string | null;
  verification_status: string | null;
  file_path: string;
  created_at: string;
  rejection_reason: string | null;
}

export const DocumentVerificationNotice = () => {
  const { user } = useAuth();
  const [recentlyVerifiedDocs, setRecentlyVerifiedDocs] = useState<DocumentStatus[]>([]);
  const [dismissed, setDismissed] = useState<Record<string, boolean>>({});
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchRecentVerifiedDocuments = async () => {
      if (!user) {
        setLoading(false);
        return;
      }
      
      try {
        const { data, error } = await supabase
          .from("documents")
          .select("id, document_type, verification_status, file_path, created_at, rejection_reason")
          .eq("user_id", user.id)
          .in("verification_status", ["approved", "rejected", "request_resubmission"])
          .order("created_at", { ascending: false })
          .limit(5);
          
        if (error) throw error;
        
        const dismissedJson = localStorage.getItem('dismissedDocNotifications');
        const dismissedDocs = dismissedJson ? JSON.parse(dismissedJson) : {};
        
        setDismissed(dismissedDocs);
        
        // Filter out documents with null created_at and ensure type safety
        const validDocs = (data || []).filter((doc): doc is DocumentStatus => 
          doc.created_at !== null
        );
        setRecentlyVerifiedDocs(validDocs);
      } catch (err) {
        console.error("Error fetching document verification status:", err);
      } finally {
        setLoading(false);
      }
    };
    
    fetchRecentVerifiedDocuments();
    
    if (user) {
      const channel = supabase
        .channel('documents-updates')
        .on(
          'postgres_changes',
          {
            event: 'UPDATE', 
            schema: 'public',
            table: 'documents',
            filter: `user_id=eq.${user.id}`
          },
          () => {
            fetchRecentVerifiedDocuments();
          }
        )
        .subscribe();
        
      return () => {
        supabase.removeChannel(channel);
      };
    }
    
    return undefined;
  }, [user]);
  
  const handleDismiss = (docId: string) => {
    const updatedDismissed = { ...dismissed, [docId]: true };
    setDismissed(updatedDismissed);
    localStorage.setItem('dismissedDocNotifications', JSON.stringify(updatedDismissed));
  };
  
  const getDocumentUrl = async (filePath: string) => {
    try {
      const { data, error } = await supabase.storage
        .from("user_documents")
        .createSignedUrl(filePath, 60);

      if (error) throw error;
      return data.signedUrl;
    } catch (error) {
      console.error("Error creating signed URL:", error);
      return null;
    }
  };
  
  const handleViewDocument = async (filePath: string) => {
    const url = await getDocumentUrl(filePath);
    if (url) {
      window.open(url, "_blank");
    }
  };
  
  if (loading || recentlyVerifiedDocs.length === 0) {
    return null;
  }
  
  return (
    <div className="space-y-4 mb-6">
      {recentlyVerifiedDocs.map((doc) => {
        if (dismissed[doc.id]) return null;
        
        const isApproved = doc.verification_status === 'approved';
        const isRejected = doc.verification_status === 'rejected';
        const isResubmission = doc.verification_status === 'request_resubmission';
        const isRecent = new Date(doc.created_at) > new Date(Date.now() - 7 * 24 * 60 * 60 * 1000);
        
        if (!isRecent) return null;
        
        return (
          <Alert 
            key={doc.id} 
            variant={isApproved ? "default" : isRejected || isResubmission ? "destructive" : undefined}
            className={isApproved ? "bg-green-50 text-green-900 border-green-200" : 
                       isResubmission ? "bg-amber-50 text-amber-900 border-amber-200" : undefined}
          >
            {isApproved ? (
              <CheckCircle className="h-4 w-4 text-green-700" />
            ) : isResubmission ? (
              <RefreshCw className="h-4 w-4 text-amber-700" />
            ) : (
              <XCircle className="h-4 w-4" />
            )}
            <AlertTitle>
              {isApproved && "Document Verified"}
              {isRejected && "Document Rejected"}
              {isResubmission && "Document Requires Resubmission"}
            </AlertTitle>
            <AlertDescription className="flex flex-col space-y-2">
              <p>
                Your {doc.document_type || "document"} has been {
                  isApproved ? "verified" : 
                  isRejected ? "rejected" : 
                  "flagged for resubmission"
                }.
                {(isRejected || isResubmission) && doc.rejection_reason && (
                  <span className="block mt-1 text-sm">
                    Reason: {doc.rejection_reason}
                  </span>
                )}
              </p>
              <div className="flex space-x-2 mt-2">
                <Button 
                  size="sm" 
                  variant="outline"
                  onClick={() => handleViewDocument(doc.file_path)}
                >
                  View Document
                </Button>
                <Button 
                  size="sm" 
                  variant="ghost"
                  onClick={() => handleDismiss(doc.id)}
                >
                  Dismiss
                </Button>
              </div>
            </AlertDescription>
          </Alert>
        );
      })}
    </div>
  );
};

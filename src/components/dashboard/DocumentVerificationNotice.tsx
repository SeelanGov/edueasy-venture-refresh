
import { useEffect, useState } from "react";
import { useAuth } from "@/contexts/AuthContext";
import { supabase } from "@/integrations/supabase/client";
import { AlertCircle, CheckCircle, XCircle } from "lucide-react";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Button } from "@/components/ui/button";

interface DocumentStatus {
  id: string;
  document_type: string | null;
  verification_status: string | null;
  file_path: string;
  created_at: string; // Using created_at instead of updated_at
}

export const DocumentVerificationNotice = () => {
  const { user } = useAuth();
  const [recentlyVerifiedDocs, setRecentlyVerifiedDocs] = useState<DocumentStatus[]>([]);
  const [dismissed, setDismissed] = useState<Record<string, boolean>>({});
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchRecentVerifiedDocuments = async () => {
      if (!user) return;
      
      try {
        // Get documents that have been recently verified or rejected
        // Changed to use created_at instead of updated_at
        const { data, error } = await supabase
          .from("documents")
          .select("id, document_type, verification_status, file_path, created_at")
          .eq("user_id", user.id)
          .in("verification_status", ["approved", "rejected"])
          .order("created_at", { ascending: false })
          .limit(5);
          
        if (error) throw error;
        
        // Check dismissed status from localStorage
        const dismissedJson = localStorage.getItem('dismissedDocNotifications');
        const dismissedDocs = dismissedJson ? JSON.parse(dismissedJson) : {};
        
        setDismissed(dismissedDocs);
        setRecentlyVerifiedDocs(data || []);
      } catch (err) {
        console.error("Error fetching document verification status:", err);
      } finally {
        setLoading(false);
      }
    };
    
    fetchRecentVerifiedDocuments();
    
    // Set up subscription for real-time updates
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
          (payload) => {
            // When a document is updated, refresh the list
            fetchRecentVerifiedDocuments();
          }
        )
        .subscribe();
        
      return () => {
        supabase.removeChannel(channel);
      };
    }
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
        // Skip if dismissed
        if (dismissed[doc.id]) return null;
        
        const isApproved = doc.verification_status === 'approved';
        const isRecent = new Date(doc.created_at) > new Date(Date.now() - 7 * 24 * 60 * 60 * 1000); // 7 days
        
        if (!isRecent) return null;
        
        return (
          <Alert 
            key={doc.id} 
            variant={isApproved ? "default" : "destructive"}
            className={isApproved ? "bg-green-50 text-green-900 border-green-200" : undefined}
          >
            {isApproved ? (
              <CheckCircle className="h-4 w-4 text-green-700" />
            ) : (
              <XCircle className="h-4 w-4" />
            )}
            <AlertTitle>
              Document {isApproved ? "Verified" : "Rejected"}
            </AlertTitle>
            <AlertDescription className="flex flex-col space-y-2">
              <p>
                Your {doc.document_type || "document"} has been {isApproved ? "verified" : "rejected"}.
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

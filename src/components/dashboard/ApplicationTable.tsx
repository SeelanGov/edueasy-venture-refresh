import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "@/components/ui/use-toast";
import { Spinner } from "@/components/Spinner";
import { FileIcon, ExternalLinkIcon, CheckCircle, XCircle, AlertCircle, RefreshCw } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  Table,
  TableBody,
  TableCaption,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";

interface Institution {
  id: string;
  name: string;
}

interface Program {
  id: string;
  name: string;
}

interface Document {
  id: string;
  file_path: string;
  created_at: string;
  verification_status: string | null;
  document_type: string | null;
}

interface Application {
  id: string;
  institution_id: string;
  program_id: string;
  status: string;
  created_at: string;
  documents: Document[];
  institution?: Institution;
  program?: Program;
}

interface ApplicationTableProps {
  applications: Application[];
  loading: boolean;
}

export const ApplicationTable = ({ applications, loading }: ApplicationTableProps) => {
  const [enrichedApplications, setEnrichedApplications] = useState<Application[]>([]);

  useEffect(() => {
    // Fetch institution and program details for each application
    const fetchDetails = async () => {
      try {
        const enriched = await Promise.all(
          applications.map(async (app) => {
            let institutionData = null;
            let programData = null;
            
            if (app.institution_id) {
              const { data: instData } = await supabase
                .from("institutions")
                .select("id, name")
                .eq("id", app.institution_id)
                .single();
              institutionData = instData;
            }
            
            if (app.program_id) {
              const { data: progData } = await supabase
                .from("programs")
                .select("id, name")
                .eq("id", app.program_id)
                .single();
              programData = progData;
            }
            
            return {
              ...app,
              institution: institutionData,
              program: programData
            };
          })
        );
        
        setEnrichedApplications(enriched);
      } catch (error) {
        console.error("Error fetching application details:", error);
      }
    };
    
    if (applications.length > 0) {
      fetchDetails();
    }
  }, [applications]);

  const getStatusBadgeClass = (status: string) => {
    switch (status.toLowerCase()) {
      case "draft":
        return "bg-yellow-100 text-yellow-800";
      case "submitted":
        return "bg-blue-100 text-blue-800";
      case "reviewed":
        return "bg-green-100 text-green-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  const getVerificationBadge = (status: string | null) => {
    if (!status) return null;
    
    switch (status.toLowerCase()) {
      case "approved":
        return (
          <Badge variant="default" className="bg-green-500 hover:bg-green-600">
            <CheckCircle className="h-3 w-3 mr-1" />
            Verified
          </Badge>
        );
      case "rejected":
        return (
          <Badge variant="destructive">
            <XCircle className="h-3 w-3 mr-1" />
            Rejected
          </Badge>
        );
      case "pending":
        return (
          <Badge variant="outline" className="border-amber-500 text-amber-500">
            <AlertCircle className="h-3 w-3 mr-1" />
            Pending
          </Badge>
        );
      case "request_resubmission":
        return (
          <Badge variant="outline" className="border-orange-500 text-orange-500">
            <RefreshCw className="h-3 w-3 mr-1" />
            Resubmit
          </Badge>
        );
      default:
        return (
          <Badge variant="outline">
            Unknown
          </Badge>
        );
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

  const handleDocumentClick = async (filePath: string) => {
    const url = await getDocumentUrl(filePath);
    if (url) {
      window.open(url, "_blank");
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center py-12">
        <Spinner size="lg" />
      </div>
    );
  }

  if (applications.length === 0) {
    return <EmptyApplicationState />;
  }

  return (
    <Table>
      <TableCaption>A list of your applications</TableCaption>
      <TableHeader>
        <TableRow>
          <TableHead>University</TableHead>
          <TableHead>Program</TableHead>
          <TableHead>Status</TableHead>
          <TableHead>Documents</TableHead>
          <TableHead>Date Applied</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {enrichedApplications.map((app) => (
          <TableRow key={app.id}>
            <TableCell className="font-medium">
              {app.institution?.name || "Not specified"}
            </TableCell>
            <TableCell>
              {app.program?.name || "Not specified"}
            </TableCell>
            <TableCell>
              <span 
                className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusBadgeClass(app.status)}`}
              >
                {app.status}
              </span>
            </TableCell>
            <TableCell>
              {app.documents.length > 0 ? (
                <div className="flex flex-col gap-2">
                  {app.documents.map((doc) => (
                    <div key={doc.id} className="flex items-center justify-between">
                      <Button
                        variant="outline"
                        size="sm"
                        className="text-xs justify-start"
                        onClick={() => handleDocumentClick(doc.file_path)}
                      >
                        <FileIcon className="h-3 w-3 mr-1" />
                        <span className="truncate">{doc.document_type || "Document"}</span>
                        <ExternalLinkIcon className="h-3 w-3 ml-1" />
                      </Button>
                      <div className="ml-2">
                        {getVerificationBadge(doc.verification_status)}
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <span className="text-gray-500 text-xs">No documents</span>
              )}
            </TableCell>
            <TableCell className="text-gray-500">
              {new Date(app.created_at).toLocaleDateString()}
            </TableCell>
          </TableRow>
        ))}
      </TableBody>
    </Table>
  );
};

const EmptyApplicationState = () => {
  return (
    <div className="text-center py-12 bg-gray-50 rounded-md">
      <div className="inline-flex justify-center items-center w-16 h-16 bg-gray-100 rounded-full mb-4">
        <FileIcon className="h-8 w-8 text-gray-400" />
      </div>
      <h3 className="text-lg font-medium text-gray-900 mb-2">No applications yet</h3>
      <p className="text-gray-500 mb-4">Start your application journey now!</p>
      <Link to="/apply">
        <Button className="bg-cap-teal hover:bg-cap-teal/90">
          <PlusIcon className="h-4 w-4 mr-2" />
          Create Application
        </Button>
      </Link>
    </div>
  );
};

// Add missing import
import { Link } from "react-router-dom";
import { PlusIcon } from "lucide-react";

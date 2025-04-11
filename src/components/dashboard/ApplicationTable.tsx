
import { useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "@/components/ui/use-toast";
import { Spinner } from "@/components/Spinner";
import { FileIcon, ExternalLinkIcon } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Table,
  TableBody,
  TableCaption,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";

interface Application {
  id: string;
  university: string;
  program: string;
  status: string;
  created_at: string;
  documents: Document[];
}

interface Document {
  id: string;
  file_path: string;
  created_at: string;
}

interface ApplicationTableProps {
  applications: Application[];
  loading: boolean;
}

export const ApplicationTable = ({ applications, loading }: ApplicationTableProps) => {
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

  const getDocumentUrl = async (filePath: string) => {
    try {
      const { data, error } = await supabase.storage
        .from("application_docs")
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
        {applications.map((app) => (
          <TableRow key={app.id}>
            <TableCell className="font-medium">{app.university}</TableCell>
            <TableCell>{app.program}</TableCell>
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
                    <Button
                      key={doc.id}
                      variant="outline"
                      size="sm"
                      className="text-xs justify-start"
                      onClick={() => handleDocumentClick(doc.file_path)}
                    >
                      <FileIcon className="h-3 w-3 mr-1" />
                      <span className="truncate">View Document</span>
                      <ExternalLinkIcon className="h-3 w-3 ml-1" />
                    </Button>
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


import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/contexts/AuthContext";
import { Navbar } from "@/components/Navbar";
import { Button } from "@/components/ui/button";
import { Spinner } from "@/components/Spinner";
import { toast } from "@/components/ui/use-toast";
import {
  Table,
  TableBody,
  TableCaption,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { FileIcon, PlusIcon, ExternalLinkIcon } from "lucide-react";

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

const Dashboard = () => {
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
    }
  }, [user]);

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

  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />
      
      <div className="container mx-auto px-4 py-8 pt-24">
        <div className="bg-white rounded-lg shadow p-6">
          <div className="flex justify-between items-center mb-6">
            <h1 className="text-2xl font-bold text-cap-dark">My Applications</h1>
            <Link to="/apply">
              <Button className="bg-cap-teal hover:bg-cap-teal/90">
                <PlusIcon className="h-4 w-4 mr-2" />
                New Application
              </Button>
            </Link>
          </div>

          {loading ? (
            <div className="flex justify-center py-12">
              <Spinner size="lg" />
            </div>
          ) : applications.length === 0 ? (
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
          ) : (
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
          )}
        </div>
      </div>
    </div>
  );
};

export default Dashboard;

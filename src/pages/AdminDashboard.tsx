
import { useState } from "react";
import { DashboardLayout } from "@/components/DashboardLayout";
import { useDocumentsManagement, DocumentWithUserInfo } from "@/hooks/useDocumentsManagement";
import { Spinner } from "@/components/Spinner";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { FileIcon, ExternalLinkIcon, CheckCircle, XCircle, AlertCircle } from "lucide-react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Table,
  TableBody,
  TableCaption,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { useAuth } from "@/contexts/AuthContext";

const AdminDashboard = () => {
  const { user } = useAuth();
  const { documents, loading, updateDocumentStatus, getDocumentUrl, refreshDocuments } = useDocumentsManagement();
  const [selectedDocument, setSelectedDocument] = useState<DocumentWithUserInfo | null>(null);
  const [tabValue, setTabValue] = useState("all");
  
  // Filter documents based on the selected tab
  const filteredDocuments = documents.filter(doc => {
    if (tabValue === "all") return true;
    return doc.verification_status === tabValue;
  });

  const getStatusBadgeVariant = (status: string | null) => {
    switch (status) {
      case "approved":
        return "success";
      case "rejected":
        return "destructive";
      case "pending":
        return "warning";
      default:
        return "secondary";
    }
  };

  const getStatusBadge = (status: string | null) => {
    const statusText = status ? status.charAt(0).toUpperCase() + status.slice(1) : "Unknown";
    const variant = getStatusBadgeVariant(status);
    
    return (
      <Badge variant={variant === "success" ? "default" : variant}>
        {variant === "success" && <CheckCircle className="h-3 w-3 mr-1" />}
        {variant === "destructive" && <XCircle className="h-3 w-3 mr-1" />}
        {variant === "warning" && <AlertCircle className="h-3 w-3 mr-1" />}
        {statusText}
      </Badge>
    );
  };

  const handleViewDocument = async (doc: DocumentWithUserInfo) => {
    setSelectedDocument(doc);
  };

  const handleOpenDocument = async (filePath: string) => {
    const url = await getDocumentUrl(filePath);
    if (url) {
      window.open(url, "_blank");
    }
  };

  if (!user) {
    return <div>Not authorized</div>;
  }

  return (
    <DashboardLayout>
      <div className="container mx-auto max-w-7xl py-8 px-4">
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-2xl font-bold">Document Verification</h1>
          <Button onClick={refreshDocuments} variant="outline" size="sm">
            Refresh
          </Button>
        </div>

        <Tabs defaultValue="all" value={tabValue} onValueChange={setTabValue} className="mb-6">
          <TabsList>
            <TabsTrigger value="all">All Documents</TabsTrigger>
            <TabsTrigger value="pending">Pending</TabsTrigger>
            <TabsTrigger value="approved">Approved</TabsTrigger>
            <TabsTrigger value="rejected">Rejected</TabsTrigger>
          </TabsList>
        </Tabs>

        {loading ? (
          <div className="flex justify-center py-12">
            <Spinner size="lg" />
          </div>
        ) : (
          <div className="bg-white rounded-lg shadow overflow-hidden">
            <Table>
              <TableCaption>List of documents requiring verification</TableCaption>
              <TableHeader>
                <TableRow>
                  <TableHead>Document Type</TableHead>
                  <TableHead>User</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Date</TableHead>
                  <TableHead>Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredDocuments.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={5} className="text-center py-6">
                      No documents found
                    </TableCell>
                  </TableRow>
                ) : (
                  filteredDocuments.map((doc) => (
                    <TableRow key={doc.id}>
                      <TableCell className="font-medium">
                        {doc.document_type || "Unknown"}
                      </TableCell>
                      <TableCell>
                        <div>{doc.user_name}</div>
                        <div className="text-xs text-gray-500">{doc.user_email}</div>
                      </TableCell>
                      <TableCell>
                        {getStatusBadge(doc.verification_status)}
                      </TableCell>
                      <TableCell>
                        {new Date(doc.created_at).toLocaleDateString()}
                      </TableCell>
                      <TableCell>
                        <div className="flex space-x-2">
                          <Button 
                            variant="outline" 
                            size="sm"
                            onClick={() => handleOpenDocument(doc.file_path)}
                          >
                            <FileIcon className="h-4 w-4 mr-1" /> View
                          </Button>
                          <Dialog>
                            <DialogTrigger asChild>
                              <Button 
                                variant="outline" 
                                size="sm"
                                onClick={() => handleViewDocument(doc)}
                              >
                                Verify
                              </Button>
                            </DialogTrigger>
                            <DialogContent>
                              <DialogHeader>
                                <DialogTitle>Verify Document</DialogTitle>
                              </DialogHeader>
                              
                              {selectedDocument && (
                                <div className="space-y-4">
                                  <div>
                                    <h3 className="font-medium">Document Details</h3>
                                    <p><span className="font-semibold">Type:</span> {selectedDocument.document_type || "Unknown"}</p>
                                    <p><span className="font-semibold">User:</span> {selectedDocument.user_name}</p>
                                    <p><span className="font-semibold">Status:</span> {selectedDocument.verification_status}</p>
                                    <Button
                                      variant="outline"
                                      size="sm"
                                      className="mt-2"
                                      onClick={() => handleOpenDocument(selectedDocument.file_path)}
                                    >
                                      <FileIcon className="h-4 w-4 mr-1" /> Open Document <ExternalLinkIcon className="h-4 w-4 ml-1" />
                                    </Button>
                                  </div>
                                  
                                  <div className="flex justify-between pt-4 border-t">
                                    <Button
                                      variant="destructive"
                                      onClick={() => updateDocumentStatus(selectedDocument.id, "rejected")}
                                    >
                                      <XCircle className="h-4 w-4 mr-2" /> Reject
                                    </Button>
                                    <Button
                                      variant="default"
                                      className="bg-green-600 hover:bg-green-700"
                                      onClick={() => updateDocumentStatus(selectedDocument.id, "approved")}
                                    >
                                      <CheckCircle className="h-4 w-4 mr-2" /> Approve
                                    </Button>
                                  </div>
                                </div>
                              )}
                            </DialogContent>
                          </Dialog>
                        </div>
                      </TableCell>
                    </TableRow>
                  ))
                )}
              </TableBody>
            </Table>
          </div>
        )}
      </div>
    </DashboardLayout>
  );
};

export default AdminDashboard;

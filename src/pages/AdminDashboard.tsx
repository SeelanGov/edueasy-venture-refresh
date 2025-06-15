
import { useState } from "react";
import { DashboardLayout } from "@/components/DashboardLayout";
import { useDocumentsManagement, DocumentWithUserInfo } from "@/hooks/useDocumentsManagement";
import { Spinner } from "@/components/Spinner";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { 
  FileIcon, 
  ExternalLinkIcon, 
  CheckCircle, 
  XCircle, 
  AlertCircle,
  RefreshCw,
  BarChart,
  Shield
} from "lucide-react";
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
import { 
  Dialog, 
  DialogContent, 
  DialogHeader, 
  DialogTitle, 
  DialogTrigger,
  DialogFooter
} from "@/components/ui/dialog";
import { useAuth } from "@/hooks/useAuth";
import { AdminAuthGuard } from "@/components/AdminAuthGuard";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Pagination, PaginationContent, PaginationItem, PaginationLink, PaginationNext, PaginationPrevious } from "@/components/ui/pagination";
import { Link } from "react-router-dom";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { AdminActivityLog } from "@/components/admin/audit/AdminActivityLog";

const AdminDashboard = () => {
  const { user } = useAuth();
  const { documents, loading, updateDocumentStatus, getDocumentUrl, refreshDocuments, totalCount, pageSize, currentPage, setCurrentPage } = useDocumentsManagement();
  const [selectedDocument, setSelectedDocument] = useState<DocumentWithUserInfo | null>(null);
  const [tabValue, setTabValue] = useState("documents");
  const [rejectionReason, setRejectionReason] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const totalPages = Math.ceil(totalCount / pageSize);
  
  // Filter documents based on the selected tab
  const filteredDocuments = documents.filter(doc => {
    if (tabValue === "documents") return true;
    return doc.verification_status === tabValue;
  });

  const getStatusBadgeVariant = (status: string | null) => {
    switch (status) {
      case "approved":
        return "default";
      case "rejected":
        return "destructive";
      case "request_resubmission":
        return "outline";
      case "pending":
        return "secondary";
      default:
        return "secondary";
    }
  };

  const getStatusBadge = (status: string | null) => {
    let statusText = status ? status.charAt(0).toUpperCase() + status.slice(1) : "Unknown";
    if (status === "request_resubmission") statusText = "Needs Resubmission";
    
    const variant = getStatusBadgeVariant(status);
    
    return (
      <Badge variant={variant} className={status === "request_resubmission" ? "border-amber-500 text-amber-500" : ""}>
        {variant === "default" && <CheckCircle className="h-3 w-3 mr-1" />}
        {variant === "destructive" && <XCircle className="h-3 w-3 mr-1" />}
        {variant === "secondary" && <AlertCircle className="h-3 w-3 mr-1" />}
        {status === "request_resubmission" && <RefreshCw className="h-3 w-3 mr-1" />}
        {statusText}
      </Badge>
    );
  };

  const handleViewDocument = async (doc: DocumentWithUserInfo) => {
    setSelectedDocument(doc);
    setRejectionReason(doc.rejection_reason || "");
  };

  const handleOpenDocument = async (filePath: string) => {
    const url = await getDocumentUrl(filePath);
    if (url) {
      window.open(url, "_blank");
    }
  };

  const handleUpdateStatus = async (id: string, status: string) => {
    setIsSubmitting(true);
    try {
      if (status === "rejected" || status === "request_resubmission") {
        await updateDocumentStatus(id, status, rejectionReason);
      } else {
        await updateDocumentStatus(id, status);
      }
      setSelectedDocument(null);
      setRejectionReason("");
    } finally {
      setIsSubmitting(false);
    }
  };

  const handlePageChange = (page: number) => {
    if (page < 1 || page > totalPages) return;
    setCurrentPage(page);
  };

  return (
    <AdminAuthGuard>
      <DashboardLayout>
        <div className="container mx-auto max-w-7xl py-8 px-4">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
            <Link to="/admin/analytics">
              <Card className="hover:shadow-md transition-shadow">
                <CardHeader className="pb-2">
                  <CardTitle className="text-lg">Analytics Dashboard</CardTitle>
                  <CardDescription>View document verification analytics</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="flex justify-between items-center">
                    <span className="text-sm text-muted-foreground">View metrics and reports</span>
                    <BarChart className="h-6 w-6 text-primary" />
                  </div>
                </CardContent>
              </Card>
            </Link>
            
            {/* Additional admin cards can be added here */}
          </div>
          
          <div className="flex justify-between items-center mb-6">
            <h1 className="text-2xl font-bold">Admin Dashboard</h1>
            <Button onClick={refreshDocuments} variant="outline" size="sm">
              Refresh
            </Button>
          </div>

          <Tabs defaultValue="documents" value={tabValue} onValueChange={setTabValue} className="mb-6">
            <TabsList>
              <TabsTrigger value="documents">Document Verification</TabsTrigger>
              <TabsTrigger value="audit">Admin Activity Log</TabsTrigger>
            </TabsList>

            <TabsContent value="documents" className="mt-6">
              <Tabs defaultValue="all" className="mb-6">
                <TabsList>
                  <TabsTrigger value="all">All Documents</TabsTrigger>
                  <TabsTrigger value="pending">Pending</TabsTrigger>
                  <TabsTrigger value="approved">Approved</TabsTrigger>
                  <TabsTrigger value="rejected">Rejected</TabsTrigger>
                  <TabsTrigger value="request_resubmission">Need Resubmission</TabsTrigger>
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
                              {doc.rejection_reason && (
                                <div className="text-xs text-gray-500 mt-1 truncate max-w-[200px]" title={doc.rejection_reason}>
                                  Reason: {doc.rejection_reason}
                                </div>
                              )}
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
                                  <DialogContent className="max-w-md">
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
                                        
                                        <div className="space-y-2">
                                          <Label htmlFor="rejection-reason">Reason (for rejection or resubmission request)</Label>
                                          <Textarea
                                            id="rejection-reason"
                                            placeholder="Enter a reason for rejection or resubmission request..."
                                            value={rejectionReason}
                                            onChange={(e) => setRejectionReason(e.target.value)}
                                            rows={3}
                                          />
                                        </div>
                                        
                                        <div className="grid grid-cols-3 gap-2 pt-4 border-t">
                                          <Button
                                            variant="destructive"
                                            disabled={isSubmitting}
                                            onClick={() => handleUpdateStatus(selectedDocument.id, "rejected")}
                                            className="w-full"
                                          >
                                            <XCircle className="h-4 w-4 mr-2" /> Reject
                                          </Button>
                                          
                                          <Button
                                            variant="outline"
                                            disabled={isSubmitting}
                                            className="w-full border-amber-500 text-amber-700 hover:bg-amber-50"
                                            onClick={() => handleUpdateStatus(selectedDocument.id, "request_resubmission")}
                                          >
                                            <RefreshCw className="h-4 w-4 mr-2" /> Request Resubmission
                                          </Button>
                                          
                                          <Button
                                            variant="default"
                                            disabled={isSubmitting}
                                            className="w-full bg-green-600 hover:bg-green-700"
                                            onClick={() => handleUpdateStatus(selectedDocument.id, "approved")}
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
                  
                  {totalPages > 1 && (
                    <div className="py-4 flex justify-center">
                      <Pagination>
                        <PaginationContent>
                          <PaginationItem>
                            <PaginationPrevious 
                              onClick={() => handlePageChange(currentPage - 1)}
                              className={currentPage <= 1 ? "pointer-events-none opacity-50" : "cursor-pointer"}
                            />
                          </PaginationItem>
                          
                          {Array.from({ length: Math.min(5, totalPages) }, (_, i) => {
                            const pageNum = currentPage <= 3 
                              ? i + 1 
                              : currentPage >= totalPages - 2 
                                ? totalPages - 4 + i 
                                : currentPage - 2 + i;
                            
                            if (pageNum <= 0 || pageNum > totalPages) return null;
                            
                            return (
                              <PaginationItem key={pageNum}>
                                <PaginationLink 
                                  isActive={pageNum === currentPage}
                                  onClick={() => handlePageChange(pageNum)}
                                >
                                  {pageNum}
                                </PaginationLink>
                              </PaginationItem>
                            );
                          })}
                          
                          <PaginationItem>
                            <PaginationNext 
                              onClick={() => handlePageChange(currentPage + 1)}
                              className={currentPage >= totalPages ? "pointer-events-none opacity-50" : "cursor-pointer"}
                            />
                          </PaginationItem>
                        </PaginationContent>
                      </Pagination>
                    </div>
                  )}
                </div>
              )}
            </TabsContent>

            <TabsContent value="audit" className="mt-6">
              <AdminActivityLog />
            </TabsContent>
          </Tabs>
        </div>
      </DashboardLayout>
    </AdminAuthGuard>
  );
};

export default AdminDashboard;

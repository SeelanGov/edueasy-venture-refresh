import { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/hooks/useAuth';
import { toast } from '@/hooks/use-toast';
import { 
  Users, 
  FileText, 
  AlertCircle, 
  CheckCircle, 
  XCircle,
  Eye,
  Download,
  MessageSquare,
  Check,
  X
} from 'lucide-react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { DocumentVerificationPanel } from '@/components/admin/dashboard/DocumentVerificationPanel';
import { UserManagementPanel } from '@/components/admin/dashboard/UserManagementPanel';
import { ApplicationListPanel } from '@/components/admin/dashboard/ApplicationListPanel';
import { makeUserMap } from '@/utils/admin/userLookup';
import { AdminDashboardStats } from "@/components/admin/dashboard/AdminDashboardStats";
import { useAdminDashboardData } from "@/hooks/useAdminDashboardData";

interface DatabaseUser {
  id: string;
  created_at: string;
  full_name: string | null;
  id_number: string | null;
  email: string | null;
  phone_number: string | null;
  contact_email: string | null;
  emergency_contact_name: string | null;
  emergency_contact_phone: string | null;
  profile_status: string | null;
  tracking_id: string | null;
  id_verified?: boolean | null; // <-- Fix: Add missing property
}

interface Document {
  id: string;
  user_id: string;
  file_path: string;
  document_type: string | null;
  verification_status: string | null;
  created_at: string;
  rejection_reason: string | null;
}

interface Application {
  id: string;
  user_id: string;
  university: string | null;
  program: string | null;
  status: string | null;
  created_at: string;
  grade12_results: string | null;
}

const AdminDashboard = () => {
  // Use custom hook
  const { users, documents, applications, loading, refreshData } = useAdminDashboardData();
  const [selectedDocument, setSelectedDocument] = useState<Document | null>(null);
  const [trackingIdSearch, setTrackingIdSearch] = useState('');
  const userMap = makeUserMap(users);

  // Counts for stats
  const verifiedUsersCount = users.filter(u => u.id_verified).length;
  const unverifiedUsersCount = users.filter(u => !u.id_verified).length;
  const pendingDocumentsCount = documents.filter(doc => doc.verification_status === 'pending').length;
  const totalApplicationsCount = applications.length;

  const updateDocumentStatus = async (documentId: string, status: string, rejectionReason?: string) => {
    try {
      const updateData: any = { verification_status: status };
      if (rejectionReason) {
        updateData.rejection_reason = rejectionReason;
      }

      const { error } = await supabase
        .from('documents')
        .update(updateData)
        .eq('id', documentId);

      if (error) throw error;

      toast({
        title: 'Success',
        description: `Document ${status} successfully`,
      });

      refreshData(); // Refresh data
    } catch (error) {
      console.error('Error updating document:', error);
      toast({
        title: 'Error',
        description: 'Failed to update document status',
        variant: 'destructive',
      });
    }
  };

  const getStatusBadge = (status: string | null) => {
    switch (status) {
      case 'approved':
        return <Badge className="bg-green-100 text-green-800">Approved</Badge>;
      case 'rejected':
        return <Badge className="bg-red-100 text-red-800">Rejected</Badge>;
      case 'pending':
      default:
        return <Badge className="bg-yellow-100 text-yellow-800">Pending</Badge>;
    }
  };

  const getPendingDocumentsCount = () => {
    return documents.filter(doc => doc.verification_status === 'pending').length;
  };

  const getCompletedProfilesCount = () => {
    return users.filter(user => user.profile_status === 'complete').length;
  };

  const getTotalApplicationsCount = () => {
    return applications.length;
  };

  const filteredUsers = users.filter((userRec) =>
    trackingIdSearch
      ? (userRec.tracking_id || '').toLowerCase().includes(trackingIdSearch.toLowerCase())
      : true
  );

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-lg">Loading admin dashboard...</div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold">Admin Dashboard</h1>
        <p className="text-gray-600 mt-2">Manage users, documents, and applications</p>
      </div>

      {/* Stats Cards */}
      <AdminDashboardStats
        totalUsers={users.length}
        verifiedUsers={verifiedUsersCount}
        unverifiedUsers={unverifiedUsersCount}
        pendingDocuments={pendingDocumentsCount}
        totalApplications={totalApplicationsCount}
      />

      {/* Main Content Tabs */}
      <Tabs defaultValue="documents" className="space-y-4">
        <TabsList>
          <TabsTrigger value="documents">Documents</TabsTrigger>
          <TabsTrigger value="users">Users</TabsTrigger>
          <TabsTrigger value="applications">Applications</TabsTrigger>
        </TabsList>

        <TabsContent value="documents" className="space-y-4">
          <DocumentVerificationPanel 
            documents={documents} 
            updateDocumentStatus={updateDocumentStatus}
            userMap={userMap}
          />
        </TabsContent>

        <TabsContent value="users" className="space-y-4">
          <UserManagementPanel 
            users={users}
            trackingIdSearch={trackingIdSearch}
            setTrackingIdSearch={setTrackingIdSearch}
            refreshUsers={refreshData}
          />
        </TabsContent>

        <TabsContent value="applications" className="space-y-4">
          <ApplicationListPanel applications={applications} userMap={userMap} />
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default AdminDashboard;

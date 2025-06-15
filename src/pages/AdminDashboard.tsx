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
  MessageSquare
} from 'lucide-react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';

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
  const { user } = useAuth();
  const [users, setUsers] = useState<DatabaseUser[]>([]);
  const [documents, setDocuments] = useState<Document[]>([]);
  const [applications, setApplications] = useState<Application[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedDocument, setSelectedDocument] = useState<Document | null>(null);
  const [trackingIdSearch, setTrackingIdSearch] = useState('');

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    setLoading(true);
    try {
      // Fetch users with tracking_id
      const { data: usersData, error: usersError } = await supabase
        .from('users')
        .select('*')
        .order('created_at', { ascending: false });

      if (usersError) throw usersError;
      setUsers(usersData as DatabaseUser[]);

      // Fetch documents
      const { data: documentsData, error: documentsError } = await supabase
        .from('documents')
        .select('*')
        .order('created_at', { ascending: false });

      if (documentsError) throw documentsError;
      setDocuments(documentsData as Document[]);

      // Fetch applications
      const { data: applicationsData, error: applicationsError } = await supabase
        .from('applications')
        .select('*')
        .order('created_at', { ascending: false });

      if (applicationsError) throw applicationsError;
      setApplications(applicationsData as Application[]);
    } catch (error) {
      console.error('Error fetching data:', error);
      toast({
        title: 'Error',
        description: 'Failed to load admin dashboard data',
        variant: 'destructive',
      });
    } finally {
      setLoading(false);
    }
  };

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

      fetchData(); // Refresh data
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
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Users</CardTitle>
            <Users className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{users.length}</div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Pending Documents</CardTitle>
            <AlertCircle className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{getPendingDocumentsCount()}</div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Completed Profiles</CardTitle>
            <CheckCircle className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{getCompletedProfilesCount()}</div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Applications</CardTitle>
            <FileText className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{getTotalApplicationsCount()}</div>
          </CardContent>
        </Card>
      </div>

      {/* Main Content Tabs */}
      <Tabs defaultValue="documents" className="space-y-4">
        <TabsList>
          <TabsTrigger value="documents">Documents</TabsTrigger>
          <TabsTrigger value="users">Users</TabsTrigger>
          <TabsTrigger value="applications">Applications</TabsTrigger>
        </TabsList>

        <TabsContent value="documents" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Document Verification</CardTitle>
              <CardDescription>Review and verify uploaded documents</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {documents.map((doc) => (
                  <div key={doc.id} className="flex items-center justify-between p-4 border rounded-lg">
                    <div className="flex-1">
                      <p className="font-medium">{doc.document_type || 'Unknown Type'}</p>
                      <p className="text-sm text-gray-600">User: {doc.user_id}</p>
                      <p className="text-sm text-gray-600">
                        Uploaded: {new Date(doc.created_at).toLocaleDateString()}
                      </p>
                    </div>
                    <div className="flex items-center space-x-2">
                      {getStatusBadge(doc.verification_status)}
                      {doc.verification_status === 'pending' && (
                        <div className="flex space-x-2">
                          <Button
                            size="sm"
                            onClick={() => updateDocumentStatus(doc.id, 'approved')}
                            className="bg-green-600 hover:bg-green-700"
                          >
                            <CheckCircle className="h-4 w-4 mr-1" />
                            Approve
                          </Button>
                          <Button
                            size="sm"
                            variant="destructive"
                            onClick={() => updateDocumentStatus(doc.id, 'rejected', 'Document unclear')}
                          >
                            <XCircle className="h-4 w-4 mr-1" />
                            Reject
                          </Button>
                        </div>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="users" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>User Management</CardTitle>
              <CardDescription>View and manage registered users (search by tracking ID)</CardDescription>
              <div className="mt-4">
                <input
                  type="text"
                  placeholder="Search Tracking ID..."
                  value={trackingIdSearch}
                  onChange={e => setTrackingIdSearch(e.target.value)}
                  className="input input-bordered px-3 py-2 border rounded w-72"
                />
              </div>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {filteredUsers.map((userData) => (
                  <div key={userData.id} className="flex items-center justify-between p-4 border rounded-lg">
                    <div className="flex-1">
                      <p className="font-medium">Tracking ID: <span className="text-blue-700 font-mono">{userData.tracking_id || "N/A"}</span></p>
                      <p className="text-sm text-gray-600">{userData.full_name || 'No name provided'}</p>
                      <p className="text-sm text-gray-600">{userData.email || userData.contact_email}</p>
                      <p className="text-xs text-gray-400">User UUID: {userData.id}</p>
                      <p className="text-sm text-gray-600">
                        Registered: {new Date(userData.created_at).toLocaleDateString()}
                      </p>
                    </div>
                    <div className="flex flex-col items-end gap-1">
                      <Badge variant={userData.profile_status === 'complete' ? 'default' : 'secondary'}>
                        {userData.profile_status || 'incomplete'}
                      </Badge>
                      <Badge variant={userData.id_verified ? 'default' : 'secondary'} className={userData.id_verified ? 'bg-green-200 text-green-800' : 'bg-yellow-100 text-yellow-800'}>
                        {userData.id_verified ? 'Verified' : 'Unverified'}
                      </Badge>
                    </div>
                  </div>
                ))}
                {filteredUsers.length === 0 && (
                  <div className="py-6 text-center text-gray-500">No users found for this tracking ID.</div>
                )}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="applications" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Applications</CardTitle>
              <CardDescription>Review submitted applications</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {applications.map((app) => (
                  <div key={app.id} className="flex items-center justify-between p-4 border rounded-lg">
                    <div className="flex-1">
                      <p className="font-medium">{app.university || 'University not specified'}</p>
                      <p className="text-sm text-gray-600">Program: {app.program || 'Not specified'}</p>
                      <p className="text-sm text-gray-600">User: {app.user_id}</p>
                      <p className="text-sm text-gray-600">
                        Submitted: {new Date(app.created_at).toLocaleDateString()}
                      </p>
                    </div>
                    <div className="flex items-center space-x-2">
                      {getStatusBadge(app.status)}
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default AdminDashboard;

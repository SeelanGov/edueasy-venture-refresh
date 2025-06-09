import { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { 
  Users, 
  FileText, 
  CheckCircle, 
  XCircle, 
  Clock, 
  TrendingUp,
  DollarSign,
  School,
  BarChart3,
  Settings,
  UserCheck,
  AlertTriangle,
  Calendar,
  Download,
  Filter,
  Search,
  RefreshCw,
  Eye,
  Edit,
  Trash2,
  Plus,
  Mail,
  Phone,
  MapPin,
  GraduationCap,
  BookOpen,
  Award,
  Target,
  Activity,
  PieChart,
  LineChart,
  Database
} from 'lucide-react';
import { useAuth } from '@/hooks/useAuth';
import { supabase } from '@/integrations/supabase/client';
import { AdminAuthGuard } from '@/components/AdminAuthGuard';
import { DashboardLayout } from '@/components/DashboardLayout';
import { Spinner } from '@/components/Spinner';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { DataTable } from '@/components/ui/data-table';
import { ColumnDef } from '@tanstack/react-table';
import { format } from 'date-fns';
import { toast } from '@/components/ui/use-toast';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { useNavigate } from 'react-router-dom';

// Define types for our data
interface User {
  id: string;
  email: string;
  full_name: string;
  created_at: string;
  last_sign_in_at: string | null;
  status: 'active' | 'pending' | 'suspended';
}

interface Application {
  id: string;
  user_id: string;
  institution_id: string;
  program_id: string;
  status: 'draft' | 'submitted' | 'under_review' | 'approved' | 'rejected';
  created_at: string;
  updated_at: string;
  user_email?: string;
  user_name?: string;
  institution_name?: string;
  program_name?: string;
}

interface Document {
  id: string;
  application_id: string;
  document_type: string;
  verification_status: 'pending' | 'approved' | 'rejected' | 'request_resubmission';
  created_at: string;
  user_name?: string;
  user_email?: string;
}

interface AdminDashboardStats {
  totalUsers: number;
  activeUsers: number;
  totalApplications: number;
  pendingApplications: number;
  approvedApplications: number;
  rejectedApplications: number;
  documentsAwaitingVerification: number;
  recentSignups: number;
}

const AdminDashboard = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [stats, setStats] = useState<AdminDashboardStats>({
    totalUsers: 0,
    activeUsers: 0,
    totalApplications: 0,
    pendingApplications: 0,
    approvedApplications: 0,
    rejectedApplications: 0,
    documentsAwaitingVerification: 0,
    recentSignups: 0,
  });
  const [users, setUsers] = useState<User[]>([]);
  const [applications, setApplications] = useState<Application[]>([]);
  const [documents, setDocuments] = useState<Document[]>([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');

  useEffect(() => {
    const fetchDashboardData = async () => {
      setLoading(true);
      try {
        // Fetch users
        const { data: userData, error: userError } = await supabase
          .from('users')
          .select('*')
          .order('created_at', { ascending: false });

        if (userError) throw userError;
        setUsers(userData || []);

        // Fetch applications with joins
        const { data: appData, error: appError } = await supabase
          .from('applications')
          .select(`
            *,
            users:user_id (email, full_name),
            institutions:institution_id (name),
            programs:program_id (name)
          `)
          .order('created_at', { ascending: false });

        if (appError) throw appError;
        
        // Transform the joined data
        const transformedApps = (appData || []).map((app: any) => ({
          ...app,
          user_email: app.users?.email,
          user_name: app.users?.full_name,
          institution_name: app.institutions?.name,
          program_name: app.programs?.name
        }));
        
        setApplications(transformedApps);

        // Fetch documents with joins
        const { data: docData, error: docError } = await supabase
          .from('documents')
          .select(`
            *,
            applications!inner (
              user_id,
              users:user_id (email, full_name)
            )
          `)
          .order('created_at', { ascending: false });

        if (docError) throw docError;
        
        // Transform the joined data
        const transformedDocs = (docData || []).map((doc: any) => ({
          ...doc,
          user_name: doc.applications?.users?.full_name,
          user_email: doc.applications?.users?.email
        }));
        
        setDocuments(transformedDocs);

        // Calculate stats
        const activeUsers = userData?.filter(u => u.last_sign_in_at !== null).length || 0;
        const pendingApps = transformedApps.filter(a => a.status === 'submitted' || a.status === 'under_review').length;
        const approvedApps = transformedApps.filter(a => a.status === 'approved').length;
        const rejectedApps = transformedApps.filter(a => a.status === 'rejected').length;
        const pendingDocs = transformedDocs.filter(d => d.verification_status === 'pending').length;
        
        // Get recent signups (last 7 days)
        const sevenDaysAgo = new Date();
        sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 7);
        const recentSignups = userData?.filter(u => 
          new Date(u.created_at) > sevenDaysAgo
        ).length || 0;

        setStats({
          totalUsers: userData?.length || 0,
          activeUsers,
          totalApplications: transformedApps.length,
          pendingApplications: pendingApps,
          approvedApplications: approvedApps,
          rejectedApplications: rejectedApps,
          documentsAwaitingVerification: pendingDocs,
          recentSignups
        });

      } catch (error) {
        console.error('Error fetching admin dashboard data:', error);
        toast({
          title: 'Error',
          description: 'Failed to load dashboard data',
          variant: 'destructive',
        });
      } finally {
        setLoading(false);
      }
    };

    fetchDashboardData();
  }, []);

  // Filter applications based on search and status
  const filteredApplications = applications.filter(app => {
    const matchesSearch = 
      app.user_name?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      app.user_email?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      app.institution_name?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      app.program_name?.toLowerCase().includes(searchQuery.toLowerCase());
    
    const matchesStatus = statusFilter === 'all' || app.status === statusFilter;
    
    return matchesSearch && matchesStatus;
  });

  // Define columns for applications table
  const applicationColumns: ColumnDef<Application>[] = [
    {
      accessorKey: 'user_name',
      header: 'Applicant',
      cell: ({ row }) => (
        <div>
          <div className="font-medium">{row.original.user_name || 'Unknown'}</div>
          <div className="text-sm text-gray-500">{row.original.user_email}</div>
        </div>
      ),
    },
    {
      accessorKey: 'institution_name',
      header: 'Institution',
      cell: ({ row }) => (
        <div>
          <div>{row.original.institution_name || 'Unknown'}</div>
          <div className="text-sm text-gray-500">{row.original.program_name}</div>
        </div>
      ),
    },
    {
      accessorKey: 'status',
      header: 'Status',
      cell: ({ row }) => {
        const status = row.original.status;
        let badgeVariant: 'default' | 'secondary' | 'destructive' | 'outline' = 'outline';
        let icon = null;
        
        switch (status) {
          case 'draft':
            badgeVariant = 'outline';
            icon = <Clock className="h-3 w-3 mr-1" />;
            break;
          case 'submitted':
            badgeVariant = 'secondary';
            icon = <FileText className="h-3 w-3 mr-1" />;
            break;
          case 'under_review':
            badgeVariant = 'secondary';
            icon = <Eye className="h-3 w-3 mr-1" />;
            break;
          case 'approved':
            badgeVariant = 'default';
            icon = <CheckCircle className="h-3 w-3 mr-1" />;
            break;
          case 'rejected':
            badgeVariant = 'destructive';
            icon = <XCircle className="h-3 w-3 mr-1" />;
            break;
        }
        
        return (
          <Badge variant={badgeVariant} className="flex items-center capitalize">
            {icon}
            {status.replace('_', ' ')}
          </Badge>
        );
      },
    },
    {
      accessorKey: 'created_at',
      header: 'Date',
      cell: ({ row }) => format(new Date(row.original.created_at), 'MMM d, yyyy'),
    },
    {
      id: 'actions',
      cell: ({ row }) => (
        <div className="flex space-x-2">
          <Button 
            variant="ghost" 
            size="sm"
            onClick={() => navigate(`/admin/applications/${row.original.id}`)}
          >
            <Eye className="h-4 w-4" />
          </Button>
          <Button 
            variant="ghost" 
            size="sm"
            onClick={() => navigate(`/admin/applications/${row.original.id}/edit`)}
          >
            <Edit className="h-4 w-4" />
          </Button>
        </div>
      ),
    },
  ];

  // Define columns for documents table
  const documentColumns: ColumnDef<Document>[] = [
    {
      accessorKey: 'user_name',
      header: 'Submitted By',
      cell: ({ row }) => (
        <div>
          <div className="font-medium">{row.original.user_name || 'Unknown'}</div>
          <div className="text-sm text-gray-500">{row.original.user_email}</div>
        </div>
      ),
    },
    {
      accessorKey: 'document_type',
      header: 'Document Type',
      cell: ({ row }) => row.original.document_type || 'Unknown',
    },
    {
      accessorKey: 'verification_status',
      header: 'Status',
      cell: ({ row }) => {
        const status = row.original.verification_status;
        let badgeVariant: 'default' | 'secondary' | 'destructive' | 'outline' = 'outline';
        let icon = null;
        
        switch (status) {
          case 'pending':
            badgeVariant = 'secondary';
            icon = <Clock className="h-3 w-3 mr-1" />;
            break;
          case 'approved':
            badgeVariant = 'default';
            icon = <CheckCircle className="h-3 w-3 mr-1" />;
            break;
          case 'rejected':
            badgeVariant = 'destructive';
            icon = <XCircle className="h-3 w-3 mr-1" />;
            break;
          case 'request_resubmission':
            badgeVariant = 'outline';
            icon = <RefreshCw className="h-3 w-3 mr-1" />;
            break;
        }
        
        return (
          <Badge variant={badgeVariant} className="flex items-center capitalize">
            {icon}
            {status.replace('_', ' ')}
          </Badge>
        );
      },
    },
    {
      accessorKey: 'created_at',
      header: 'Submitted',
      cell: ({ row }) => format(new Date(row.original.created_at), 'MMM d, yyyy'),
    },
    {
      id: 'actions',
      cell: ({ row }) => (
        <div className="flex space-x-2">
          <Button 
            variant="ghost" 
            size="sm"
            onClick={() => navigate(`/admin/documents/${row.original.id}`)}
          >
            <Eye className="h-4 w-4" />
          </Button>
          <Dialog>
            <DialogTrigger asChild>
              <Button variant="ghost" size="sm">
                <CheckCircle className="h-4 w-4" />
              </Button>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>Verify Document</DialogTitle>
                <DialogDescription>
                  Are you sure you want to verify this document?
                </DialogDescription>
              </DialogHeader>
              <DialogFooter>
                <Button variant="outline">Cancel</Button>
                <Button>Verify</Button>
              </DialogFooter>
            </DialogContent>
          </Dialog>
        </div>
      ),
    },
  ];

  return (
    <AdminAuthGuard>
      <DashboardLayout>
        <div className="container mx-auto p-6">
          <div className="flex justify-between items-center mb-6">
            <h1 className="text-3xl font-bold">Admin Dashboard</h1>
            <div className="flex space-x-2">
              <Button variant="outline" size="sm" onClick={() => navigate('/admin/settings')}>
                <Settings className="h-4 w-4 mr-2" />
                Settings
              </Button>
              <Button size="sm" onClick={() => navigate('/admin/users/new')}>
                <Plus className="h-4 w-4 mr-2" />
                Add User
              </Button>
            </div>
          </div>

          {loading ? (
            <div className="flex justify-center items-center h-64">
              <Spinner size="lg" />
              <p className="ml-4 text-lg text-gray-600">Loading dashboard data...</p>
            </div>
          ) : (
            <>
              {/* Stats Overview */}
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-6">
                <Card>
                  <CardHeader className="pb-2">
                    <CardTitle className="text-sm font-medium text-gray-500">Total Users</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="flex items-center">
                      <Users className="h-5 w-5 text-blue-500 mr-2" />
                      <div className="text-2xl font-bold">{stats.totalUsers}</div>
                    </div>
                    <p className="text-xs text-gray-500 mt-1">
                      {stats.activeUsers} active users
                    </p>
                  </CardContent>
                </Card>
                
                <Card>
                  <CardHeader className="pb-2">
                    <CardTitle className="text-sm font-medium text-gray-500">Applications</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="flex items-center">
                      <FileText className="h-5 w-5 text-green-500 mr-2" />
                      <div className="text-2xl font-bold">{stats.totalApplications}</div>
                    </div>
                    <p className="text-xs text-gray-500 mt-1">
                      {stats.pendingApplications} pending review
                    </p>
                  </CardContent>
                </Card>
                
                <Card>
                  <CardHeader className="pb-2">
                    <CardTitle className="text-sm font-medium text-gray-500">Documents</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="flex items-center">
                      <FileText className="h-5 w-5 text-amber-500 mr-2" />
                      <div className="text-2xl font-bold">{stats.documentsAwaitingVerification}</div>
                    </div>
                    <p className="text-xs text-gray-500 mt-1">
                      Awaiting verification
                    </p>
                  </CardContent>
                </Card>
                
                <Card>
                  <CardHeader className="pb-2">
                    <CardTitle className="text-sm font-medium text-gray-500">New Signups</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="flex items-center">
                      <UserCheck className="h-5 w-5 text-purple-500 mr-2" />
                      <div className="text-2xl font-bold">{stats.recentSignups}</div>
                    </div>
                    <p className="text-xs text-gray-500 mt-1">
                      In the last 7 days
                    </p>
                  </CardContent>
                </Card>
              </div>

              {/* Main Content Tabs */}
              <Tabs defaultValue="applications" className="w-full">
                <TabsList className="mb-4">
                  <TabsTrigger value="applications">Applications</TabsTrigger>
                  <TabsTrigger value="documents">Documents</TabsTrigger>
                  <TabsTrigger value="users">Users</TabsTrigger>
                  <TabsTrigger value="analytics">Analytics</TabsTrigger>
                </TabsList>
                
                <TabsContent value="applications">
                  <Card>
                    <CardHeader>
                      <CardTitle>Application Management</CardTitle>
                      <CardDescription>
                        Review and manage student applications
                      </CardDescription>
                      <div className="flex flex-col sm:flex-row gap-4 mt-4">
                        <div className="relative flex-1">
                          <Search className="absolute left-2 top-2.5 h-4 w-4 text-gray-500" />
                          <Input
                            placeholder="Search applications..."
                            className="pl-8"
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                          />
                        </div>
                        <Select
                          value={statusFilter}
                          onValueChange={setStatusFilter}
                        >
                          <SelectTrigger className="w-full sm:w-[180px]">
                            <SelectValue placeholder="Filter by status" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="all">All Statuses</SelectItem>
                            <SelectItem value="draft">Draft</SelectItem>
                            <SelectItem value="submitted">Submitted</SelectItem>
                            <SelectItem value="under_review">Under Review</SelectItem>
                            <SelectItem value="approved">Approved</SelectItem>
                            <SelectItem value="rejected">Rejected</SelectItem>
                          </SelectContent>
                        </Select>
                        <Button variant="outline" className="flex-shrink-0">
                          <Download className="h-4 w-4 mr-2" />
                          Export
                        </Button>
                      </div>
                    </CardHeader>
                    <CardContent>
                      <DataTable
                        columns={applicationColumns}
                        data={filteredApplications}
                        searchKey="user_name"
                      />
                    </CardContent>
                  </Card>
                </TabsContent>
                
                <TabsContent value="documents">
                  <Card>
                    <CardHeader>
                      <CardTitle>Document Verification</CardTitle>
                      <CardDescription>
                        Verify and manage submitted documents
                      </CardDescription>
                      <div className="flex flex-col sm:flex-row gap-4 mt-4">
                        <div className="relative flex-1">
                          <Search className="absolute left-2 top-2.5 h-4 w-4 text-gray-500" />
                          <Input
                            placeholder="Search documents..."
                            className="pl-8"
                          />
                        </div>
                        <Select defaultValue="pending">
                          <SelectTrigger className="w-full sm:w-[180px]">
                            <SelectValue placeholder="Filter by status" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="all">All Statuses</SelectItem>
                            <SelectItem value="pending">Pending</SelectItem>
                            <SelectItem value="approved">Approved</SelectItem>
                            <SelectItem value="rejected">Rejected</SelectItem>
                            <SelectItem value="request_resubmission">Needs Resubmission</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                    </CardHeader>
                    <CardContent>
                      <DataTable
                        columns={documentColumns}
                        data={documents}
                        searchKey="user_name"
                      />
                    </CardContent>
                  </Card>
                </TabsContent>
                
                <TabsContent value="users">
                  <Card>
                    <CardHeader>
                      <CardTitle>User Management</CardTitle>
                      <CardDescription>
                        Manage user accounts and permissions
                      </CardDescription>
                    </CardHeader>
                    <CardContent>
                      <p>User management interface will be implemented here.</p>
                    </CardContent>
                  </Card>
                </TabsContent>
                
                <TabsContent value="analytics">
                  <Card>
                    <CardHeader>
                      <CardTitle>Analytics Dashboard</CardTitle>
                      <CardDescription>
                        View application and user statistics
                      </CardDescription>
                    </CardHeader>
                    <CardContent>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <Card>
                          <CardHeader>
                            <CardTitle className="text-sm">Application Status Distribution</CardTitle>
                          </CardHeader>
                          <CardContent className="h-[300px] flex items-center justify-center">
                            <PieChart className="h-16 w-16 text-gray-300" />
                            <p className="text-gray-500 ml-4">Chart will be implemented here</p>
                          </CardContent>
                        </Card>
                        
                        <Card>
                          <CardHeader>
                            <CardTitle className="text-sm">User Registrations Over Time</CardTitle>
                          </CardHeader>
                          <CardContent className="h-[300px] flex items-center justify-center">
                            <LineChart className="h-16 w-16 text-gray-300" />
                            <p className="text-gray-500 ml-4">Chart will be implemented here</p>
                          </CardContent>
                        </Card>
                      </div>
                    </CardContent>
                  </Card>
                </TabsContent>
              </Tabs>
            </>
          )}
        </div>
      </DashboardLayout>
    </AdminAuthGuard>
  );
};

export default AdminDashboard;

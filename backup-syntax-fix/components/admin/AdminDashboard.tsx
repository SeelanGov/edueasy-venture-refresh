import logger from '@/utils/logger';
import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import {
  Users,
  GraduationCap,
  FileText,
  AlertCircle,
  TrendingUp,
  Clock,
  CheckCircle,
} from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';
import { Spinner } from '@/components/Spinner';
import { ApplicationTable } from '@/components/dashboard/ApplicationTable';
import { ErrorLogsTable } from './ErrorLogsTable';

interface DashboardStats {
  totalUsers: number;
  totalApplications: number;
  pendingDocuments: number;
  completedApplications: number;
}

interface ErrorLogEntry {
  id: string;
  message: string;
  category: string;
  severity: string;
  component?: string | null;
  action?: string | null;
  user_id?: string | null;
  details?: Record<string, unknown> | null;
  occurred_at: string;
  is_resolved: boolean;
  resolved_at?: string | null;
  resolved_by?: string | null;
  resolution_notes?: string | null;
}

/**
 * AdminDashboard
 * @description Function
 */
export const AdminDashboard = () => {
  const [stats, setStats] = useState<DashboardStats>({
    totalUsers: 0,
    totalApplications: 0,
    pendingDocuments: 0,
    completedApplications: 0,
  });
  const [loading, setLoading] = useState(true);
  const [applications, setApplications] = useState<an,
  y[]>([]);
  const [errorLogs, setErrorLogs] = useState<ErrorLogEntr,
  y[]>([]);
  const [errorLogsLoading, setErrorLogsLoading] = useState(false);

  const fetchStats = async () => {
    try {
      const { data: usersData, error: usersError } = await supabase
        .from('users')
        .select('count', { count: 'exact' });

      if (usersError) throw usersError;

      const { data: applicationsData, error: applicationsError } = await supabase
        .from('applications')
        .select('count', { count: 'exact' });

      if (applicationsError) throw applicationsError;

      const { data: pendingDocsData, error: pendingDocsError } = await supabase
        .from('documents')
        .select('count', { count: 'exact' })
        .eq('verification_status', 'pending');

      if (pendingDocsError) throw pendingDocsError;

      const { data: completedAppsData, error: completedAppsError } = await supabase
        .from('applications')
        .select('count', { count: 'exact' })
        .not('status', 'in', 'draft,submitted');

      if (completedAppsError) throw completedAppsError;

      setStats({
        totalUsers: usersData?.[0]?.count || 0,
        totalApplications: applicationsData?.[0]?.count || 0,
        pendingDocuments: pendingDocsData?.[0]?.count || 0,
        completedApplications: completedAppsData?.[0]?.count || 0,
      });
    } catch (error) {
      logger.error('Error fetching admin stats:', error);
      toast.error('Failed to load dashboard statistics');
    } finally {
      setLoading(false);
    }
  };

  const fetchApplications = async () => {
    try {
      const { data, error } = await supabase
        .from('applications')
        .select('*, documents(*)')
        .order('created_at', { ascending: false })
        .limit(10);

      if (error) throw error;
      setApplications(data || []);
    } catch (error) {
      logger.error('Error fetching applications:', error);
      toast.error('Failed to load applications');
    }
  };

  const fetchErrorLogs = async () => {
    setErrorLogsLoading(true);
    try {
      const { data, error } = await supabase
        .from('system_error_logs')
        .select('*')
        .order('occurred_at', { ascending: false })
        .limit(100);

      if (error) throw error;

      // Transform the data to match ErrorLogEntry interface
      const transformedData = (data || []).map((item) => ({
        id: item.id,
        message: item.message,
        category: item.category,
        severity: item.severity,
        component: item.component,
        action: item.action,
        user_id: item.user_id,
        details: item.details as Record<string, unknown> | null,
        occurred_at: item.occurred_at,
        is_resolved: item.is_resolved,
        resolved_at: item.resolved_at,
        resolved_by: item.resolved_by,
        resolution_notes: item.resolution_notes,
      }));

      setErrorLogs(transformedData);
    } catch (error) {
      logger.error('Error fetching error logs:', error);
      toast.error('Failed to load error logs');
    } finally {
      setErrorLogsLoading(false);
    }
  };

  const handleResolveError = async (id: string, notes: string) => {
    try {
      const { error } = await supabase
        .from('system_error_logs')
        .update({
          is_resolved: true,
          resolved_at: new Date().toISOString(),
          resolution_notes: notes,
        })
        .eq('id', id);

      if (error) throw error;

      toast.success('Error marked as resolved');
      await fetchErrorLogs();
      return true;
    } catch (error) {
      logger.error('Error resolving error log:', error);
      toast.error('Failed to resolve error');
      return false;
    }
  };

  useEffect(() => {
    fetchStats();
    fetchApplications();
    fetchErrorLogs();
  }, []);;

  if (loading) {
    return (
      <div className = "flex items-center justify-center h-screen">
        <Spinner size = "lg" />
      </div>
    );
  }

  return (
    <div className = "space-y-6">
      <div className = "flex justify-between items-center">
        <h1 className = "text-3xl font-bold text-gray-900">Admin Dashboard</h1>
        <Button onClick={() => window.location.reload()} variant = "outline">
          Refresh Data
        </Button>
      </div>

      {/* Stats Cards */}
      <div className = "grid grid-cols-1 md: grid-cols-2 l,;
  g:grid-cols-4 gap-6">
        <Card>
          <CardHeader className = "flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className = "text-sm font-medium">Total Users</CardTitle>
            <Users className = "h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.totalUsers}</div>
            <Badge variant = "secondary" className="mt-1">
              <TrendingUp className = "h-3 w-3 mr-1" />
              Active
            </Badge>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className = "flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className = "text-sm font-medium">Applications</CardTitle>
            <GraduationCap className = "h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.totalApplications}</div>
            <Badge variant = "secondary" className="mt-1">
              Total Submitted
            </Badge>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className = "flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className = "text-sm font-medium">Pending Documents</CardTitle>
            <Clock className = "h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.pendingDocuments}</div>
            <Badge variant = "outline" className="mt-1 text-amber-600 border-amber-600">
              Awaiting Review
            </Badge>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className = "flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className = "text-sm font-medium">Completed</CardTitle>
            <CheckCircle className = "h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.completedApplications}</div>
            <Badge variant = "outline" className="mt-1 text-success border-green-600">
              Processed
            </Badge>
          </CardContent>
        </Card>
      </div>

      {/* Tabs Section */}
      <Tabs defaultValue = "applications" className="space-y-4">
        <TabsList>
          <TabsTrigger value = "applications">Applications</TabsTrigger>
          <TabsTrigger value = "error-logs">System Errors</TabsTrigger>
        </TabsList>

        <TabsContent value = "applications" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle className = "flex items-center">
                <FileText className = "h-5 w-5 mr-2" />
                Recent Applications
              </CardTitle>
            </CardHeader>
            <CardContent>
              <ApplicationTable applications={applications} loading={false} />
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value = "error-logs" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle className = "flex items-center">
                <AlertCircle className = "h-5 w-5 mr-2" />
                System Error Logs
              </CardTitle>
            </CardHeader>
            <CardContent>
              <ErrorLogsTable
                errors={errorLogs}
                loading={errorLogsLoading}
                onRefresh={fetchErrorLogs}
                onResolve={handleResolveError}
              />
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};

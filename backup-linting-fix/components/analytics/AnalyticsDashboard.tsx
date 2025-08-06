import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { DollarSign, Download, FileText, RefreshCw, Target, Users } from '@/components/ui/icons';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { SkeletonButton, SkeletonDashboardCard } from '@/components/ui/Skeleton';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { toast } from '@/components/ui/use-toast';
import { useAuth } from '@/hooks/useAuth';
import {
  analyticsService,
  type ApplicationAnalytics,
  type RevenueAnalytics,
  type UserAnalytics,
} from '@/services/AnalyticsService';
import { memo, useEffect, useState } from 'react';

interface AnalyticsDashboardProps {
  className?: string;
}

const AnalyticsDashboard = memo<AnalyticsDashboardProps>(({ className }) => {
  const { user } = useAuth();
  const [activeTab, setActiveTab] = useState('overview');
  const [timeRange, setTimeRange] = useState('30d');
  const [loading, setLoading] = useState(true);
  const [userAnalytics, setUserAnalytics] = useState<UserAnalytics | null>(null);
  const [applicationAnalytics, setApplicationAnalytics] = useState<ApplicationAnalytics | null>(
    null,
  );
  const [revenueAnalytics, setRevenueAnalytics] = useState<RevenueAnalytics | null>(null);

  useEffect(() => {
    if (user) {
      analyticsService.setUserId(user.id);
      loadAnalytics();
    }
  }, [user, timeRange]);

  const loadAnalytics = async () => {
    setLoading(true);
    try {
      const [userData, appData, revenueData] = await Promise.all([
        analyticsService.getUserAnalytics(user?.id || ''),
        analyticsService.getApplicationAnalytics(),
        analyticsService.getRevenueAnalytics(),
      ]);

      setUserAnalytics(userData);
      setApplicationAnalytics(appData);
      setRevenueAnalytics(revenueData);
    } catch (error) {
      console.error('Failed to load analytics:', error);
      toast({
        title: 'Analytics Error',
        description: 'Failed to load analytics data. Please try again.',
        variant: 'destructive',
      });
    } finally {
      setLoading(false);
    }
  };

  const handleExportReport = async (reportType: string) => {
    try {
      const report = await analyticsService.generateReport(
        reportType as 'user' | 'application' | 'revenue',
        { timeRange },
      );

      if (report) {
        // Create and download CSV
        const csvContent = convertToCSV(report);
        downloadCSV(csvContent, `${reportType}_analytics_${timeRange}.csv`);

        toast({
          title: 'Report Exported',
          description: `${reportType} analytics report has been downloaded.`,
        });
      }
    } catch (error) {
      console.error('Failed to export report:', error);
      toast({
        title: 'Export Error',
        description: 'Failed to export analytics report.',
        variant: 'destructive',
      });
    }
  };

  const convertToCSV = (data: unknown[]): string => {
    if (!data || data.length === 0) return '';

    const headers = Object.keys(data[0]);
    const csvRows = [
      headers.join(','),
      ...data.map((row) => headers.map((header) => JSON.stringify(row[header])).join(',')),
    ];

    return csvRows.join('\n');
  };

  const downloadCSV = (content: string, filename: string) => {
    const blob = new Blob([content], { type: 'text/csv' });
    const url = window.URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = filename;
    link.click();
    window.URL.revokeObjectURL(url);
  };

  const formatNumber = (num: number): string => {
    return new Intl.NumberFormat().format(num);
  };

  const formatCurrency = (amount: number): string => {
    return new Intl.NumberFormat('en-ZA', {
      style: 'currency',
      currency: 'ZAR',
    }).format(amount);
  };

  const formatPercentage = (value: number): string => {
    return `${(value * 100).toFixed(1)}%`;
  };

  if (loading) {
    return (
      <div className={`space-y-6 ${className}`}>
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold">Analytics Dashboard</h1>
            <p className="text-gray-600">Track your platform performance and insights</p>
          </div>
          <SkeletonButton />
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {Array.from({ length: 4 }).map((_, i) => (
            <SkeletonDashboardCard key={i} />
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className={`space-y-6 ${className}`}>
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">Analytics Dashboard</h1>
          <p className="text-gray-600">Track your platform performance and insights</p>
        </div>
        <div className="flex items-center space-x-3">
          <Select value={timeRange} onValueChange={setTimeRange}>
            <SelectTrigger className="w-32">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="7d">Last 7 days</SelectItem>
              <SelectItem value="30d">Last 30 days</SelectItem>
              <SelectItem value="90d">Last 90 days</SelectItem>
              <SelectItem value="1y">Last year</SelectItem>
            </SelectContent>
          </Select>
          <Button onClick={loadAnalytics} variant="outline" size="sm">
            <RefreshCw className="h-4 w-4 mr-2" />
            Refresh
          </Button>
        </div>
      </div>

      {/* Overview Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Users</CardTitle>
            <Users className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {formatNumber(userAnalytics?.total_sessions || 0)}
            </div>
            <p className="text-xs text-muted-foreground">
              {formatNumber(userAnalytics?.total_page_views || 0)} page views
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Applications</CardTitle>
            <FileText className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {formatNumber(applicationAnalytics?.total_applications || 0)}
            </div>
            <p className="text-xs text-muted-foreground">
              {formatPercentage(applicationAnalytics?.conversion_funnel?.submitted || 0)} success
              rate
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Revenue</CardTitle>
            <DollarSign className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {formatCurrency(revenueAnalytics?.total_revenue || 0)}
            </div>
            <p className="text-xs text-muted-foreground">
              {formatCurrency(revenueAnalytics?.average_order_value || 0)} avg order
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Conversion Rate</CardTitle>
            <Target className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {formatPercentage(userAnalytics?.conversion_rate || 0)}
            </div>
            <p className="text-xs text-muted-foreground">
              {formatNumber(userAnalytics?.applications_submitted || 0)} submissions
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Detailed Analytics Tabs */}
      <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="overview">Overview</TabsTrigger>
          <TabsTrigger value="users">Users</TabsTrigger>
          <TabsTrigger value="applications">Applications</TabsTrigger>
          <TabsTrigger value="revenue">Revenue</TabsTrigger>
        </TabsList>

        <TabsContent value="overview" className="space-y-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <Card>
              <CardHeader>
                <CardTitle>User Engagement</CardTitle>
                <CardDescription>User activity and engagement metrics</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <span>Active Sessions</span>
                    <Badge variant="secondary">
                      {formatNumber(userAnalytics?.total_sessions || 0)}
                    </Badge>
                  </div>
                  <div className="flex items-center justify-between">
                    <span>Page Views</span>
                    <Badge variant="secondary">
                      {formatNumber(userAnalytics?.total_page_views || 0)}
                    </Badge>
                  </div>
                  <div className="flex items-center justify-between">
                    <span>Features Used</span>
                    <Badge variant="secondary">{userAnalytics?.features_used?.length || 0}</Badge>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Application Funnel</CardTitle>
                <CardDescription>Application completion stages</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {applicationAnalytics?.conversion_funnel &&
                    Object.entries(applicationAnalytics.conversion_funnel).map(([stage, count]) => (
                      <div key={stage} className="flex items-center justify-between">
                        <span className="capitalize">{stage.replace('_', ' ')}</span>
                        <Badge variant="secondary">{formatNumber(count)}</Badge>
                      </div>
                    ))}
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="users" className="space-y-6">
          <Card>
            <CardHeader>
              <div className="flex items-center justify-between">
                <div>
                  <CardTitle>User Analytics</CardTitle>
                  <CardDescription>Detailed user behavior and metrics</CardDescription>
                </div>
                <Button onClick={() => handleExportReport('user')} variant="outline" size="sm">
                  <Download className="h-4 w-4 mr-2" />
                  Export
                </Button>
              </div>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                <div className="space-y-2">
                  <h4 className="font-medium">Session Metrics</h4>
                  <div className="text-2xl font-bold">
                    {formatNumber(userAnalytics?.total_sessions || 0)}
                  </div>
                  <p className="text-sm text-gray-600">Total sessions</p>
                </div>
                <div className="space-y-2">
                  <h4 className="font-medium">Page Views</h4>
                  <div className="text-2xl font-bold">
                    {formatNumber(userAnalytics?.total_page_views || 0)}
                  </div>
                  <p className="text-sm text-gray-600">Total page views</p>
                </div>
                <div className="space-y-2">
                  <h4 className="font-medium">Conversion Rate</h4>
                  <div className="text-2xl font-bold">
                    {formatPercentage(userAnalytics?.conversion_rate || 0)}
                  </div>
                  <p className="text-sm text-gray-600">Overall conversion</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="applications" className="space-y-6">
          <Card>
            <CardHeader>
              <div className="flex items-center justify-between">
                <div>
                  <CardTitle>Application Analytics</CardTitle>
                  <CardDescription>Application submission and completion metrics</CardDescription>
                </div>
                <Button
                  onClick={() => handleExportReport('application')}
                  variant="outline"
                  size="sm"
                >
                  <Download className="h-4 w-4 mr-2" />
                  Export
                </Button>
              </div>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                <div className="space-y-2">
                  <h4 className="font-medium">Total Applications</h4>
                  <div className="text-2xl font-bold">
                    {formatNumber(applicationAnalytics?.total_applications || 0)}
                  </div>
                  <p className="text-sm text-gray-600">All time</p>
                </div>
                <div className="space-y-2">
                  <h4 className="font-medium">Avg Completion Time</h4>
                  <div className="text-2xl font-bold">
                    {Math.round(applicationAnalytics?.average_completion_time || 0)}m
                  </div>
                  <p className="text-sm text-gray-600">Minutes per application</p>
                </div>
                <div className="space-y-2">
                  <h4 className="font-medium">Success Rate</h4>
                  <div className="text-2xl font-bold">
                    {formatPercentage(
                      (applicationAnalytics?.conversion_funnel?.submitted || 0) /
                        (applicationAnalytics?.conversion_funnel?.started || 1),
                    )}
                  </div>
                  <p className="text-sm text-gray-600">Completed applications</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="revenue" className="space-y-6">
          <Card>
            <CardHeader>
              <div className="flex items-center justify-between">
                <div>
                  <CardTitle>Revenue Analytics</CardTitle>
                  <CardDescription>Revenue and payment metrics</CardDescription>
                </div>
                <Button onClick={() => handleExportReport('revenue')} variant="outline" size="sm">
                  <Download className="h-4 w-4 mr-2" />
                  Export
                </Button>
              </div>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                <div className="space-y-2">
                  <h4 className="font-medium">Total Revenue</h4>
                  <div className="text-2xl font-bold">
                    {formatCurrency(revenueAnalytics?.total_revenue || 0)}
                  </div>
                  <p className="text-sm text-gray-600">All time</p>
                </div>
                <div className="space-y-2">
                  <h4 className="font-medium">Avg Order Value</h4>
                  <div className="text-2xl font-bold">
                    {formatCurrency(revenueAnalytics?.average_order_value || 0)}
                  </div>
                  <p className="text-sm text-gray-600">Per transaction</p>
                </div>
                <div className="space-y-2">
                  <h4 className="font-medium">Conversion Rate</h4>
                  <div className="text-2xl font-bold">
                    {formatPercentage(revenueAnalytics?.conversion_rate || 0)}
                  </div>
                  <p className="text-sm text-gray-600">Payment success</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
});

AnalyticsDashboard.displayName = 'AnalyticsDashboard';

export default AnalyticsDashboard;

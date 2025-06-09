
import { AdminLayout } from '@/components/admin/layout/AdminLayout';
import { MetricsCard } from '@/components/admin/components/MetricsCard';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { useDashboardMetrics } from '@/hooks/useAdminData';
import { Users, CreditCard, DollarSign, Package } from 'lucide-react';
import { formatCurrency } from '@/config/subscriptionTiers';

const AdminDashboardOverview = () => {
  const { data: metrics, isLoading } = useDashboardMetrics();

  if (isLoading) {
    return (
      <AdminLayout title="Dashboard">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          {[...Array(4)].map((_, i) => (
            <div key={i} className="h-32 bg-gray-200 animate-pulse rounded-lg" />
          ))}
        </div>
      </AdminLayout>
    );
  }

  return (
    <AdminLayout title="Dashboard">
      <div className="space-y-6">
        {/* Metrics Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          <MetricsCard
            title="Total Students"
            value={metrics?.totalStudents || 0}
            icon={Users}
            description="All registered users"
          />
          <MetricsCard
            title="Paid Users"
            value={metrics?.totalPaidUsers || 0}
            icon={CreditCard}
            description="Users with active plans"
          />
          <MetricsCard
            title="Monthly Revenue"
            value={formatCurrency(metrics?.monthlyRevenue || 0)}
            icon={DollarSign}
            description="This month's revenue"
          />
          <MetricsCard
            title="Active Plans"
            value={Object.keys(metrics?.planBreakdown || {}).length}
            icon={Package}
            description="Available subscription plans"
          />
        </div>

        {/* Plan Breakdown */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <Card>
            <CardHeader>
              <CardTitle>Plan Distribution</CardTitle>
              <CardDescription>Breakdown of users by subscription plan</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {Object.entries(metrics?.planBreakdown || {}).map(([plan, count]) => (
                  <div key={plan} className="flex items-center justify-between">
                    <div className="flex items-center">
                      <div className="w-3 h-3 rounded-full bg-cap-teal mr-3" />
                      <span className="font-medium capitalize">{plan}</span>
                    </div>
                    <span className="text-sm text-gray-500">{count} users</span>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Quick Actions</CardTitle>
              <CardDescription>Common administrative tasks</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-2 gap-4">
                <button className="p-4 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors">
                  <Users className="h-6 w-6 mx-auto mb-2 text-cap-teal" />
                  <p className="text-sm font-medium">Manage Users</p>
                </button>
                <button className="p-4 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors">
                  <CreditCard className="h-6 w-6 mx-auto mb-2 text-cap-teal" />
                  <p className="text-sm font-medium">View Payments</p>
                </button>
                <button className="p-4 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors">
                  <Package className="h-6 w-6 mx-auto mb-2 text-cap-teal" />
                  <p className="text-sm font-medium">Edit Plans</p>
                </button>
                <button className="p-4 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors">
                  <DollarSign className="h-6 w-6 mx-auto mb-2 text-cap-teal" />
                  <p className="text-sm font-medium">Export Data</p>
                </button>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </AdminLayout>
  );
};

export default AdminDashboardOverview;

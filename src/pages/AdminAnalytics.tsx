
import { AdminAuthGuard } from '@/components/AdminAuthGuard';
import { DashboardLayout } from '@/components/DashboardLayout';
import { AnalyticsDashboard } from '@/components/admin/analytics/AnalyticsDashboard';

const AdminAnalytics = () => {
  return (
    <AdminAuthGuard>
      <DashboardLayout>
        <AnalyticsDashboard />
      </DashboardLayout>
    </AdminAuthGuard>
  );
};

export default AdminAnalytics;

import { PaymentRecoveryPanel } from '@/components/admin/dashboard/PaymentRecoveryPanel';
import { AdminAuthGuard } from '@/components/AdminAuthGuard';
import { PageLayout } from '@/components/layout/PageLayout';

const AdminPaymentRecovery = () => {
  return (
    <AdminAuthGuard>
      <PageLayout
        title="Payment Recovery Management"
        subtitle="Manage orphaned and failed payments, link payments to users, and resolve payment issues"
        gradient={false}
        containerClassName="max-w-7xl"
      >
        <PaymentRecoveryPanel />
      </PageLayout>
    </AdminAuthGuard>
  );
};

export default AdminPaymentRecovery;


import { useState } from 'react';
import { AdminLayout } from '@/components/admin/layout/AdminLayout';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { StatusBadge } from '@/components/admin/components/StatusBadge';
import { useAdminPayments, useUpdatePaymentStatus } from '@/hooks/useAdminData';
import { Search, Edit } from 'lucide-react';
import { formatCurrency } from '@/config/subscriptionTiers';

const AdminPayments = () => {
  const { data: payments, isLoading } = useAdminPayments();
  const updatePaymentStatus = useUpdatePaymentStatus();
  const [searchTerm, setSearchTerm] = useState('');
  const [filterStatus, setFilterStatus] = useState('all');
  const [filterPlan, setFilterPlan] = useState('all');

  const filteredPayments = payments?.filter(payment => {
    const matchesSearch = 
      payment.user_id.includes(searchTerm) ||
      payment.transaction_id?.includes(searchTerm) ||
      payment.payment_reference?.includes(searchTerm);
    
    const matchesStatus = filterStatus === 'all' || payment.status === filterStatus;
    const matchesPlan = filterPlan === 'all' || payment.plan === filterPlan;
    
    return matchesSearch && matchesStatus && matchesPlan;
  });

  const handleStatusUpdate = (paymentId: string, newStatus: string) => {
    updatePaymentStatus.mutate({ paymentId, status: newStatus });
  };

  if (isLoading) {
    return (
      <AdminLayout title="Payments">
        <div className="animate-pulse space-y-4">
          <div className="h-10 bg-gray-200 rounded" />
          <div className="h-64 bg-gray-200 rounded" />
        </div>
      </AdminLayout>
    );
  }

  return (
    <AdminLayout title="Payments">
      <div className="space-y-6">
        {/* Search and Filters */}
        <Card>
          <CardHeader>
            <CardTitle>Payment Management</CardTitle>
            <CardDescription>View and manage all payment transactions</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="flex flex-col lg:flex-row gap-4">
              <div className="relative flex-1">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                <Input
                  placeholder="Search by user ID, transaction ID, or reference..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10"
                />
              </div>
              <select
                value={filterStatus}
                onChange={(e) => setFilterStatus(e.target.value)}
                className="px-3 py-2 border border-gray-300 rounded-md"
              >
                <option value="all">All Statuses</option>
                <option value="pending">Pending</option>
                <option value="paid">Paid</option>
                <option value="failed">Failed</option>
              </select>
              <select
                value={filterPlan}
                onChange={(e) => setFilterPlan(e.target.value)}
                className="px-3 py-2 border border-gray-300 rounded-md"
              >
                <option value="all">All Plans</option>
                <option value="starter">Starter</option>
                <option value="essential">Essential</option>
                <option value="pro-ai">Pro + AI</option>
              </select>
            </div>
          </CardContent>
        </Card>

        {/* Payments Table */}
        <Card>
          <CardContent className="p-0">
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-gray-50 border-b">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Payment Details
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Plan
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Amount
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Method
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Status
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Date
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Actions
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {filteredPayments?.map((payment) => (
                    <tr key={payment.id} className="hover:bg-gray-50">
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm font-medium text-gray-900">
                          {payment.transaction_id || payment.payment_reference || 'N/A'}
                        </div>
                        <div className="text-sm text-gray-500">
                          User: {payment.user_id.slice(0, 8)}...
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800 capitalize">
                          {payment.plan}
                        </span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                        {formatCurrency(payment.amount)}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 capitalize">
                        {payment.payment_method}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <StatusBadge status={payment.status} />
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                        {new Date(payment.created_at).toLocaleDateString()}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium space-x-2">
                        {payment.status === 'pending' && (
                          <>
                            <Button
                              variant="default"
                              size="sm"
                              onClick={() => handleStatusUpdate(payment.id, 'paid')}
                              disabled={updatePaymentStatus.isPending}
                            >
                              Mark Paid
                            </Button>
                            <Button
                              variant="destructive"
                              size="sm"
                              onClick={() => handleStatusUpdate(payment.id, 'failed')}
                              disabled={updatePaymentStatus.isPending}
                            >
                              Mark Failed
                            </Button>
                          </>
                        )}
                        {payment.status === 'failed' && (
                          <Button
                            variant="default"
                            size="sm"
                            onClick={() => handleStatusUpdate(payment.id, 'paid')}
                            disabled={updatePaymentStatus.isPending}
                          >
                            Mark Paid
                          </Button>
                        )}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </CardContent>
        </Card>

        <div className="text-sm text-gray-500 text-center">
          Showing {filteredPayments?.length || 0} of {payments?.length || 0} payments
        </div>
      </div>
    </AdminLayout>
  );
};

export default AdminPayments;

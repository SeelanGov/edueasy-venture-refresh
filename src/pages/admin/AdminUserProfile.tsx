
import { useParams } from 'react-router-dom';
import { AdminLayout } from '@/components/admin/layout/AdminLayout';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { useAdminUsers, useAdminPayments, useUserPlans } from '@/hooks/useAdminData';
import { User, CreditCard, Package, ArrowLeft } from 'lucide-react';
import { Link } from 'react-router-dom';
import { formatCurrency } from '@/config/subscriptionTiers';
import { StatusBadge } from '@/components/admin/components/StatusBadge';

const AdminUserProfile = () => {
  const { userId } = useParams();
  const { data: users } = useAdminUsers();
  const { data: payments } = useAdminPayments();
  const { data: userPlans } = useUserPlans();

  const user = users?.find(u => u.id === userId);
  const userPayments = payments?.filter(p => p.user_id === userId);
  const userActivePlans = userPlans?.filter(p => p.user_id === userId);

  if (!user) {
    return (
      <AdminLayout title="User Profile">
        <div className="text-center py-12">
          <h3 className="text-lg font-medium text-gray-900">User not found</h3>
          <Link to="/admin/users">
            <Button className="mt-4">
              <ArrowLeft className="h-4 w-4 mr-2" />
              Back to Users
            </Button>
          </Link>
        </div>
      </AdminLayout>
    );
  }

  return (
    <AdminLayout title={`User: ${user.full_name || 'Unknown'}`}>
      <div className="space-y-6">
        {/* Back Button */}
        <Link to="/admin/users">
          <Button variant="outline">
            <ArrowLeft className="h-4 w-4 mr-2" />
            Back to Users
          </Button>
        </Link>

        {/* User Information */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center">
              <User className="h-5 w-5 mr-2" />
              User Information
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <h4 className="font-medium text-gray-900 mb-2">Basic Details</h4>
                <dl className="space-y-2">
                  <div>
                    <dt className="text-sm text-gray-500">Full Name</dt>
                    <dd className="text-sm font-medium">{user.full_name || 'Not provided'}</dd>
                  </div>
                  <div>
                    <dt className="text-sm text-gray-500">Email</dt>
                    <dd className="text-sm font-medium">{user.email || 'Not provided'}</dd>
                  </div>
                  <div>
                    <dt className="text-sm text-gray-500">User ID</dt>
                    <dd className="text-sm font-medium font-mono">{user.id}</dd>
                  </div>
                </dl>
              </div>
              <div>
                <h4 className="font-medium text-gray-900 mb-2">Account Status</h4>
                <dl className="space-y-2">
                  <div>
                    <dt className="text-sm text-gray-500">Current Plan</dt>
                    <dd>
                      <Badge variant={user.current_plan === 'starter' ? 'secondary' : 'default'}>
                        {user.current_plan || 'starter'}
                      </Badge>
                    </dd>
                  </div>
                  <div>
                    <dt className="text-sm text-gray-500">Profile Status</dt>
                    <dd>
                      <Badge variant={user.profile_status === 'complete' ? 'default' : 'secondary'}>
                        {user.profile_status || 'incomplete'}
                      </Badge>
                    </dd>
                  </div>
                  <div>
                    <dt className="text-sm text-gray-500">Member Since</dt>
                    <dd className="text-sm font-medium">
                      {new Date(user.created_at).toLocaleDateString()}
                    </dd>
                  </div>
                </dl>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Payment History */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center">
              <CreditCard className="h-5 w-5 mr-2" />
              Payment History
            </CardTitle>
            <CardDescription>All payment transactions for this user</CardDescription>
          </CardHeader>
          <CardContent>
            {userPayments && userPayments.length > 0 ? (
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead className="bg-gray-50">
                    <tr>
                      <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase">
                        Plan
                      </th>
                      <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase">
                        Amount
                      </th>
                      <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase">
                        Method
                      </th>
                      <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase">
                        Status
                      </th>
                      <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase">
                        Date
                      </th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-200">
                    {userPayments.map((payment) => (
                      <tr key={payment.id}>
                        <td className="px-4 py-2 text-sm capitalize">{payment.plan}</td>
                        <td className="px-4 py-2 text-sm font-medium">
                          {formatCurrency(payment.amount)}
                        </td>
                        <td className="px-4 py-2 text-sm capitalize">{payment.payment_method}</td>
                        <td className="px-4 py-2">
                          <StatusBadge status={payment.status} />
                        </td>
                        <td className="px-4 py-2 text-sm text-gray-500">
                          {new Date(payment.created_at).toLocaleDateString()}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            ) : (
              <p className="text-gray-500 text-center py-4">No payment history found</p>
            )}
          </CardContent>
        </Card>

        {/* Active Plans */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center">
              <Package className="h-5 w-5 mr-2" />
              Plan History
            </CardTitle>
            <CardDescription>Current and previous subscription plans</CardDescription>
          </CardHeader>
          <CardContent>
            {userActivePlans && userActivePlans.length > 0 ? (
              <div className="space-y-4">
                {userActivePlans.map((plan) => (
                  <div key={plan.id} className="flex items-center justify-between p-4 border rounded-lg">
                    <div>
                      <h4 className="font-medium capitalize">{plan.plan}</h4>
                      <p className="text-sm text-gray-500">
                        Started: {new Date(plan.start_date).toLocaleDateString()}
                        {plan.end_date && ` • Ended: ${new Date(plan.end_date).toLocaleDateString()}`}
                      </p>
                    </div>
                    <Badge variant={plan.active ? 'default' : 'secondary'}>
                      {plan.active ? 'Active' : 'Inactive'}
                    </Badge>
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-gray-500 text-center py-4">No plan history found</p>
            )}
          </CardContent>
        </Card>

        {/* Quick Actions */}
        <Card>
          <CardHeader>
            <CardTitle>Quick Actions</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex flex-wrap gap-4">
              <Button variant="outline">
                Upgrade Plan
              </Button>
              <Button variant="outline">
                Reset Password
              </Button>
              <Button variant="outline">
                Send Message
              </Button>
              <Button variant="destructive" className="ml-auto">
                Deactivate Account
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    </AdminLayout>
  );
};

export default AdminUserProfile;

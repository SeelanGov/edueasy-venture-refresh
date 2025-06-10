
import { AdminLayout } from '@/components/admin/layout/AdminLayout';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { useAdminPlans, useUpdatePlan } from '@/hooks/useAdminData';
import { Package, Edit, Plus, DollarSign } from 'lucide-react';
import { formatCurrency } from '@/config/subscriptionTiers';

const AdminPlans = () => {
  const { data: plans, isLoading } = useAdminPlans();
  const updatePlan = useUpdatePlan();

  const togglePlanStatus = async (planId: string, currentStatus: boolean | null) => {
    await updatePlan.mutateAsync({
      id: planId,
      active: !currentStatus
    });
  };

  if (isLoading) {
    return (
      <AdminLayout title="Plans">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {[...Array(3)].map((_, i) => (
            <div key={i} className="h-64 bg-gray-200 animate-pulse rounded-lg" />
          ))}
        </div>
      </AdminLayout>
    );
  }

  return (
    <AdminLayout title="Plans">
      <div className="space-y-6">
        {/* Header */}
        <div className="flex justify-between items-center">
          <div>
            <h2 className="text-2xl font-bold">Subscription Plans</h2>
            <p className="text-gray-600">Manage pricing tiers and features</p>
          </div>
          <Button>
            <Plus className="h-4 w-4 mr-2" />
            Add Plan
          </Button>
        </div>

        {/* Plans Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {plans?.map((plan) => (
            <Card key={plan.id} className="relative">
              <CardHeader>
                <div className="flex items-center justify-between">
                  <CardTitle className="capitalize">{plan.name}</CardTitle>
                  <Badge variant={plan.active ? 'default' : 'secondary'}>
                    {plan.active ? 'Active' : 'Inactive'}
                  </Badge>
                </div>
                <CardDescription>
                  <div className="flex items-center text-2xl font-bold text-cap-teal">
                    <DollarSign className="h-5 w-5" />
                    {formatCurrency(plan.price)}
                  </div>
                </CardDescription>
              </CardHeader>
              
              <CardContent>
                <div className="space-y-4">
                  <div>
                    <h4 className="font-medium mb-2">Features</h4>
                    <ul className="text-sm text-gray-600 space-y-1">
                      {(plan.features || []).map((feature, index) => (
                        <li key={index} className="flex items-center">
                          <div className="w-1.5 h-1.5 bg-cap-teal rounded-full mr-2" />
                          {feature}
                        </li>
                      ))}
                      {(!plan.features || plan.features.length === 0) && (
                        <li className="text-gray-400 italic">No features defined</li>
                      )}
                    </ul>
                  </div>
                  
                  <div className="flex gap-2">
                    <Button
                      variant="outline"
                      size="sm"
                      className="flex-1"
                      onClick={() => togglePlanStatus(plan.id, plan.active)}
                      disabled={updatePlan.isPending}
                    >
                      {plan.active ? 'Deactivate' : 'Activate'}
                    </Button>
                    <Button variant="outline" size="sm">
                      <Edit className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          )) || []}
        </div>

        {/* Stats */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">Total Plans</p>
                  <p className="text-3xl font-bold">{plans?.length || 0}</p>
                </div>
                <Package className="h-8 w-8 text-cap-teal" />
              </div>
            </CardContent>
          </Card>
          
          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">Active Plans</p>
                  <p className="text-3xl font-bold">
                    {plans?.filter(p => p.active).length || 0}
                  </p>
                </div>
                <Package className="h-8 w-8 text-green-600" />
              </div>
            </CardContent>
          </Card>
          
          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">Avg. Price</p>
                  <p className="text-3xl font-bold">
                    {plans?.length ? formatCurrency(
                      plans.reduce((acc, plan) => acc + plan.price, 0) / plans.length
                    ) : formatCurrency(0)}
                  </p>
                </div>
                <DollarSign className="h-8 w-8 text-purple-600" />
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </AdminLayout>
  );
};

export default AdminPlans;

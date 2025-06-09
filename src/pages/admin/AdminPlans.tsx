
import { useState } from 'react';
import { AdminLayout } from '@/components/admin/layout/AdminLayout';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { useAdminPlans, useUpdatePlan, useCreatePlan } from '@/hooks/useAdminData';
import { Edit, Plus, Package } from 'lucide-react';
import { formatCurrency } from '@/config/subscriptionTiers';
import { Plan } from '@/types/AdminTypes';

const AdminPlans = () => {
  const { data: plans, isLoading } = useAdminPlans();
  const updatePlan = useUpdatePlan();
  const createPlan = useCreatePlan();
  const [editingPlan, setEditingPlan] = useState<Plan | null>(null);
  const [isCreateDialogOpen, setIsCreateDialogOpen] = useState(false);
  const [newPlan, setNewPlan] = useState({
    name: '',
    price: 0,
    features: [],
    active: true,
  });

  const handleUpdatePlan = (plan: Plan) => {
    updatePlan.mutate(plan);
    setEditingPlan(null);
  };

  const handleCreatePlan = () => {
    if (newPlan.name && (newPlan.price > 0 || newPlan.name === 'starter')) {
      createPlan.mutate(newPlan);
      setIsCreateDialogOpen(false);
      setNewPlan({ name: '', price: 0, features: [], active: true });
    }
  };

  if (isLoading) {
    return (
      <AdminLayout title="Plans">
        <div className="animate-pulse space-y-4">
          <div className="h-10 bg-gray-200 rounded" />
          <div className="h-64 bg-gray-200 rounded" />
        </div>
      </AdminLayout>
    );
  }

  return (
    <AdminLayout title="Plans">
      <div className="space-y-6">
        {/* Header */}
        <Card>
          <CardHeader>
            <div className="flex justify-between items-center">
              <div>
                <CardTitle>Plan Management</CardTitle>
                <CardDescription>Manage subscription plans and pricing</CardDescription>
              </div>
              <Dialog open={isCreateDialogOpen} onOpenChange={setIsCreateDialogOpen}>
                <DialogTrigger asChild>
                  <Button>
                    <Plus className="h-4 w-4 mr-2" />
                    Create Plan
                  </Button>
                </DialogTrigger>
                <DialogContent>
                  <DialogHeader>
                    <DialogTitle>Create New Plan</DialogTitle>
                    <DialogDescription>
                      Create a new subscription plan for users.
                    </DialogDescription>
                  </DialogHeader>
                  <div className="space-y-4">
                    <Input
                      placeholder="Plan name"
                      value={newPlan.name}
                      onChange={(e) => setNewPlan({ ...newPlan, name: e.target.value })}
                    />
                    <Input
                      type="number"
                      placeholder="Price (0 for free plans)"
                      value={newPlan.price}
                      onChange={(e) => setNewPlan({ ...newPlan, price: parseInt(e.target.value) || 0 })}
                    />
                  </div>
                  <DialogFooter>
                    <Button variant="outline" onClick={() => setIsCreateDialogOpen(false)}>
                      Cancel
                    </Button>
                    <Button onClick={handleCreatePlan}>Create Plan</Button>
                  </DialogFooter>
                </DialogContent>
              </Dialog>
            </div>
          </CardHeader>
        </Card>

        {/* Plans Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {plans?.map((plan) => (
            <Card key={plan.id} className="relative">
              <CardHeader>
                <div className="flex justify-between items-start">
                  <div>
                    <CardTitle className="capitalize">{plan.name}</CardTitle>
                    <div className="text-2xl font-bold text-cap-teal mt-2">
                      {formatCurrency(plan.price)}
                    </div>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Badge variant={plan.active ? 'default' : 'secondary'}>
                      {plan.active ? 'Active' : 'Inactive'}
                    </Badge>
                    <Dialog>
                      <DialogTrigger asChild>
                        <Button variant="ghost" size="sm" onClick={() => setEditingPlan(plan)}>
                          <Edit className="h-4 w-4" />
                        </Button>
                      </DialogTrigger>
                      <DialogContent>
                        <DialogHeader>
                          <DialogTitle>Edit Plan</DialogTitle>
                          <DialogDescription>
                            Update plan details and pricing.
                          </DialogDescription>
                        </DialogHeader>
                        {editingPlan && (
                          <div className="space-y-4">
                            <Input
                              placeholder="Plan name"
                              value={editingPlan.name}
                              onChange={(e) => setEditingPlan({ ...editingPlan, name: e.target.value })}
                            />
                            <Input
                              type="number"
                              placeholder="Price"
                              value={editingPlan.price}
                              onChange={(e) => setEditingPlan({ ...editingPlan, price: parseInt(e.target.value) || 0 })}
                            />
                            <div className="flex items-center space-x-2">
                              <input
                                type="checkbox"
                                checked={editingPlan.active}
                                onChange={(e) => setEditingPlan({ ...editingPlan, active: e.target.checked })}
                              />
                              <label>Active</label>
                            </div>
                          </div>
                        )}
                        <DialogFooter>
                          <Button variant="outline" onClick={() => setEditingPlan(null)}>
                            Cancel
                          </Button>
                          <Button onClick={() => editingPlan && handleUpdatePlan(editingPlan)}>
                            Save Changes
                          </Button>
                        </DialogFooter>
                      </DialogContent>
                    </Dialog>
                  </div>
                </div>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  <h4 className="font-medium text-gray-900">Features:</h4>
                  <ul className="space-y-2">
                    {plan.features.map((feature, index) => (
                      <li key={index} className="flex items-center text-sm text-gray-600">
                        <Package className="h-4 w-4 mr-2 text-green-500" />
                        {feature}
                      </li>
                    ))}
                  </ul>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </AdminLayout>
  );
};

export default AdminPlans;


import { AdminLayout } from '@/components/admin/layout/AdminLayout';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { useAdminUsers } from '@/hooks/useAdminData';
import { Users, Search, Filter, Eye } from 'lucide-react';
import { useState } from 'react';
import { Link } from 'react-router-dom';

const AdminUsers = () => {
  const { data: users, isLoading } = useAdminUsers();
  const [searchTerm, setSearchTerm] = useState('');
  const [filterPlan, setFilterPlan] = useState('all');

  const filteredUsers = users?.filter(user => {
    const matchesSearch = !searchTerm || 
      (user.full_name?.toLowerCase().includes(searchTerm.toLowerCase())) ||
      (user.email?.toLowerCase().includes(searchTerm.toLowerCase()));
    
    const matchesFilter = filterPlan === 'all' || user.current_plan === filterPlan;
    
    return matchesSearch && matchesFilter;
  }) || [];

  const getPlanBadgeColor = (plan: string | null) => {
    if (!plan || plan === 'starter') return 'bg-gray-100 text-gray-800';
    if (plan === 'essential') return 'bg-blue-100 text-blue-800';
    if (plan === 'pro-ai') return 'bg-purple-100 text-purple-800';
    return 'bg-gray-100 text-gray-800';
  };

  const getStatusBadgeColor = (status: string | null) => {
    if (!status || status === 'incomplete') return 'bg-yellow-100 text-yellow-800';
    if (status === 'complete') return 'bg-green-100 text-green-800';
    return 'bg-gray-100 text-gray-800';
  };

  if (isLoading) {
    return (
      <AdminLayout title="Users">
        <div className="space-y-4">
          {[...Array(5)].map((_, i) => (
            <div key={i} className="h-20 bg-gray-200 animate-pulse rounded-lg" />
          ))}
        </div>
      </AdminLayout>
    );
  }

  return (
    <AdminLayout title="Users">
      <div className="space-y-6">
        {/* Header Stats */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">Total Users</p>
                  <p className="text-3xl font-bold">{users?.length || 0}</p>
                </div>
                <Users className="h-8 w-8 text-cap-teal" />
              </div>
            </CardContent>
          </Card>
          
          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">Active Users</p>
                  <p className="text-3xl font-bold">
                    {users?.filter(u => u.profile_status === 'complete').length || 0}
                  </p>
                </div>
                <Users className="h-8 w-8 text-green-600" />
              </div>
            </CardContent>
          </Card>
          
          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">Paid Users</p>
                  <p className="text-3xl font-bold">
                    {users?.filter(u => u.current_plan && u.current_plan !== 'starter').length || 0}
                  </p>
                </div>
                <Users className="h-8 w-8 text-purple-600" />
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Search and Filters */}
        <Card>
          <CardHeader>
            <CardTitle>User Management</CardTitle>
            <CardDescription>View and manage all registered users</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="flex flex-col sm:flex-row gap-4 mb-6">
              <div className="relative flex-1">
                <Search className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                <Input
                  placeholder="Search users by name or email..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10"
                />
              </div>
              <div className="flex gap-2">
                <Button
                  variant={filterPlan === 'all' ? 'default' : 'outline'}
                  onClick={() => setFilterPlan('all')}
                  size="sm"
                >
                  All Plans
                </Button>
                <Button
                  variant={filterPlan === 'starter' ? 'default' : 'outline'}
                  onClick={() => setFilterPlan('starter')}
                  size="sm"
                >
                  Starter
                </Button>
                <Button
                  variant={filterPlan === 'essential' ? 'default' : 'outline'}
                  onClick={() => setFilterPlan('essential')}
                  size="sm"
                >
                  Essential
                </Button>
                <Button
                  variant={filterPlan === 'pro-ai' ? 'default' : 'outline'}
                  onClick={() => setFilterPlan('pro-ai')}
                  size="sm"
                >
                  Pro AI
                </Button>
              </div>
            </div>

            {/* Users Table */}
            <div className="space-y-4">
              {filteredUsers.map((user) => (
                <div key={user.id} className="flex items-center justify-between p-4 border border-gray-200 rounded-lg hover:bg-gray-50">
                  <div className="flex-1">
                    <div className="flex items-center gap-4">
                      <div className="flex-1">
                        <h3 className="font-medium">{user.full_name || 'No Name'}</h3>
                        <p className="text-sm text-gray-500">{user.email || 'No Email'}</p>
                        <p className="text-xs text-gray-400">
                          Joined: {new Date(user.created_at).toLocaleDateString()}
                        </p>
                      </div>
                      
                      <div className="flex flex-col gap-2">
                        <Badge className={getPlanBadgeColor(user.current_plan)}>
                          {user.current_plan || 'starter'}
                        </Badge>
                        <Badge className={getStatusBadgeColor(user.profile_status)}>
                          {user.profile_status || 'incomplete'}
                        </Badge>
                      </div>
                      
                      <Link to={`/admin/users/${user.id}`}>
                        <Button variant="outline" size="sm">
                          <Eye className="h-4 w-4 mr-2" />
                          View
                        </Button>
                      </Link>
                    </div>
                  </div>
                </div>
              ))}
              
              {filteredUsers.length === 0 && (
                <div className="text-center py-8">
                  <Users className="h-12 w-12 mx-auto text-gray-400 mb-4" />
                  <p className="text-gray-500">No users found matching your criteria</p>
                </div>
              )}
            </div>
          </CardContent>
        </Card>
      </div>
    </AdminLayout>
  );
};

export default AdminUsers;

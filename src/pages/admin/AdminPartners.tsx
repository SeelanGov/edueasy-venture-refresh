
import { useState } from 'react';
import { AdminLayout } from '@/components/admin/layout/AdminLayout';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { usePartners, usePartnerMetrics } from '@/hooks/usePartnerData';
import { Search, Plus, Eye, Users, DollarSign, Building } from 'lucide-react';
import { Link } from 'react-router-dom';
import { formatCurrency } from '@/config/subscriptionTiers';

const AdminPartners = () => {
  const { data: partners, isLoading } = usePartners();
  const { data: metrics } = usePartnerMetrics();
  const [searchTerm, setSearchTerm] = useState('');
  const [filterType, setFilterType] = useState('all');
  const [filterTier, setFilterTier] = useState('all');
  const [filterStatus, setFilterStatus] = useState('all');

  const filteredPartners = partners?.filter(partner => {
    const matchesSearch = !searchTerm || 
      partner.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      partner.email.toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesType = filterType === 'all' || partner.type === filterType;
    const matchesTier = filterTier === 'all' || partner.tier === filterTier;
    const matchesStatus = filterStatus === 'all' || partner.status === filterStatus;
    
    return matchesSearch && matchesType && matchesTier && matchesStatus;
  }) || [];

  const getTypeBadgeColor = (type: string) => {
    switch (type) {
      case 'university': return 'bg-blue-100 text-blue-800';
      case 'tvet': return 'bg-green-100 text-green-800';
      case 'funder': return 'bg-purple-100 text-purple-800';
      case 'seta': return 'bg-orange-100 text-orange-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getTierBadgeColor = (tier: string) => {
    switch (tier) {
      case 'basic': return 'bg-gray-100 text-gray-800';
      case 'standard': return 'bg-blue-100 text-blue-800';
      case 'premium': return 'bg-purple-100 text-purple-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getStatusBadgeColor = (status: string) => {
    switch (status) {
      case 'active': return 'bg-green-100 text-green-800';
      case 'inactive': return 'bg-gray-100 text-gray-800';
      case 'pending': return 'bg-yellow-100 text-yellow-800';
      case 'suspended': return 'bg-red-100 text-red-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  if (isLoading) {
    return (
      <AdminLayout title="Partners">
        <div className="space-y-4">
          {[...Array(5)].map((_, i) => (
            <div key={i} className="h-20 bg-gray-200 animate-pulse rounded-lg" />
          ))}
        </div>
      </AdminLayout>
    );
  }

  return (
    <AdminLayout title="Partners">
      <div className="space-y-6">
        {/* Header Stats */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">Total Partners</p>
                  <p className="text-3xl font-bold">{metrics?.totalPartners || 0}</p>
                </div>
                <Building className="h-8 w-8 text-cap-teal" />
              </div>
            </CardContent>
          </Card>
          
          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">Active Partners</p>
                  <p className="text-3xl font-bold">{metrics?.activePartners || 0}</p>
                </div>
                <Users className="h-8 w-8 text-green-600" />
              </div>
            </CardContent>
          </Card>
          
          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">Annual Revenue</p>
                  <p className="text-3xl font-bold">{formatCurrency(metrics?.totalRevenue || 0)}</p>
                </div>
                <DollarSign className="h-8 w-8 text-purple-600" />
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">Premium Partners</p>
                  <p className="text-3xl font-bold">{metrics?.tierBreakdown?.premium || 0}</p>
                </div>
                <Building className="h-8 w-8 text-gold" />
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Search and Filters */}
        <Card>
          <CardHeader>
            <div className="flex justify-between items-center">
              <div>
                <CardTitle>Partner Management</CardTitle>
                <CardDescription>Manage institutional partnerships and relationships</CardDescription>
              </div>
              <Link to="/admin/partners/new">
                <Button>
                  <Plus className="h-4 w-4 mr-2" />
                  Add Partner
                </Button>
              </Link>
            </div>
          </CardHeader>
          <CardContent>
            <div className="flex flex-col lg:flex-row gap-4 mb-6">
              <div className="relative flex-1">
                <Search className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                <Input
                  placeholder="Search partners by name or email..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10"
                />
              </div>
              <div className="flex gap-2">
                <select
                  value={filterType}
                  onChange={(e) => setFilterType(e.target.value)}
                  className="px-3 py-2 border border-gray-300 rounded-md"
                >
                  <option value="all">All Types</option>
                  <option value="university">University</option>
                  <option value="tvet">TVET</option>
                  <option value="funder">Funder</option>
                  <option value="seta">SETA</option>
                  <option value="other">Other</option>
                </select>
                <select
                  value={filterTier}
                  onChange={(e) => setFilterTier(e.target.value)}
                  className="px-3 py-2 border border-gray-300 rounded-md"
                >
                  <option value="all">All Tiers</option>
                  <option value="basic">Basic</option>
                  <option value="standard">Standard</option>
                  <option value="premium">Premium</option>
                </select>
                <select
                  value={filterStatus}
                  onChange={(e) => setFilterStatus(e.target.value)}
                  className="px-3 py-2 border border-gray-300 rounded-md"
                >
                  <option value="all">All Status</option>
                  <option value="active">Active</option>
                  <option value="inactive">Inactive</option>
                  <option value="pending">Pending</option>
                  <option value="suspended">Suspended</option>
                </select>
              </div>
            </div>

            {/* Partners Table */}
            <div className="space-y-4">
              {filteredPartners.map((partner) => (
                <div key={partner.id} className="flex items-center justify-between p-4 border border-gray-200 rounded-lg hover:bg-gray-50">
                  <div className="flex-1">
                    <div className="flex items-center gap-4">
                      <div className="flex-1">
                        <h3 className="font-medium">{partner.name}</h3>
                        <p className="text-sm text-gray-500">{partner.email}</p>
                        <p className="text-xs text-gray-400">
                          Investment: {formatCurrency(partner.annual_investment || 0)}
                        </p>
                      </div>
                      
                      <div className="flex flex-col gap-2">
                        <Badge className={getTypeBadgeColor(partner.type)}>
                          {partner.type}
                        </Badge>
                        <Badge className={getTierBadgeColor(partner.tier)}>
                          {partner.tier}
                        </Badge>
                      </div>

                      <div className="flex flex-col gap-2">
                        <Badge className={getStatusBadgeColor(partner.status)}>
                          {partner.status}
                        </Badge>
                        <div className="text-xs text-gray-400">
                          {partner.contact_person || 'No contact'}
                        </div>
                      </div>
                      
                      <Link to={`/admin/partners/${partner.id}`}>
                        <Button variant="outline" size="sm">
                          <Eye className="h-4 w-4 mr-2" />
                          View
                        </Button>
                      </Link>
                    </div>
                  </div>
                </div>
              ))}
              
              {filteredPartners.length === 0 && (
                <div className="text-center py-8">
                  <Building className="h-12 w-12 mx-auto text-gray-400 mb-4" />
                  <p className="text-gray-500">No partners found matching your criteria</p>
                </div>
              )}
            </div>
          </CardContent>
        </Card>
      </div>
    </AdminLayout>
  );
};

export default AdminPartners;

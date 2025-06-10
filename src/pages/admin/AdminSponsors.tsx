
import React, { useState } from 'react';
import { AdminLayout } from '@/components/admin/layout/AdminLayout';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { SponsorAllocationsTable } from '@/components/admin/SponsorAllocationsTable';
import { SponsorCard } from '@/components/admin/SponsorCard';
import { usePartners } from '@/hooks/usePartnerData';
import { useSponsorAllocations } from '@/hooks/useSponsorAllocations';
import { Badge } from '@/components/ui/badge';
import { Users, Gift, CheckCircle, Search, Filter } from 'lucide-react';
import { Partner } from '@/types/PartnerTypes';

const AdminSponsors = () => {
  const { data: partners } = usePartners();
  const { allocations } = useSponsorAllocations();
  
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [tierFilter, setTierFilter] = useState('all');

  const sponsors = partners?.filter((p: Partner) => p.type === 'sponsor') || [];
  
  // Filter sponsors based on search and filters
  const filteredSponsors = sponsors.filter((sponsor: Partner) => {
    const matchesSearch = sponsor.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         sponsor.email.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = statusFilter === 'all' || sponsor.status === statusFilter;
    const matchesTier = tierFilter === 'all' || sponsor.tier === tierFilter;
    
    return matchesSearch && matchesStatus && matchesTier;
  });

  const activeSponsors = sponsors.filter((s: Partner) => s.status === 'active');
  const activeAllocations = allocations?.filter((a: any) => a.status === 'active') || [];
  const totalAllocations = allocations?.length || 0;

  // Calculate sponsor statistics
  const getSponsorStats = (sponsorId: string) => {
    const sponsorAllocations = allocations?.filter((a: any) => a.sponsor_id === sponsorId) || [];
    const activeSponsorAllocations = sponsorAllocations.filter((a: any) => a.status === 'active');
    
    return {
      total: sponsorAllocations.length,
      active: activeSponsorAllocations.length,
    };
  };

  console.log('Sponsors data:', { sponsors, allocations });

  return (
    <AdminLayout title="Sponsor Management">
      <div className="space-y-6">
        <div>
          <h1 className="text-2xl font-bold">Sponsor Management</h1>
          <p className="text-muted-foreground">
            Manage sponsors and their student allocations
          </p>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Total Sponsors</CardTitle>
              <Users className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{sponsors.length}</div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Active Sponsors</CardTitle>
              <CheckCircle className="h-4 w-4 text-green-600" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{activeSponsors.length}</div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Total Allocations</CardTitle>
              <Gift className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{totalAllocations}</div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Active Allocations</CardTitle>
              <CheckCircle className="h-4 w-4 text-green-600" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{activeAllocations.length}</div>
            </CardContent>
          </Card>
        </div>

        <Tabs defaultValue="sponsors" className="space-y-4">
          <TabsList>
            <TabsTrigger value="sponsors">Sponsor List</TabsTrigger>
            <TabsTrigger value="allocations">Student Allocations</TabsTrigger>
          </TabsList>

          <TabsContent value="sponsors" className="space-y-4">
            {/* Search and Filters */}
            <Card>
              <CardContent className="p-4">
                <div className="flex flex-col sm:flex-row gap-4">
                  <div className="relative flex-1">
                    <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                    <Input
                      placeholder="Search sponsors by name or email..."
                      value={searchTerm}
                      onChange={(e) => setSearchTerm(e.target.value)}
                      className="pl-10"
                    />
                  </div>
                  <div className="flex gap-2">
                    <Select value={statusFilter} onValueChange={setStatusFilter}>
                      <SelectTrigger className="w-32">
                        <SelectValue placeholder="Status" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="all">All Status</SelectItem>
                        <SelectItem value="active">Active</SelectItem>
                        <SelectItem value="inactive">Inactive</SelectItem>
                        <SelectItem value="pending">Pending</SelectItem>
                      </SelectContent>
                    </Select>
                    <Select value={tierFilter} onValueChange={setTierFilter}>
                      <SelectTrigger className="w-32">
                        <SelectValue placeholder="Tier" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="all">All Tiers</SelectItem>
                        <SelectItem value="basic">Basic</SelectItem>
                        <SelectItem value="standard">Standard</SelectItem>
                        <SelectItem value="premium">Premium</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Sponsor Cards Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {filteredSponsors.map((sponsor: Partner) => {
                const stats = getSponsorStats(sponsor.id);
                return (
                  <SponsorCard
                    key={sponsor.id}
                    sponsor={sponsor}
                    totalStudents={stats.total}
                    activeStudents={stats.active}
                  />
                );
              })}
            </div>

            {filteredSponsors.length === 0 && (
              <Card>
                <CardContent className="p-8 text-center">
                  <Users className="w-12 h-12 mx-auto mb-4 text-muted-foreground opacity-50" />
                  <h3 className="text-lg font-medium mb-2">No sponsors found</h3>
                  <p className="text-muted-foreground">
                    {searchTerm || statusFilter !== 'all' || tierFilter !== 'all'
                      ? 'Try adjusting your search criteria.'
                      : 'No sponsors have been registered yet.'
                    }
                  </p>
                </CardContent>
              </Card>
            )}
          </TabsContent>

          <TabsContent value="allocations" className="space-y-4">
            <Card>
              <CardContent className="p-6">
                <SponsorAllocationsTable />
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </AdminLayout>
  );
};

export default AdminSponsors;

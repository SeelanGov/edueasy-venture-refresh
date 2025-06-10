
import React from 'react';
import { AdminLayout } from '@/components/admin/layout/AdminLayout';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { SponsorAllocationsTable } from '@/components/admin/SponsorAllocationsTable';
import { usePartners } from '@/hooks/usePartnerData';
import { useSponsorAllocations } from '@/hooks/useSponsorAllocations';
import { Badge } from '@/components/ui/badge';
import { Users, Gift, CheckCircle, XCircle } from 'lucide-react';
import { Partner } from '@/types/PartnerTypes';

const AdminSponsors = () => {
  const { data: partners } = usePartners();
  const { allocations } = useSponsorAllocations();

  const sponsors = partners?.filter((p: Partner) => p.type === 'sponsor') || [];
  const activeSponsors = sponsors.filter((s: Partner) => s.status === 'active');
  const activeAllocations = allocations?.filter((a: any) => a.status === 'active') || [];
  const totalAllocations = allocations?.length || 0;

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

        <Tabs defaultValue="allocations" className="space-y-4">
          <TabsList>
            <TabsTrigger value="allocations">Student Allocations</TabsTrigger>
            <TabsTrigger value="sponsors">Sponsor List</TabsTrigger>
          </TabsList>

          <TabsContent value="allocations" className="space-y-4">
            <Card>
              <CardContent className="p-6">
                <SponsorAllocationsTable />
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="sponsors" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle>Registered Sponsors</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {sponsors.map((sponsor: Partner) => (
                    <div key={sponsor.id} className="flex items-center justify-between p-4 border rounded-lg">
                      <div>
                        <h3 className="font-semibold">{sponsor.name}</h3>
                        <p className="text-sm text-muted-foreground">{sponsor.email}</p>
                        {sponsor.contact_person && (
                          <p className="text-sm text-muted-foreground">
                            Contact: {sponsor.contact_person}
                          </p>
                        )}
                      </div>
                      <div className="flex items-center space-x-2">
                        <Badge variant={sponsor.status === 'active' ? 'default' : 'secondary'}>
                          {sponsor.status}
                        </Badge>
                        <Badge variant="outline">{sponsor.tier}</Badge>
                      </div>
                    </div>
                  ))}
                  {sponsors.length === 0 && (
                    <div className="text-center py-8 text-muted-foreground">
                      No sponsors registered yet.
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </AdminLayout>
  );
};

export default AdminSponsors;

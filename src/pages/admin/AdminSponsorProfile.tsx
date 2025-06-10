
import React from 'react';
import { useParams } from 'react-router-dom';
import { AdminLayout } from '@/components/admin/layout/AdminLayout';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { usePartner } from '@/hooks/usePartnerData';
import { useSponsorAllocations } from '@/hooks/useSponsorAllocations';
import { SponsorAllocationsTable } from '@/components/admin/SponsorAllocationsTable';
import { SponsorPaymentHistory } from '@/components/admin/SponsorPaymentHistory';
import { SponsorNoteTimeline } from '@/components/admin/SponsorNoteTimeline';
import { SponsorAnalytics } from '@/components/admin/SponsorAnalytics';
import { AllocationModal } from '@/components/admin/AllocationModal';
import { Users, Mail, Phone, Globe, MapPin, Calendar, DollarSign } from 'lucide-react';

const AdminSponsorProfile = () => {
  const { id } = useParams<{ id: string }>();
  const { data: sponsor, isLoading } = usePartner(id!);
  const { allocations } = useSponsorAllocations();

  const sponsorAllocations = allocations?.filter((a: any) => a.sponsor_id === id) || [];
  const activeAllocations = sponsorAllocations.filter((a: any) => a.status === 'active');

  if (isLoading) {
    return (
      <AdminLayout title="Loading...">
        <div className="flex items-center justify-center h-64">
          <div className="text-lg">Loading sponsor details...</div>
        </div>
      </AdminLayout>
    );
  }

  if (!sponsor || sponsor.type !== 'sponsor') {
    return (
      <AdminLayout title="Sponsor Not Found">
        <div className="text-center py-16">
          <h2 className="text-2xl font-semibold mb-4">Sponsor Not Found</h2>
          <p className="text-muted-foreground">The sponsor you're looking for doesn't exist or has been removed.</p>
        </div>
      </AdminLayout>
    );
  }

  return (
    <AdminLayout title={`${sponsor.name} - Sponsor Profile`}>
      <div className="space-y-6">
        {/* Header Section */}
        <div className="bg-white rounded-lg border p-6">
          <div className="flex justify-between items-start mb-6">
            <div>
              <h1 className="text-3xl font-bold mb-2">{sponsor.name}</h1>
              <div className="flex items-center gap-4 mb-4">
                <Badge variant={sponsor.status === 'active' ? 'default' : 'secondary'}>
                  {sponsor.status}
                </Badge>
                <Badge variant="outline">{sponsor.tier}</Badge>
                <Badge variant="outline">Sponsor</Badge>
              </div>
            </div>
            <div className="flex gap-2">
              <AllocationModal sponsorId={sponsor.id} />
              <Button variant="outline">
                <DollarSign className="w-4 h-4 mr-2" />
                Generate Report
              </Button>
            </div>
          </div>

          {/* Contact Info Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            <div className="flex items-center gap-2">
              <Mail className="w-4 h-4 text-muted-foreground" />
              <span className="text-sm">{sponsor.email}</span>
            </div>
            {sponsor.phone && (
              <div className="flex items-center gap-2">
                <Phone className="w-4 h-4 text-muted-foreground" />
                <span className="text-sm">{sponsor.phone}</span>
              </div>
            )}
            {sponsor.website && (
              <div className="flex items-center gap-2">
                <Globe className="w-4 h-4 text-muted-foreground" />
                <span className="text-sm">{sponsor.website}</span>
              </div>
            )}
            {sponsor.city && (
              <div className="flex items-center gap-2">
                <MapPin className="w-4 h-4 text-muted-foreground" />
                <span className="text-sm">{sponsor.city}, {sponsor.province}</span>
              </div>
            )}
          </div>

          {sponsor.contact_person && (
            <div className="mt-4 pt-4 border-t">
              <h3 className="font-medium mb-2">Contact Person</h3>
              <p className="text-sm text-muted-foreground">
                {sponsor.contact_person} • {sponsor.contact_email}
              </p>
            </div>
          )}
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Total Allocations</CardTitle>
              <Users className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{sponsorAllocations.length}</div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Active Students</CardTitle>
              <Users className="h-4 w-4 text-green-600" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{activeAllocations.length}</div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Investment</CardTitle>
              <DollarSign className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">
                R{sponsor.annual_investment?.toLocaleString() || '0'}
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Contract Period</CardTitle>
              <Calendar className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-sm">
                {sponsor.contract_start_date ? (
                  <>
                    {new Date(sponsor.contract_start_date).getFullYear()} - 
                    {sponsor.contract_end_date ? new Date(sponsor.contract_end_date).getFullYear() : 'Ongoing'}
                  </>
                ) : (
                  'Not specified'
                )}
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Tabs Section */}
        <Tabs defaultValue="allocations" className="space-y-4">
          <TabsList>
            <TabsTrigger value="allocations">Student Allocations</TabsTrigger>
            <TabsTrigger value="payments">Payment History</TabsTrigger>
            <TabsTrigger value="notes">Notes & Timeline</TabsTrigger>
            <TabsTrigger value="analytics">Analytics</TabsTrigger>
          </TabsList>

          <TabsContent value="allocations">
            <Card>
              <CardContent className="p-6">
                <SponsorAllocationsTable sponsorId={sponsor.id} />
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="payments">
            <Card>
              <CardContent className="p-6">
                <SponsorPaymentHistory sponsorId={sponsor.id} />
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="notes">
            <Card>
              <CardContent className="p-6">
                <SponsorNoteTimeline sponsorId={sponsor.id} />
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="analytics">
            <Card>
              <CardContent className="p-6">
                <SponsorAnalytics sponsorId={sponsor.id} />
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </AdminLayout>
  );
};

export default AdminSponsorProfile;

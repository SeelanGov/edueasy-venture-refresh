
import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { ArrowLeft, Building2, Mail, Phone, Globe, Calendar, CreditCard, MessageSquare } from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';

interface Partner {
  id: string;
  name: string;
  type: string;
  tier: string;
  status: string;
  contact_email: string | null;
  contact_phone?: string | null; // Made optional
  phone: string | null;
  contact_person: string | null;
  website: string | null;
  annual_investment: number | null;
  contract_start_date: string | null;
  contract_end_date: string | null;
  integration_status: string | null;
  notes: string | null;
  created_at: string;
}

interface Payment {
  id: string;
  amount: number;
  status: string;
  payment_date: string;
  due_date: string | null;
  invoice_number: string | null;
}

export const PartnerProfile = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [partner, setPartner] = useState<Partner | null>(null);
  const [payments, setPayments] = useState<Payment[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (id) {
      fetchPartnerData();
    }
  }, [id]);

  const fetchPartnerData = async () => {
    if (!id) return;
    
    try {
      // Fetch partner details
      const { data: partnerData, error: partnerError } = await supabase
        .from('partners')
        .select('*')
        .eq('id', id)
        .single();

      if (partnerError) throw partnerError;
      
      // Transform data to match Partner interface
      const transformedPartner = {
        ...partnerData,
        contact_phone: partnerData.phone || partnerData.contact_phone // Map phone to contact_phone
      };
      
      setPartner(transformedPartner);

      // Fetch payment history
      const { data: paymentsData, error: paymentsError } = await supabase
        .from('partner_payments')
        .select('*')
        .eq('partner_id', id)
        .order('payment_date', { ascending: false });

      if (paymentsError) throw paymentsError;
      setPayments(paymentsData || []);
    } catch (error) {
      console.error('Error fetching partner data:', error);
    } finally {
      setLoading(false);
    }
  };

  const updatePartnerTier = async (newTier: 'basic' | 'standard' | 'premium') => {
    if (!id) return;
    
    try {
      const { error } = await supabase
        .from('partners')
        .update({ tier: newTier })
        .eq('id', id);

      if (error) throw error;
      
      setPartner(prev => prev ? { ...prev, tier: newTier } : null);
    } catch (error) {
      console.error('Error updating partner tier:', error);
    }
  };

  if (loading) {
    return <div className="flex items-center justify-center h-64">Loading partner details...</div>;
  }

  if (!partner) {
    return <div className="text-center">Partner not found</div>;
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center gap-4">
        <Button variant="ghost" onClick={() => navigate('/admin/partners')}>
          <ArrowLeft className="h-4 w-4 mr-2" />
          Back to Partners
        </Button>
        <div className="flex-1">
          <h1 className="text-2xl font-bold text-gray-900">{partner.name}</h1>
          <p className="text-gray-600 capitalize">{partner.type} Partner</p>
        </div>
        <Badge className={partner.tier === 'premium' ? 'bg-purple-100 text-purple-800' : 
                          partner.tier === 'standard' ? 'bg-blue-100 text-blue-800' : 
                          'bg-gray-100 text-gray-800'}>
          {partner.tier}
        </Badge>
      </div>

      {/* Main Content */}
      <Tabs defaultValue="overview" className="space-y-6">
        <TabsList>
          <TabsTrigger value="overview">Overview</TabsTrigger>
          <TabsTrigger value="payments">Payments</TabsTrigger>
          <TabsTrigger value="integration">Integration</TabsTrigger>
          <TabsTrigger value="notes">Notes</TabsTrigger>
        </TabsList>

        <TabsContent value="overview" className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Contact Information */}
            <Card>
              <CardHeader>
                <CardTitle>Contact Information</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                {partner.contact_person && (
                  <div>
                    <label className="text-sm font-medium text-gray-500">Contact Person</label>
                    <p>{partner.contact_person}</p>
                  </div>
                )}
                {partner.contact_email && (
                  <div className="flex items-center gap-2">
                    <Mail className="h-4 w-4 text-gray-400" />
                    <a href={`mailto:${partner.contact_email}`} className="text-blue-600 hover:underline">
                      {partner.contact_email}
                    </a>
                  </div>
                )}
                {(partner.contact_phone || partner.phone) && (
                  <div className="flex items-center gap-2">
                    <Phone className="h-4 w-4 text-gray-400" />
                    <a href={`tel:${partner.contact_phone || partner.phone}`} className="text-blue-600 hover:underline">
                      {partner.contact_phone || partner.phone}
                    </a>
                  </div>
                )}
                {partner.website && (
                  <div className="flex items-center gap-2">
                    <Globe className="h-4 w-4 text-gray-400" />
                    <a href={partner.website} target="_blank" rel="noopener noreferrer" className="text-blue-600 hover:underline">
                      {partner.website}
                    </a>
                  </div>
                )}
              </CardContent>
            </Card>

            {/* Partnership Details */}
            <Card>
              <CardHeader>
                <CardTitle>Partnership Details</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <label className="text-sm font-medium text-gray-500">Annual Investment</label>
                  <p className="text-lg font-semibold text-green-600">
                    R{partner.annual_investment?.toLocaleString() || '0'}
                  </p>
                </div>
                <div>
                  <label className="text-sm font-medium text-gray-500">Status</label>
                  <Badge className={partner.status === 'active' ? 'bg-green-100 text-green-800' : 
                                   partner.status === 'pending' ? 'bg-yellow-100 text-yellow-800' : 
                                   'bg-red-100 text-red-800'}>
                    {partner.status}
                  </Badge>
                </div>
                {partner.contract_start_date && (
                  <div>
                    <label className="text-sm font-medium text-gray-500">Contract Period</label>
                    <p>
                      {new Date(partner.contract_start_date).toLocaleDateString()} - 
                      {partner.contract_end_date ? new Date(partner.contract_end_date).toLocaleDateString() : 'Ongoing'}
                    </p>
                  </div>
                )}
              </CardContent>
            </Card>
          </div>

          {/* Tier Management */}
          <Card>
            <CardHeader>
              <CardTitle>Tier Management</CardTitle>
              <CardDescription>Change partner tier and access levels</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="flex gap-2">
                {(['basic', 'standard', 'premium'] as const).map((tier) => (
                  <Button
                    key={tier}
                    variant={partner.tier === tier ? 'default' : 'outline'}
                    onClick={() => updatePartnerTier(tier)}
                    className="capitalize"
                  >
                    {tier}
                  </Button>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="payments">
          <Card>
            <CardHeader>
              <CardTitle>Payment History</CardTitle>
              <CardDescription>Track payments and invoices</CardDescription>
            </CardHeader>
            <CardContent>
              {payments.length === 0 ? (
                <p className="text-gray-500 text-center py-8">No payment records found</p>
              ) : (
                <div className="space-y-4">
                  {payments.map((payment) => (
                    <div key={payment.id} className="flex justify-between items-center p-4 border rounded-lg">
                      <div>
                        <p className="font-medium">R{payment.amount.toLocaleString()}</p>
                        <p className="text-sm text-gray-500">
                          {payment.invoice_number} • {new Date(payment.payment_date).toLocaleDateString()}
                        </p>
                        {payment.due_date && (
                          <p className="text-sm text-gray-500">
                            Due: {new Date(payment.due_date).toLocaleDateString()}
                          </p>
                        )}
                      </div>
                      <Badge className={payment.status === 'paid' ? 'bg-green-100 text-green-800' : 
                                       payment.status === 'pending' ? 'bg-yellow-100 text-yellow-800' : 
                                       'bg-red-100 text-red-800'}>
                        {payment.status}
                      </Badge>
                    </div>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="integration">
          <Card>
            <CardHeader>
              <CardTitle>Integration Status</CardTitle>
              <CardDescription>API and system integration progress</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div>
                  <label className="text-sm font-medium text-gray-500">Integration Status</label>
                  <Badge className={partner.integration_status === 'completed' ? 'bg-green-100 text-green-800' : 
                                   partner.integration_status === 'in_progress' ? 'bg-blue-100 text-blue-800' : 
                                   'bg-gray-100 text-gray-800'}>
                    {partner.integration_status || 'Not Started'}
                  </Badge>
                </div>
                <div className="pt-4">
                  <Button variant="outline">
                    Generate API Key
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="notes">
          <Card>
            <CardHeader>
              <CardTitle>Partner Notes</CardTitle>
              <CardDescription>Internal notes and communication history</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {partner.notes ? (
                  <div className="p-4 bg-gray-50 rounded-lg">
                    <p>{partner.notes}</p>
                  </div>
                ) : (
                  <p className="text-gray-500 text-center py-8">No notes available</p>
                )}
                <Button variant="outline">
                  <MessageSquare className="h-4 w-4 mr-2" />
                  Add Note
                </Button>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};

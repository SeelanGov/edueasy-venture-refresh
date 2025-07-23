import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { supabase } from '@/integrations/supabase/client';
import { ArrowLeft, Globe, Mail, MessageSquare, Phone } from 'lucide-react';
import { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { toast } from 'sonner';

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
  reference_number?: string | null;
  tier?: string | null;
}

export const PartnerProfile = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [partner, setPartner] = useState<Partner | null>(null);
  const [payments, setPayments] = useState<Payment[]>([]);
  const [loading, setLoading] = useState(true);
  const [isProcessingPayment, setIsProcessingPayment] = useState(false);

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
        contact_phone: partnerData.phone, // Map phone to contact_phone
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
      const { error } = await supabase.from('partners').update({ tier: newTier }).eq('id', id);

      if (error) throw error;

      setPartner((prev) => (prev ? { ...prev, tier: newTier } : null));
    } catch (error) {
      console.error('Error updating partner tier:', error);
    }
  };

  const handleMarkAsPaid = async (paymentId: string) => {
    if (!partner?.id) return;

    setIsProcessingPayment(true);
    try {
      // Update payment status
      const { error: paymentError } = await supabase
        .from('partner_payments')
        .update({ 
          status: 'paid', 
          updated_at: new Date().toISOString() 
        })
        .eq('id', paymentId);

      if (paymentError) throw paymentError;

      // Update partner status
      const { error: partnerError } = await supabase
        .from('partners')
        .update({ 
          status: 'active',
          updated_at: new Date().toISOString() 
        })
        .eq('id', partner.id);

      if (partnerError) throw partnerError;

      toast.success('Partner activated successfully!');
      fetchPartnerData(); // Refresh data
    } catch (error) {
      console.error('Error marking payment as paid:', error);
      toast.error('Failed to mark payment as paid. Please try again.');
    } finally {
      setIsProcessingPayment(false);
    }
  };

  if (loading) {
    return <div className="flex items-center justify-center h-64">Loading partner details...</div>;
  }

  if (!partner) {
    return <div className="flex items-center justify-center h-64">Partner not found</div>;
  }

  return (
    <div className="p-4 sm:p-8 max-w-4xl mx-auto">
      <div className="flex items-center gap-3 mb-2">
        <Button
          variant="ghost"
          size="sm"
          onClick={() => navigate('/admin/partners')}
          className="p-2"
        >
          <ArrowLeft className="h-4 w-4" />
        </Button>
        <h1 className="text-2xl sm:text-3xl font-bold">{partner.name}</h1>
        <Badge
          className={
            partner.status === 'active'
              ? 'bg-green-100 text-green-800'
              : partner.status === 'pending'
                ? 'bg-yellow-100 text-yellow-800'
                : 'bg-red-100 text-red-800'
          }
        >
          {partner.status}
        </Badge>
        <Badge variant="outline" className="capitalize">
          {partner.tier}
        </Badge>
      </div>

      <Tabs defaultValue="details" className="space-y-4">
        <TabsList>
          <TabsTrigger value="details">Details</TabsTrigger>
          <TabsTrigger value="payments">Payments</TabsTrigger>
          <TabsTrigger value="integration">Integration</TabsTrigger>
          <TabsTrigger value="notes">Notes</TabsTrigger>
        </TabsList>

        <TabsContent value="details">
          <Card>
            <CardHeader>
              <CardTitle>Partner Information</CardTitle>
              <CardDescription>Basic partner details and contact information</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="text-sm font-medium text-gray-500">Name</label>
                  <p className="text-sm">{partner.name}</p>
                </div>
                <div>
                  <label className="text-sm font-medium text-gray-500">Type</label>
                  <p className="text-sm capitalize">{partner.type}</p>
                </div>
                <div>
                  <label className="text-sm font-medium text-gray-500">Email</label>
                  <div className="flex items-center gap-2">
                    <Mail className="h-4 w-4 text-gray-400" />
                    <a href={`mailto:${partner.contact_email}`} className="text-sm text-blue-600 hover:underline">
                      {partner.contact_email}
                    </a>
                  </div>
                </div>
                <div>
                  <label className="text-sm font-medium text-gray-500">Phone</label>
                  <div className="flex items-center gap-2">
                    <Phone className="h-4 w-4 text-gray-400" />
                    <span className="text-sm">{partner.contact_phone || 'Not provided'}</span>
                  </div>
                </div>
                {partner.website && (
                  <div>
                    <label className="text-sm font-medium text-gray-500">Website</label>
                    <div className="flex items-center gap-2">
                      <Globe className="h-4 w-4 text-gray-400" />
                      <a href={partner.website} target="_blank" rel="noopener noreferrer" className="text-sm text-blue-600 hover:underline">
                        {partner.website}
                      </a>
                    </div>
                  </div>
                )}
              </div>

              <div className="pt-4">
                <label className="text-sm font-medium text-gray-500">Tier</label>
                <div className="flex gap-2 mt-2">
                  {(['basic', 'standard', 'premium'] as const).map((tier) => (
                    <Button
                      key={tier}
                      variant={partner.tier === tier ? 'default' : 'outline'}
                      size="sm"
                      onClick={() => updatePartnerTier(tier)}
                      className="capitalize"
                    >
                      {tier}
                    </Button>
                  ))}
                </div>
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
                    <div
                      key={payment.id}
                      className="flex justify-between items-center p-4 border rounded-lg"
                    >
                      <div>
                        <p className="font-medium">R{payment.amount.toLocaleString()}</p>
                        <p className="text-sm text-gray-500">
                          {payment.reference_number && `Ref: ${payment.reference_number} • `}
                          {new Date(payment.payment_date).toLocaleDateString()}
                        </p>
                        {payment.tier && (
                          <p className="text-sm text-gray-500">Tier: {payment.tier}</p>
                        )}
                        {payment.due_date && (
                          <p className="text-sm text-gray-500">
                            Due: {new Date(payment.due_date).toLocaleDateString()}
                          </p>
                        )}
                      </div>
                      <div className="flex items-center gap-2">
                        <Badge
                          className={
                            payment.status === 'paid'
                              ? 'bg-green-100 text-green-800'
                              : payment.status === 'pending'
                                ? 'bg-yellow-100 text-yellow-800'
                                : 'bg-red-100 text-red-800'
                          }
                        >
                          {payment.status}
                        </Badge>
                        {payment.status === 'pending' && (
                          <Button 
                            size="sm" 
                            onClick={() => handleMarkAsPaid(payment.id)}
                            disabled={isProcessingPayment}
                            className="bg-green-600 hover:bg-green-700"
                          >
                            {isProcessingPayment ? 'Processing...' : 'Mark as Paid'}
                          </Button>
                        )}
                      </div>
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
                  <Badge
                    className={
                      partner.integration_status === 'completed'
                        ? 'bg-green-100 text-green-800'
                        : partner.integration_status === 'in_progress'
                          ? 'bg-blue-100 text-blue-800'
                          : 'bg-gray-100 text-gray-800'
                    }
                  >
                    {partner.integration_status || 'Not Started'}
                  </Badge>
                </div>
                <div className="pt-4">
                  <Button variant="outline">Generate API Key</Button>
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

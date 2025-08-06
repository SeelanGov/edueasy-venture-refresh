import { Spinner } from '@/components/Spinner';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { supabase } from '@/integrations/supabase/client';
import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { v4 as uuidv4 } from 'uuid';

const BackToHomeBtn = ({ className = '' }: { className?: string }): JSX.Element => {
  const navigate = useNavigate();
  return (
    <div className={`relative w-full ${className}`}>
      <div className="container mx-auto px-4 mt-8 mb-0 flex items-center">
        <Button
          type="button"
          variant="ghost"
          className="bg-transparent px-3 py-1 rounded-lg flex items-center text-cap-teal hover:bg-cap-teal/10"
          onClick={() => navigate('/')}
        >
          <span className="mr-2 text-lg">&#8592;</span>
          Back to Home
        </Button>
      </div>
    </div>
  );
};

const PartnerDashboard: React.FC = () => {
  const navigate = useNavigate();
  const [partner, setPartner] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [paymentReference, setPaymentReference] = useState<string>('');
  const [paymentAmount, setPaymentAmount] = useState<number>(0);
  const [payments, setPayments] = useState<any[]>([]);

  // Only fetch if logged-in
  useEffect(() => {
    async function fetchPartner() {
      setLoading(true);
      const {
        data: { user },
      } = await supabase.auth.getUser();
      if (!user) {
        navigate('/partner/login');
        return;
      }
      const { data: partnerData, error } = await supabase
        .from('partners')
        .select('*')
        .eq('created_by', user.id)
        .single();

      if (error || !partnerData) {
        setPartner(null);
        setLoading(false);
        return;
      }
      setPartner(partnerData);

      // Generate payment details for pending partners
      if (partnerData.status === 'pending') {
        const reference = `EDU-PART-${uuidv4().slice(0, 8)}`;
        const amount =
          partnerData.tier === 'basic' ? 50000 : partnerData.tier === 'standard' ? 150000 : 300000;

        setPaymentReference(reference);
        setPaymentAmount(amount);

        // Check if payment record already exists
        const { data: existingPayment } = await supabase
          .from('partner_payments')
          .select('*')
          .eq('partner_id', partnerData.id)
          .eq('status', 'pending')
          .single();

        if (!existingPayment) {
          // Create payment record
          await supabase.from('partner_payments').insert({
            partner_id: partnerData.id,
            tier: partnerData.tier,
            amount: amount,
            method: 'eft',
            reference_number: reference,
            status: 'pending',
            payment_date: new Date().toISOString(),
          });
        }
      }

      // Fetch payment history for all partners
      const { data: paymentsData } = await supabase
        .from('partner_payments')
        .select('*')
        .eq('partner_id', partnerData.id)
        .order('created_at', { ascending: false });

      setPayments(paymentsData || []);
      setLoading(false);
    }
    fetchPartner();
  }, [navigate]);

  if (loading) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center bg-background-subtle">
        <BackToHomeBtn />
        <Spinner size="lg" />
      </div>
    );
  }

  if (!partner) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center bg-background-subtle">
        <BackToHomeBtn />
        <Card className="bg-card p-8 rounded-xl shadow-lg w-full max-w-md">
          <h1 className="text-xl font-bold mb-4 text-center text-primary">
            No Partner Profile Found
          </h1>
          <p className="mb-4 text-center text-muted">Please register as a partner.</p>
          <Button
            className="bg-cap-teal text-white rounded-lg px-5 py-2"
            onClick={() => navigate('/partner/register')}
          >
            Register as Partner
          </Button>
        </Card>
      </div>
    );
  }

  // Pending payment: show EFT instructions
  if (partner.status !== 'active') {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center bg-background-subtle">
        <BackToHomeBtn />
        <Card className="bg-card p-8 rounded-xl shadow-lg w-full max-w-xl text-center">
          <h1 className="text-2xl font-bold mb-2 text-primary">Complete Your Subscription</h1>
          <p className="mb-4 text-foreground-muted">
            To access all partner features, please complete your subscription payment via EFT.
          </p>

          <div className="border border-dashed border-cap-teal rounded-lg p-6 mt-4 text-left bg-cap-teal/5">
            <h3 className="font-semibold mb-3">EFT Payment Instructions</h3>
            <p className="mb-2">
              Please make payment of <strong>R{paymentAmount.toLocaleString()}</strong> via EFT to:
            </p>
            <div className="bg-gray-50 p-3 rounded font-mono text-sm">
              <div>Bank: FNB</div>
              <div>Account: 123456789</div>
              <div>
                Reference: <strong>{paymentReference}</strong>
              </div>
            </div>
            <p className="text-sm text-gray-600 mt-3">
              Once payment is confirmed by EduEasy, your dashboard will be fully unlocked.
            </p>
          </div>

          <div className="mt-4 text-sm text-gray-500">
            <strong>Need help?</strong>
            <br />
            Email{' '}
            <a href="mailto:partners@edueasy.co.za" className="text-cap-teal underline">
              partners@edueasy.co.za
            </a>
            <br />
            or WhatsApp 060 123 4567
          </div>
        </Card>
      </div>
    );
  }

  // Access granted: show enhanced dashboard
  return (
    <div className="min-h-screen bg-background-subtle">
      <BackToHomeBtn />
      <div className="max-w-6xl mx-auto p-6">
        <div className="mb-6">
          <h1 className="text-3xl font-bold text-primary mb-2">Partner Dashboard</h1>
          <div className="flex items-center gap-4">
            <span className="text-sm font-medium bg-blue-100 text-blue-800 px-2 py-1 rounded">
              {partner.tier} Tier
            </span>
            <span className="text-sm font-medium bg-green-100 text-green-800 px-2 py-1 rounded">
              {partner.status}
            </span>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
          <Card className="bg-card p-6 rounded-lg shadow">
            <h2 className="text-lg font-semibold mb-3">Your Plan</h2>
            <div className="space-y-2">
              <p className="text-2xl font-bold">{partner.tier}</p>
              <p className="text-muted-foreground">
                {partner.tier === 'basic'
                  ? 'Up to 100 applications/month'
                  : partner.tier === 'standard'
                    ? 'Up to 500 applications/month'
                    : 'Unlimited applications'}
              </p>
            </div>
          </Card>

          <Card className="bg-card p-6 rounded-lg shadow">
            <h2 className="text-lg font-semibold mb-3">Payment History</h2>
            {payments.length === 0 ? (
              <p className="text-muted-foreground">No payments recorded</p>
            ) : (
              <div className="space-y-2">
                {payments.slice(0, 3).map((payment) => (
                  <div
                    key={payment.id}
                    className="flex justify-between items-center p-2 border rounded"
                  >
                    <div>
                      <p className="font-medium">R{payment.amount.toLocaleString()}</p>
                      <p className="text-sm text-muted-foreground">
                        {new Date(payment.payment_date).toLocaleDateString()}
                      </p>
                    </div>
                    <span
                      className={`text-sm px-2 py-1 rounded ${
                        payment.status === 'paid'
                          ? 'bg-green-100 text-green-800'
                          : 'bg-yellow-100 text-yellow-800'
                      }`}
                    >
                      {payment.status}
                    </span>
                  </div>
                ))}
              </div>
            )}
          </Card>
        </div>

        {/* Applications Overview */}
        <Card className="bg-card p-6 rounded-lg shadow">
          <h2 className="text-lg font-semibold mb-3">Applications Overview</h2>
          <div className="text-muted">(API integration coming soon)</div>
        </Card>

        {/* Invoice Download */}
        <Card className="bg-card p-6 rounded-lg shadow">
          <h2 className="text-lg font-semibold mb-3">Documents</h2>
          <div className="flex gap-4">
            <Button variant="outline" asChild>
              <a href="/static/partner-invoice-sample.pdf" download>
                Download Invoice (Sample)
              </a>
            </Button>
          </div>
        </Card>
      </div>
    </div>
  );
};

export default PartnerDashboard;

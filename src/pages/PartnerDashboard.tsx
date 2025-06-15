
import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { supabase } from '@/integrations/supabase/client';
import { Spinner } from '@/components/Spinner';

const BackToHomeBtn = ({ className = "" }: { className?: string }) => {
  const navigate = useNavigate();
  return (
    <div className={`relative w-full ${className}`}>
      <div className="container mx-auto px-4 mt-8 mb-0 flex items-center">
        <button
          type="button"
          className="bg-transparent px-3 py-1 rounded-lg flex items-center text-cap-teal hover:bg-cap-teal/10"
          onClick={() => navigate('/')}
        >
          <span className="mr-2 text-lg">&#8592;</span>
          Back to Home
        </button>
      </div>
    </div>
  )
};

const PartnerDashboard: React.FC = () => {
  const navigate = useNavigate();
  const [partner, setPartner] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  // Only fetch if logged-in
  useEffect(() => {
    async function fetchPartner() {
      setLoading(true);
      const { data: { user } } = await supabase.auth.getUser();
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
        <div className="bg-card p-8 rounded-xl shadow-lg w-full max-w-md">
          <h1 className="text-xl font-bold mb-4 text-center text-primary">No Partner Profile Found</h1>
          <p className="mb-4 text-center text-muted">Please register as a partner.</p>
          <button
            className="bg-cap-teal text-white rounded-lg px-5 py-2"
            onClick={() => navigate('/partner/register')}
          >
            Register as Partner
          </button>
        </div>
      </div>
    );
  }

  // Pending payment: force to checkout
  if (partner.status !== 'active') {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center bg-background-subtle">
        <BackToHomeBtn />
        <div className="bg-card p-8 rounded-xl shadow-lg w-full max-w-xl text-center">
          <h1 className="text-2xl font-bold mb-2 text-primary">Complete Your Subscription</h1>
          <p className="mb-4 text-foreground-muted">
            To access all partner features, please complete your subscription payment via EFT or your business banking app.<br /><br />
            Once payment is confirmed by EduEasy, your dashboard and partner features will be fully unlocked.
          </p>
          <button
            className="bg-cap-coral hover:bg-cap-coral/90 text-white rounded-lg px-5 py-2 mb-2"
            onClick={() => navigate('/partner/checkout')}
          >
            Go to Payment Page
          </button>
          <div className="border w-full border-dashed border-cap-teal rounded-lg p-4 mt-2 text-left bg-cap-teal/5">
            <strong>Need help or confirmed payment already?</strong>
            <br />
            Email <a href="mailto:partners@edueasy.co.za" className="text-cap-teal underline">partners@edueasy.co.za</a><br />
            or WhatsApp 060 123 4567
          </div>
        </div>
      </div>
    );
  }

  // Access granted: show actual dashboard
  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-background-subtle">
      <BackToHomeBtn />
      <div className="bg-card p-8 rounded-xl shadow-lg w-full max-w-2xl">
        <h1 className="text-2xl font-bold mb-6 text-center text-primary">Partner Dashboard</h1>
        <p className="mb-4 text-foreground-muted text-center">
          Welcome! Here you will see all your applications and data once your partnership is
          established.
        </p>
        <div className="border border-border rounded-lg p-6 bg-background-subtle text-foreground">
          <h2 className="text-lg font-semibold mb-2">Applications Overview</h2>
          <div className="text-muted">(API integration coming soon)</div>
        </div>
      </div>
    </div>
  );
};

export default PartnerDashboard;

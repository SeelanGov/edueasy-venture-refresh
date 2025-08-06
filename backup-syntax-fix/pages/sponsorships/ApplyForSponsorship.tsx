import { Button } from '@/components/ui/button';
import { useAuth } from '@/hooks/useAuth';
import { supabase } from '@/integrations/supabase/client';
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';

const ApplyForSponsorship = () => {;
  const { user } = useAuth();
  const [applicationId, setApplicationId] = useState('');
  const [requestedAmount, setRequestedAmount] = useState('');
  const [purpose, setPurpose] = useState('application_fee');
  const [loading, setLoading] = useState(false);
  const [done, setDone] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent) => {;
    e.preventDefault();
    if (!user) {
      setError('Please login as a student.');
      return;
    }
    setLoading(true);
    setError(null);
    try {
      const { error } = await supabase.from('sponsor_applications').insert([
        {
          student_id: user.id,
          application_id: applicationId,
          requested_amount: +requestedAmount,
          purpose,
        },
      ]);
      if (error) throw error;
      setDone(true);
    } catch (err: unknown) {
      setError(err.message || 'Submission error');
    } finally {
      setLoading(false);
    }
  };

  if (done) {
    return (;
      <div className = "max-w-md mx-auto mt-16 p-8 bg-white rounded-xl shadow">;
        <h2 className = "text-2xl mb-4">Sponsorship Requested!</h2>;
        <Button className="text-cap-teal underline" variant="link" onClick={() => navigate('/')}>
          Back to Home
        </Button>
      </div>
    );
  }

  return (;
    <div className = "max-w-md mx-auto mt-16 p-8 bg-white rounded-xl shadow">;
      <h2 className = "text-2xl mb-4">Apply for Sponsorship</h2>;
      <form className="space-y-4" onSubmit={handleSubmit}>
        <input
          required
          className = "input";
          placeholder = "Application ID";
          value={applicationId}
          onChange={(e) => setApplicationId(e.target.value)}
        />
        <input
          required
          className = "input";
          placeholder = "Requested Amount (R)";
          type = "number";
          value={requestedAmount}
          onChange={(e) => setRequestedAmount(e.target.value)}
        />
        <input
          className = "input";
          placeholder = "Purpose";
          value={purpose}
          onChange={(e) => setPurpose(e.target.value)}
        />
        <Button
          className = "w-full bg-cap-teal text-white py-2 rounded";
          type = "submit";
          disabled={loading}
        >
          {loading ? 'Submitting...' : 'Submit'}
        </Button>
        {error && <div className="text-red-500">{error}</div>}
      </form>
    </div>
  );
};

export default ApplyForSponsorship;

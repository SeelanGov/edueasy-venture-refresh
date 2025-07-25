import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
// Import supabase for registration (assume import path for client)
import { supabase } from '@/integrations/supabase/client';

const PartnerRegister: React.FC = () => {
  const navigate = useNavigate();
  const [form, setForm] = useState({
    instituteName: '',
    username: '',
    password: '',
    confirmPassword: '',
    email: '',
  });
  const [tier, setTier] = useState<'basic' | 'standard' | 'premium'>('basic');
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [loading, setLoading] = useState(false);

  const tierOptions = [
    {
      value: 'basic',
      label: 'Basic',
      price: 'R50,000',
      description: 'Up to 100 applications/month',
    },
    {
      value: 'standard',
      label: 'Standard',
      price: 'R150,000',
      description: 'Up to 500 applications/month',
    },
    {
      value: 'premium',
      label: 'Premium',
      price: 'R300,000',
      description: 'Unlimited applications',
    },
  ];

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>): void => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setSuccess('');
    if (
      !form.instituteName ||
      !form.username ||
      !form.password ||
      !form.confirmPassword ||
      !form.email
    ) {
      setError('All fields are required.');
      return;
    }
    if (form.password !== form.confirmPassword) {
      setError('Passwords do not match.');
      return;
    }

    setLoading(true);

    // 1. Create user account
    const { error: signUpError, data } = await supabase.auth.signUp({
      email: form.email,
      password: form.password,
      options: {
        data: {
          username: form.username,
        },
      },
    });

    if (signUpError) {
      setError(signUpError.message || 'Error creating account.');
      setLoading(false);
      return;
    }

    // 2. Create partner record with required 'type' and tier
    if (data.user) {
      const { error: partnerError } = await supabase.from('partners').insert({
        name: form.instituteName,
        type: 'university', // REQUIRED: type is not nullable per schema
        email: form.email,
        contact_email: form.email,
        phone: null,
        website: null,
        status: 'pending',
        tier: tier, // Add selected tier
        created_by: data.user.id,
      });

      if (partnerError) {
        setError(partnerError.message || 'Failed to complete registration. Contact support.');
        setLoading(false);
        return;
      }

      setSuccess('Account created! Please check your email to verify.');
      setTimeout(() => navigate('/partner/dashboard'), 1500);
    }
    setLoading(false);
  };

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-background-subtle">
      <div className="relative w-full">
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
      <Card className="bg-card p-8 rounded-xl shadow-lg w-full max-w-md mt-0">
        <h1 className="text-2xl font-bold mb-6 text-center text-primary">
          Partner Institute Registration
        </h1>
        <form onSubmit={handleSubmit} className="flex flex-col gap-4">
          <input
            type="text"
            name="instituteName"
            placeholder="Institute Name"
            value={form.instituteName}
            onChange={handleChange}
            className="border border-border rounded px-3 py-2 bg-background text-foreground"
            required
          />
          <input
            type="text"
            name="username"
            placeholder="Username"
            value={form.username}
            onChange={handleChange}
            className="border border-border rounded px-3 py-2 bg-background text-foreground"
            required
          />
          <input
            type="email"
            name="email"
            placeholder="Email"
            value={form.email}
            onChange={handleChange}
            className="border border-border rounded px-3 py-2 bg-background text-foreground"
            required
          />
          <input
            type="password"
            name="password"
            placeholder="Password"
            value={form.password}
            onChange={handleChange}
            className="border border-border rounded px-3 py-2 bg-background text-foreground"
            required
          />
          <input
            type="password"
            name="confirmPassword"
            placeholder="Confirm Password"
            value={form.confirmPassword}
            onChange={handleChange}
            className="border border-border rounded px-3 py-2 bg-background text-foreground"
            required
          />

          {/* Tier Selection */}
          <div className="space-y-4">
            <Label className="text-base font-semibold">Select Your Plan</Label>
            <RadioGroup
              value={tier}
              onValueChange={(value) => setTier(value as 'basic' | 'standard' | 'premium')}
            >
              {tierOptions.map((option) => (
                <div
                  key={option.value}
                  className="flex items-center space-x-2 p-3 border rounded-lg hover:bg-gray-50"
                >
                  <RadioGroupItem value={option.value} id={option.value} />
                  <Label htmlFor={option.value} className="flex-1 cursor-pointer">
                    <div className="font-medium">{option.label}</div>
                    <div className="text-sm text-muted-foreground">{option.description}</div>
                    <div className="text-lg font-bold text-primary">{option.price}</div>
                  </Label>
                </div>
              ))}
            </RadioGroup>
          </div>

          {error && <div className="text-red-500 text-sm">{error}</div>}
          {success && <div className="text-green-500 text-sm">{success}</div>}
          <Button
            type="submit"
            disabled={loading}
            className="bg-orange-500 hover:bg-orange-600 text-white font-semibold rounded-lg px-5 py-2 mt-2 transition-colors duration-150"
          >
            {loading ? 'Registering...' : 'Register'}
          </Button>
        </form>
        <div className="mt-4 text-center text-sm">
          Already have an account?{' '}
          <Button
            variant="ghost"
            className="text-primary underline p-0 h-auto font-normal"
            onClick={() => navigate('/partner/login')}
          >
            Log in
          </Button>
        </div>
      </div>
    </div>
  );
};

export default PartnerRegister;

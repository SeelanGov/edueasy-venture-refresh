import { Button } from '@/components/ui/button';
import { toast } from '@/components/ui/use-toast';
import { supabase } from '@/integrations/supabase/client';
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';

const SponsorRegister = (): void => {
  const [form, setForm] = useState({
    email: '',
    name: '',
    phone: '',
    organization_type: '',
    password: '',
  });
  const [loading, setLoading] = useState(false);
  const [registered, setRegistered] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const navigate = useNavigate();

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>): void => {
    setForm((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    try {
      // Step 1: Create user account with Supabase Auth
      const { data: authData, error: authError } = await supabase.auth.signUp({
        email: form.email,
        password: form.password,
        options: {
          data: {
            name: form.name,
            user_type: 'sponsor',
          },
        },
      });

      if (authError) throw authError;

      if (!authData.user) {
        throw new Error('Failed to create user account');
      }

      // Step 2: Create sponsor profile in sponsors table (without password)
      const { error: profileError } = await supabase.from('sponsors').insert([
        {
          id: authData.user.id, // Link to auth user
          email: form.email,
          name: form.name,
          phone: form.phone,
          organization_type: form.organization_type,
          // NO PASSWORD STORED - Supabase Auth handles this securely
        },
      ]);

      if (profileError) {
        // If profile creation fails, clean up the auth user
        await supabase.auth.signOut();
        throw profileError;
      }

      // Step 3: Create user record in users table
      const { error: userError } = await supabase.from('users').insert([
        {
          id: authData.user.id,
          email: form.email,
          user_type: 'sponsor',
          name: form.name,
        },
      ]);

      if (userError) {
        // If user record creation fails, clean up
        await supabase.auth.signOut();
        await supabase.from('sponsors').delete().eq('id', authData.user.id);
        throw userError;
      }

      setRegistered(true);
      toast({
        title: 'Registration Successful',
        description: 'Your sponsor account has been created successfully.',
        variant: 'default',
      });
    } catch (err: unknown) {
      setError(err.message || 'Error registering sponsor');
      toast({
        title: 'Registration Failed',
        description: err.message || 'Error registering sponsor',
        variant: 'destructive',
      });
    } finally {
      setLoading(false);
    }
  };

  if (registered) {
    return (
      <div className="max-w-md mx-auto mt-16 p-8 bg-white rounded-xl shadow">
        <h2 className="text-2xl mb-4">Registration Successful!</h2>
        <p>
          Please proceed to{' '}
          <Button
            className="text-cap-teal underline"
            variant="link"
            onClick={() => navigate('/sponsors/login')}
          >
            Login
          </Button>
          .
        </p>
      </div>
    );
  }

  return (
    <div className="max-w-md mx-auto mt-16 p-8 bg-white rounded-xl shadow">
      <h2 className="text-2xl mb-4">Sponsor Registration</h2>
      <form className="space-y-4" onSubmit={handleRegister}>
        <input
          name="name"
          onChange={handleChange}
          value={form.name}
          className="input"
          required
          placeholder="Name"
        />
        <input
          name="email"
          onChange={handleChange}
          value={form.email}
          className="input"
          required
          type="email"
          placeholder="Email"
        />
        <input
          name="phone"
          onChange={handleChange}
          value={form.phone}
          className="input"
          placeholder="Phone"
        />
        <select
          name="organization_type"
          onChange={handleChange}
          value={form.organization_type}
          className="input"
          required
        >
          <option value="">Organization Type</option>
          <option value="individual">Individual</option>
          <option value="company">Company</option>
          <option value="ngo">NGO</option>
          <option value="government">Government</option>
        </select>
        <input
          name="password"
          onChange={handleChange}
          value={form.password}
          className="input"
          required
          type="password"
          placeholder="Password"
          minLength={6}
        />
        <Button
          type="submit"
          className="w-full bg-cap-teal text-white py-2 rounded"
          disabled={loading}
        >
          {loading ? 'Registering...' : 'Register'}
        </Button>
        {error && <div className="text-red-500">{error}</div>}
      </form>
    </div>
  );
};

export default SponsorRegister;

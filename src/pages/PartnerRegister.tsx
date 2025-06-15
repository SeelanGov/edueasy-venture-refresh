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
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [loading, setLoading] = useState(false);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
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

    // 2. Create partner record with 'pending' status (restrict dashboard)
    // Only run this if registration succeeded
    if (data.user) {
      // Save partner info in partners table.
      const { error: partnerError } = await supabase.from('partners').insert({
        name: form.instituteName,
        email: form.email,
        contact_email: form.email,
        phone: null,
        website: null,
        status: 'pending', // valid value per schema
        created_by: data.user.id,
      });

      if (partnerError) {
        setError(partnerError.message || 'Failed to complete registration. Contact support.');
        setLoading(false);
        return;
      }

      setSuccess('Account created! Please check your email to verify.');
      // Redirect to dashboard after slight delay
      setTimeout(() => navigate('/partner/dashboard'), 1500);
    }
    setLoading(false);
  };

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-background-subtle">
      <div className="bg-card p-8 rounded-xl shadow-lg w-full max-w-md">
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
          {error && <div className="text-red-500 text-sm">{error}</div>}
          {success && <div className="text-green-500 text-sm">{success}</div>}
          <button
            type="submit"
            disabled={loading}
            className="bg-orange-500 hover:bg-orange-600 text-white font-semibold rounded-lg px-5 py-2 mt-2 transition-colors duration-150"
          >
            {loading ? "Registering..." : "Register"}
          </button>
        </form>
        <div className="mt-4 text-center text-sm">
          Already have an account?{' '}
          <button className="text-primary underline" onClick={() => navigate('/partner/login')}>
            Log in
          </button>
        </div>
      </div>
    </div>
  );
};

export default PartnerRegister;

import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { supabase } from '@/integrations/supabase/client';
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { toast } from 'sonner';

const InstitutionLogin: React.FC = () => {
  const navigate = useNavigate();
  const [form, setForm] = useState({ email: '', password: '' });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    if (!form.email || !form.password) {
      setError('Both fields are required.');
      setLoading(false);
      return;
    }

    try {
      const { data, error } = await supabase.auth.signInWithPassword({
        email: form.email,
        password: form.password,
      });

      if (error) throw error;

      // Check if user is an institution
      const { data: userData, error: userError } = await supabase
        .from('users')
        .select('user_type')
        .eq('id', data.user.id)
        .single();

      if (userError || userData?.user_type !== 'institution') {
        await supabase.auth.signOut();
        throw new Error('Invalid institution credentials');
      }

      toast.success('Successfully logged in!');
      navigate('/institutions/dashboard');
    } catch (err: unknown) {
      const errorMessage = err instanceof Error ? err.message : 'Login error';
      setError(errorMessage);
      toast.error(errorMessage);
    } finally {
      setLoading(false);
    }
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
        <h1 className="text-2xl font-bold mb-6 text-center text-cap-teal">Institution Login</h1>
        <form onSubmit={handleSubmit} className="flex flex-col gap-4">
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
          {error && <div className="text-red-500 text-sm">{error}</div>}
          <Button
            type="submit"
            disabled={loading}
            className="bg-cap-teal hover:bg-cap-teal/90 text-white font-semibold rounded-lg px-5 py-2 mt-2 transition-colors duration-150"
          >
            {loading ? 'Logging in...' : 'Log In'}
          </Button>
        </form>
        <div className="mt-4 text-center text-sm">
          Don&apos;t have an account?{' '}
          <Button
            variant="ghost"
            className="text-cap-teal underline p-0 h-auto font-normal"
            onClick={() => navigate('/institutions/register')}
          >
            Register
          </Button>
        </div>
      </Card>
    </div>
  );
};

export default InstitutionLogin;

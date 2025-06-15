
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';

const PartnerLogin: React.FC = () => {
  const navigate = useNavigate();
  const [form, setForm] = useState({ username: '', password: '' });
  const [error, setError] = useState('');

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    if (!form.username || !form.password) {
      setError('Both fields are required.');
      return;
    }
    // Simulate login success
    navigate('/partner/dashboard');
  };

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-background-subtle">
      <div className="relative w-full">
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
      <div className="bg-card p-8 rounded-xl shadow-lg w-full max-w-md mt-0">
        <h1 className="text-2xl font-bold mb-6 text-center text-primary">Partner Login</h1>
        <form onSubmit={handleSubmit} className="flex flex-col gap-4">
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
            type="password"
            name="password"
            placeholder="Password"
            value={form.password}
            onChange={handleChange}
            className="border border-border rounded px-3 py-2 bg-background text-foreground"
            required
          />
          {error && <div className="text-red-500 text-sm">{error}</div>}
          <button
            type="submit"
            className="bg-orange-500 hover:bg-orange-600 text-white font-semibold rounded-lg px-5 py-2 mt-2 transition-colors duration-150"
          >
            Log In
          </button>
        </form>
        <div className="mt-4 text-center text-sm">
          Don&apos;t have an account?{' '}
          <button className="text-primary underline" onClick={() => navigate('/partner/register')}>
            Register
          </button>
        </div>
      </div>
    </div>
  );
};

export default PartnerLogin;

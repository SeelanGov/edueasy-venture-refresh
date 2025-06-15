
import React, { useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useNavigate } from "react-router-dom";

const SponsorRegister = () => {
  const [form, setForm] = useState({
    email: "",
    name: "",
    phone: "",
    organization_type: "",
    password: ""
  });
  const [loading, setLoading] = useState(false);
  const [registered, setRegistered] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const navigate = useNavigate();

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    setForm(prev => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    try {
      // Simulate password hash for PoC (real app: hash server side)
      const { error } = await supabase
        .from("sponsors")
        .insert([
          {
            email: form.email,
            name: form.name,
            phone: form.phone,
            organization_type: form.organization_type,
            password_hash: form.password // Do NOT do this in production
          }
        ]);
      if (error) throw error;
      setRegistered(true);
    } catch (err: any) {
      setError(err.message || "Error registering sponsor");
    } finally {
      setLoading(false);
    }
  };

  if (registered) {
    return (
      <div className="max-w-md mx-auto mt-16 p-8 bg-white rounded-xl shadow">
        <h2 className="text-2xl mb-4">Registration Successful!</h2>
        <p>Please proceed to <button className="text-cap-teal underline" onClick={() => navigate("/sponsors/login")}>Login</button>.</p>
      </div>
    );
  }

  return (
    <div className="max-w-md mx-auto mt-16 p-8 bg-white rounded-xl shadow">
      <h2 className="text-2xl mb-4">Sponsor Registration</h2>
      <form className="space-y-4" onSubmit={handleRegister}>
        <input name="name" onChange={handleChange} value={form.name} className="input" required placeholder="Name" />
        <input name="email" onChange={handleChange} value={form.email} className="input" required type="email" placeholder="Email" />
        <input name="phone" onChange={handleChange} value={form.phone} className="input" placeholder="Phone" />
        <select name="organization_type" onChange={handleChange} value={form.organization_type} className="input" required>
          <option value="">Organization Type</option>
          <option value="individual">Individual</option>
          <option value="company">Company</option>
          <option value="ngo">NGO</option>
          <option value="government">Government</option>
        </select>
        <input name="password" onChange={handleChange} value={form.password} className="input" required type="password" placeholder="Password" />
        <button type="submit" className="w-full bg-cap-teal text-white py-2 rounded" disabled={loading}>
          {loading ? "Registering..." : "Register"}
        </button>
        {error && <div className="text-red-500">{error}</div>}
      </form>
    </div>
  );
};

export default SponsorRegister;

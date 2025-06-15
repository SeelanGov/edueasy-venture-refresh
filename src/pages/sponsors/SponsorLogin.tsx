
import React, { useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useNavigate } from "react-router-dom";

const SponsorLogin = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    try {
      const { data, error } = await supabase
        .from("sponsors")
        .select("*")
        .eq("email", email)
        .eq("password_hash", password)
        .maybeSingle();

      if (!data || error) throw new Error("Invalid email or password");

      // For PoC: Store sponsor ID in localStorage
      localStorage.setItem("sponsor_id", data.id);
      navigate("/sponsors/dashboard");
    } catch (err: any) {
      setError(err.message || "Login error");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-md mx-auto mt-16 p-8 bg-white rounded-xl shadow">
      <h2 className="text-2xl mb-4">Sponsor Login</h2>
      <form className="space-y-4" onSubmit={handleLogin}>
        <input className="input" required placeholder="Email" type="email" value={email} onChange={e=>setEmail(e.target.value)} />
        <input className="input" required placeholder="Password" type="password" value={password} onChange={e=>setPassword(e.target.value)} />
        <button type="submit" className="w-full bg-cap-teal text-white py-2 rounded" disabled={loading}>
          {loading ? "Logging in..." : "Login"}
        </button>
        {error && <div className="text-red-500">{error}</div>}
      </form>
    </div>
  );
};

export default SponsorLogin;

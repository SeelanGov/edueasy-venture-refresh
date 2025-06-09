
import React, { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { ArrowLeft } from "lucide-react";

const PartnerLogin: React.FC = () => {
  const navigate = useNavigate();
  const [form, setForm] = useState({ username: "", password: "" });
  const [error, setError] = useState("");

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    if (!form.username || !form.password) {
      setError("Both fields are required.");
      return;
    }
    // Simulate login success
    navigate("/partner/dashboard");
  };

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gray-50">
      <div className="absolute top-8 left-8">
        <Link 
          to="/" 
          className="inline-flex items-center text-cap-teal hover:text-cap-teal/80 transition-colors font-medium"
        >
          <ArrowLeft className="h-5 w-5 mr-2" />
          Back to Home
        </Link>
      </div>

      <div className="bg-white p-8 rounded-xl shadow-lg w-full max-w-md">
        <h1 className="text-2xl font-bold mb-6 text-center text-gray-900">Partner Login</h1>
        <form onSubmit={handleSubmit} className="flex flex-col gap-4">
          <input
            type="text"
            name="username"
            placeholder="Username"
            value={form.username}
            onChange={handleChange}
            className="border border-gray-300 rounded px-3 py-2 bg-white text-gray-900"
            required
          />
          <input
            type="password"
            name="password"
            placeholder="Password"
            value={form.password}
            onChange={handleChange}
            className="border border-gray-300 rounded px-3 py-2 bg-white text-gray-900"
            required
          />
          {error && <div className="text-red-500 text-sm">{error}</div>}
          <button
            type="submit"
            className="bg-cap-teal hover:bg-cap-teal/90 text-white font-semibold rounded-lg px-5 py-2 mt-2 transition-colors duration-150"
          >
            Log In
          </button>
        </form>
        <div className="mt-4 text-center text-sm">
          Don&apos;t have an account?{' '}
          <button className="text-cap-teal underline" onClick={() => navigate('/partner/register')}>
            Register
          </button>
        </div>
      </div>
    </div>
  );
};

export default PartnerLogin;

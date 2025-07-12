
import React from "react";
import { useSponsorApplications } from "@/hooks/useSponsorApplications";
import { useNavigate } from "react-router-dom";
import { useAuth } from "@/hooks/useAuth";

const SponsorDashboard = () => {
  const { applications, loading, refresh } = useSponsorApplications({ asSponsor: true });
  const { userType } = useAuth();
  const navigate = useNavigate();

  if (userType !== 'sponsor') {
    return <div className="max-w-md mx-auto mt-16 p-8 bg-white rounded-xl shadow">
      <h2 className="text-2xl mb-4">Unauthenticated</h2>
      <p>Please <button className="text-cap-teal underline" onClick={() => navigate("/sponsors/login")}>Login</button> as sponsor.</p>
    </div>
  }

  return (
    <div className="max-w-3xl mx-auto mt-10">
      <h2 className="text-2xl mb-4">Sponsor Dashboard</h2>
      {loading ? <div>Loading...</div> : (
        <table className="min-w-full border rounded">
          <thead>
            <tr>
              <th className="px-2 py-1">Application ID</th>
              <th className="px-2 py-1">Student ID</th>
              <th className="px-2 py-1">Sponsored Amount</th>
              <th className="px-2 py-1">Status</th>
              <th className="px-2 py-1">Paid At</th>
            </tr>
          </thead>
          <tbody>
            {applications.map((row: any) => (
              <tr key={row.id}>
                <td className="px-2 py-1">{row.sponsor_application_id}</td>
                <td className="px-2 py-1">{row.sponsor_applications?.student_id}</td>
                <td className="px-2 py-1">{row.sponsored_amount}</td>
                <td className="px-2 py-1">{row.payment_status}</td>
                <td className="px-2 py-1">{row.paid_at ? new Date(row.paid_at).toLocaleString() : "-"}</td>
              </tr>
            ))}
            {applications.length === 0 && (
              <tr>
                <td colSpan={5} className="text-center text-gray-400 py-4">No sponsorships found.</td>
              </tr>
            )}
          </tbody>
        </table>
      )}
    </div>
  );
};

export default SponsorDashboard;

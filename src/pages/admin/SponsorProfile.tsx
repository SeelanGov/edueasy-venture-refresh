
import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { supabase } from '@/integrations/supabase/client';
import { SponsorAllocation } from '@/types/SponsorTypes';

const SponsorProfile = () => {
  const { id } = useParams();
  const [sponsor, setSponsor] = useState(null);
  const [allocations, setAllocations] = useState<SponsorAllocation[]>([]);

  useEffect(() => {
    // Load sponsor profile and allocations
    supabase.from('partners').select('*').eq('id', id).maybeSingle().then(({ data }) => {
      setSponsor(data || null);
    });
    supabase.from('sponsor_allocations').select('*').eq('sponsor_id', id).then(({ data }) => {
      setAllocations(data || []);
    });
  }, [id]);

  if (!sponsor) return <div className="p-8">Loading sponsor profile...</div>;

  return (
    <div className="p-8">
      <h1 className="text-3xl font-bold mb-2">{sponsor.name || sponsor.id}</h1>
      <div className="mb-4">
        <div className="text-gray-600"><strong>Status:</strong> {sponsor.status}</div>
        <div className="text-gray-600"><strong>Email:</strong> {sponsor.email}</div>
        <div className="text-gray-600"><strong>Phone:</strong> {sponsor.phone || '-'}</div>
        <div className="text-gray-600"><strong>Contact Person:</strong> {sponsor.contact_person || '-'}</div>
        <div className="text-gray-600"><strong>Website:</strong> <a href={sponsor.website} className="text-blue-600 underline" target="_blank" rel="noopener noreferrer">{sponsor.website}</a></div>
      </div>
      <h2 className="text-2xl font-semibold mb-2 mt-6">Student Allocations</h2>
      <table className="min-w-full border rounded">
        <thead>
          <tr>
            <th className="px-3 py-2">Student ID</th>
            <th className="px-3 py-2">Status</th>
            <th className="px-3 py-2">Plan</th>
            <th className="px-3 py-2">Notes</th>
          </tr>
        </thead>
        <tbody>
          {allocations.map(a => (
            <tr key={a.id}>
              <td className="px-3 py-2">{a.student_id}</td>
              <td className="px-3 py-2">{a.status}</td>
              <td className="px-3 py-2">{a.plan || '-'}</td>
              <td className="px-3 py-2">{a.notes || '-'}</td>
            </tr>
          ))}
          {allocations.length === 0 && <tr><td colSpan={4} className="text-center text-gray-400 py-8">No allocations found</td></tr>}
        </tbody>
      </table>
      <div className="mt-8">
        <h3 className="text-lg font-semibold mb-2">Notes & Payment History</h3>
        <div className="text-gray-500">(Enhance this section with partner_notes and payment history)</div>
      </div>
    </div>
  );
};
export default SponsorProfile;

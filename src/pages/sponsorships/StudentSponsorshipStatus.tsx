import { useSponsorApplications } from '@/hooks/useSponsorApplications';

// Type-safe interface for application row
interface ApplicationRow {
  id: string;
  application_id: string;
  requested_amount: number;
  status: string;
  purpose: string;
  created_at: string;
}

export default function StudentSponsorshipStatus(): JSX.Element {
  const { applications, loading } = useSponsorApplications({ asSponsor: false });

  return (
    <div className="max-w-3xl mx-auto mt-10">
      <h2 className="text-2xl mb-4">My Sponsorship Applications</h2>
      {loading ? (
        <div>Loading...</div>
      ) : (
        <table className="min-w-full border rounded">
          <thead>
            <tr>
              <th className="px-2 py-1">Application ID</th>
              <th className="px-2 py-1">Requested Amount</th>
              <th className="px-2 py-1">Status</th>
              <th className="px-2 py-1">Purpose</th>
              <th className="px-2 py-1">Created At</th>
            </tr>
          </thead>
          <tbody>
            {applications.map((row: ApplicationRow) => (
              <tr key={row.id}>
                <td className="px-2 py-1">{row.application_id}</td>
                <td className="px-2 py-1">{row.requested_amount}</td>
                <td className="px-2 py-1">{row.status}</td>
                <td className="px-2 py-1">{row.purpose}</td>
                <td className="px-2 py-1">
                  {row.created_at ? new Date(row.created_at).toLocaleString() : '-'}
                </td>
              </tr>
            ))}
            {applications.length === 0 && (
              <tr>
                <td colSpan={5} className="text-center text-gray-400 py-4">
                  No sponsorship applications found.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      )}
    </div>
  );
}
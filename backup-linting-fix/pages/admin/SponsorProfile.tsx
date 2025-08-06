import { useParams } from 'react-router-dom';
import { useSponsor } from '@/hooks/useSponsor';
import { useSponsorAllocations } from '@/hooks/useSponsorAllocations';
import { useSponsorNotes } from '@/hooks/useSponsorNotes';
import { useSponsorPayments } from '@/hooks/useSponsorPayments';
import SponsorNoteTimeline from '@/components/sponsor/SponsorNoteTimeline';
import SponsorPaymentHistory from '@/components/sponsor/SponsorPaymentHistory';
import SponsorStudentTable from '@/components/sponsor/SponsorStudentTable';
import { Spinner } from '@/components/Spinner';

const SponsorProfile = () => {
  const { id } = useParams<{ id: string }>();
  const { data: sponsor, isLoading: sponsorLoading } = useSponsor(id);
  const { allocations, loading: allocationsLoading } = useSponsorAllocations({ sponsorId: id });
  const { data: notes = [], isLoading: notesLoading } = useSponsorNotes(id);
  const { data: payments = [], isLoading: paymentsLoading } = useSponsorPayments(id);

  if (sponsorLoading || allocationsLoading) {
    return (
      <div className="flex items-center justify-center py-24">
        <Spinner size="md" />
        <span className="ml-3 text-gray-500">Loading sponsor profile…</span>
      </div>
    );
  }
  if (!sponsor) {
    return <div className="p-8 text-center text-gray-400">Sponsor not found.</div>;
  }

  return (
    <div className="p-4 sm:p-8 max-w-4xl mx-auto">
      <h1 className="text-2xl sm:text-3xl font-bold mb-4">{sponsor.name}</h1>
      <section className="mb-6">
        <div className="flex flex-col gap-1 text-gray-600">
          <span>
            <strong>Status:</strong> {sponsor.status}
          </span>
          <span>
            <strong>Email:</strong> {sponsor.email}
          </span>
          <span>
            <strong>Phone:</strong> {sponsor.phone || '-'}
          </span>
          <span>
            <strong>Contact Person:</strong> {sponsor.contact_person || '-'}
          </span>
          <span>
            <strong>Website:</strong>{' '}
            {sponsor.website ? (
              <a
                href={sponsor.website}
                className="text-blue-600 underline"
                target="_blank"
                rel="noopener noreferrer"
              >
                {sponsor.website}
              </a>
            ) : (
              '-'
            )}
          </span>
        </div>
      </section>

      {/* Student Allocations */}
      <section className="mb-10">
        <h2 className="text-xl font-semibold mb-2 mt-6">Student Allocations</h2>
        <SponsorStudentTable allocations={allocations} />
      </section>

      {/* CRM Tabs: Notes & Payment History */}
      <section>
        <h2 className="text-xl font-semibold mb-2">Activity Log</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {/* Sponsor Notes */}
          <div>
            <h3 className="font-semibold mb-1">Sponsor Notes</h3>
            {notesLoading ? (
              <div className="text-gray-400 py-8 text-center">Loading notes…</div>
            ) : (
              <SponsorNoteTimeline notes={notes} />
            )}
          </div>
          {/* Payment History */}
          <div>
            <h3 className="font-semibold mb-1">Payment History</h3>
            {paymentsLoading ? (
              <div className="text-gray-400 py-8 text-center">Loading payments…</div>
            ) : (
              <SponsorPaymentHistory payments={payments} />
            )}
          </div>
        </div>
      </section>
    </div>
  );
};
export default SponsorProfile;

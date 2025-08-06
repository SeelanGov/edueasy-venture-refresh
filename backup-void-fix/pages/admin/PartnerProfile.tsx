import NotesTimeline from '@/components/admin/partners/NotesTimeline';
import PartnerIntegrationChecklist from '@/components/admin/partners/PartnerIntegrationChecklist';
import PartnerPaymentHistory from '@/components/admin/partners/PartnerPaymentHistory';
import PartnerStatusBadge from '@/components/admin/partners/PartnerStatusBadge';
import { Spinner } from '@/components/Spinner';
import { Button } from '@/components/ui/button';
import { toast } from '@/components/ui/use-toast'; // show toast on error
import { usePartner } from '@/hooks/usePartner';
import { usePartnerNotes } from '@/hooks/usePartnerNotes';
import { usePartnerPayments } from '@/hooks/usePartnerPayments';
import React, { useState } from 'react';
import { useParams } from 'react-router-dom';

const TAB_HEADINGS = [
  { id: 'details', label: 'Details' },
  { id: 'integration', label: 'Integration' },
  { id: 'payments', label: 'Payments' },
  { id: 'notes', label: 'Notes' },
  { id: 'settings', label: 'Settings' },
];

const PartnerProfilePage: React.FC = () => {
  const { id = '' } = useParams<{ id: string }>();
  const [tab, setTab] = useState('details');
  const { partner, isLoading } = usePartner(id);
  const { payments } = usePartnerPayments(id);
  const { notes } = usePartnerNotes(id);

  // Display basic errors (if fetching fails and id not found)
  if (isLoading) {
    return (
      <div className="flex items-center justify-center py-24">
        <Spinner size="md" />
        <span className="ml-3 text-gray-500">Loading partner…</span>
      </div>
    );
  }
  if (!partner) {
    toast({
      title: 'Partner not found',
      description: 'This partner either does not exist or could not be loaded.',
      variant: 'destructive',
    });
    return <div className="p-8 text-center text-red-400">Partner not found or unavailable.</div>;
  }

  return (
    <div className="p-4 sm:p-8 max-w-4xl mx-auto">
      <div className="flex items-center gap-3 mb-2">
        <h1 className="text-2xl sm:text-3xl font-bold">{partner.name}</h1>
        <PartnerStatusBadge status={partner.status} tier={partner.tier} type={partner.type} />
      </div>
      <div className="flex gap-3 mb-6">
        {TAB_HEADINGS.map((t) => (
          <Button
            key={t.id}
            variant={tab === t.id ? 'default' : 'ghost'}
            className={`text-sm ${tab === t.id ? 'bg-cap-teal/10 font-bold underline' : ''}`}
            onClick={() => setTab(t.id)}
          >
            {t.label}
          </Button>
        ))}
      </div>
      <div>
        {tab === 'details' && (
          <section className="mb-6">
            <div className="flex flex-col gap-1 text-gray-600">
              <div>
                <strong>Email:</strong> {partner.email}
              </div>
              <div>
                <strong>Phone:</strong> {partner.phone || '-'}
              </div>
              <div>
                <strong>Type:</strong> {partner.type}
              </div>
              <div>
                <strong>Tier:</strong> {partner.tier}
              </div>
              <div>
                <strong>Status:</strong>{' '}
                <PartnerStatusBadge
                  status={partner.status}
                  tier={partner.tier}
                  type={partner.type}
                />
              </div>
              <div>
                <strong>Integration:</strong> {partner.integration_status || '-'}
              </div>
            </div>
          </section>
        )}
        {tab === 'integration' && <PartnerIntegrationChecklist partner={partner} />}
        {tab === 'payments' && <PartnerPaymentHistory payments={payments} />}
        {tab === 'notes' && <NotesTimeline notes={notes} />}
        {tab === 'settings' && (
          <div className="rounded border p-4 text-gray-500 italic">
            Settings editing not implemented yet.
          </div>
        )}
      </div>
    </div>
  );
};

export default PartnerProfilePage;

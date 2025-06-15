
import React, { useState, useMemo } from 'react';
import { useSponsorAllocations } from '@/hooks/useSponsorAllocations';
import { SponsorMetrics } from '@/components/admin/sponsors/SponsorMetrics';
import { SponsorAllocationsTable } from '@/components/admin/sponsors/SponsorAllocationsTable';
import { SponsorFormModal } from '@/components/admin/sponsors/SponsorFormModal';
import { SponsorListTable } from '@/components/admin/sponsors/SponsorListTable';
import { useNavigate } from 'react-router-dom';
import { supabase } from '@/integrations/supabase/client';
import { Sponsor } from '@/types/SponsorTypes';

const SponsorsPage = () => {
  const { allocations, loading, createAllocation, updateAllocation, deleteAllocation } = useSponsorAllocations();
  const [tab, setTab] = useState<'allocations' | 'sponsors'>('allocations');
  const [modalOpen, setModalOpen] = useState(false);
  const [editAlloc, setEditAlloc] = useState<any>(null);
  const [sponsors, setSponsors] = useState<Sponsor[]>([]);
  const navigate = useNavigate();

  // Load sponsors on demand
  React.useEffect(() => {
    if (tab === 'sponsors' && sponsors.length === 0) {
      supabase.from('partners').select('*').eq('type', 'sponsor').then(({ data }) => {
        setSponsors((data as Sponsor[]) || []);
      });
    }
  }, [tab, sponsors.length]);

  // Metrics (basic stats)
  const totalSponsors = useMemo(() => sponsors.length, [sponsors]);
  const activeSponsors = useMemo(() => sponsors.filter(s => s.status === 'active').length, [sponsors]);
  const totalAllocations = allocations.length;
  const activeAllocations = allocations.filter(a => a.status === 'active').length;

  const handleAdd = () => {
    setEditAlloc(null);
    setModalOpen(true);
  };
  const handleEdit = (alloc: any) => {
    setEditAlloc(alloc);
    setModalOpen(true);
  };
  const handleDelete = async (id: string) => {
    if (window.confirm('Are you sure to delete this allocation?')) {
      await deleteAllocation(id);
    }
  };
  const handleSave = async (values: any) => {
    if (editAlloc) {
      await updateAllocation(editAlloc.id, values);
    } else {
      await createAllocation(values);
    }
    setModalOpen(false);
  };

  return (
    <div className="p-8">
      <h1 className="text-3xl font-bold mb-4">Sponsor Management</h1>
      <div className="space-x-2 flex mb-6">
        <button className={tab === 'allocations' ? 'font-bold underline' : ''} onClick={() => setTab('allocations')}>Student Allocations</button>
        <button className={tab === 'sponsors' ? 'font-bold underline' : ''} onClick={() => setTab('sponsors')}>Sponsors List</button>
      </div>
      <SponsorMetrics
        totalSponsors={totalSponsors}
        activeSponsors={activeSponsors}
        totalAllocations={totalAllocations}
        activeAllocations={activeAllocations}
      />
      {tab === 'allocations' && (
        <>
          <div className="flex justify-end mb-2">
            <button
              className="px-4 py-2 bg-cap-teal text-white rounded"
              onClick={handleAdd}
            >
              Add Allocation
            </button>
          </div>
          <SponsorAllocationsTable
            allocations={allocations}
            onEdit={handleEdit}
            onDelete={handleDelete}
          />
        </>
      )}
      {tab === 'sponsors' && (
        <SponsorListTable
          sponsors={sponsors}
          onView={(id: string) => navigate(`/admin/sponsors/${id}`)}
        />
      )}
      <SponsorFormModal
        open={modalOpen}
        allocation={editAlloc}
        onSave={handleSave}
        onClose={() => setModalOpen(false)}
      />
    </div>
  );
};

export default SponsorsPage;

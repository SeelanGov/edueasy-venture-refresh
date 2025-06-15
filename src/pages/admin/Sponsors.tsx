import React, { useState } from 'react';
import { SponsorMetrics } from '@/components/admin/sponsors/SponsorMetrics';
import { SponsorAllocationsTable } from '@/components/admin/sponsors/SponsorAllocationsTable';
import { SponsorFormModal } from '@/components/admin/sponsors/SponsorFormModal';
import { SponsorListTable } from '@/components/admin/sponsors/SponsorListTable';
import { useNavigate } from 'react-router-dom';
import { useSponsorAllocations } from '@/hooks/useSponsorAllocations';
import { useSponsors } from '@/hooks/useSponsors';

const SponsorsPage = () => {
  // Allocations management via data hook
  const {
    allocations,
    loading: allocationsLoading,
    createAllocation,
    updateAllocation,
    deleteAllocation,
    fetchAllocations,
  } = useSponsorAllocations();

  // Sponsors management via query hook
  const {
    data: sponsorList = [],
    isLoading: sponsorsLoading,
    refetch: refetchSponsors,
  } = useSponsors();

  const [tab, setTab] = useState<'allocations' | 'sponsors'>('allocations');
  const [modalOpen, setModalOpen] = useState(false);
  const [editAlloc, setEditAlloc] = useState<any>(null);
  const navigate = useNavigate();

  // Metrics (basic stats)
  const totalSponsors = sponsorList.length;
  const activeSponsors = sponsorList.filter(s => s.status === 'active').length;
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
      fetchAllocations();
    }
  };
  const handleSave = async (values: any) => {
    if (editAlloc) {
      await updateAllocation(editAlloc.id, values);
    } else {
      await createAllocation(values);
    }
    setModalOpen(false);
    fetchAllocations();
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
          sponsors={sponsorList}
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


import React, { useState } from 'react';
import { SponsorMetrics } from '@/components/admin/sponsors/SponsorMetrics';
import { SponsorAllocationsTable } from '@/components/admin/sponsors/SponsorAllocationsTable';
import { SponsorFormModal } from '@/components/admin/sponsors/SponsorFormModal';
import { SponsorListTable } from '@/components/admin/sponsors/SponsorListTable';
import { useNavigate } from 'react-router-dom';
import { useSponsorAllocations } from '@/hooks/useSponsorAllocations';
import { useSponsors } from '@/hooks/useSponsors';

const SponsorsPage = () => {
  // Search & filter state
  const [search, setSearch] = useState('');
  const [typeFilter, setTypeFilter] = useState('');
  // Allocations management via data hook
  const {
    allocations,
    loading: allocationsLoading,
    createAllocation,
    updateAllocation,
    deleteAllocation,
    fetchAllocations,
  } = useSponsorAllocations();

  const {
    data: sponsorList = [],
    isLoading: sponsorsLoading,
    refetch: refetchSponsors,
  } = useSponsors({ search, type: typeFilter });

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
    <div className="p-8 max-w-screen-xl mx-auto">
      <h1 className="text-3xl font-bold mb-4">Sponsor Management</h1>
      {/* Tab navigation */}
      <div className="space-x-2 flex mb-6">
        <button className={tab === 'allocations' ? 'font-bold underline' : ''} onClick={() => setTab('allocations')}>Student Allocations</button>
        <button className={tab === 'sponsors' ? 'font-bold underline' : ''} onClick={() => setTab('sponsors')}>Sponsors List</button>
      </div>
      {/* Search and Filter */}
      <div className="flex flex-wrap gap-2 mb-4">
        <input
          type="text"
          placeholder="Search sponsor name or email"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="rounded border border-gray-300 px-3 py-2 text-sm w-64"
        />
        <select
          value={typeFilter}
          onChange={e => setTypeFilter(e.target.value)}
          className="rounded border border-gray-300 px-3 py-2 text-sm"
        >
          <option value="">All Types</option>
          <option value="corporate">Corporate</option>
          <option value="foundation">Foundation</option>
          <option value="government">Government</option>
          <option value="individual">Individual</option>
          {/* Add other types as required */}
        </select>
        {tab === 'sponsors' && (
          <button
            className="bg-gray-200 text-xs rounded px-3 py-2 ml-2 opacity-60 cursor-not-allowed"
            disabled
            title="Bulk operations coming soon"
          >
            Bulk Operations (soon)
          </button>
        )}
      </div>
      {/* Metrics */}
      <SponsorMetrics
        totalSponsors={totalSponsors}
        activeSponsors={activeSponsors}
        totalAllocations={totalAllocations}
        activeAllocations={activeAllocations}
      />
      {/* Main Table Views */}
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
          {allocationsLoading ? (
            <div className="py-16 text-center text-gray-400">Loading allocations…</div>
          ) : (
            <SponsorAllocationsTable
              allocations={allocations}
              onEdit={handleEdit}
              onDelete={handleDelete}
            />
          )}
        </>
      )}
      {tab === 'sponsors' && (
        <>
          {sponsorsLoading ? (
            <div className="py-16 text-center text-gray-400">Loading sponsors…</div>
          ) : sponsorList.length === 0 ? (
            <div className="py-16 text-center text-gray-400">No sponsors found. Try different search/filters.</div>
          ) : (
            <SponsorListTable
              sponsors={sponsorList}
              onView={(id: string) => navigate(`/admin/sponsors/${id}`)}
            />
          )}
        </>
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

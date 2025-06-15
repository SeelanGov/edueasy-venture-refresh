import React, { useState } from 'react';
import { SponsorMetrics } from '@/components/admin/sponsors/SponsorMetrics';
import { SponsorAllocationsTable } from '@/components/admin/sponsors/SponsorAllocationsTable';
import { SponsorFormModal } from '@/components/admin/sponsors/SponsorFormModal';
import { SponsorListTable } from '@/components/admin/sponsors/SponsorListTable';
import { useNavigate } from 'react-router-dom';
import { useSponsorAllocations } from '@/hooks/useSponsorAllocations';
import { useSponsors } from '@/hooks/useSponsors';
import { toast } from '@/components/ui/use-toast';
import { Spinner } from '@/components/Spinner';
import { exportToCsv } from '@/utils/exportToCsv';
import { FileExport } from 'lucide-react';

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
      const res = await deleteAllocation(id);
      fetchAllocations();
      if (res) {
        toast({
          title: "Allocation deleted successfully",
        });
      } else {
        toast({
          title: "Delete failed",
          variant: "destructive",
        });
      }
    }
  };
  const handleSave = async (values: any) => {
    try {
      if (editAlloc) {
        await updateAllocation(editAlloc.id, values);
        toast({
          title: "Allocation updated",
        });
      } else {
        await createAllocation(values);
        toast({
          title: "Allocation created",
        });
      }
      setModalOpen(false);
      fetchAllocations();
    } catch (err) {
      toast({
        title: "Operation failed",
        variant: "destructive"
      });
    }
  };

  // Export Handlers
  const handleExportAllocations = () => {
    if (allocations.length === 0) {
      toast({ title: "No allocations to export", variant: "destructive" });
      return;
    }
    exportToCsv(
      allocations.map(a => ({
        "Sponsor ID": a.sponsor_id,
        "Student ID": a.student_id,
        Status: a.status,
        Plan: a.plan ?? "",
        "Allocated On": a.allocated_on,
        "Expires On": a.expires_on ?? "",
        Notes: a.notes ?? "",
      })),
      "allocations.csv"
    );
    toast({ title: "Allocations exported!" });
  };

  const handleExportSponsors = () => {
    if (!sponsorList || sponsorList.length === 0) {
      toast({ title: "No sponsors to export", variant: "destructive" });
      return;
    }
    exportToCsv(
      sponsorList.map(s => ({
        "ID": s.id,
        Name: s.name,
        Email: s.email,
        Phone: s.phone ?? "",
        "Contact Person": s.contact_person ?? "",
        Status: s.status,
        Tier: s.tier,
        Website: s.website ?? "",
      })),
      "sponsors.csv"
    );
    toast({ title: "Sponsors exported!" });
  };

  return (
    <div className="p-4 sm:p-8 max-w-screen-xl mx-auto">
      <h1 className="text-2xl sm:text-3xl font-bold mb-4">Sponsor Management</h1>
      {/* Tab navigation */}
      <div className="space-x-2 flex mb-4 sm:mb-6">
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
          className="rounded border border-gray-300 px-3 py-2 text-sm w-full sm:w-64"
        />
        <select
          value={typeFilter}
          onChange={e => setTypeFilter(e.target.value)}
          className="rounded border border-gray-300 px-3 py-2 text-sm w-full sm:w-auto"
        >
          <option value="">All Types</option>
          <option value="corporate">Corporate</option>
          <option value="foundation">Foundation</option>
          <option value="government">Government</option>
          <option value="individual">Individual</option>
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
          <div className="flex items-center justify-between mb-2">
            <button
              className="px-4 py-2 bg-cap-teal text-white rounded"
              onClick={handleAdd}
            >
              Add Allocation
            </button>
            <button
              className="ml-2 inline-flex items-center gap-2 text-cap-teal hover:underline bg-white border border-cap-teal px-3 py-2 rounded shadow-sm text-sm"
              onClick={handleExportAllocations}
              title="Export Allocations"
              type="button"
            >
              <FileExport size={18} className="mr-1" />
              Export CSV
            </button>
          </div>
          {allocationsLoading ? (
            <div className="py-24 flex items-center justify-center">
              <Spinner size="md" />
              <span className="ml-3 text-gray-500">Loading allocations…</span>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <SponsorAllocationsTable
                allocations={allocations}
                onEdit={handleEdit}
                onDelete={handleDelete}
              />
            </div>
          )}
        </>
      )}
      {tab === 'sponsors' && (
        <>
          <div className="flex justify-end mb-2">
            <button
              className="inline-flex items-center gap-2 text-cap-teal hover:underline bg-white border border-cap-teal px-3 py-2 rounded shadow-sm text-sm"
              onClick={handleExportSponsors}
              title="Export Sponsors"
              type="button"
            >
              <FileExport size={18} className="mr-1" />
              Export CSV
            </button>
          </div>
          {sponsorsLoading ? (
            <div className="py-24 flex items-center justify-center">
              <Spinner size="md" />
              <span className="ml-3 text-gray-500">Loading sponsors…</span>
            </div>
          ) : sponsorList.length === 0 ? (
            <div className="py-16 text-center text-gray-400">No sponsors found. Try different search/filters.</div>
          ) : (
            <div className="overflow-x-auto">
              <SponsorListTable
                sponsors={sponsorList}
                onView={(id: string) => navigate(`/admin/sponsors/${id}`)}
              />
            </div>
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

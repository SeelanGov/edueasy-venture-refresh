import { supabase } from '@/integrations/supabase/client';
import { type SponsorAllocation  } from '@/types/SponsorTypes';
import { useCallback, useEffect, useState } from 'react';
import { useState } from 'react';




// Filtering/search/pagination options
export interface SponsorAllocationsOptions {
  sponsorId?: string;
  studentId?: string;
  status?: string;
  search?: string;
  page?: number;
  pageSize?: number;
}

/**
 * useSponsorAllocations
 * @description Function
 */
export const useSponsorAllocations = (options: SponsorAllocationsOptions = {}) => {
  const [allocations, setAllocations] = useState<SponsorAllocation[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [total, setTotal] = useState(0);

  const fetchAllocations = useCallback(async () => {
    setLoading(true);
    setError(null);
    let query = supabase.from('sponsor_allocations').select('*', { count: 'exact' });

    // Filtering
    if (options.sponsorId) query = query.eq('sponsor_id', options.sponsorId);
    if (options.studentId) query = query.eq('student_id', options.studentId);
    if (options.status) query = query.eq('status', options.status);
    if (options.search) {
      query = query.or(`student_id.ilike.%${options.search}%,notes.ilike.%${options.search}%`);
    }
    // Pagination
    if (options.page && options.pageSize) {
      const from = (options.page - 1) * options.pageSize;
      const to = from + options.pageSize - 1;
      query = query.range(from, to);
    }

    query = query.order('created_at', { ascending: false });
    try {
      const { data, error, count } = await query;
      if (error) throw error;
      setAllocations(data ?? []);
      setTotal(count ?? 0);
      // ADDED: Logging for debugging
    } catch (err) {
      setError(
        (err as Error).message
          ? `Failed to fetch allocations: ${(err as Error).message}`
          : 'Failed to fetch allocations',
      );
      setAllocations([]);
      setTotal(0);
      // ADDED: Logging error for traceability
      console.error('[useSponsorAllocations] fetch error', err);
    } finally {
      setLoading(false);
    }
  }, [
    options.sponsorId,
    options.studentId,
    options.status,
    options.search,
    options.page,
    options.pageSize,
  ]);

  // Helper to coerce plan and notes to string or undefined
  const normalizeAllocationPayload = (
    data: Omit<SponsorAllocation, 'id' | 'created_at' | 'updated'>,
  ) => ({
    ...data,
    plan: data.plan ?? '',
    notes: data.notes ?? '',
    expires_on: data.expires_on === '' ? undefined : data.expires_on,
  });

  const createAllocation = async (
    data: Omit<SponsorAllocation, 'id' | 'created_at' | 'updated_at'>,
  ) => {
    setLoading(true);
    setError(null);
    try {
      const payload = normalizeAllocationPayload(data);
      const { data: inserted, error } = await supabase
        .from('sponsor_allocations')
        .insert(payload)
        .select('*')
        .single();
      if (error) throw error;
      fetchAllocations();
      return inserted;
    } catch (err) {
      setError(
        (err as Error).message
          ? `Failed to create allocation: ${(err as Error).message}`
          : 'Failed to create allocation',
      );
      return null;
    } finally {
      setLoading(false);
    }
  };

  const updateAllocation = async (id: string, updates: Partial<SponsorAllocation>) => {
    setLoading(true);
    setError(null);
    try {
      const payload = {
        ...updates,
        plan: updates.plan ?? '',
        notes: updates.notes ?? '',
        expires_on: updates.expires_on === '' ? undefined : updates.expires_on,
      };
      const { data: updated, error } = await supabase
        .from('sponsor_allocations')
        .update(payload)
        .eq('id', id)
        .select('*')
        .single();
      if (error) throw error;
      fetchAllocations();
      return updated;
    } catch (err) {
      setError(
        (err as Error).message
          ? `Failed to update allocation: ${(err as Error).message}`
          : 'Failed to update allocation',
      );
      return null;
    } finally {
      setLoading(false);
    }
  };

  const deleteAllocation = async (id: string) => {
    setLoading(true);
    setError(null);
    try {
      const { error } = await supabase.from('sponsor_allocations').delete().eq('id', id);
      if (error) throw error;
      fetchAllocations();
      return true;
    } catch (err) {
      setError(
        (err as Error).message
          ? `Failed to delete allocation: ${(err as Error).message}`
          : 'Failed to delete allocation',
      );
      return false;
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchAllocations();
  }, [fetchAllocations]);

  return {
    allocations,
    loading,
    error,
    total,
    fetchAllocations,
    createAllocation,
    updateAllocation,
    deleteAllocation,
  };
};

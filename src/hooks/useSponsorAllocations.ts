
import { useState, useEffect, useCallback } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/hooks/useAuth';
import { SponsorAllocation } from '@/types/SponsorTypes';

export const useSponsorAllocations = () => {
  const [allocations, setAllocations] = useState<SponsorAllocation[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const { user } = useAuth();

  const fetchAllocations = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const { data, error } = await supabase
        .from('sponsor_allocations')
        .select('*')
        .order('created_at', { ascending: false });
      if (error) throw error;
      setAllocations(data ?? []);
    } catch (err) {
      setError('Failed to fetch allocations');
      setAllocations([]);
    } finally {
      setLoading(false);
    }
  }, []);

  // Helper to coerce plan and notes to string or undefined
  const normalizeAllocationPayload = (
    data: Omit<SponsorAllocation, 'id' | 'created_at' | 'updated_at'>
  ) => ({
    ...data,
    plan: data.plan ?? '', // never null/undefined
    notes: data.notes ?? '', // never null/undefined
    expires_on: data.expires_on === '' ? undefined : data.expires_on,
  });

  const createAllocation = async (
    data: Omit<SponsorAllocation, 'id' | 'created_at' | 'updated_at'>
  ) => {
    setLoading(true);
    try {
      const payload = normalizeAllocationPayload(data);
      const { data: inserted, error } = await supabase
        .from('sponsor_allocations')
        .insert(payload)
        .select('*')
        .single();
      if (error) throw error;
      await fetchAllocations();
      return inserted;
    } catch (err) {
      setError('Failed to create allocation');
      return null;
    } finally {
      setLoading(false);
    }
  };

  const updateAllocation = async (id: string, updates: Partial<SponsorAllocation>) => {
    setLoading(true);
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
      await fetchAllocations();
      return updated;
    } catch (err) {
      setError('Failed to update allocation');
      return null;
    } finally {
      setLoading(false);
    }
  };

  const deleteAllocation = async (id: string) => {
    setLoading(true);
    try {
      const { error } = await supabase
        .from('sponsor_allocations')
        .delete()
        .eq('id', id);
      if (error) throw error;
      await fetchAllocations();
      return true;
    } catch (err) {
      setError('Failed to delete allocation');
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
    fetchAllocations,
    createAllocation,
    updateAllocation,
    deleteAllocation,
  };
};

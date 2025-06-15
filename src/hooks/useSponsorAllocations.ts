
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

  const createAllocation = async (data: Omit<SponsorAllocation, 'id' | 'created_at' | 'updated_at'>) => {
    setLoading(true);
    try {
      const { data: inserted, error } = await supabase
        .from('sponsor_allocations')
        .insert(data)
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
      const { data: updated, error } = await supabase
        .from('sponsor_allocations')
        .update(updates)
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

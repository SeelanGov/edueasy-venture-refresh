
import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { toast } from '@/hooks/use-toast';
import { useAuth } from '@/hooks/useAuth';

export interface Sponsorship {
  id: string;
  organization_name: string;
  amount: number;
  currency: string;
  start_date: string;
  end_date: string;
  description: string;
  requirements: any;
  status: string;
  sponsorship_level: string;
  logo_url?: string;
  website_url?: string;
  contact_name: string;
  contact_email: string;
  contact_phone: string;
  is_active: boolean;
  created_at: string;
  updated_at: string;
}

export const useSponsorships = () => {
  const [sponsorships, setSponsorships] = useState<Sponsorship[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const { user } = useAuth();

  const fetchSponsorships = async () => {
    setLoading(true);
    setError(null);

    try {
      const { data, error } = await supabase
        .from('sponsorships')
        .select('*')
        .eq('is_active', true)
        .order('created_at', { ascending: false });

      if (error) throw error;
      setSponsorships(data || []);
    } catch (err) {
      console.error('Error fetching sponsorships:', err);
      setError('Failed to load sponsorships');
      toast({
        title: 'Error',
        description: 'Failed to load sponsorships',
        variant: 'destructive',
      });
    } finally {
      setLoading(false);
    }
  };

  const createSponsorship = async (sponsorshipData: Partial<Sponsorship>) => {
    if (!user) {
      toast({
        title: 'Authentication required',
        description: 'Please log in to create a sponsorship',
        variant: 'destructive',
      });
      return null;
    }

    try {
      const { data, error } = await supabase
        .from('sponsorships')
        .insert([sponsorshipData])
        .select()
        .single();

      if (error) throw error;

      await fetchSponsorships();
      toast({
        title: 'Success',
        description: 'Sponsorship created successfully',
      });
      return data;
    } catch (err) {
      console.error('Error creating sponsorship:', err);
      toast({
        title: 'Error',
        description: 'Failed to create sponsorship',
        variant: 'destructive',
      });
      return null;
    }
  };

  const updateSponsorship = async (id: string, updates: Partial<Sponsorship>) => {
    try {
      const { data, error } = await supabase
        .from('sponsorships')
        .update(updates)
        .eq('id', id)
        .select()
        .single();

      if (error) throw error;

      await fetchSponsorships();
      toast({
        title: 'Success',
        description: 'Sponsorship updated successfully',
      });
      return data;
    } catch (err) {
      console.error('Error updating sponsorship:', err);
      toast({
        title: 'Error',
        description: 'Failed to update sponsorship',
        variant: 'destructive',
      });
      return null;
    }
  };

  const deleteSponsorship = async (id: string) => {
    try {
      const { error } = await supabase
        .from('sponsorships')
        .delete()
        .eq('id', id);

      if (error) throw error;

      await fetchSponsorships();
      toast({
        title: 'Success',
        description: 'Sponsorship deleted successfully',
      });
      return true;
    } catch (err) {
      console.error('Error deleting sponsorship:', err);
      toast({
        title: 'Error',
        description: 'Failed to delete sponsorship',
        variant: 'destructive',
      });
      return false;
    }
  };

  const activateSponsorship = async (id: string) => {
    try {
      const { data, error } = await supabase
        .from('sponsorships')
        .update({ is_active: true, status: 'active' })
        .eq('id', id)
        .select()
        .single();

      if (error) throw error;

      await fetchSponsorships();
      toast({
        title: 'Success',
        description: 'Sponsorship activated successfully',
      });
      return data;
    } catch (err) {
      console.error('Error activating sponsorship:', err);
      toast({
        title: 'Error',
        description: 'Failed to activate sponsorship',
        variant: 'destructive',
      });
      return null;
    }
  };

  const deactivateSponsorship = async (id: string) => {
    try {
      const { data, error } = await supabase
        .from('sponsorships')
        .update({ is_active: false, status: 'inactive' })
        .eq('id', id)
        .select()
        .single();

      if (error) throw error;

      await fetchSponsorships();
      toast({
        title: 'Success',
        description: 'Sponsorship deactivated successfully',
      });
      return data;
    } catch (err) {
      console.error('Error deactivating sponsorship:', err);
      toast({
        title: 'Error',
        description: 'Failed to deactivate sponsorship',
        variant: 'destructive',
      });
      return null;
    }
  };

  useEffect(() => {
    fetchSponsorships();
  }, []);

  return {
    sponsorships,
    loading,
    error,
    fetchSponsorships,
    createSponsorship,
    updateSponsorship,
    deleteSponsorship,
    activateSponsorship,
    deactivateSponsorship,
  };
};

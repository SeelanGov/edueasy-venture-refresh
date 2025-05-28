import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/contexts/AuthContext';
import { Sponsorship, SponsorshipLevel } from '@/types/RevenueTypes';
import { toast } from '@/components/ui/use-toast';

export function useSponsorships() {
  const { user } = useAuth();
  const [loading, setLoading] = useState(true);
  const [sponsorships, setSponsorships] = useState<Sponsorship[]>([]);
  const [error, setError] = useState<string | null>(null);
  const [isAdmin, setIsAdmin] = useState(false);

  // Helper function to handle errors
  const handleError = (error: any, message: string) => {
    console.error(message, error);
    setError(message);
    toast({
      title: 'Error',
      description: message,
      variant: 'destructive',
    });
  };

  // Check if user is admin
  const checkAdminStatus = async () => {
    if (!user?.id) {
      setIsAdmin(false);
      return;
    }

    try {
      const { data, error } = await supabase
        .from('user_roles')
        .select('*')
        .eq('user_id', user.id)
        .eq('role', 'admin')
        .single();

      if (error && error.code !== 'PGRST116') {
        // PGRST116 is "No rows returned" error
        throw error;
      }

      setIsAdmin(!!data);
    } catch (error) {
      console.error('Failed to check admin status:', error);
      setIsAdmin(false);
    }
  };

  // Fetch all active sponsorships (public)
  const fetchActiveSponsorships = async () => {
    try {
      setLoading(true);
      setError(null);

      const { data, error } = await supabase
        .from('sponsorships')
        .select('*')
        .eq('is_active', true)
        .order('sponsorship_level', { ascending: false });

      if (error) throw error;

      setSponsorships(data || []);
    } catch (error) {
      handleError(error, 'Failed to fetch sponsorships');
    } finally {
      setLoading(false);
    }
  };

  // Fetch all sponsorships (admin only)
  const fetchAllSponsorships = async () => {
    if (!isAdmin) {
      handleError(new Error('Unauthorized'), 'Only administrators can access this information');
      return;
    }

    try {
      setLoading(true);
      setError(null);

      const { data, error } = await supabase
        .from('sponsorships')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) throw error;

      setSponsorships(data || []);
    } catch (error) {
      handleError(error, 'Failed to fetch sponsorships');
    } finally {
      setLoading(false);
    }
  };

  // Create a new sponsorship (admin only)
  const createSponsorship = async (
    sponsorship: Omit<Sponsorship, 'id' | 'created_at' | 'updated_at'>
  ) => {
    if (!isAdmin) {
      handleError(new Error('Unauthorized'), 'Only administrators can create sponsorships');
      return null;
    }

    try {
      setLoading(true);
      setError(null);

      const { data, error } = await supabase
        .from('sponsorships')
        .insert({
          ...sponsorship,
          created_at: new Date().toISOString(),
          updated_at: new Date().toISOString(),
        })
        .select()
        .single();

      if (error) throw error;

      // Refresh sponsorships list
      await fetchAllSponsorships();

      toast({
        title: 'Sponsorship Created',
        description: 'The sponsorship has been created successfully.',
        variant: 'default',
      });

      return data;
    } catch (error) {
      handleError(error, 'Failed to create sponsorship');
      return null;
    } finally {
      setLoading(false);
    }
  };

  // Update an existing sponsorship (admin only)
  const updateSponsorship = async (sponsorshipId: string, updates: Partial<Sponsorship>) => {
    if (!isAdmin) {
      handleError(new Error('Unauthorized'), 'Only administrators can update sponsorships');
      return null;
    }

    try {
      setLoading(true);
      setError(null);

      const { data, error } = await supabase
        .from('sponsorships')
        .update({
          ...updates,
          updated_at: new Date().toISOString(),
        })
        .eq('id', sponsorshipId)
        .select()
        .single();

      if (error) throw error;

      // Refresh sponsorships list
      await fetchAllSponsorships();

      toast({
        title: 'Sponsorship Updated',
        description: 'The sponsorship has been updated successfully.',
        variant: 'default',
      });

      return data;
    } catch (error) {
      handleError(error, 'Failed to update sponsorship');
      return null;
    } finally {
      setLoading(false);
    }
  };

  // Deactivate a sponsorship (admin only)
  const deactivateSponsorship = async (sponsorshipId: string) => {
    if (!isAdmin) {
      handleError(new Error('Unauthorized'), 'Only administrators can deactivate sponsorships');
      return false;
    }

    try {
      setLoading(true);
      setError(null);

      const { error } = await supabase
        .from('sponsorships')
        .update({
          is_active: false,
          updated_at: new Date().toISOString(),
        })
        .eq('id', sponsorshipId);

      if (error) throw error;

      // Refresh sponsorships list
      await fetchAllSponsorships();

      toast({
        title: 'Sponsorship Deactivated',
        description: 'The sponsorship has been deactivated successfully.',
        variant: 'default',
      });

      return true;
    } catch (error) {
      handleError(error, 'Failed to deactivate sponsorship');
      return false;
    } finally {
      setLoading(false);
    }
  };

  // Submit a sponsorship inquiry (public)
  const submitSponsorshipInquiry = async (
    organizationName: string,
    contactName: string,
    contactEmail: string,
    contactPhone: string,
    message: string
  ) => {
    try {
      setLoading(true);
      setError(null);

      // Create a lead for the sponsorship inquiry
      const { error } = await supabase.from('leads').insert({
        name: contactName,
        email: contactEmail,
        phone: contactPhone,
        organization: organizationName,
        interest_type: 'sponsorship',
        message,
        status: 'new',
        source: 'website',
      });

      if (error) throw error;

      toast({
        title: 'Inquiry Submitted',
        description:
          'Your sponsorship inquiry has been submitted successfully. Our team will contact you soon.',
        variant: 'default',
      });

      return true;
    } catch (error) {
      handleError(error, 'Failed to submit sponsorship inquiry');
      return false;
    } finally {
      setLoading(false);
    }
  };

  // Load data when user changes
  useEffect(() => {
    if (user?.id) {
      checkAdminStatus();
    }
    fetchActiveSponsorships();
  }, [user]);

  // Refresh sponsorships list when admin status changes
  useEffect(() => {
    if (isAdmin) {
      fetchAllSponsorships();
    } else {
      fetchActiveSponsorships();
    }
  }, [isAdmin]);

  return {
    loading,
    error,
    sponsorships,
    isAdmin,
    fetchActiveSponsorships,
    fetchAllSponsorships,
    createSponsorship,
    updateSponsorship,
    deactivateSponsorship,
    submitSponsorshipInquiry,
  };
}

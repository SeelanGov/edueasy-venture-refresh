import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { toast } from '@/hooks/use-toast';
import { useAuth } from '@/hooks/useAuth';
import type { Sponsorship } from '@/types/RevenueTypes';
import { SponsorshipStatus, SponsorshipLevel } from '@/types/RevenueTypes';

export const useSponsorships = () => {
  const [sponsorships, setSponsorships] = useState<Sponsorship[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [isAdmin, setIsAdmin] = useState(false);
  const { user } = useAuth();

  useEffect(() => {
    // Check if user is admin
    const checkAdminStatus = async () => {
      if (user) {
        const { data } = await supabase
          .from('user_roles')
          .select('role')
          .eq('user_id', user.id)
          .eq('role', 'admin')
          .single();
        setIsAdmin(!!data);
      }
    };
    checkAdminStatus();
  }, [user]);

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

      // Convert database format to our type format with proper type casting
      const convertedData: Sponsorship[] = (data || []).map((item) => ({
        ...item,
        logo_url: item.logo_url || undefined,
        website_url: item.website_url || undefined,
        expires_at: item.expires_at || undefined,
        status: item.status as SponsorshipStatus,
        sponsorship_level: item.sponsorship_level as SponsorshipLevel,
        requirements: item.requirements as Record<string, any> | null,
      }));

      setSponsorships(convertedData);
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

  const createSponsorship = async (
    sponsorshipData: Omit<Sponsorship, 'id' | 'created_at' | 'updated_at'>,
  ) => {
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
        .insert(sponsorshipData)
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

  const submitSponsorshipInquiry = async (inquiryData: {
    organizationName: string;
    contactName: string;
    contactEmail: string;
    contactPhone: string;
    message: string;
  }) => {
    try {
      // For now, just create a sponsorship record with inquiry status
      const sponsorshipData = {
        organization_name: inquiryData.organizationName,
        contact_name: inquiryData.contactName,
        contact_email: inquiryData.contactEmail,
        contact_phone: inquiryData.contactPhone,
        description: inquiryData.message,
        amount: 0,
        currency: 'ZAR',
        status: SponsorshipStatus.PENDING,
        sponsorship_level: SponsorshipLevel.BRONZE,
        start_date: new Date().toISOString(),
        end_date: new Date(Date.now() + 365 * 24 * 60 * 60 * 1000).toISOString(),
        is_active: false,
      };

      const result = await createSponsorship(sponsorshipData);

      if (result) {
        toast({
          title: 'Inquiry Submitted',
          description: 'Thank you for your interest! We will contact you soon.',
        });
      }

      return result;
    } catch (err) {
      console.error('Error submitting sponsorship inquiry:', err);
      toast({
        title: 'Error',
        description: 'Failed to submit inquiry',
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
      const { error } = await supabase.from('sponsorships').delete().eq('id', id);

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
        .update({ is_active: true, status: SponsorshipStatus.ACTIVE })
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
        .update({ is_active: false, status: SponsorshipStatus.INACTIVE })
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
    isAdmin,
    fetchSponsorships,
    createSponsorship,
    submitSponsorshipInquiry,
    updateSponsorship,
    deleteSponsorship,
    activateSponsorship,
    deactivateSponsorship,
  };
};

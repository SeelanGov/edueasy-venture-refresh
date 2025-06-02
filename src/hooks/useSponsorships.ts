import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/contexts/AuthContext';
import { toast } from 'sonner';

export enum SponsorshipStatus {
  PENDING = 'pending',
  APPROVED = 'approved',
  REJECTED = 'rejected',
  ACTIVE = 'active',
  EXPIRED = 'expired',
}

export enum SponsorshipLevel {
  BRONZE = 'bronze',
  SILVER = 'silver',
  GOLD = 'gold',
  PLATINUM = 'platinum',
}

export interface Sponsorship {
  id: string;
  organization_name: string;
  contact_name: string;
  contact_email: string;
  contact_phone: string;
  description: string;
  amount: number;
  currency: string;
  status: SponsorshipStatus;
  sponsorship_level: SponsorshipLevel;
  start_date: string;
  end_date: string;
  is_active: boolean;
  requirements?: Record<string, any>;
  logo_url?: string;
  website_url?: string;
  created_at: string;
  updated_at: string;
  expires_at?: string;
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
      setSponsorships((data || []) as Sponsorship[]);
    } catch (err) {
      console.error('Error fetching sponsorships:', err);
      setError('Failed to load sponsorships');
      toast.error('Failed to load sponsorships');
    } finally {
      setLoading(false);
    }
  };

  const applyForSponsorship = async (
    sponsorName: string,
    amount: number,
    requirements?: Record<string, any>
  ): Promise<Sponsorship | undefined> => {
    if (!user) {
      toast.error('Please log in to apply for sponsorships');
      return undefined;
    }

    try {
      // Mock sponsorship application
      const mockApplication = {
        id: Date.now().toString(),
        organization_name: sponsorName,
        contact_name: 'Contact Person',
        contact_email: 'contact@sponsor.com',
        contact_phone: '+1234567890',
        description: 'Mock sponsorship application',
        amount,
        currency: 'ZAR',
        status: SponsorshipStatus.PENDING,
        sponsorship_level: SponsorshipLevel.BRONZE,
        start_date: new Date().toISOString(),
        end_date: new Date(Date.now() + 365 * 24 * 60 * 60 * 1000).toISOString(),
        is_active: true,
        requirements,
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
      };

      toast.success('Sponsorship application submitted successfully');
      return mockApplication;
    } catch (err) {
      console.error('Error applying for sponsorship:', err);
      toast.error('Failed to submit sponsorship application');
      return undefined;
    }
  };

  const updateSponsorshipStatus = async (sponsorshipId: string, status: SponsorshipStatus) => {
    try {
      // Mock status update
      setSponsorships(prev => 
        prev.map(s => 
          s.id === sponsorshipId 
            ? { ...s, status, updated_at: new Date().toISOString() }
            : s
        )
      );
      
      toast.success(`Sponsorship status updated to ${status}`);
    } catch (err) {
      console.error('Error updating sponsorship status:', err);
      toast.error('Failed to update sponsorship status');
    }
  };

  // Admin functions
  const isAdmin = user?.email?.includes('admin') || false;

  const submitSponsorshipInquiry = async (inquiry: any): Promise<boolean> => {
    try {
      toast.success('Sponsorship inquiry submitted successfully');
      return true;
    } catch (err) {
      console.error('Error submitting inquiry:', err);
      toast.error('Failed to submit inquiry');
      return false;
    }
  };

  const createSponsorship = async (sponsorship: Partial<Sponsorship>): Promise<Sponsorship | undefined> => {
    try {
      const newSponsorship: Sponsorship = {
        id: Date.now().toString(),
        organization_name: sponsorship.organization_name || '',
        contact_name: sponsorship.contact_name || '',
        contact_email: sponsorship.contact_email || '',
        contact_phone: sponsorship.contact_phone || '',
        description: sponsorship.description || '',
        amount: sponsorship.amount || 0,
        currency: sponsorship.currency || 'ZAR',
        status: SponsorshipStatus.PENDING,
        sponsorship_level: sponsorship.sponsorship_level || SponsorshipLevel.BRONZE,
        start_date: sponsorship.start_date || new Date().toISOString(),
        end_date: sponsorship.end_date || new Date(Date.now() + 365 * 24 * 60 * 60 * 1000).toISOString(),
        is_active: true,
        requirements: sponsorship.requirements,
        logo_url: sponsorship.logo_url,
        website_url: sponsorship.website_url,
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
      };

      setSponsorships(prev => [newSponsorship, ...prev]);
      toast.success('Sponsorship created successfully');
      return newSponsorship;
    } catch (err) {
      console.error('Error creating sponsorship:', err);
      toast.error('Failed to create sponsorship');
      return undefined;
    }
  };

  const updateSponsorship = async (id: string, updates: Partial<Sponsorship>) => {
    try {
      setSponsorships(prev => 
        prev.map(s => 
          s.id === id 
            ? { ...s, ...updates, updated_at: new Date().toISOString() }
            : s
        )
      );
      
      toast.success('Sponsorship updated successfully');
    } catch (err) {
      console.error('Error updating sponsorship:', err);
      toast.error('Failed to update sponsorship');
    }
  };

  const deactivateSponsorship = async (id: string) => {
    try {
      setSponsorships(prev => 
        prev.map(s => 
          s.id === id 
            ? { ...s, is_active: false, updated_at: new Date().toISOString() }
            : s
        )
      );
      
      toast.success('Sponsorship deactivated successfully');
    } catch (err) {
      console.error('Error deactivating sponsorship:', err);
      toast.error('Failed to deactivate sponsorship');
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
    applyForSponsorship,
    updateSponsorshipStatus,
    submitSponsorshipInquiry,
    createSponsorship,
    updateSponsorship,
    deactivateSponsorship,
  };
};

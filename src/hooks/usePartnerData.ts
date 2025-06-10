import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { Partner, PartnerPayment, PartnerNote, PartnerTierConfig, PartnerMetrics } from '@/types/PartnerTypes';
import { toast } from '@/hooks/use-toast';

export const usePartners = () => {
  return useQuery({
    queryKey: ['partners'],
    queryFn: async (): Promise<Partner[]> => {
      const { data, error } = await supabase
        .from('partners')
        .select('*')
        .order('created_at', { ascending: false });
      
      if (error) throw error;
      return data || [];
    },
  });
};

export const usePartner = (partnerId: string) => {
  return useQuery({
    queryKey: ['partner', partnerId],
    queryFn: async (): Promise<Partner | null> => {
      const { data, error } = await supabase
        .from('partners')
        .select('*')
        .eq('id', partnerId)
        .single();
      
      if (error) throw error;
      return data;
    },
    enabled: !!partnerId,
  });
};

export const usePartnerPayments = (partnerId?: string) => {
  return useQuery({
    queryKey: ['partner-payments', partnerId],
    queryFn: async (): Promise<PartnerPayment[]> => {
      let query = supabase
        .from('partner_payments')
        .select('*')
        .order('payment_date', { ascending: false });
      
      if (partnerId) {
        query = query.eq('partner_id', partnerId);
      }
      
      const { data, error } = await query;
      
      if (error) throw error;
      return data || [];
    },
  });
};

export const usePartnerNotes = (partnerId: string) => {
  return useQuery({
    queryKey: ['partner-notes', partnerId],
    queryFn: async (): Promise<PartnerNote[]> => {
      const { data, error } = await supabase
        .from('partner_notes')
        .select('*')
        .eq('partner_id', partnerId)
        .order('created_at', { ascending: false });
      
      if (error) throw error;
      return data || [];
    },
    enabled: !!partnerId,
  });
};

export const usePartnerTierConfigs = () => {
  return useQuery({
    queryKey: ['partner-tier-configs'],
    queryFn: async (): Promise<PartnerTierConfig[]> => {
      const { data, error } = await supabase
        .from('partner_tier_config')
        .select('*')
        .order('annual_fee', { ascending: true });
      
      if (error) throw error;
      return data || [];
    },
  });
};

export const usePartnerMetrics = () => {
  return useQuery({
    queryKey: ['partner-metrics'],
    queryFn: async (): Promise<PartnerMetrics> => {
      // Get all partners
      const { data: partners, error: partnersError } = await supabase
        .from('partners')
        .select('id, status, tier, annual_investment');
      
      if (partnersError) throw partnersError;

      // Get active partners
      const activePartners = partners?.filter(p => p.status === 'active') || [];

      // Calculate tier breakdown
      const tierBreakdown: { [key: string]: number } = {};
      partners?.forEach(partner => {
        tierBreakdown[partner.tier] = (tierBreakdown[partner.tier] || 0) + 1;
      });

      // Calculate total revenue
      const totalRevenue = partners?.reduce((sum, partner) => 
        sum + (partner.annual_investment || 0), 0) || 0;

      return {
        totalPartners: partners?.length || 0,
        activePartners: activePartners.length,
        totalRevenue,
        tierBreakdown,
      };
    },
  });
};

export const useCreatePartner = () => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: async (partner: Omit<Partner, 'id' | 'created_at' | 'updated_at'>) => {
      const { data, error } = await supabase
        .from('partners')
        .insert(partner)
        .select()
        .single();
      
      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['partners'] });
      queryClient.invalidateQueries({ queryKey: ['partner-metrics'] });
      toast({
        title: 'Success',
        description: 'Partner created successfully',
      });
    },
    onError: () => {
      toast({
        title: 'Error',
        description: 'Failed to create partner',
        variant: 'destructive',
      });
    },
  });
};

export const useUpdatePartner = () => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: async (partner: Partial<Partner> & { id: string }) => {
      const { data, error } = await supabase
        .from('partners')
        .update(partner)
        .eq('id', partner.id)
        .select()
        .single();
      
      if (error) throw error;
      return data;
    },
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: ['partners'] });
      queryClient.invalidateQueries({ queryKey: ['partner', data.id] });
      queryClient.invalidateQueries({ queryKey: ['partner-metrics'] });
      toast({
        title: 'Success',
        description: 'Partner updated successfully',
      });
    },
    onError: () => {
      toast({
        title: 'Error',
        description: 'Failed to update partner',
        variant: 'destructive',
      });
    },
  });
};

export const useDeletePartner = () => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: async (partnerId: string) => {
      const { error } = await supabase
        .from('partners')
        .delete()
        .eq('id', partnerId);
      
      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['partners'] });
      queryClient.invalidateQueries({ queryKey: ['partner-metrics'] });
      toast({
        title: 'Success',
        description: 'Partner deleted successfully',
      });
    },
    onError: () => {
      toast({
        title: 'Error',
        description: 'Failed to delete partner',
        variant: 'destructive',
      });
    },
  });
};

export const useCreatePartnerNote = () => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: async (note: Omit<PartnerNote, 'id' | 'created_at'>) => {
      const { data, error } = await supabase
        .from('partner_notes')
        .insert(note)
        .select()
        .single();
      
      if (error) throw error;
      return data;
    },
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: ['partner-notes', data.partner_id] });
      toast({
        title: 'Success',
        description: 'Note added successfully',
      });
    },
  });
};

export const useCreatePartnerPayment = () => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: async (payment: Omit<PartnerPayment, 'id' | 'created_at' | 'updated_at'>) => {
      const { data, error } = await supabase
        .from('partner_payments')
        .insert(payment)
        .select()
        .single();
      
      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['partner-payments'] });
      toast({
        title: 'Success',
        description: 'Payment record created successfully',
      });
    },
  });
};

export const usePartnerData = () => {
  return usePartners();
};

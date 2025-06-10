
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { Payment, UserPlan, Plan, AdminUser, DashboardMetrics } from '@/types/AdminTypes';
import { toast } from '@/hooks/use-toast';

export const useAdminUsers = () => {
  return useQuery({
    queryKey: ['admin-users'],
    queryFn: async (): Promise<AdminUser[]> => {
      const { data, error } = await supabase
        .from('users')
        .select('*')
        .order('created_at', { ascending: false });
      
      if (error) throw error;
      return data || [];
    },
  });
};

export const useAdminPayments = () => {
  return useQuery({
    queryKey: ['admin-payments'],
    queryFn: async (): Promise<Payment[]> => {
      const { data, error } = await supabase
        .from('payments')
        .select('*')
        .order('created_at', { ascending: false });
      
      if (error) throw error;
      return data || [];
    },
  });
};

export const useAdminPlans = () => {
  return useQuery({
    queryKey: ['admin-plans'],
    queryFn: async (): Promise<Plan[]> => {
      const { data, error } = await supabase
        .from('plans')
        .select('*')
        .order('created_at', { ascending: false });
      
      if (error) throw error;
      return data || [];
    },
  });
};

export const useUserPlans = () => {
  return useQuery({
    queryKey: ['admin-user-plans'],
    queryFn: async (): Promise<UserPlan[]> => {
      const { data, error } = await supabase
        .from('user_plans')
        .select('*')
        .order('created_at', { ascending: false });
      
      if (error) throw error;
      return data || [];
    },
  });
};

export const useDashboardMetrics = () => {
  return useQuery({
    queryKey: ['dashboard-metrics'],
    queryFn: async (): Promise<DashboardMetrics> => {
      // Get total students
      const { data: users, error: usersError } = await supabase
        .from('users')
        .select('id, current_plan');
      
      if (usersError) throw usersError;

      // Get paid users - only those with active plans that are not 'starter'
      const { data: paidUsers, error: paidError } = await supabase
        .from('user_plans')
        .select('user_id')
        .eq('active', true)
        .neq('plan', 'starter');
      
      if (paidError) throw paidError;

      // Get monthly revenue
      const startOfMonth = new Date();
      startOfMonth.setDate(1);
      startOfMonth.setHours(0, 0, 0, 0);
      
      const { data: monthlyPayments, error: revenueError } = await supabase
        .from('payments')
        .select('amount')
        .eq('status', 'paid')
        .gte('created_at', startOfMonth.toISOString());
      
      if (revenueError) throw revenueError;

      // Calculate plan breakdown
      const planBreakdown: { [key: string]: number } = {};
      users?.forEach(user => {
        const plan = user.current_plan || 'starter';
        planBreakdown[plan] = (planBreakdown[plan] || 0) + 1;
      });

      return {
        totalStudents: users?.length || 0,
        totalPaidUsers: paidUsers?.length || 0,
        monthlyRevenue: monthlyPayments?.reduce((sum, payment) => sum + payment.amount, 0) || 0,
        planBreakdown,
      };
    },
  });
};

export const useUpdatePaymentStatus = () => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: async ({ paymentId, status }: { paymentId: string; status: string }) => {
      const { data, error } = await supabase
        .from('payments')
        .update({ status, updated_at: new Date().toISOString() })
        .eq('id', paymentId)
        .select()
        .single();
      
      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['admin-payments'] });
      queryClient.invalidateQueries({ queryKey: ['admin-users'] });
      queryClient.invalidateQueries({ queryKey: ['dashboard-metrics'] });
      toast({
        title: 'Success',
        description: 'Payment status updated successfully',
      });
    },
    onError: () => {
      toast({
        title: 'Error',
        description: 'Failed to update payment status',
        variant: 'destructive',
      });
    },
  });
};

export const useUpdatePlan = () => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: async (plan: Partial<Plan> & { id: string }) => {
      const { data, error } = await supabase
        .from('plans')
        .update(plan)
        .eq('id', plan.id)
        .select()
        .single();
      
      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['admin-plans'] });
      toast({
        title: 'Success',
        description: 'Plan updated successfully',
      });
    },
  });
};

export const useCreatePlan = () => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: async (plan: Omit<Plan, 'id' | 'created_at' | 'updated_at'>) => {
      const { data, error } = await supabase
        .from('plans')
        .insert(plan)
        .select()
        .single();
      
      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['admin-plans'] });
      toast({
        title: 'Success',
        description: 'Plan created successfully',
      });
    },
  });
};

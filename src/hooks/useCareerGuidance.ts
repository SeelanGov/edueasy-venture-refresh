import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/contexts/AuthContext';
import { 
  CareerGuidance,
  AssessmentType
} from '@/types/RevenueTypes';
import { toast } from '@/components/ui/use-toast';

export function useCareerGuidance() {
  const { user } = useAuth();
  const [loading, setLoading] = useState(true);
  const [assessments, setAssessments] = useState<CareerGuidance[]>([]);
  const [currentAssessment, setCurrentAssessment] = useState<CareerGuidance | null>(null);
  const [error, setError] = useState<string | null>(null);

  // Helper function to handle errors
  const handleError = (error: any, message: string) => {
    console.error(message, error);
    setError(message);
    toast({
      title: "Error",
      description: message,
      variant: "destructive",
    });
  };

  // Fetch user's assessments
  const fetchAssessments = async () => {
    if (!user?.id) {
      setAssessments([]);
      return;
    }
    
    try {
      setLoading(true);
      setError(null);
      
      const { data, error } = await supabase
        .from('career_guidance')
        .select('*')
        .eq('user_id', user.id)
        .order('assessment_date', { ascending: false });
      
      if (error) throw error;
      
      setAssessments(data || []);
    } catch (error) {
      handleError(error, 'Failed to fetch career assessments');
    } finally {
      setLoading(false);
    }
  };

  // Fetch a specific assessment
  const fetchAssessment = async (assessmentId: string) => {
    try {
      setLoading(true);
      setError(null);
      
      const { data, error } = await supabase
        .from('career_guidance')
        .select('*')
        .eq('id', assessmentId)
        .single();
      
      if (error) throw error;
      
      setCurrentAssessment(data);
    } catch (error) {
      handleError(error, 'Failed to fetch assessment details');
    } finally {
      setLoading(false);
    }
  };

  // Create a new assessment
  const createAssessment = async (
    assessmentType: AssessmentType,
    results: Record<string, any>,
    recommendations?: Record<string, any>,
    isPremium: boolean = false
  ) => {
    if (!user?.id) {
      handleError(new Error('User not authenticated'), 'Authentication required');
      return null;
    }
    
    try {
      setLoading(true);
      setError(null);
      
      const { data, error } = await supabase
        .from('career_guidance')
        .insert({
          user_id: user.id,
          assessment_type: assessmentType,
          assessment_date: new Date().toISOString(),
          results,
          recommendations: recommendations || null,
          is_premium: isPremium
        })
        .select()
        .single();
      
      if (error) throw error;
      
      // Update the assessments list
      await fetchAssessments();
      
      toast({
        title: "Assessment Created",
        description: "Your career assessment has been saved successfully.",
        variant: "default",
      });
      
      return data;
    } catch (error) {
      handleError(error, 'Failed to create assessment');
      return null;
    } finally {
      setLoading(false);
    }
  };

  // Update an existing assessment
  const updateAssessment = async (
    assessmentId: string,
    updates: Partial<CareerGuidance>
  ) => {
    if (!user?.id) {
      handleError(new Error('User not authenticated'), 'Authentication required');
      return null;
    }
    
    try {
      setLoading(true);
      setError(null);
      
      const { data, error } = await supabase
        .from('career_guidance')
        .update({
          ...updates,
          updated_at: new Date().toISOString()
        })
        .eq('id', assessmentId)
        .eq('user_id', user.id) // Ensure the user owns this assessment
        .select()
        .single();
      
      if (error) throw error;
      
      // Update the assessments list and current assessment
      await fetchAssessments();
      setCurrentAssessment(data);
      
      toast({
        title: "Assessment Updated",
        description: "Your career assessment has been updated successfully.",
        variant: "default",
      });
      
      return data;
    } catch (error) {
      handleError(error, 'Failed to update assessment');
      return null;
    } finally {
      setLoading(false);
    }
  };

  // Delete an assessment
  const deleteAssessment = async (assessmentId: string) => {
    if (!user?.id) {
      handleError(new Error('User not authenticated'), 'Authentication required');
      return false;
    }
    
    try {
      setLoading(true);
      setError(null);
      
      const { error } = await supabase
        .from('career_guidance')
        .delete()
        .eq('id', assessmentId)
        .eq('user_id', user.id); // Ensure the user owns this assessment
      
      if (error) throw error;
      
      // Update the assessments list
      await fetchAssessments();
      
      toast({
        title: "Assessment Deleted",
        description: "Your career assessment has been deleted successfully.",
        variant: "default",
      });
      
      return true;
    } catch (error) {
      handleError(error, 'Failed to delete assessment');
      return false;
    } finally {
      setLoading(false);
    }
  };

  // Load data when user changes
  useEffect(() => {
    if (user?.id) {
      fetchAssessments();
    }
  }, [user]);

  return {
    loading,
    error,
    assessments,
    currentAssessment,
    fetchAssessments,
    fetchAssessment,
    createAssessment,
    updateAssessment,
    deleteAssessment
  };
}
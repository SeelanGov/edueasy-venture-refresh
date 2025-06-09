import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { toast } from '@/components/ui/use-toast';
import { useAuth } from '@/hooks/useAuth';
import { AssessmentType } from '@/types/assessment';
import { CareerAssessment } from '@/types/career-assessment';
import { CareerGuidance } from '@/types/career-guidance';

export enum AssessmentType {
  SKILLS = 'skills',
  PERSONALITY = 'personality',
  INTERESTS = 'interests',
  VALUES = 'values',
  CAREER_MATCH = 'career_match',
  COMPREHENSIVE = 'comprehensive',
  APTITUDE = 'aptitude',
}

export interface CareerAssessment {
  id: string;
  user_id: string;
  assessment_type: AssessmentType;
  questions: Record<string, any>;
  responses: Record<string, any>;
  results: Record<string, any>;
  completed_at?: string;
  created_at: string;
  updated_at: string;
}

export interface CareerGuidance {
  id: string;
  user_id: string;
  assessment_id?: string;
  assessment_type: AssessmentType;
  assessment_date: string;
  recommendations: Record<string, any> | null;
  action_plan?: Record<string, any>;
  results: Record<string, any>;
  is_premium: boolean;
  created_at: string;
  updated_at: string;
}

export const useCareerGuidance = () => {
  const [assessments, setAssessments] = useState<CareerAssessment[]>([]);
  const [guidance, setGuidance] = useState<CareerGuidance[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const { user } = useAuth();

  const fetchAssessments = async () => {
    if (!user) return;

    setLoading(true);
    setError(null);

    try {
      const { data, error } = await supabase
        .from('career_assessments')
        .select('*')
        .eq('user_id', user.id)
        .order('created_at', { ascending: false });

      if (error) throw error;
      setAssessments((data || []) as CareerAssessment[]);
    } catch (err) {
      console.error('Error fetching assessments:', err);
      setError('Failed to load assessments');
      toast.error('Failed to load assessments');
    } finally {
      setLoading(false);
    }
  };

  const fetchGuidance = async () => {
    if (!user) return;

    setLoading(true);
    setError(null);

    try {
      const { data, error } = await supabase
        .from('career_guidance')
        .select('*')
        .eq('user_id', user.id)
        .order('created_at', { ascending: false });

      if (error) throw error;
      setGuidance((data || []) as CareerGuidance[]);
    } catch (err) {
      console.error('Error fetching guidance:', err);
      setError('Failed to load career guidance');
      toast.error('Failed to load career guidance');
    } finally {
      setLoading(false);
    }
  };

  const fetchAssessment = async (assessmentId: string) => {
    if (!user) return null;

    try {
      const { data, error } = await supabase
        .from('career_assessments')
        .select('*')
        .eq('id', assessmentId)
        .eq('user_id', user.id)
        .single();

      if (error) throw error;
      return data as CareerAssessment;
    } catch (err) {
      console.error('Error fetching assessment:', err);
      toast.error('Failed to load assessment');
      return null;
    }
  };

  const createAssessment = async (
    assessmentType: AssessmentType,
    results: Record<string, any>,
    recommendations: Record<string, any>,
    isPremium: boolean = false
  ) => {
    if (!user) return null;

    try {
      // Create the assessment first
      const { data: assessmentData, error: assessmentError } = await supabase
        .from('career_assessments')
        .insert({
          user_id: user.id,
          assessment_type: assessmentType,
          questions: {},
          responses: {},
          results,
          completed_at: new Date().toISOString(),
        })
        .select()
        .single();

      if (assessmentError) throw assessmentError;

      // Create the guidance record
      const { data: guidanceData, error: guidanceError } = await supabase
        .from('career_guidance')
        .insert({
          user_id: user.id,
          assessment_id: assessmentData.id,
          assessment_type: assessmentType,
          assessment_date: new Date().toISOString(),
          recommendations,
          results,
          is_premium: isPremium,
        })
        .select()
        .single();

      if (guidanceError) throw guidanceError;

      await fetchAssessments();
      await fetchGuidance();
      toast.success('Assessment completed successfully');
      return guidanceData as CareerGuidance;
    } catch (err) {
      console.error('Error creating assessment:', err);
      toast.error('Failed to create assessment');
      return null;
    }
  };

  const submitAssessmentResponses = async (assessmentId: string, responses: Record<string, any>) => {
    if (!user) return null;

    try {
      // Mock results generation for now
      const mockResults = {
        score: Math.random() * 100,
        recommendations: ['Consider software engineering', 'Explore data science'],
        strengths: ['Analytical thinking', 'Problem solving'],
        areas_for_growth: ['Communication', 'Leadership'],
      };

      const { data, error } = await supabase
        .from('career_assessments')
        .update({
          responses,
          results: mockResults,
          completed_at: new Date().toISOString(),
        })
        .eq('id', assessmentId)
        .eq('user_id', user.id)
        .select()
        .single();

      if (error) throw error;
      
      await fetchAssessments();
      toast.success('Assessment completed successfully');
      return data as CareerAssessment;
    } catch (err) {
      console.error('Error submitting assessment:', err);
      toast.error('Failed to submit assessment');
      return null;
    }
  };

  const generateGuidance = async (assessmentId: string, isPremium: boolean = false) => {
    if (!user) return null;

    try {
      // Get the assessment
      const { data: assessment, error: assessmentError } = await supabase
        .from('career_assessments')
        .select('*')
        .eq('id', assessmentId)
        .eq('user_id', user.id)
        .single();

      if (assessmentError) throw assessmentError;

      // Mock guidance generation
      const mockGuidance = {
        career_paths: ['Software Engineer', 'Data Scientist', 'Product Manager'],
        skills_to_develop: ['JavaScript', 'Python', 'Machine Learning'],
        next_steps: ['Complete online courses', 'Build portfolio projects', 'Network with professionals'],
        premium_insights: isPremium ? ['Detailed salary ranges', 'Industry contacts', 'Personalized mentoring'] : null,
      };

      const { data, error } = await supabase
        .from('career_guidance')
        .insert({
          user_id: user.id,
          assessment_id: assessmentId,
          assessment_type: assessment.assessment_type,
          assessment_date: assessment.created_at,
          recommendations: mockGuidance,
          results: assessment.results,
          is_premium: isPremium,
        })
        .select()
        .single();

      if (error) throw error;
      
      await fetchGuidance();
      toast.success('Career guidance generated successfully');
      return data as CareerGuidance;
    } catch (err) {
      console.error('Error generating guidance:', err);
      toast.error('Failed to generate career guidance');
      return null;
    }
  };

  useEffect(() => {
    if (user) {
      fetchAssessments();
      fetchGuidance();
    }
  }, [user]);

  return {
    assessments,
    guidance,
    loading,
    error,
    createAssessment,
    submitAssessmentResponses,
    generateGuidance,
    fetchAssessments,
    fetchGuidance,
    fetchAssessment,
  };
};

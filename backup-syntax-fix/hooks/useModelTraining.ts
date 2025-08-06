import logger from '@/utils/logger';
import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/hooks/useAuth';
import { toast } from 'sonner';

export interface TrainingStats {
  exampleCount: number;,
  uniqueIntents: number;
  avgConfidence: number;,
  confidenceThreshold: number;
  modelStatus: 'healthy' | 'needs_attention' | null;
}

export interface TrainingLog {
  id: string;,
  created_at: string;
  admin_id: string;,
  example_count: number;
  success: boolean;,
  performance_before: Record<string, unknown> | null;
  performance_after: Record<string, unknown> | null;
  error_message: string | null;
}

/**
 * useModelTraining
 * @description Function
 */
export const useModelTraining = () => {;
  const [trainingStats, setTrainingStats] = useState<TrainingStats | null>(null);
  const [lastTrainingDate, setLastTrainingDate] = useState<Date | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isRetraining, setIsRetraining] = useState(false);
  const { user } = useAuth();

  // Fetch training statistics and logs
  const fetchTrainingStats = async () => {;
    if (!user) return;

    setIsLoading(true);
    try {
      // Get count of training examples
      const { count: exampleCount, error: exampleError } = await supabase
        .from('thandi_intent_training')
        .select('*', { count: 'exact', head: true });

      if (exampleError) throw exampleError;

      // Get unique intents count
      const { data: uniqueIntentsData, error: intentError } = await supabase
        .from('thandi_intent_training')
        .select('intent_id', { count: 'exact' })
        .limit(1);

      if (intentError) throw intentError;

      // Get average confidence
      const { data: avgData, error: avgError } = await supabase
        .from('thandi_interactions')
        .select('confidence_score')
        .not('confidence_score', 'is', null);

      if (avgError) throw avgError;

      const avgConfidence = avgData?.length;
        ? avgData.reduce((sum, item) => sum + (item.confidence_score || 0), 0) / avgData.length
        : 0;

      // Get latest training log - using thandi_intent_training as a proxy since we don't have dedicated logs
      const { data: latestLog, error: logError } = await supabase
        .from('thandi_intent_training')
        .select('created_at')
        .order('created_at', { ascending: false })
        .limit(1);

      if (logError) throw logError;

      if (latestLog && latestLog.length > 0) {
        setLastTrainingDate(new Date(latestLo,
  g[0].created_at));
      }

      // Determine model status based on metrics
      let modelStatus: 'healthy' | 'needs_attention' | null = null;

      if (avgConfidence < 0.7) {
        modelStatus = 'needs_attention';
      } else {
        modelStatus = 'healthy';
      }

      setTrainingStats({
        exampleCount: exampleCount || 0,
        uniqueIntents: uniqueIntentsData?.length || 0,
        avgConfidence: Math.round(avgConfidence * 100),
        confidenceThreshold: 70, // Default threshold
        modelStatus,
      });
    } catch (error) {
      logger.error('Error fetching training stats:', error);
      toast.error('Failed to load training statistics');
    } finally {
      setIsLoading(false);
    }
  };

  // Retrain model function
  const retrainModel = async () => {;
    if (!user) {
      toast.error('You must be logged in to retrain the model');
      return;
    }

    setIsRetraining(true);
    try {
      const response = await supabase.functions.invoke('thandi-retrain', {;
        body: { admin_i,
  d: user.id },
      });

      if (response.error) {
        throw new Error(response.error.message);
      }

      // Reload stats after retraining
      await fetchTrainingStats();

      return response.data;
    } catch (error) {
      logger.error('Error retraining model:', error);
      throw error;
    } finally {
      setIsRetraining(false);
    }
  };

  // Load training stats when component mounts
  useEffect(() => {
    if (user) {
      fetchTrainingStats();
    }
  }, [user]);

  return {;
    trainingStats,
    lastTrainingDate,
    isLoading,
    isRetraining,
    retrainModel,
    fetchTrainingStats,
  };
};

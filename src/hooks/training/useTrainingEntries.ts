import { useState } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/hooks/useAuth';
import { toast } from 'sonner';

// Define the training entry type to match the database response
interface TrainingEntry {
  id: string;
  message_id: string;
  intent_id: string | null;
  admin_id: string;
  confidence: number | null;
  created_at: string;
  intents: {
    intent_name: string;
  } | null;
}

/**
 * useTrainingEntries
 * @description Hook for managing training entries
 */
export const useTrainingEntries = () => {
  const [trainedMessages, setTrainedMessages] = useState<TrainingEntry[]>([]);
  const { user } = useAuth();

  // Fetch training entries for specific messages
  const fetchTrainingEntries = async (messageIds: string[]) => {
    if (!messageIds.length) {
      setTrainedMessages([]);
      return [];
    }

    try {
      const { data: trained, error } = await supabase
        .from('thandi_intent_training')
        .select(
          `
          *,
          intents:intent_id (intent_name)
        `,
        )
        .in('message_id', messageIds);

      if (error) throw error;

      setTrainedMessages(trained || []);
      return trained || [];
    } catch (error) {
      console.error('Error fetching training entries:', error);
      toast.error('Failed to load training data');
      return [];
    }
  };

  // Add training data for a message
  const addTrainingData = async (messageId: string, intentId: string, confidence?: number) => {
    if (!user) return null;

    try {
      const { data, error } = await supabase
        .from('thandi_intent_training')
        .insert({
          message_id: messageId,
          intent_id: intentId,
          admin_id: user.id,
          confidence: confidence || null,
        })
        .select();

      if (error) throw error;

      toast.success('Training data added successfully');
      return data[0];
    } catch (error) {
      console.error('Error adding training data:', error);
      toast.error('Failed to add training data');
      return null;
    }
  };

  // Update existing training data
  const updateTrainingData = async (id: string, intentId: string, confidence?: number) => {
    if (!user) return false;

    try {
      const { error } = await supabase
        .from('thandi_intent_training')
        .update({
          intent_id: intentId,
          confidence: confidence || null,
          admin_id: user.id,
        })
        .eq('id', id);

      if (error) throw error;

      toast.success('Training data updated successfully');
      return true;
    } catch (error) {
      console.error('Error updating training data:', error);
      toast.error('Failed to update training data');
      return false;
    }
  };

  // Delete training data
  const deleteTrainingData = async (id: string) => {
    try {
      const { error } = await supabase.from('thandi_intent_training').delete().eq('id', id);

      if (error) throw error;

      toast.success('Training data deleted successfully');
      return true;
    } catch (error) {
      console.error('Error deleting training data:', error);
      toast.error('Failed to delete training data');
      return false;
    }
  };

  return {
    trainedMessages,
    setTrainedMessages,
    fetchTrainingEntries,
    addTrainingData,
    updateTrainingData,
    deleteTrainingData,
  };
};

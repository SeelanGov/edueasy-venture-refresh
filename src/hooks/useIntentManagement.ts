import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';

export interface Intent {
  id: string;
  intent_name: string;
  description: string | null;
  response_template: string | null;
  sample_queries: string[] | null;
  created_at: string;
  updated_at: string;
}

export interface IntentWithStats extends Intent {
  message_count: number;
  avg_confidence: number | null;
}

export const useIntentManagement = () => {
  const [intents, setIntents] = useState<IntentWithStats[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedIntent, setSelectedIntent] = useState<IntentWithStats | null>(null);
  const [isEditingIntent, setIsEditingIntent] = useState(false);

  // Fetch all intents with statistics
  const fetchIntents = async () => {
    setLoading(true);
    try {
      // Get all intents with aggregated stats
      const { data, error } = await supabase.rpc('get_intents_with_stats');

      if (error) throw error;

      // Transform the data to ensure sample_queries is properly typed
      const transformedData =
        data?.map((intent) => ({
          ...intent,
          // Convert Json to string[] or null
          sample_queries: intent.sample_queries
            ? Array.isArray(intent.sample_queries)
              ? intent.sample_queries.map((q) => String(q))
              : null
            : null,
        })) || [];

      setIntents(transformedData);
    } catch (error) {
      console.error('Error fetching intents:', error);
      toast.error('Failed to load intents');
    } finally {
      setLoading(false);
    }
  };

  // Create a new intent
  const createIntent = async (intentData: {
    intent_name: string;
    description?: string;
    response_template?: string;
    sample_queries?: string[];
  }) => {
    try {
      const { data, error } = await supabase
        .from('thandi_intents')
        .insert({
          intent_name: intentData.intent_name,
          description: intentData.description || null,
          response_template: intentData.response_template || null,
          sample_queries: intentData.sample_queries || null,
        })
        .select();

      if (error) throw error;

      toast.success('Intent created successfully');
      fetchIntents(); // Refresh intents list
      return data[0];
    } catch (error) {
      console.error('Error creating intent:', error);
      toast.error('Failed to create intent');
      return null;
    }
  };

  // Update an existing intent
  const updateIntent = async (
    id: string,
    updates: {
      intent_name?: string;
      description?: string;
      response_template?: string;
      sample_queries?: string[];
    },
  ) => {
    try {
      const { error } = await supabase
        .from('thandi_intents')
        .update({
          ...updates,
          updated_at: new Date().toISOString(),
        })
        .eq('id', id);

      if (error) throw error;

      toast.success('Intent updated successfully');
      fetchIntents(); // Refresh intents list
      return true;
    } catch (error) {
      console.error('Error updating intent:', error);
      toast.error('Failed to update intent');
      return false;
    }
  };

  // Delete an intent
  const deleteIntent = async (id: string) => {
    try {
      // Check if the intent has associated messages
      const { count, error: countError } = await supabase
        .from('thandi_interactions')
        .select('*', { count: 'exact', head: true })
        .eq('intent_id', id);

      if (countError) throw countError;

      // If this intent is used in messages, don't allow deletion
      if (count && count > 0) {
        toast.error(`Cannot delete intent: it's used in ${count} messages`);
        return false;
      }

      const { error } = await supabase.from('thandi_intents').delete().eq('id', id);

      if (error) throw error;

      toast.success('Intent deleted successfully');
      fetchIntents(); // Refresh intents list
      return true;
    } catch (error) {
      console.error('Error deleting intent:', error);
      toast.error('Failed to delete intent');
      return false;
    }
  };

  // Load intents when component mounts
  useEffect(() => {
    fetchIntents();
  }, []);

  return {
    intents,
    loading,
    selectedIntent,
    setSelectedIntent,
    isEditingIntent,
    setIsEditingIntent,
    fetchIntents,
    createIntent,
    updateIntent,
    deleteIntent,
  };
};

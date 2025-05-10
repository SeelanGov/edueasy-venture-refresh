
import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/contexts/AuthContext";
import { toast } from "sonner";

export interface ChatMessage {
  id: string;
  message: string;
  is_user: boolean;
  created_at: string;
  user_id: string;
  confidence_score: number | null;
  low_confidence: boolean | null;
  intent_id: string | null;
  response_type: string | null;
  user_name?: string;
  user_email?: string;
  intent_name?: string;
}

export interface TrainingEntry {
  id: string;
  message_id: string;
  intent_id: string;
  admin_id: string;
  confidence: number | null;
  created_at: string;
  message?: ChatMessage;
  intent_name?: string;
}

export const useTrainingData = () => {
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [trainedMessages, setTrainedMessages] = useState<TrainingEntry[]>([]);
  const [loading, setLoading] = useState(true);
  const [lowConfidenceOnly, setLowConfidenceOnly] = useState(true);
  const [page, setPage] = useState(0);
  const [hasMore, setHasMore] = useState(true);
  const limit = 20;
  const { user } = useAuth();

  // Fetch messages that need training
  const fetchMessages = async (pageNum = 0, lowConfOnly = true) => {
    if (!user) return;
    
    setLoading(true);
    try {
      const query = supabase
        .from("thandi_interactions")
        .select(`
          *,
          users!thandi_interactions_user_id_fkey (
            full_name,
            email
          )
        `)
        .eq("is_user", true)
        .order("created_at", { ascending: false });
        
      if (lowConfOnly) {
        query.eq("low_confidence", true);
      }
      
      const { data: messages, error } = await query
        .range(pageNum * limit, (pageNum + 1) * limit - 1);
        
      if (error) throw error;

      // Get already trained message IDs
      const messageIds = messages.map(m => m.id);
      
      if (messageIds.length > 0) {
        const { data: trained, error: trainingError } = await supabase
          .from("thandi_intent_training")
          .select(`
            *,
            intents:intent_id (intent_name)
          `)
          .in("message_id", messageIds);
          
        if (trainingError) throw trainingError;
        
        setTrainedMessages(trained || []);
      }
      
      // Transform the data to include user info
      const transformedMessages = messages.map(msg => ({
        ...msg,
        user_name: msg.users?.full_name || "Unknown User",
        user_email: msg.users?.email || "Unknown Email"
      }));
      
      setMessages(transformedMessages);
      setHasMore(messages.length === limit);
    } catch (error) {
      console.error("Error fetching messages:", error);
      toast.error("Failed to load messages");
    } finally {
      setLoading(false);
    }
  };

  // Add training data for a message
  const addTrainingData = async (messageId: string, intentId: string, confidence?: number) => {
    if (!user) return null;
    
    try {
      const { data, error } = await supabase
        .from("thandi_intent_training")
        .insert({
          message_id: messageId,
          intent_id: intentId,
          admin_id: user.id,
          confidence: confidence || null
        })
        .select();

      if (error) throw error;
      
      toast.success("Training data added successfully");
      
      // Refresh training data
      fetchMessages(page, lowConfidenceOnly);
      return data[0];
    } catch (error) {
      console.error("Error adding training data:", error);
      toast.error("Failed to add training data");
      return null;
    }
  };

  // Update existing training data
  const updateTrainingData = async (id: string, intentId: string, confidence?: number) => {
    try {
      const { error } = await supabase
        .from("thandi_intent_training")
        .update({
          intent_id: intentId,
          confidence: confidence || null,
          admin_id: user?.id
        })
        .eq("id", id);

      if (error) throw error;
      
      toast.success("Training data updated successfully");
      
      // Refresh training data
      fetchMessages(page, lowConfidenceOnly);
      return true;
    } catch (error) {
      console.error("Error updating training data:", error);
      toast.error("Failed to update training data");
      return false;
    }
  };

  // Delete training data
  const deleteTrainingData = async (id: string) => {
    try {
      const { error } = await supabase
        .from("thandi_intent_training")
        .delete()
        .eq("id", id);

      if (error) throw error;
      
      toast.success("Training data deleted successfully");
      
      // Refresh training data
      fetchMessages(page, lowConfidenceOnly);
      return true;
    } catch (error) {
      console.error("Error deleting training data:", error);
      toast.error("Failed to delete training data");
      return false;
    }
  };

  // Load messages when component mounts
  useEffect(() => {
    fetchMessages(page, lowConfidenceOnly);
  }, [user, page, lowConfidenceOnly]);

  return {
    messages,
    trainedMessages,
    loading,
    lowConfidenceOnly,
    setLowConfidenceOnly,
    page,
    setPage,
    hasMore,
    fetchMessages,
    addTrainingData,
    updateTrainingData,
    deleteTrainingData
  };
};

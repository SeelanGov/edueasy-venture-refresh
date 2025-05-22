
import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/contexts/AuthContext";
import { toast } from "sonner";
import { ChatMessage, TrainingFilters } from "@/types/TrainingTypes";

export const useTrainingMessages = () => {
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [loading, setLoading] = useState(true);
  const [hasMore, setHasMore] = useState(true);
  const { user } = useAuth();

  // Fetch messages that need training
  const fetchMessages = async (filters: TrainingFilters) => {
    if (!user) return [];
    
    setLoading(true);
    try {
      const query = supabase
        .from("thandi_interactions")
        .select(`*`)
        .eq("is_user", true)
        .order("created_at", { ascending: false });
        
      if (filters.lowConfidenceOnly) {
        query.eq("low_confidence", true);
      }
      
      const { data: messages, error } = await query
        .range(filters.page * filters.limit, (filters.page + 1) * filters.limit - 1);
        
      if (error) throw error;

      // Get user details for each message
      const userIds = [...new Set(messages.map(m => m.user_id))];
      const { data: users, error: usersError } = await supabase
        .from('users')
        .select('id, full_name, email')
        .in('id', userIds);
        
      if (usersError) throw usersError;
      
      // Transform the data to include user info
      const transformedMessages = messages.map(msg => {
        const userInfo = users?.find(u => u.id === msg.user_id);
        return {
          ...msg,
          user_name: userInfo?.full_name || "Unknown User",
          user_email: userInfo?.email || "Unknown Email"
        };
      });
      
      setMessages(transformedMessages);
      setHasMore(messages.length === filters.limit);
      return transformedMessages;
    } catch (error) {
      console.error("Error fetching messages:", error);
      toast.error("Failed to load messages");
      return [];
    } finally {
      setLoading(false);
    }
  };

  return {
    messages,
    loading,
    hasMore,
    fetchMessages,
    setMessages
  };
};

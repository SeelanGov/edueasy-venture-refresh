
import { useState, useEffect } from "react";
import { useAuth } from "@/contexts/AuthContext";
import { useTrainingMessages } from "./training/useTrainingMessages";
import { useTrainingEntries } from "./training/useTrainingEntries";
import { TrainingFilters } from "@/types/TrainingTypes";

export { type ChatMessage, type TrainingEntry } from "@/types/TrainingTypes";

export const useTrainingData = () => {
  const [lowConfidenceOnly, setLowConfidenceOnly] = useState(true);
  const [page, setPage] = useState(0);
  const limit = 20;
  
  const { user } = useAuth();
  const { 
    messages, 
    loading, 
    hasMore, 
    fetchMessages 
  } = useTrainingMessages();
  
  const { 
    trainedMessages, 
    fetchTrainingEntries, 
    addTrainingData, 
    updateTrainingData, 
    deleteTrainingData 
  } = useTrainingEntries();

  // Load messages and their training data when component mounts or filters change
  useEffect(() => {
    const loadData = async () => {
      const filters: TrainingFilters = {
        lowConfidenceOnly,
        page,
        limit
      };
      
      const fetchedMessages = await fetchMessages(filters);
      
      if (fetchedMessages.length > 0) {
        const messageIds = fetchedMessages.map(m => m.id);
        await fetchTrainingEntries(messageIds);
      }
    };
    
    if (user) {
      loadData();
    }
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
    addTrainingData,
    updateTrainingData,
    deleteTrainingData
  };
};

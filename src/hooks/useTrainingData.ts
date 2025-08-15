import { useState, useEffect } from 'react';
import { useAuth } from '@/hooks/useAuth';
import { useTrainingMessages } from './training/useTrainingMessages';
import { useTrainingEntries } from './training/useTrainingEntries';
import { type TrainingFilters, type TrainingEntry as TrainingEntryType } from '@/types/TrainingTypes';






// Use canonical TrainingEntry from types
interface TrainingEntry extends TrainingEntryType {
  intents: {
    intent_name: string;
  } | null;
}

export { type ChatMessage };
export type { TrainingEntry };

/**
 * useTrainingData
 * @description Function
 */
export const useTrainingData = () => {
  const [lowConfidenceOnly, setLowConfidenceOnly] = useState(true);
  const [page, setPage] = useState(0);
  const limit = 20;

  const { user } = useAuth();
  const { messages, loading, hasMore, fetchMessages } = useTrainingMessages();

  const {
    trainedMessages,
    fetchTrainingEntries,
    addTrainingData,
    updateTrainingData,
    deleteTrainingData,
  } = useTrainingEntries();

  // Load messages and their training data when component mounts or filters change
  useEffect(() => {
    const loadData = async () => {
      const filters: TrainingFilters = {
        lowConfidenceOnly,
        page,
        limit,
      };

      const fetchedMessages = await fetchMessages(filters);

      if (fetchedMessages.length > 0) {
        const messageIds = fetchedMessages.map((m) => m.id);
        await fetchTrainingEntries(messageIds);
      }
    };

    if (user) {
      loadData();
    }
  }, [user, page, lowConfidenceOnly]);

  // Cast trainedMessages to our local TrainingEntry type to avoid conflicts
  const typedTrainedMessages = trainedMessages as TrainingEntry[];

  return {
    messages,
    trainedMessages: typedTrainedMessages,
    loading,
    lowConfidenceOnly,
    setLowConfidenceOnly,
    page,
    setPage,
    hasMore,
    addTrainingData,
    updateTrainingData,
    deleteTrainingData,
  };
};

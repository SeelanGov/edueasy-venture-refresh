import { TrainingHeader } from './training/TrainingHeader';
import { MessageTable } from './training/MessageTable';
import { TrainingFooter } from './training/TrainingFooter';
import { type ChatMessage, type TrainingEntry } from '@/hooks/useTrainingData';
import { type Intent } from '@/hooks/useIntentManagement';
import { useModelTraining } from '@/hooks/useModelTraining';

interface MessageTrainingProps {
  messages: ChatMessage[];
  trainedMessages: TrainingEntry[];
  loading: boolean;
  intents: Intent[];
  lowConfidenceOnly: boolean;
  setLowConfidenceOnly: (value: boolean) => void;
  page: number;
  setPage: (page: number) => void;
  hasMore: boolean;
  onTrain: (messageId: string, intentId: string) => void;
  onUpdateTraining: (id: string, intentId: string) => void;
  onDeleteTraining: (id: string) => void;
}

/**
 * MessageTraining
 * @description Function
 */
export const MessageTraining = ({
  messages,
  trainedMessages,
  loading,
  intents,
  lowConfidenceOnly,
  setLowConfidenceOnly,
  page,
  setPage,
  hasMore,
  onTrain,
  onUpdateTraining,
  onDeleteTraining,
}: MessageTrainingProps): JSX.Element => {
  const {
    trainingStats,
    lastTrainingDate,
    isLoading: statsLoading,
    isRetraining,
    retrainModel,
  } = useModelTraining();

  return (
    <div className="space-y-4">
      <TrainingHeader
        lowConfidenceOnly={lowConfidenceOnly}
        setLowConfidenceOnly={setLowConfidenceOnly}
        trainingStats={trainingStats}
        lastTrainingDate={lastTrainingDate}
        isLoading={statsLoading}
        isRetraining={isRetraining}
        onRetrain={retrainModel}
      />

      <MessageTable
        messages={messages}
        trainedMessages={trainedMessages}
        loading={loading}
        intents={intents}
        onTrain={onTrain}
        onUpdateTraining={onUpdateTraining}
        onDeleteTraining={onDeleteTraining}
      />

      <TrainingFooter page={page} setPage={setPage} hasMore={hasMore} />
    </div>
  );
};

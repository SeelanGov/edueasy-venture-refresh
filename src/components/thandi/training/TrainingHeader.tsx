import { Switch } from '@/components/ui/switch';
import { Label } from '@/components/ui/label';
import { ModelTrainingStatus } from './ModelTrainingStatus';
import { TrainingStats } from '@/hooks/useModelTraining';

interface TrainingHeaderProps {
  lowConfidenceOnly: boolean;
  setLowConfidenceOnly: (value: boolean) => void;
  trainingStats: TrainingStats | null;
  lastTrainingDate: Date | null;
  isLoading: boolean;
  isRetraining: boolean;
  onRetrain: () => Promise<void>;
}

export const TrainingHeader = ({
  lowConfidenceOnly,
  setLowConfidenceOnly,
  trainingStats,
  lastTrainingDate,
  isLoading,
  isRetraining,
  onRetrain,
}: TrainingHeaderProps) => {
  return (
    <div className="space-y-4">
      <div className="flex justify-between items-center">
        <h2 className="text-xl font-semibold">Message Training</h2>
        <div className="flex items-center space-x-4">
          <div className="flex items-center space-x-2">
            <Switch
              id="low-confidence"
              checked={lowConfidenceOnly}
              onCheckedChange={setLowConfidenceOnly}
            />
            <Label htmlFor="low-confidence">Show low confidence only</Label>
          </div>
        </div>
      </div>

      <ModelTrainingStatus
        trainingStats={trainingStats}
        lastTrainingDate={lastTrainingDate}
        isLoading={isLoading}
        isRetraining={isRetraining}
        onRetrain={onRetrain}
      />
    </div>
  );
};

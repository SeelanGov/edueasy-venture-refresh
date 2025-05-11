
import { useState } from "react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Spinner } from "@/components/Spinner";
import { TrainingStats } from "@/hooks/useModelTraining";
import { toast } from "sonner";
import { RefreshCw, Check, AlertTriangle } from "lucide-react";

interface ModelTrainingStatusProps {
  trainingStats: TrainingStats | null;
  lastTrainingDate: Date | null;
  isLoading: boolean;
  isRetraining: boolean;
  onRetrain: () => Promise<void>;
}

export const ModelTrainingStatus = ({
  trainingStats,
  lastTrainingDate,
  isLoading,
  isRetraining,
  onRetrain
}: ModelTrainingStatusProps) => {
  const [showStats, setShowStats] = useState(false);
  
  const handleRetrain = async () => {
    try {
      await onRetrain();
      toast.success("Model retraining completed successfully");
    } catch (error) {
      console.error("Retraining error:", error);
      toast.error("Failed to retrain model. Please try again.");
    }
  };
  
  const formatDate = (date: Date | null) => {
    if (!date) return "Never";
    return new Intl.DateTimeFormat('en-US', {
      dateStyle: 'medium',
      timeStyle: 'short'
    }).format(date);
  };
  
  return (
    <Card className="p-4 mb-4">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <h3 className="text-lg font-medium">Model Training Status</h3>
          <div className="flex items-center mt-1 gap-2">
            <span className="text-sm text-muted-foreground">Last trained:</span>
            <span className="text-sm font-medium">{formatDate(lastTrainingDate)}</span>
            {lastTrainingDate && (
              <Badge variant={
                Date.now() - lastTrainingDate.getTime() > 7 * 24 * 60 * 60 * 1000
                  ? "outline"
                  : "default"
              }>
                {Date.now() - lastTrainingDate.getTime() > 7 * 24 * 60 * 60 * 1000
                  ? "Needs retraining"
                  : "Up to date"
                }
              </Badge>
            )}
          </div>
          
          {!isLoading && trainingStats && showStats && (
            <div className="mt-2 grid grid-cols-2 gap-x-4 gap-y-1 text-xs">
              <div>Training examples: <span className="font-medium">{trainingStats.exampleCount}</span></div>
              <div>Confidence threshold: <span className="font-medium">{trainingStats.confidenceThreshold}%</span></div>
              <div>Average confidence: <span className="font-medium">{trainingStats.avgConfidence}%</span></div>
              <div>Unique intents: <span className="font-medium">{trainingStats.uniqueIntents}</span></div>
            </div>
          )}
          
          <Button 
            variant="ghost" 
            size="sm" 
            className="mt-1 h-6 px-2 text-xs"
            onClick={() => setShowStats(!showStats)}
          >
            {showStats ? "Hide stats" : "Show stats"}
          </Button>
        </div>
        
        <Button 
          onClick={handleRetrain}
          disabled={isRetraining || isLoading}
          className="relative"
        >
          {isRetraining ? (
            <>
              <Spinner size="sm" className="mr-2" />
              <span>Training...</span>
            </>
          ) : (
            <>
              <RefreshCw className="h-4 w-4 mr-2" />
              <span>Retrain Model</span>
            </>
          )}
        </Button>
      </div>
      
      {trainingStats?.modelStatus && (
        <div className="mt-3 text-sm flex items-center gap-2">
          <span className="font-medium">Model status:</span>
          {trainingStats.modelStatus === "healthy" ? (
            <Badge variant="default" className="bg-green-100 text-green-800 hover:bg-green-200">
              <Check className="h-3 w-3 mr-1" /> Healthy
            </Badge>
          ) : (
            <Badge variant="destructive">
              <AlertTriangle className="h-3 w-3 mr-1" /> Needs attention
            </Badge>
          )}
        </div>
      )}
    </Card>
  );
};


import { useState } from "react";
import { Intent } from "@/hooks/useIntentManagement";
import { ChatMessage, TrainingEntry } from "@/hooks/useTrainingData";
import { TableRow, TableCell } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { 
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { 
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import {
  AlertCircle,
  CheckCircle,
  Clock,
  XCircle,
  Tag,
} from "lucide-react";

interface MessageRowProps {
  message: ChatMessage;
  training: TrainingEntry | undefined;
  intents: Intent[];
  onTrain: (messageId: string, intentId: string) => void;
  onUpdateTraining: (trainingId: string, intentId: string) => void;
  onDeleteTraining: (trainingId: string) => void;
}

export const MessageRow = ({
  message,
  training,
  intents,
  onTrain,
  onUpdateTraining,
  onDeleteTraining
}: MessageRowProps) => {
  const [selectedIntent, setSelectedIntent] = useState<string>("");

  const formatConfidence = (score: number | null | undefined) => {
    if (score === null || score === undefined) return "-";
    return `${Math.round(score * 100)}%`;
  };

  const handleTrain = () => {
    if (selectedIntent) {
      onTrain(message.id, selectedIntent);
      setSelectedIntent("");
    }
  };

  const handleUpdateTraining = (trainingId: string) => {
    if (selectedIntent) {
      onUpdateTraining(trainingId, selectedIntent);
      setSelectedIntent("");
    }
  };

  return (
    <TableRow>
      <TableCell className="font-medium">
        <div className="line-clamp-3">{message.message}</div>
        <div className="text-xs text-gray-500 mt-1">
          {new Date(message.created_at).toLocaleString()}
        </div>
      </TableCell>
      <TableCell>
        <div className="text-sm font-medium">{message.user_name}</div>
        <div className="text-xs text-gray-500">{message.user_email}</div>
      </TableCell>
      <TableCell>
        {message.intent_id ? (
          <TooltipProvider>
            <Tooltip>
              <TooltipTrigger asChild>
                <Badge variant={message.low_confidence ? "outline" : "secondary"}>
                  {intents.find(i => i.id === message.intent_id)?.intent_name || "Unknown"}
                </Badge>
              </TooltipTrigger>
              <TooltipContent>
                <p>Detected by Thandi AI</p>
              </TooltipContent>
            </Tooltip>
          </TooltipProvider>
        ) : (
          <Badge variant="outline">None</Badge>
        )}
        
        {training && (
          <TooltipProvider>
            <Tooltip>
              <TooltipTrigger asChild>
                <Badge variant="default" className="ml-1">
                  <Tag className="h-3 w-3 mr-1" />
                  {intents.find(i => i.id === training.intent_id)?.intent_name || "Unknown"}
                </Badge>
              </TooltipTrigger>
              <TooltipContent>
                <p>Trained by admin</p>
              </TooltipContent>
            </Tooltip>
          </TooltipProvider>
        )}
      </TableCell>
      <TableCell>
        {message.confidence_score !== null ? (
          <Badge 
            variant={message.low_confidence ? "destructive" : "default"}
            className={message.low_confidence ? "" : "bg-green-600 hover:bg-green-700"}
          >
            {message.low_confidence ? (
              <AlertCircle className="h-3 w-3 mr-1" />
            ) : (
              <CheckCircle className="h-3 w-3 mr-1" />
            )}
            {formatConfidence(message.confidence_score)}
          </Badge>
        ) : (
          <Badge variant="outline">
            <Clock className="h-3 w-3 mr-1" />
            Unknown
          </Badge>
        )}
      </TableCell>
      <TableCell>
        <Select 
          value={selectedIntent} 
          onValueChange={(value) => setSelectedIntent(value)}
        >
          <SelectTrigger className="w-full">
            <SelectValue placeholder="Select intent" />
          </SelectTrigger>
          <SelectContent>
            {intents.map((intent) => (
              <SelectItem key={intent.id} value={intent.id}>
                {intent.intent_name}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </TableCell>
      <TableCell>
        {training ? (
          <div className="flex space-x-2">
            <Button 
              variant="outline"
              size="sm"
              disabled={!selectedIntent}
              onClick={() => handleUpdateTraining(training.id)}
            >
              Update
            </Button>
            <Button 
              variant="outline"
              size="sm"
              className="text-destructive hover:text-destructive"
              onClick={() => onDeleteTraining(training.id)}
            >
              <XCircle className="h-4 w-4" />
            </Button>
          </div>
        ) : (
          <Button 
            variant="outline"
            size="sm"
            disabled={!selectedIntent}
            onClick={handleTrain}
          >
            Train
          </Button>
        )}
      </TableCell>
    </TableRow>
  );
};

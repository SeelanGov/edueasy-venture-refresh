
import { useState } from "react";
import { 
  ChatMessage, 
  TrainingEntry,
  useTrainingData 
} from "@/hooks/useTrainingData";
import { Intent, useIntentManagement } from "@/hooks/useIntentManagement";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow
} from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Pagination, PaginationContent, PaginationItem, PaginationNext, PaginationPrevious } from "@/components/ui/pagination";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
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
  onDeleteTraining
}: MessageTrainingProps) => {
  const [selectedIntents, setSelectedIntents] = useState<Record<string, string>>({});
  
  const getTrainingForMessage = (messageId: string) => {
    return trainedMessages.find(t => t.message_id === messageId);
  };

  const handleIntentSelect = (messageId: string, intentId: string) => {
    setSelectedIntents({
      ...selectedIntents,
      [messageId]: intentId
    });
  };

  const handleTrain = (messageId: string) => {
    const intentId = selectedIntents[messageId];
    if (intentId) {
      onTrain(messageId, intentId);
      // Clear selected intent after training
      const newSelectedIntents = { ...selectedIntents };
      delete newSelectedIntents[messageId];
      setSelectedIntents(newSelectedIntents);
    }
  };

  const handleUpdateTraining = (trainingId: string, messageId: string) => {
    const intentId = selectedIntents[messageId];
    if (intentId) {
      onUpdateTraining(trainingId, intentId);
      // Clear selected intent after updating
      const newSelectedIntents = { ...selectedIntents };
      delete newSelectedIntents[messageId];
      setSelectedIntents(newSelectedIntents);
    }
  };

  const formatConfidence = (score: number | null | undefined) => {
    if (score === null || score === undefined) return "-";
    return `${Math.round(score * 100)}%`;
  };

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
      
      <div className="border rounded-md">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead className="w-[300px]">Message</TableHead>
              <TableHead className="w-[150px]">User</TableHead>
              <TableHead className="w-[120px]">Detected Intent</TableHead>
              <TableHead className="w-[120px]">Confidence</TableHead>
              <TableHead className="w-[200px]">Assign Intent</TableHead>
              <TableHead className="w-[120px]">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {loading ? (
              <TableRow>
                <TableCell colSpan={6} className="text-center py-4">Loading messages...</TableCell>
              </TableRow>
            ) : messages.length === 0 ? (
              <TableRow>
                <TableCell colSpan={6} className="text-center py-4">No messages found.</TableCell>
              </TableRow>
            ) : (
              messages.map((message) => {
                const training = getTrainingForMessage(message.id);
                
                return (
                  <TableRow key={message.id}>
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
                        value={selectedIntents[message.id] || ""} 
                        onValueChange={(value) => handleIntentSelect(message.id, value)}
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
                            disabled={!selectedIntents[message.id]}
                            onClick={() => handleUpdateTraining(training.id, message.id)}
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
                          disabled={!selectedIntents[message.id]}
                          onClick={() => handleTrain(message.id)}
                        >
                          Train
                        </Button>
                      )}
                    </TableCell>
                  </TableRow>
                );
              })
            )}
          </TableBody>
        </Table>
      </div>
      
      {/* Pagination */}
      <div className="flex justify-center">
        <Pagination>
          <PaginationContent>
            <PaginationItem>
              <PaginationPrevious 
                onClick={() => page > 0 && setPage(page - 1)}
                className={page === 0 ? "pointer-events-none opacity-50" : ""}
              />
            </PaginationItem>
            <PaginationItem>
              <span className="px-2">{page + 1}</span>
            </PaginationItem>
            <PaginationItem>
              <PaginationNext 
                onClick={() => hasMore && setPage(page + 1)}
                className={!hasMore ? "pointer-events-none opacity-50" : ""}
              />
            </PaginationItem>
          </PaginationContent>
        </Pagination>
      </div>
    </div>
  );
};

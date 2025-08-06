import type { ChatMessage, TrainingEntry } from '@/hooks/useTrainingData';
import type { Intent } from '@/hooks/useIntentManagement';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { MessageRow } from './MessageRow';

interface MessageTableProps {
  messages: ChatMessage[];
  trainedMessages: TrainingEntry[];
  loading: boolean;
  intents: Intent[];
  onTrain: (messageId: string, intentId: string) => void;
  onUpdateTraining: (id: string, intentId: string) => void;
  onDeleteTraining: (id: string) => void;
}

/**
 * MessageTable
 * @description Function
 */
export const MessageTable = ({
  messages,
  trainedMessages,
  loading,
  intents,
  onTrain,
  onUpdateTraining,
  onDeleteTraining,
}: MessageTableProps): void => {
  const getTrainingForMessage = (messageId: string): void => {
    return trainedMessages.find((t) => t.message_id === messageId);
  };

  return (
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
              <TableCell colSpan={6} className="text-center py-4">
                Loading messages...
              </TableCell>
            </TableRow>
          ) : messages.length === 0 ? (
            <TableRow>
              <TableCell colSpan={6} className="text-center py-4">
                No messages found.
              </TableCell>
            </TableRow>
          ) : (
            messages.map((message) => (
              <MessageRow
                key={message.id}
                message={message}
                training={getTrainingForMessage(message.id)}
                intents={intents}
                onTrain={onTrain}
                onUpdateTraining={onUpdateTraining}
                onDeleteTraining={onDeleteTraining}
              />
            ))
          )}
        </TableBody>
      </Table>
    </div>
  );
};

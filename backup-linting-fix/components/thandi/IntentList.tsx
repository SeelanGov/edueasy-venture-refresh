import { useState } from 'react';
import type { IntentWithStats } from '@/hooks/useIntentManagement';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Edit, Trash2, Plus, Info } from 'lucide-react';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip';
import { IntentForm } from './IntentForm';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';

interface IntentListProps {
  intents: IntentWithStats[];
  loading: boolean;
  onEdit: (intent: IntentWithStats) => void;
  onDelete: (id: string) => void;
  onCreate: (data: {
    intent_name: string;
    description?: string;
    response_template?: string;
    sample_queries?: string[];
  }) => void;
}

/**
 * IntentList
 * @description Function
 */
export const IntentList = ({
  intents,
  loading,
  onEdit,
  onDelete,
  onCreate,
}: IntentListProps) => {
  const [isCreating, setIsCreating] = useState(false);
  const [showDeleteDialog, setShowDeleteDialog] = useState(false);
  const [intentToDelete, setIntentToDelete] = useState<string | null>(null);

  const handleDelete = (id: string) => {
    setIntentToDelete(id);
    setShowDeleteDialog(true);
  };

  const confirmDelete = () => {
    if (intentToDelete) {
      onDelete(intentToDelete);
      setShowDeleteDialog(false);
      setIntentToDelete(null);
    }
  };

  const handleCreate = (data: {
    intent_name: string;
    description?: string;
    response_template?: string;
    sample_queries?: string[];
  }) => {
    onCreate(data);
    setIsCreating(false);
  };

  return (
    <div className="space-y-4">
      <div className="flex justify-between items-center">
        <h2 className="text-xl font-semibold">Intent Management</h2>
        <Button onClick={() => setIsCreating(true)}>
          <Plus className="h-4 w-4 mr-2" /> Add Intent
        </Button>
      </div>

      {/* Create Intent Form Dialog */}
      <Dialog open={isCreating} onOpenChange={setIsCreating}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>Create New Intent</DialogTitle>
            <DialogDescription>Define a new intent for Thandi to recognize.</DialogDescription>
          </DialogHeader>
          <IntentForm onSubmit={handleCreate} onCancel={() => setIsCreating(false)} />
        </DialogContent>
      </Dialog>

      {/* Delete Confirmation Dialog */}
      <Dialog open={showDeleteDialog} onOpenChange={setShowDeleteDialog}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>Confirm Deletion</DialogTitle>
            <DialogDescription>
              Are you sure you want to delete this intent? This action cannot be undone.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button variant="outline" onClick={() => setShowDeleteDialog(false)}>
              Cancel
            </Button>
            <Button variant="destructive" onClick={confirmDelete}>
              Delete
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      <div className="border rounded-md">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead className="w-[200px]">Name</TableHead>
              <TableHead>Description</TableHead>
              <TableHead className="w-[100px]" title="Number of messages">
                Messages
              </TableHead>
              <TableHead className="w-[100px]" title="Average confidence score">
                Avg. Conf.
              </TableHead>
              <TableHead className="w-[100px]">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {loading ? (
              <TableRow>
                <TableCell colSpan={5} className="text-center py-4">
                  Loading intents...
                </TableCell>
              </TableRow>
            ) : intents.length === 0 ? (
              <TableRow>
                <TableCell colSpan={5} className="text-center py-4">
                  No intents found.
                </TableCell>
              </TableRow>
            ) : (
              intents.map((intent) => (
                <TableRow key={intent.id}>
                  <TableCell className="font-medium">
                    <div>{intent.intent_name}</div>
                    {intent.sample_queries && intent.sample_queries.length > 0 && (
                      <TooltipProvider>
                        <Tooltip>
                          <TooltipTrigger>
                            <Badge variant="outline" className="mt-1 cursor-help">
                              {intent.sample_queries.length} samples
                            </Badge>
                          </TooltipTrigger>
                          <TooltipContent className="max-w-md">
                            <div className="p-2">
                              <h4 className="font-semibold mb-1">Sample Queries:</h4>
                              <ul className="list-disc pl-5">
                                {intent.sample_queries.slice(0, 5).map((query, idx) => (
                                  <li key={idx} className="text-sm">
                                    {query}
                                  </li>
                                ))}
                                {intent.sample_queries.length > 5 && (
                                  <li className="text-sm font-italic">
                                    ...and {intent.sample_queries.length - 5} more
                                  </li>
                                )}
                              </ul>
                            </div>
                          </TooltipContent>
                        </Tooltip>
                      </TooltipProvider>
                    )}
                  </TableCell>
                  <TableCell>
                    <div className="line-clamp-2">{intent.description || '-'}</div>
                    {intent.response_template && (
                      <TooltipProvider>
                        <Tooltip>
                          <TooltipTrigger>
                            <Badge variant="secondary" className="mt-1 cursor-help">
                              <Info className="h-3 w-3 mr-1" /> Has template
                            </Badge>
                          </TooltipTrigger>
                          <TooltipContent className="max-w-md">
                            <div className="p-2">
                              <h4 className="font-semibold mb-1">Response Template:</h4>
                              <p className="text-sm">{intent.response_template}</p>
                            </div>
                          </TooltipContent>
                        </Tooltip>
                      </TooltipProvider>
                    )}
                  </TableCell>
                  <TableCell>{intent.message_count}</TableCell>
                  <TableCell>
                    {intent.avg_confidence !== null
                      ? Math.round(intent.avg_confidence * 100) + '%'
                      : '-'}
                  </TableCell>
                  <TableCell>
                    <div className="flex space-x-2">
                      <Button variant="ghost" size="icon" onClick={() => onEdit(intent)}>
                        <Edit className="h-4 w-4" />
                      </Button>
                      <Button
                        variant="ghost"
                        size="icon"
                        className="text-destructive hover:text-destructive"
                        onClick={() => handleDelete(intent.id)}
                        disabled={intent.message_count > 0}
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                  </TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </div>
    </div>
  );
};

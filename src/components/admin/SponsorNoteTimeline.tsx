
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Card, CardContent } from '@/components/ui/card';
import { usePartnerNotes, useCreatePartnerNote } from '@/hooks/usePartnerData';
import { format } from 'date-fns';
import { Plus, MessageSquare, User } from 'lucide-react';

interface SponsorNoteTimelineProps {
  sponsorId: string;
}

export const SponsorNoteTimeline: React.FC<SponsorNoteTimelineProps> = ({ sponsorId }) => {
  const [newNote, setNewNote] = useState('');
  const [isAdding, setIsAdding] = useState(false);
  
  const { data: notes, isLoading } = usePartnerNotes(sponsorId);
  const createNote = useCreatePartnerNote();

  const handleAddNote = async () => {
    if (!newNote.trim()) return;

    try {
      await createNote.mutateAsync({
        partner_id: sponsorId,
        note: newNote,
        note_type: 'general',
      });
      setNewNote('');
      setIsAdding(false);
    } catch (error) {
      console.error('Failed to add note:', error);
    }
  };

  if (isLoading) {
    return <div className="p-4">Loading notes...</div>;
  }

  return (
    <div className="space-y-4">
      <div className="flex justify-between items-center">
        <h3 className="text-lg font-semibold">Notes & Timeline</h3>
        <Button 
          variant="outline" 
          size="sm"
          onClick={() => setIsAdding(!isAdding)}
        >
          <Plus className="w-4 h-4 mr-2" />
          Add Note
        </Button>
      </div>

      {isAdding && (
        <Card>
          <CardContent className="p-4">
            <Textarea
              placeholder="Add a note about this sponsor..."
              value={newNote}
              onChange={(e) => setNewNote(e.target.value)}
              className="mb-3"
            />
            <div className="flex gap-2">
              <Button 
                size="sm" 
                onClick={handleAddNote}
                disabled={!newNote.trim() || createNote.isPending}
              >
                Add Note
              </Button>
              <Button 
                variant="outline" 
                size="sm"
                onClick={() => {
                  setIsAdding(false);
                  setNewNote('');
                }}
              >
                Cancel
              </Button>
            </div>
          </CardContent>
        </Card>
      )}

      <div className="space-y-3">
        {notes?.map((note: any) => (
          <Card key={note.id}>
            <CardContent className="p-4">
              <div className="flex items-start gap-3">
                <div className="flex-shrink-0 w-8 h-8 bg-muted rounded-full flex items-center justify-center">
                  <MessageSquare className="w-4 h-4" />
                </div>
                <div className="flex-1">
                  <div className="flex items-center gap-2 mb-2">
                    <User className="w-4 h-4 text-muted-foreground" />
                    <span className="text-sm font-medium">Admin</span>
                    <span className="text-sm text-muted-foreground">
                      {format(new Date(note.created_at), 'MMM dd, yyyy at h:mm a')}
                    </span>
                  </div>
                  <p className="text-sm">{note.note}</p>
                  {note.note_type && note.note_type !== 'general' && (
                    <span className="inline-block mt-2 px-2 py-1 bg-muted rounded text-xs">
                      {note.note_type}
                    </span>
                  )}
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
        
        {(!notes || notes.length === 0) && (
          <div className="text-center py-8 text-muted-foreground">
            <MessageSquare className="w-12 h-12 mx-auto mb-4 opacity-50" />
            <p>No notes yet. Add the first note to start tracking interactions.</p>
          </div>
        )}
      </div>
    </div>
  );
};

import React from 'react';
import type { SponsorNote } from '@/hooks/useSponsorNotes';

interface SponsorNoteTimelineProps {
  notes: SponsorNote[];
}

/**
 * SponsorNoteTimeline
 * @description Function
 */
export const SponsorNoteTimeline: React.FC<SponsorNoteTimelineProps> = ({ notes }) => (
  <div className="py-4">
    {notes.length === 0 && (
      <div className="py-8 text-center text-gray-400">No sponsor notes yet.</div>
    )}
    <ol className="relative border-s border-gray-200">
      {notes.map((note) => (
        <li key={note.id} className="mb-8 ms-6">
          <span className="absolute flex items-center justify-center w-6 h-6 bg-blue-100 rounded-full -start-3 ring-2 ring-white">
            <span className="w-2 h-2 bg-blue-600 rounded-full"></span>
          </span>
          <div className="flex items-center mb-1">
            <span className="text-xs text-gray-500">
              {note.created_at ? new Date(note.created_at).toLocaleString() : ''}
            </span>
            <span className="ml-2 text-xs text-muted-foreground">
              {note.note_type || 'General'}
            </span>
          </div>
          <div className="text-sm font-medium text-gray-800">{note.note}</div>
        </li>
      ))}
    </ol>
  </div>
);

export default SponsorNoteTimeline;

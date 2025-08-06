import React from 'react';
const NotesTimeline: React.FC<{ notes: unknown[] }> = ({ notes }) => (
  <div>
    <h3 className="font-semibold mb-2">Notes</h3>
    {!notes?.length ? (
      <div className="text-gray-400 italic py-4">No notes found.</div>
    ) : (
      <ul className="space-y-2">
        {notes.map((note, i) => (
          <li key={i} className="bg-gray-50 border rounded p-2">
            <div className="text-sm">{note.note}</div>
            <div className="text-xs text-gray-400">
              {note.created_at?.slice(0, 16)} by {note.created_by || 'unknown'}
            </div>
          </li>
        ))}
      </ul>
    )}
  </div>
);
export default NotesTimeline;

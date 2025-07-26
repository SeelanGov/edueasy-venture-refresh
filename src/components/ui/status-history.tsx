import React from 'react';
import { StatusBadge, type ExtendedStatusType } from './status-badge';
import { cn } from '@/lib/utils';
import { format } from 'date-fns';

export interface StatusHistoryEntry {
  id: string;
  status: ExtendedStatusType;
  timestamp: Date;
  note?: string;
  updatedBy?: string;
}

interface StatusHistoryProps {
  entries: StatusHistoryEntry[];
  className?: string;
  showTimestamps?: boolean;
  showNotes?: boolean;
  showUpdatedBy?: boolean;
  maxEntries?: number;
}

/**
 * StatusHistory
 * @description Function
 */
export const StatusHistory: React.FC<StatusHistoryProps> = ({
  entries,
  className,
  showTimestamps = true,
  showNotes = true,
  showUpdatedBy = false,
  maxEntries,
}) => {
  const displayEntries = maxEntries ? entries.slice(0, maxEntries) : entries;

  return (
    <div className={cn('space-y-3', className)}>
      <h4 className="text-sm font-medium text-foreground">Status History</h4>
      <div className="space-y-2">
        {displayEntries.map((entry, index) => (
          <div
            key={entry.id}
            className={cn(
              'flex items-start gap-3 p-3 rounded-md border',
              index === 0 ? 'bg-muted/30' : 'bg-background',
            )}
          >
            <div className="flex-shrink-0">
              <StatusBadge status={entry.status} size="sm">
                {entry.status.charAt(0).toUpperCase() + entry.status.slice(1).replace('-', ' ')}
              </StatusBadge>
            </div>

            <div className="flex-1 min-w-0">
              <div className="flex items-center gap-2 text-sm">
                {showTimestamps && (
                  <time className="text-muted-foreground" dateTime={entry.timestamp.toISOString()}>
                    {format(entry.timestamp, 'MMM d, yyyy h:mm a')}
                  </time>
                )}
                {showUpdatedBy && entry.updatedBy && (
                  <span className="text-muted-foreground">by {entry.updatedBy}</span>
                )}
              </div>

              {showNotes && entry.note && (
                <p className="mt-1 text-sm text-foreground">{entry.note}</p>
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default StatusHistory;

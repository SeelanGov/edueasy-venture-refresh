import { Button } from '@/components/ui/button';
import { Typography } from '@/components/ui/typography';
import { cn } from '@/lib/utils';

interface OfflineNoticeProps {
  isOnline: boolean;
  onSyncNow: () => void;
  className?: string;
}

/**
 * OfflineNotice
 * @description Function
 */
export const OfflineNotice = ({ isOnline, onSyncNow, className }: OfflineNoticeProps): JSX.Element | null => {
  if (isOnline) return null;

  return (
    <div
      className={cn(
        'bg-warning/10 border border-warning/20 rounded-md p-4 mb-6',
        'dark:bg-warning/5 dark:border-warning/10',
        'md:p-5 md:mb-8 md:flex md:items-center md:justify-between',
        className,
      )}
      role="alert"
      aria-live="polite"
    >
      <div className="flex md:flex-1">
        <div className="flex-shrink-0">
          <svg
            className="h-5 w-5 md:h-6 md:w-6 text-warning"
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 20 20"
            fill="currentColor"
            aria-hidden="true"
          >
            <path
              fillRule="evenodd"
              d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z"
              clipRule="evenodd"
            />
          </svg>
        </div>
        <div className="ml-3 md:ml-4">
          <Typography variant="h5" color="warning" className="font-medium md:text-lg">
            You're currently offline
          </Typography>
          <Typography variant="body-sm" className="mt-2 text-warning/80 md:text-base">
            Your application will be saved locally. Click "Sync Now" when you're back online.
          </Typography>
          <div className="mt-4 md:hidden">
            <Button
              variant="outline"
              size="sm"
              onClick={onSyncNow}
              disabled={!isOnline}
              className="border-warning/20 bg-warning/5 hover:bg-warning/10 text-warning-foreground focus-visible-ring"
              aria-label="Synchronize application data"
            >
              Sync Now
            </Button>
          </div>
        </div>
      </div>
      <div className="hidden md:block md:ml-4">
        <Button
          variant="outline"
          onClick={onSyncNow}
          disabled={!isOnline}
          className="border-warning/20 bg-warning/5 hover:bg-warning/10 text-warning-foreground focus-visible-ring"
          aria-label="Synchronize application data"
        >
          Sync Now
        </Button>
      </div>
    </div>
  );
};

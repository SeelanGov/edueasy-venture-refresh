import { useEffect } from 'react';
import { useToast } from '@/hooks/use-toast';

interface AnalyticsKeyboardShortcutsProps {
  onRefresh: () => void;
  onExport: () => void;
  onResetFilters: () => void;
}


/**
 * AnalyticsKeyboardShortcuts
 * @description Function
 */
export const AnalyticsKeyboardShortcuts = ({
  onRefresh,
  onExport,
  onResetFilters,
}: AnalyticsKeyboardShortcutsProps): void => {
  const { toast } = useToast();

  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent): void => {
      // Only handle if Ctrl/Cmd is pressed
      if (!(event.ctrlKey || event.metaKey)) return;

      switch (event.key) {
        case 'r':
          event.preventDefault();
          onRefresh();
          toast({
            title: 'Data Refreshed',
            description: 'Analytics data has been refreshed.',
          });
          break;
        case 'e':
          event.preventDefault();
          onExport();
          toast({
            title: 'Export Started',
            description: 'Analytics data export has been initiated.',
          });
          break;
        case 'Backspace':
          event.preventDefault();
          onResetFilters();
          toast({
            title: 'Filters Reset',
            description: 'All filters have been cleared.',
          });
          break;
        default:
          break;
      }
    };

    document.addEventListener('keydown', handleKeyDown);
    return () => document.removeEventListener('keydown', handleKeyDown);
  }, [onRefresh, onExport, onResetFilters, toast]);

  return null; // This component only handles keyboard events
};

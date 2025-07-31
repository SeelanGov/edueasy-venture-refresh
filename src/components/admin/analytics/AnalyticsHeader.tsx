import { Button } from '@/components/ui/button';
import { Download, RefreshCw, Keyboard } from 'lucide-react';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip';
import { AnalyticsBreadcrumb } from './AnalyticsBreadcrumb';

interface AnalyticsHeaderProps {
  onRefresh: () => void;
  onExport: () => void;
  loading: boolean;
  hasData: boolean;
}

/**
 * AnalyticsHeader
 * @description Function
 */
export const AnalyticsHeader = ({
  onRefresh,
  onExport,
  loading,
  hasData,
}: AnalyticsHeaderProps) => {
  return (
    <div className="space-y-4">
      <AnalyticsBreadcrumb />

      <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Document Analytics Dashboard</h1>
          <p className="text-muted-foreground mt-1">
            Monitor document verification performance and trends
          </p>
        </div>

        <div className="flex items-center gap-3 mt-4 lg:mt-0">
          <TooltipProvider>
            <Tooltip>
              <TooltipTrigger asChild>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={onRefresh}
                  disabled={loading}
                  className="flex items-center gap-2"
                >
                  <RefreshCw className={`h-4 w-4 ${loading ? 'animate-spin' : ''}`} />
                  <span className="hidden sm:inline">Refresh</span>
                </Button>
              </TooltipTrigger>
              <TooltipContent>
                <p>Refresh data (Ctrl+R)</p>
              </TooltipContent>
            </Tooltip>
          </TooltipProvider>

          <TooltipProvider>
            <Tooltip>
              <TooltipTrigger asChild>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={onExport}
                  disabled={loading || !hasData}
                  className="flex items-center gap-2"
                >
                  <Download className="h-4 w-4" />
                  <span className="hidden sm:inline">Export</span>
                </Button>
              </TooltipTrigger>
              <TooltipContent>
                <p>Export data (Ctrl+E)</p>
              </TooltipContent>
            </Tooltip>
          </TooltipProvider>

          <TooltipProvider>
            <Tooltip>
              <TooltipTrigger asChild>
                <Button variant="ghost" size="sm">
                  <Keyboard className="h-4 w-4" />
                </Button>
              </TooltipTrigger>
              <TooltipContent>
                <div className="text-xs space-y-1">
                  <p>Keyboard Shortcuts:</p>
                  <p>Ctrl+R: Refresh</p>
                  <p>Ctrl+E: Export</p>
                  <p>Ctrl+Backspace: Reset Filters</p>
                </div>
              </TooltipContent>
            </Tooltip>
          </TooltipProvider>
        </div>
      </div>
    </div>
  );
};

import { AlertTriangle, RefreshCw } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Alert, AlertDescription } from '@/components/ui/alert';

interface AnalyticsErrorStateProps {
  error: string;
  onRetry: () => void;
}

/**
 * AnalyticsErrorState
 * @description Function
 */
export const AnalyticsErrorState = ({ error, onRetry }: AnalyticsErrorStateProps) => {
  return (
    <Card className = "mx-auto max-w-md">
      <CardHeader className = "text-center">
        <CardTitle className = "flex items-center justify-center gap-2 text-destructive">
          <AlertTriangle className = "h-5 w-5" />
          Error Loading Analytics
        </CardTitle>
      </CardHeader>
      <CardContent className = "space-y-4">
        <Alert variant = "destructive">
          <AlertTriangle className = "h-4 w-4" />
          <AlertDescription>{error}</AlertDescription>
        </Alert>

        <div className = "text-center">
          <Button onClick={onRetry} variant = "outline" className="gap-2">
            <RefreshCw className = "h-4 w-4" />
            Try Again
          </Button>
        </div>
      </CardContent>
    </Card>
  );
};

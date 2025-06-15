
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { AlertTriangle, RefreshCw } from 'lucide-react';

interface AnalyticsErrorStateProps {
  error: string;
  onRetry: () => void;
}

export const AnalyticsErrorState = ({ error, onRetry }: AnalyticsErrorStateProps) => {
  return (
    <Card className="border-red-200 bg-red-50">
      <CardContent className="p-8 text-center">
        <AlertTriangle className="h-12 w-12 text-red-500 mx-auto mb-4" />
        <h3 className="text-lg font-semibold text-red-900 mb-2">
          Error Loading Analytics
        </h3>
        <p className="text-red-700 mb-4">{error}</p>
        <Button 
          onClick={onRetry} 
          variant="outline" 
          className="border-red-300 text-red-700 hover:bg-red-100"
        >
          <RefreshCw className="h-4 w-4 mr-2" />
          Try Again
        </Button>
      </CardContent>
    </Card>
  );
};

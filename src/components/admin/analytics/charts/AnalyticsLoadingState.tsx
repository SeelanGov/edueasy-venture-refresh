
import { Spinner } from '@/components/Spinner';
import { Card, CardContent } from '@/components/ui/card';

export const AnalyticsLoadingState = () => {
  return (
    <div className="space-y-6">
      {/* Stat Cards Loading */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        {[...Array(4)].map((_, i) => (
          <Card key={i} className="animate-pulse">
            <CardContent className="p-6">
              <div className="space-y-2">
                <div className="h-4 bg-gray-200 rounded w-3/4"></div>
                <div className="h-8 bg-gray-200 rounded w-1/2"></div>
                <div className="h-3 bg-gray-200 rounded w-full"></div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
      
      {/* Charts Loading */}
      <div className="flex justify-center py-12">
        <Spinner size="lg" />
        <span className="ml-3 text-muted-foreground">Loading analytics data...</span>
      </div>
    </div>
  );
};

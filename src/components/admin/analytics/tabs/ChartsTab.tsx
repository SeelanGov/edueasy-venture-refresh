
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { DocumentTimelineChart } from '../DocumentTimelineChart';
import { DocumentTypePerformanceChart } from '../DocumentTypePerformanceChart';
import { DocumentAnalytics } from '@/hooks/analytics/types';

interface ChartsTabProps {
  analytics: DocumentAnalytics;
}

export const ChartsTab = ({ analytics }: ChartsTabProps) => {
  return (
    <>
      <Card>
        <CardHeader>
          <CardTitle>Document Processing Timeline</CardTitle>
          <CardDescription>Documents processed over time by status</CardDescription>
        </CardHeader>
        <CardContent>
          <DocumentTimelineChart data={analytics.documentsByDate} />
        </CardContent>
      </Card>
      
      <Card>
        <CardHeader>
          <CardTitle>Document Type Performance</CardTitle>
          <CardDescription>Approval and rejection rates by document type</CardDescription>
        </CardHeader>
        <CardContent>
          <DocumentTypePerformanceChart data={analytics.documentsByType} />
        </CardContent>
      </Card>
    </>
  );
};

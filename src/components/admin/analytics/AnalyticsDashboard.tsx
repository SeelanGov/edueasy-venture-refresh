
import { useEffect, useState } from 'react';
import { Button } from '@/components/ui/button';
import { Spinner } from '@/components/Spinner';
import { Download } from 'lucide-react';
import { AnalyticsFilters } from './AnalyticsFilters';
import { AnalyticsStatCards } from './AnalyticsStatCards';
import { AnalyticsTabs } from './AnalyticsTabs';
import { useDocumentAnalytics } from '@/hooks/analytics';
import { supabase } from '@/integrations/supabase/client';

export const AnalyticsDashboard = () => {
  const { analytics, loading, error, filters, updateFilters, resetFilters, refreshAnalytics } =
    useDocumentAnalytics();
  const [documentTypes, setDocumentTypes] = useState<string[]>([]);
  const [institutions, setInstitutions] = useState<{ id: string; name: string }[]>([]);

  // Pull unique document types and institutions for filtering
  useEffect(() => {
    const fetchMetadata = async () => {
      // Document types
      const { data: typeData } = await supabase
        .from('documents')
        .select('document_type')
        .not('document_type', 'is', null);

      if (typeData) {
        const validTypes: string[] = typeData
          .map((d) => d.document_type)
          .filter((type): type is string => type !== null && typeof type === 'string');
        setDocumentTypes(Array.from(new Set(validTypes)).sort());
      }

      // Institutions
      const { data: institutionData } = await supabase
        .from('institutions')
        .select('id, name')
        .order('name');
      if (institutionData) setInstitutions(institutionData);
    };
    fetchMetadata();
  }, []);

  // Export analytics as CSV
  const handleExportData = () => {
    if (!analytics) return;
    let csv = 'data:text/csv;charset=utf-8,';
    csv += 'Metric,Value\r\n';
    csv += `Total Documents,${analytics.totalDocuments}\r\n`;
    csv += `Approved Documents,${analytics.approvedDocuments}\r\n`;
    csv += `Rejected Documents,${analytics.rejectedDocuments}\r\n`;
    csv += `Pending Documents,${analytics.pendingDocuments}\r\n`;
    csv += `Resubmission Requested,${analytics.resubmissionRequestedDocuments}\r\n`;
    csv += `Pass Rate,${analytics.passRate.toFixed(2)}%\r\n`;
    csv += `Fail Rate,${analytics.failRate.toFixed(2)}%\r\n`;
    const encodedUri = encodeURI(csv);
    const link = document.createElement('a');
    link.setAttribute('href', encodedUri);
    link.setAttribute('download', 'document-analytics.csv');
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  if (error) {
    return (
      <div className="container mx-auto max-w-7xl py-8 px-4">
        <div className="bg-red-50 border-l-4 border-red-500 p-4 mb-6">
          <p className="text-red-700">Error loading analytics data: {error}</p>
        </div>
        <Button onClick={refreshAnalytics}>Try Again</Button>
      </div>
    );
  }

  return (
    <div className="container mx-auto max-w-7xl py-8 px-4">
      <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between mb-6">
        <div>
          <h1 className="text-2xl font-bold">Document Analytics Dashboard</h1>
          <p className="text-muted-foreground">
            Monitor document verification performance and trends
          </p>
        </div>
        <div className="flex items-center gap-4 mt-4 lg:mt-0">
          <Button variant="outline" onClick={refreshAnalytics} disabled={loading}>
            {loading ? <Spinner size="sm" /> : 'Refresh Data'}
          </Button>
          <Button variant="outline" onClick={handleExportData} disabled={loading || !analytics}>
            <Download className="h-4 w-4 mr-2" />
            Export
          </Button>
        </div>
      </div>

      <AnalyticsFilters
        filters={filters}
        onUpdateFilters={updateFilters}
        onResetFilters={resetFilters}
        documentTypes={documentTypes}
        institutions={institutions}
      />

      {loading ? (
        <div className="flex justify-center py-12">
          <Spinner size="lg" />
        </div>
      ) : analytics ? (
        <>
          <AnalyticsStatCards analytics={analytics} />
          <AnalyticsTabs analytics={analytics} />
        </>
      ) : (
        <div className="text-center py-12">
          <p className="text-muted-foreground">
            No data available. Try adjusting your filters.
          </p>
        </div>
      )}
    </div>
  );
};

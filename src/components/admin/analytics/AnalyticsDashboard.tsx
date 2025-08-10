import { useEffect } from 'react';
import { AnalyticsFilters } from './AnalyticsFilters';
import { AnalyticsStatCards } from './AnalyticsStatCards';
import { AnalyticsTabs } from './AnalyticsTabs';
import { AnalyticsLoadingState } from './charts/AnalyticsLoadingState';
import { AnalyticsErrorState } from './charts/AnalyticsErrorState';
import { AnalyticsHeader } from './AnalyticsHeader';
import { AnalyticsKeyboardShortcuts } from './AnalyticsKeyboardShortcuts';
import { useDocumentAnalytics } from '@/hooks/analytics';
import { supabase } from '@/integrations/supabase/client';

/**
 * AnalyticsDashboard
 * @description Function
 */
export const AnalyticsDashboard = () => {
  const { analytics, loading, error, filters, updateFilters, resetFilters, refreshAnalytics } =
    useDocumentAnalytics();
  const [documentTypes, setDocumentTypes] = useState<string[]>([]);
  const [institutions, setInstitutions] = useState<{ id: string; name: string }[]>([]);

  // Fetch metadata for filters
  useEffect(() => {
    const fetchMetadata = async () => {
      try {
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
      } catch (err) {
        console.error('Error fetching metadata:', err);
      }
    };

    fetchMetadata();
  }, []);

  // Export analytics data as CSV
  const handleExportData = (): void => {
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
    link.setAttribute(
      'download',
      `document-analytics-${new Date().toISOString().split('T')[0]}.csv`,
    );
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <div className="container mx-auto max-w-7xl py-6 px-4 space-y-6">
      <AnalyticsKeyboardShortcuts
        onRefresh={refreshAnalytics}
        onExport={handleExportData}
        onResetFilters={resetFilters}
      />

      <AnalyticsHeader
        onRefresh={refreshAnalytics}
        onExport={handleExportData}
        loading={loading}
        hasData={!!analytics}
      />

      <AnalyticsFilters
        filters={filters}
        onUpdateFilters={updateFilters}
        onResetFilters={resetFilters}
        documentTypes={documentTypes}
        institutions={institutions}
      />

      {error ? (
        <AnalyticsErrorState error={error} onRetry={refreshAnalytics} />
      ) : loading ? (
        <AnalyticsLoadingState />
      ) : analytics ? (
        <div className="space-y-6">
          <AnalyticsStatCards analytics={analytics} />
          <AnalyticsTabs analytics={analytics} />
        </div>
      ) : (
        <div className="text-center py-12">
          <p className="text-muted-foreground">No data available. Try adjusting your filters.</p>
        </div>
      )}
    </div>
  );
};

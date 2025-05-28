import { useState, useEffect } from 'react';
import { DashboardLayout } from '@/components/DashboardLayout';
import { AdminAuthGuard } from '@/components/AdminAuthGuard';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Button } from '@/components/ui/button';
import { Spinner } from '@/components/Spinner';
import { ChartBarIcon, TableIcon, Download } from 'lucide-react';
import { StatCard } from '@/components/admin/analytics/StatCard';
import { StatusDistributionChart } from '@/components/admin/analytics/StatusDistributionChart';
import { DocumentTimelineChart } from '@/components/admin/analytics/DocumentTimelineChart';
import { RejectionReasonsChart } from '@/components/admin/analytics/RejectionReasonsChart';
import { DocumentTypePerformanceChart } from '@/components/admin/analytics/DocumentTypePerformanceChart';
import { AnalyticsFilterBar } from '@/components/admin/analytics/AnalyticsFilters';
import { useDocumentAnalytics } from '@/hooks/analytics';
import { supabase } from '@/integrations/supabase/client';
import {
  Table,
  TableBody,
  TableCaption,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';

const AdminAnalytics = () => {
  const { analytics, loading, error, filters, updateFilters, resetFilters, refreshAnalytics } =
    useDocumentAnalytics();

  const [documentTypes, setDocumentTypes] = useState<string[]>([]);
  const [institutions, setInstitutions] = useState<{ id: string; name: string }[]>([]);
  const [activeTab, setActiveTab] = useState('overview');

  useEffect(() => {
    const fetchMetadata = async () => {
      // Fetch distinct document types
      const { data: typeData } = await supabase
        .from('documents')
        .select('document_type')
        .not('document_type', 'is', null);

      if (typeData) {
        const validTypes: string[] = typeData
          .map((d) => d.document_type)
          .filter((type): type is string => type !== null && typeof type === 'string');
        const uniqueTypes: string[] = Array.from(new Set(validTypes)).sort();
        setDocumentTypes(uniqueTypes);
      }

      // Fetch institutions
      const { data: institutionData } = await supabase
        .from('institutions')
        .select('id, name')
        .order('name');

      if (institutionData) {
        setInstitutions(institutionData);
      }
    };

    fetchMetadata();
  }, []);

  const handleExportData = () => {
    if (!analytics) return;

    // Create CSV data
    let csv = 'data:text/csv;charset=utf-8,';

    // Headers
    csv += 'Metric,Value\r\n';

    // Data rows
    csv += `Total Documents,${analytics.totalDocuments}\r\n`;
    csv += `Approved Documents,${analytics.approvedDocuments}\r\n`;
    csv += `Rejected Documents,${analytics.rejectedDocuments}\r\n`;
    csv += `Pending Documents,${analytics.pendingDocuments}\r\n`;
    csv += `Resubmission Requested,${analytics.resubmissionRequestedDocuments}\r\n`;
    csv += `Pass Rate,${analytics.passRate.toFixed(2)}%\r\n`;
    csv += `Fail Rate,${analytics.failRate.toFixed(2)}%\r\n`;

    // Create and trigger download
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
      <AdminAuthGuard>
        <DashboardLayout>
          <div className="container mx-auto max-w-7xl py-8 px-4">
            <div className="bg-red-50 border-l-4 border-red-500 p-4 mb-6">
              <p className="text-red-700">Error loading analytics data: {error}</p>
            </div>
            <Button onClick={refreshAnalytics}>Try Again</Button>
          </div>
        </DashboardLayout>
      </AdminAuthGuard>
    );
  }

  return (
    <AdminAuthGuard>
      <DashboardLayout>
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

          <AnalyticsFilterBar
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
              <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4 mt-6">
                <StatCard
                  title="Total Documents"
                  value={analytics.totalDocuments}
                  icon={<ChartBarIcon />}
                />
                <StatCard
                  title="Approved"
                  value={analytics.approvedDocuments}
                  description={`${analytics.passRate.toFixed(1)}% Pass Rate`}
                />
                <StatCard
                  title="Rejected"
                  value={analytics.rejectedDocuments + analytics.resubmissionRequestedDocuments}
                  description={`${analytics.failRate.toFixed(1)}% Fail Rate`}
                />
                <StatCard
                  title="Pending Review"
                  value={analytics.pendingDocuments}
                  description={`${((analytics.pendingDocuments / (analytics.totalDocuments || 1)) * 100).toFixed(1)}% of total`}
                />
              </div>

              <Tabs
                defaultValue="overview"
                value={activeTab}
                onValueChange={setActiveTab}
                className="mt-8"
              >
                <TabsList className="grid w-full md:w-auto grid-cols-3 mb-6">
                  <TabsTrigger value="overview">Overview</TabsTrigger>
                  <TabsTrigger value="charts">Charts</TabsTrigger>
                  <TabsTrigger value="data">Data Tables</TabsTrigger>
                </TabsList>

                <TabsContent value="overview" className="space-y-6">
                  <div className="grid gap-6 md:grid-cols-2">
                    <Card>
                      <CardHeader>
                        <CardTitle>Document Status Distribution</CardTitle>
                        <CardDescription>
                          Breakdown of document verification statuses
                        </CardDescription>
                      </CardHeader>
                      <CardContent>
                        <StatusDistributionChart
                          approved={analytics.approvedDocuments}
                          rejected={analytics.rejectedDocuments}
                          pending={analytics.pendingDocuments}
                          resubmission={analytics.resubmissionRequestedDocuments}
                        />
                      </CardContent>
                    </Card>

                    <Card>
                      <CardHeader>
                        <CardTitle>Top Rejection Reasons</CardTitle>
                        <CardDescription>Most common causes for document rejection</CardDescription>
                      </CardHeader>
                      <CardContent>
                        <RejectionReasonsChart data={analytics.commonRejectionReasons} />
                      </CardContent>
                    </Card>
                  </div>
                </TabsContent>

                <TabsContent value="charts" className="space-y-6">
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
                      <CardDescription>
                        Approval and rejection rates by document type
                      </CardDescription>
                    </CardHeader>
                    <CardContent>
                      <DocumentTypePerformanceChart data={analytics.documentsByType} />
                    </CardContent>
                  </Card>
                </TabsContent>

                <TabsContent value="data" className="space-y-6">
                  <Card>
                    <CardHeader>
                      <CardTitle>Rejection Reasons</CardTitle>
                      <CardDescription>
                        Detailed breakdown of document rejection causes
                      </CardDescription>
                    </CardHeader>
                    <CardContent>
                      <Table>
                        <TableHeader>
                          <TableRow>
                            <TableHead>Rejection Reason</TableHead>
                            <TableHead className="text-right">Count</TableHead>
                            <TableHead className="text-right">Percentage</TableHead>
                          </TableRow>
                        </TableHeader>
                        <TableBody>
                          {analytics.commonRejectionReasons.length === 0 ? (
                            <TableRow>
                              <TableCell colSpan={3} className="text-center py-6">
                                No rejection data available
                              </TableCell>
                            </TableRow>
                          ) : (
                            analytics.commonRejectionReasons.map((reason) => (
                              <TableRow key={reason.reason}>
                                <TableCell>{reason.reason}</TableCell>
                                <TableCell className="text-right">{reason.count}</TableCell>
                                <TableCell className="text-right">
                                  {(
                                    (reason.count /
                                      (analytics.rejectedDocuments +
                                        analytics.resubmissionRequestedDocuments || 1)) *
                                    100
                                  ).toFixed(1)}
                                  %
                                </TableCell>
                              </TableRow>
                            ))
                          )}
                        </TableBody>
                      </Table>
                    </CardContent>
                  </Card>

                  <Card>
                    <CardHeader>
                      <CardTitle>Document Type Breakdown</CardTitle>
                      <CardDescription>Statistics by document type</CardDescription>
                    </CardHeader>
                    <CardContent>
                      <Table>
                        <TableHeader>
                          <TableRow>
                            <TableHead>Document Type</TableHead>
                            <TableHead className="text-right">Total</TableHead>
                            <TableHead className="text-right">Approved</TableHead>
                            <TableHead className="text-right">Rejected</TableHead>
                            <TableHead className="text-right">Pending</TableHead>
                            <TableHead className="text-right">Pass Rate</TableHead>
                          </TableRow>
                        </TableHeader>
                        <TableBody>
                          {analytics.documentsByType.length === 0 ? (
                            <TableRow>
                              <TableCell colSpan={6} className="text-center py-6">
                                No document data available
                              </TableCell>
                            </TableRow>
                          ) : (
                            analytics.documentsByType.map((type) => {
                              const total =
                                type.approved +
                                type.rejected +
                                type.pending +
                                type.request_resubmission;
                              const processed =
                                type.approved + type.rejected + type.request_resubmission;
                              const passRate =
                                processed > 0 ? (type.approved / processed) * 100 : 0;

                              return (
                                <TableRow key={type.type}>
                                  <TableCell>
                                    {type.type.replace(/([A-Z])/g, ' $1').trim()}
                                  </TableCell>
                                  <TableCell className="text-right">{total}</TableCell>
                                  <TableCell className="text-right">{type.approved}</TableCell>
                                  <TableCell className="text-right">
                                    {type.rejected + type.request_resubmission}
                                  </TableCell>
                                  <TableCell className="text-right">{type.pending}</TableCell>
                                  <TableCell className="text-right">
                                    {passRate.toFixed(1)}%
                                  </TableCell>
                                </TableRow>
                              );
                            })
                          )}
                        </TableBody>
                      </Table>
                    </CardContent>
                  </Card>
                </TabsContent>
              </Tabs>
            </>
          ) : (
            <div className="text-center py-12">
              <p className="text-muted-foreground">
                No data available. Try adjusting your filters.
              </p>
            </div>
          )}
        </div>
      </DashboardLayout>
    </AdminAuthGuard>
  );
};

export default AdminAnalytics;

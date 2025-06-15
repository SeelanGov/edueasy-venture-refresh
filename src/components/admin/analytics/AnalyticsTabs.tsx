
import { useState } from 'react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { OverviewTab } from './tabs/OverviewTab';
import { ChartsTab } from './tabs/ChartsTab';
import { DataTablesTab } from './tabs/DataTablesTab';
import { DocumentAnalytics } from '@/hooks/analytics/types';

interface AnalyticsTabsProps {
  analytics: DocumentAnalytics;
}

export const AnalyticsTabs = ({ analytics }: AnalyticsTabsProps) => {
  const [activeTab, setActiveTab] = useState('overview');

  return (
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
        <OverviewTab analytics={analytics} />
      </TabsContent>

      <TabsContent value="charts" className="space-y-6">
        <ChartsTab analytics={analytics} />
      </TabsContent>

      <TabsContent value="data" className="space-y-6">
        <DataTablesTab analytics={analytics} />
      </TabsContent>
    </Tabs>
  );
};

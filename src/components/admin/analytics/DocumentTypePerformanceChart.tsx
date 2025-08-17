import { ChartContainer, ChartTooltip, ChartTooltipContent } from '@/components/ui/chart';
import { Bar, BarChart, CartesianGrid, Legend, XAxis, YAxis } from 'recharts';
import { type DocumentTypeData  } from '@/hooks/analytics';
import { formatDisplayName, STATUS_CONFIG } from '@/lib/chart-config';
import { useMemo } from 'react';






interface DocumentTypePerformanceChartProps {
  data: DocumentTypeData[];
}

/**
 * DocumentTypePerformanceChart
 * @description Function
 */
export const DocumentTypePerformanceChart = ({ data }: DocumentTypePerformanceChartProps) => {
  // Format type names for display using the shared formatting utility
  const chartData = useMemo(() => {
    return data.map((item) => ({
      ...item,
      displayType: formatDisplayName(item.type),
    }));
  }, [data]);

  return (
    <ChartContainer config={STATUS_CONFIG} className="aspect-auto h-[300px] w-full">
      <BarChart data={chartData}>
        <CartesianGrid strokeDasharray="3 3" />
        <XAxis
          dataKey="displayType"
          tick={{ fontSize: 12 }}
          height={60}
          interval={0}
          angle={-45}
          textAnchor="end" />
        <YAxis tick={{ fontSize: 12 }} />
        <ChartTooltip content={<ChartTooltipContent />} />
        <Bar dataKey="approved" stackId="a" fill={STATUS_CONFIG.approved.color} />
        <Bar dataKey="rejected" stackId="a" fill={STATUS_CONFIG.rejected.color} />
        <Bar
          dataKey="request_resubmission"
          stackId="a"
          fill={STATUS_CONFIG.request_resubmission.color}
        />
        <Bar dataKey="pending" stackId="a" fill={STATUS_CONFIG.pending.color} />
        <Legend />
      </BarChart>
    </ChartContainer>
  );
};

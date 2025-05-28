import { ChartContainer, ChartTooltip, ChartTooltipContent } from '@/components/ui/chart';
import { Area, AreaChart, CartesianGrid, XAxis, YAxis } from 'recharts';
import { useMemo } from 'react';
import { STATUS_CONFIG, CHART_COLORS } from '@/lib/chart-config';

interface TimelineChartProps {
  data: {
    date: string;
    status: string;
    count: number;
  }[];
}

export const DocumentTimelineChart = ({ data }: TimelineChartProps) => {
  // Process data for timeline chart with memoization
  const processedData = useMemo(() => {
    const dateMap: Record<string, Record<string, number>> = {};

    data.forEach((item) => {
      const date = item.date;
      const status = item.status || 'pending';

      if (!dateMap[date]) {
        dateMap[date] = { approved: 0, rejected: 0, pending: 0, request_resubmission: 0 };
      }

      dateMap[date][status] = (dateMap[date][status] || 0) + item.count;
    });

    // Convert to array format for charting and sort by date
    const result = Object.entries(dateMap).map(([date, statuses]) => ({
      date,
      ...statuses,
    }));

    return result.sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime());
  }, [data]);

  return (
    <ChartContainer config={STATUS_CONFIG} className="aspect-auto h-[300px] w-full">
      <AreaChart data={processedData}>
        <CartesianGrid strokeDasharray="3 3" />
        <XAxis
          dataKey="date"
          tick={{ fontSize: 12 }}
          tickFormatter={(value) => {
            const date = new Date(value);
            return `${date.getDate()}/${date.getMonth() + 1}`;
          }}
        />
        <YAxis tick={{ fontSize: 12 }} />
        <ChartTooltip content={<ChartTooltipContent />} />
        <Area
          type="monotone"
          dataKey="approved"
          stackId="1"
          stroke={CHART_COLORS.approved}
          fill={CHART_COLORS.approved}
        />
        <Area
          type="monotone"
          dataKey="rejected"
          stackId="1"
          stroke={CHART_COLORS.rejected}
          fill={CHART_COLORS.rejected}
        />
        <Area
          type="monotone"
          dataKey="request_resubmission"
          stackId="1"
          stroke={CHART_COLORS.request_resubmission}
          fill={CHART_COLORS.request_resubmission}
        />
        <Area
          type="monotone"
          dataKey="pending"
          stackId="1"
          stroke={CHART_COLORS.pending}
          fill={CHART_COLORS.pending}
        />
      </AreaChart>
    </ChartContainer>
  );
};

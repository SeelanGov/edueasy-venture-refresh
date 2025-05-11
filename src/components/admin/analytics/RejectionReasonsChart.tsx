
import { ChartContainer, ChartTooltip, ChartTooltipContent } from "@/components/ui/chart";
import { Bar, BarChart, CartesianGrid, XAxis, YAxis } from "recharts";
import type { RejectionReason } from "@/hooks/analytics";
import { CHART_COLORS } from "@/lib/chart-config";
import { useMemo } from "react";

interface RejectionReasonsChartProps {
  data: RejectionReason[];
}

export const RejectionReasonsChart = ({ data }: RejectionReasonsChartProps) => {
  // Process data with memoization for better performance
  const chartData = useMemo(() => {
    return data.map(item => ({
      ...item,
      shortReason: item.reason.length > 20 ? `${item.reason.substring(0, 20)}...` : item.reason
    }));
  }, [data]);

  const config = {
    count: { label: "Count", color: CHART_COLORS.count },
  };

  return (
    <ChartContainer config={config} className="aspect-auto h-[300px] w-full">
      <BarChart data={chartData} layout="vertical" barCategoryGap={8}>
        <CartesianGrid strokeDasharray="3 3" />
        <XAxis type="number" tick={{ fontSize: 12 }} />
        <YAxis 
          type="category" 
          dataKey="shortReason" 
          tick={{ fontSize: 12 }}
          width={150}
        />
        <ChartTooltip
          content={
            <ChartTooltipContent 
              formatter={(value, name, props) => [`${value} occurrences`, props.payload.reason]} 
            />
          }
        />
        <Bar dataKey="count" fill={CHART_COLORS.count} />
      </BarChart>
    </ChartContainer>
  );
};

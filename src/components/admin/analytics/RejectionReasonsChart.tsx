
import { ChartContainer, ChartTooltip, ChartTooltipContent } from "@/components/ui/chart";
import { Bar, BarChart, CartesianGrid, XAxis, YAxis } from "recharts";
import type { RejectionReason } from "@/hooks/analytics";

interface RejectionReasonsChartProps {
  data: RejectionReason[];
}

export const RejectionReasonsChart = ({ data }: RejectionReasonsChartProps) => {
  // Process data if needed (truncate long reasons)
  const chartData = data.map(item => ({
    ...item,
    shortReason: item.reason.length > 20 ? `${item.reason.substring(0, 20)}...` : item.reason
  }));

  const config = {
    count: { label: "Count", color: "#7E69AB" },
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
        <Bar dataKey="count" fill="#7E69AB" />
      </BarChart>
    </ChartContainer>
  );
};


import {
  ChartContainer,
  ChartTooltip,
  ChartLegend,
  ChartLegendContent,
  ChartTooltipContent,
} from "@/components/ui/chart";
import { Cell, Legend, Pie, PieChart } from "recharts";
import { useMemo } from "react";
import { CHART_COLORS } from "@/lib/chart-config";

interface StatusDistributionChartProps {
  approved: number;
  rejected: number;
  pending: number;
  resubmission: number;
}

export const StatusDistributionChart = ({
  approved,
  rejected,
  pending,
  resubmission,
}: StatusDistributionChartProps) => {
  const data = useMemo(() => {
    return [
      { name: "Approved", value: approved, color: CHART_COLORS.approved },
      { name: "Rejected", value: rejected, color: CHART_COLORS.rejected },
      { name: "Pending", value: pending, color: CHART_COLORS.pending },
      { name: "Resubmission", value: resubmission, color: CHART_COLORS.request_resubmission },
    ].filter((item) => item.value > 0);
  }, [approved, rejected, pending, resubmission]);

  const config = {
    approved: { label: "Approved", color: CHART_COLORS.approved },
    rejected: { label: "Rejected", color: CHART_COLORS.rejected },
    pending: { label: "Pending", color: CHART_COLORS.pending },
    resubmission: { label: "Resubmission", color: CHART_COLORS.request_resubmission },
  };

  return (
    <ChartContainer 
      config={config}
      className="aspect-auto h-[300px] w-full"
    >
      <PieChart>
        <Pie
          data={data}
          dataKey="value"
          nameKey="name"
          cx="50%"
          cy="50%"
          outerRadius={80}
          innerRadius={40}
          paddingAngle={2}
          label={({ name, percent }) => `${name}: ${(percent * 100).toFixed(0)}%`}
          labelLine={false}
        >
          {data.map((entry, index) => (
            <Cell key={`cell-${index}`} fill={entry.color} />
          ))}
        </Pie>
        <ChartTooltip
          content={
            <ChartTooltipContent 
              formatter={(value) => [`${value} documents`]}
            />
          }
        />
        <ChartLegend
          content={<ChartLegendContent />}
        />
      </PieChart>
    </ChartContainer>
  );
};

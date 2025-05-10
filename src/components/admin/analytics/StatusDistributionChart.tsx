
import {
  ChartContainer,
  ChartTooltip,
  ChartLegend,
  ChartLegendContent,
  ChartTooltipContent,
} from "@/components/ui/chart";
import { Cell, Legend, Pie, PieChart } from "recharts";

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
  const data = [
    { name: "Approved", value: approved, color: "#16A34A" },
    { name: "Rejected", value: rejected, color: "#DC2626" },
    { name: "Pending", value: pending, color: "#2563EB" },
    { name: "Resubmission", value: resubmission, color: "#EAB308" },
  ].filter((item) => item.value > 0);

  const config = {
    approved: { label: "Approved", color: "#16A34A" },
    rejected: { label: "Rejected", color: "#DC2626" },
    pending: { label: "Pending", color: "#2563EB" },
    resubmission: { label: "Resubmission", color: "#EAB308" },
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


import {
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
} from "@/components/ui/chart";
import {
  Bar,
  BarChart,
  CartesianGrid,
  Legend,
  XAxis,
  YAxis,
} from "recharts";
import { DocumentTypeData } from "@/hooks/analytics";

interface DocumentTypePerformanceChartProps {
  data: DocumentTypeData[];
}

export const DocumentTypePerformanceChart = ({ data }: DocumentTypePerformanceChartProps) => {
  // Format type names for display
  const chartData = data.map(item => ({
    ...item,
    displayType: item.type.replace(/([A-Z])/g, ' $1').trim()
  }));

  const config = {
    approved: { label: "Approved", color: "#16A34A" },
    rejected: { label: "Rejected", color: "#DC2626" },
    pending: { label: "Pending", color: "#2563EB" },
    request_resubmission: { label: "Resubmission", color: "#EAB308" },
  };

  return (
    <ChartContainer 
      config={config}
      className="aspect-auto h-[300px] w-full"
    >
      <BarChart data={chartData}>
        <CartesianGrid strokeDasharray="3 3" />
        <XAxis 
          dataKey="displayType"
          tick={{ fontSize: 12 }}
          height={60}
          interval={0}
          angle={-45}
          textAnchor="end" 
        />
        <YAxis tick={{ fontSize: 12 }} />
        <ChartTooltip
          content={<ChartTooltipContent />}
        />
        <Bar dataKey="approved" stackId="a" fill="#16A34A" />
        <Bar dataKey="rejected" stackId="a" fill="#DC2626" />
        <Bar dataKey="request_resubmission" stackId="a" fill="#EAB308" />
        <Bar dataKey="pending" stackId="a" fill="#2563EB" />
        <Legend />
      </BarChart>
    </ChartContainer>
  );
};

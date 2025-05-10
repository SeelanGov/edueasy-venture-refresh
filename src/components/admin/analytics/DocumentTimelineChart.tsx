
import {
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
} from "@/components/ui/chart";
import {
  Area,
  AreaChart,
  CartesianGrid,
  ResponsiveContainer,
  XAxis,
  YAxis,
} from "recharts";

interface TimelineChartProps {
  data: {
    date: string;
    status: string;
    count: number;
  }[];
}

export const DocumentTimelineChart = ({ data }: TimelineChartProps) => {
  // Process data for timeline chart
  const processedData = data.reduce((acc: Record<string, any>[], item) => {
    const existingEntry = acc.find(entry => entry.date === item.date);
    
    if (existingEntry) {
      existingEntry[item.status] = item.count;
    } else {
      const newEntry = { 
        date: item.date, 
        approved: 0, 
        rejected: 0, 
        pending: 0, 
        request_resubmission: 0 
      };
      newEntry[item.status] = item.count;
      acc.push(newEntry);
    }
    
    return acc;
  }, []);

  // Sort by date
  processedData.sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime());

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
        <ChartTooltip
          content={
            <ChartTooltipContent />
          }
        />
        <Area
          type="monotone"
          dataKey="approved"
          stackId="1"
          stroke="#16A34A"
          fill="#16A34A"
        />
        <Area
          type="monotone"
          dataKey="rejected"
          stackId="1"
          stroke="#DC2626"
          fill="#DC2626"
        />
        <Area
          type="monotone"
          dataKey="request_resubmission"
          stackId="1"
          stroke="#EAB308"
          fill="#EAB308"
        />
        <Area
          type="monotone"
          dataKey="pending"
          stackId="1"
          stroke="#2563EB"
          fill="#2563EB"
        />
      </AreaChart>
    </ChartContainer>
  );
};

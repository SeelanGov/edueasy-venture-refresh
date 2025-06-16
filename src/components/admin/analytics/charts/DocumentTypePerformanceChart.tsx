
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import type { DocumentTypeData } from '@/hooks/analytics/types';

interface DocumentTypePerformanceChartProps {
  data: DocumentTypeData[];
}

export const DocumentTypePerformanceChart = ({ data }: DocumentTypePerformanceChartProps) => {
  if (!data || data.length === 0) {
    return (
      <div className="flex items-center justify-center h-[300px] text-muted-foreground">
        No document type data available
      </div>
    );
  }

  const formattedData = data.map(item => ({
    type: item.type.replace(/([A-Z])/g, ' $1').trim(),
    approved: item.approved,
    rejected: item.rejected + item.request_resubmission,
    pending: item.pending,
  }));

  return (
    <ResponsiveContainer width="100%" height={300}>
      <BarChart data={formattedData}>
        <CartesianGrid strokeDasharray="3 3" />
        <XAxis 
          dataKey="type" 
          angle={-45}
          textAnchor="end"
          height={80}
          fontSize={12}
        />
        <YAxis />
        <Tooltip />
        <Legend />
        <Bar dataKey="approved" stackId="a" fill="#22c55e" name="Approved" />
        <Bar dataKey="rejected" stackId="a" fill="#ef4444" name="Rejected" />
        <Bar dataKey="pending" stackId="a" fill="#f59e0b" name="Pending" />
      </BarChart>
    </ResponsiveContainer>
  );
};

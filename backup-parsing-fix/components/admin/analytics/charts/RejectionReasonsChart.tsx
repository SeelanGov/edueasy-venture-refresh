import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import type { RejectionReason } from '@/hooks/analytics/types';

interface RejectionReasonsChartProps {
  data: RejectionReason[];
}

/**
 * RejectionReasonsChart
 * @description Function
 */
export const RejectionReasonsChart = ({ data }: RejectionReasonsChartProps) => {
  if (!data || data.length === 0) {
    return (
      <div className="flex items-center justify-center h-[300px] text-muted-foreground">
        No rejection data available
      </div>
    );
  }

  const formattedData = data.slice(0, 5).map((item) => ({
    ...item,
    reason: item.reason.length > 20 ? `${item.reason.substring(0, 20)}...` : item.reason,
  }));

  return (
    <ResponsiveContainer width="100%" height={300}>
      <BarChart data={formattedData} layout="horizontal">
        <CartesianGrid strokeDasharray="3 3" />
        <XAxis type="number" />
        <YAxis type="category" dataKey="reason" width={100} fontSize={12} />
        <Tooltip formatter={(value, name, props) => [value, 'Count', props.payload?.reason]} />
        <Bar dataKey="count" fill="#ef4444" />
      </BarChart>
    </ResponsiveContainer>
  );
};

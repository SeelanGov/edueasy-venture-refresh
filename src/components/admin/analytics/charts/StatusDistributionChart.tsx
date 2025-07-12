import { PieChart, Pie, Cell, ResponsiveContainer, Legend, Tooltip } from 'recharts';

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
    { name: 'Approved', value: approved, color: '#22c55e' },
    { name: 'Rejected', value: rejected, color: '#ef4444' },
    { name: 'Pending', value: pending, color: '#f59e0b' },
    { name: 'Resubmission', value: resubmission, color: '#f97316' },
  ].filter((item) => item.value > 0);

  if (data.length === 0) {
    return (
      <div className="flex items-center justify-center h-[300px] text-muted-foreground">
        No data available
      </div>
    );
  }

  return (
    <ResponsiveContainer width="100%" height={300}>
      <PieChart>
        <Pie
          data={data}
          cx="50%"
          cy="50%"
          innerRadius={60}
          outerRadius={100}
          paddingAngle={5}
          dataKey="value"
        >
          {data.map((entry, index) => (
            <Cell key={`cell-${index}`} fill={entry.color} />
          ))}
        </Pie>
        <Tooltip formatter={(value) => [value, 'Documents']} />
        <Legend />
      </PieChart>
    </ResponsiveContainer>
  );
};

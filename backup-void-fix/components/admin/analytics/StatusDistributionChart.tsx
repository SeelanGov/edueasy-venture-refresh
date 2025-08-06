import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';

interface StatusData {
  status: string;
  count: number;
  percentage: number;
}

interface StatusDistributionChartProps {
  data: StatusData[];
}

/**
 * StatusDistributionChart
 * @description Function
 */
export const StatusDistributionChart = ({ data }: StatusDistributionChartProps): void => {
  return (
    <div className="w-full h-[400px]">
      <ResponsiveContainer width="100%" height="100%">
        <BarChart
          data={data}
          margin={{
            top: 20,
            right: 30,
            left: 20,
            bottom: 5,
          }}
        >
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis
            dataKey="status"
            tick={{ fontSize: 12 }}
            angle={-45}
            textAnchor="end"
            height={80}
          />
          <YAxis tick={{ fontSize: 12 }} />
          <Tooltip
            formatter={(value, label) => [value, label]}
            labelFormatter={(label) => `Status: ${label}`}
          />
          <Bar dataKey="count" fill="#4f46e5" radius={[4, 4, 0, 0]} name="Count" />
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
};


import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart, Pie, Cell } from 'recharts';
import { useSponsorAllocations } from '@/hooks/useSponsorAllocations';

interface SponsorAnalyticsProps {
  sponsorId: string;
}

export const SponsorAnalytics: React.FC<SponsorAnalyticsProps> = ({ sponsorId }) => {
  const { allocations } = useSponsorAllocations();

  const sponsorAllocations = allocations?.filter((a: any) => a.sponsor_id === sponsorId) || [];

  // Plan distribution data
  const planDistribution = sponsorAllocations.reduce((acc: any, allocation: any) => {
    acc[allocation.plan] = (acc[allocation.plan] || 0) + 1;
    return acc;
  }, {});

  const planData = Object.entries(planDistribution).map(([plan, count]) => ({
    plan,
    count,
  }));

  // Status distribution data
  const statusDistribution = sponsorAllocations.reduce((acc: any, allocation: any) => {
    acc[allocation.status] = (acc[allocation.status] || 0) + 1;
    return acc;
  }, {});

  const statusData = Object.entries(statusDistribution).map(([status, count]) => ({
    status,
    count,
  }));

  // Monthly allocation trends (last 6 months)
  const monthlyData = [];
  for (let i = 5; i >= 0; i--) {
    const date = new Date();
    date.setMonth(date.getMonth() - i);
    const monthName = date.toLocaleDateString('en-US', { month: 'short' });
    
    const monthAllocations = sponsorAllocations.filter((a: any) => {
      const allocDate = new Date(a.allocated_on);
      return allocDate.getMonth() === date.getMonth() && 
             allocDate.getFullYear() === date.getFullYear();
    }).length;

    monthlyData.push({
      month: monthName,
      allocations: monthAllocations,
    });
  }

  const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042', '#8884D8'];

  return (
    <div className="space-y-6">
      <h3 className="text-lg font-semibold">Analytics Overview</h3>
      
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Plan Distribution */}
        <Card>
          <CardHeader>
            <CardTitle className="text-base">Plan Distribution</CardTitle>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={250}>
              <BarChart data={planData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="plan" />
                <YAxis />
                <Tooltip />
                <Bar dataKey="count" fill="#8884d8" />
              </BarChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        {/* Status Distribution */}
        <Card>
          <CardHeader>
            <CardTitle className="text-base">Allocation Status</CardTitle>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={250}>
              <PieChart>
                <Pie
                  data={statusData}
                  cx="50%"
                  cy="50%"
                  labelLine={false}
                  label={({ status, percent }) => `${status} ${(percent * 100).toFixed(0)}%`}
                  outerRadius={80}
                  fill="#8884d8"
                  dataKey="count"
                >
                  {statusData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip />
              </PieChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>
      </div>

      {/* Monthly Trends */}
      <Card>
        <CardHeader>
          <CardTitle className="text-base">Allocation Trends (Last 6 Months)</CardTitle>
        </CardHeader>
        <CardContent>
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={monthlyData}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="month" />
              <YAxis />
              <Tooltip />
              <Bar dataKey="allocations" fill="#82ca9d" />
            </BarChart>
          </ResponsiveContainer>
        </CardContent>
      </Card>

      {/* Summary Stats */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card>
          <CardContent className="p-4">
            <div className="text-2xl font-bold">{sponsorAllocations.length}</div>
            <p className="text-sm text-muted-foreground">Total Allocations</p>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="p-4">
            <div className="text-2xl font-bold">
              {sponsorAllocations.filter((a: any) => a.status === 'active').length}
            </div>
            <p className="text-sm text-muted-foreground">Active Students</p>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="p-4">
            <div className="text-2xl font-bold">
              {sponsorAllocations.length > 0 
                ? Math.round((sponsorAllocations.filter((a: any) => a.status === 'active').length / sponsorAllocations.length) * 100)
                : 0}%
            </div>
            <p className="text-sm text-muted-foreground">Utilization Rate</p>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

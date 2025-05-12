
import { ReactNode } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Typography } from "@/components/ui/typography";

interface StatCardProps {
  title: string;
  value: string | number;
  icon?: ReactNode;
  description?: string;
  trend?: {
    value: number;
    positive: boolean;
  };
}

export const StatCard = ({ title, value, icon, description, trend }: StatCardProps) => {
  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
        <CardTitle className="text-sm font-medium">
          <Typography variant="body-sm">{title}</Typography>
        </CardTitle>
        {icon && <div className="h-4 w-4 text-muted-foreground">{icon}</div>}
      </CardHeader>
      <CardContent>
        <Typography variant="h3" className="font-bold">{value}</Typography>
        {(description || trend) && (
          <Typography variant="caption" color="muted" className="mt-1">
            {description}
            {trend && (
              <span className={`inline-block ml-1 ${trend.positive ? 'text-success' : 'text-error'}`}>
                {trend.positive ? '+' : '-'}{Math.abs(trend.value)}%
              </span>
            )}
          </Typography>
        )}
      </CardContent>
    </Card>
  );
};

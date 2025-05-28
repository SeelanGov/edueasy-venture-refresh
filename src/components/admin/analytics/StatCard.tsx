import { ReactNode } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Typography } from '@/components/ui/typography';
import { cn } from '@/lib/utils';

interface StatCardProps {
  title: string;
  value: string | number;
  icon?: ReactNode;
  description?: string;
  trend?: {
    value: number;
    positive: boolean;
  };
  className?: string;
  valueClassName?: string;
  id?: string; // For landmark/ARIA purposes
}

export const StatCard = ({
  title,
  value,
  icon,
  description,
  trend,
  className,
  valueClassName,
  id,
}: StatCardProps) => {
  // Generate an id if none provided for ARIA purposes
  const cardId = id || `stat-card-${title.toLowerCase().replace(/\s+/g, '-')}`;
  const valueId = `${cardId}-value`;
  const trendDirection = trend?.positive ? 'increase' : 'decrease';
  const trendAria = trend ? `${Math.abs(trend.value)}% ${trendDirection} from previous period` : '';

  return (
    <Card
      className={cn(
        'transition-all hover:shadow-md',
        'md:min-h-[150px] md:flex md:flex-col md:justify-between',
        className
      )}
      id={cardId}
      role="region"
      aria-labelledby={`${cardId}-title`}
    >
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2 md:pb-3">
        <CardTitle className="text-sm font-medium md:text-base" id={`${cardId}-title`}>
          <Typography variant="body-sm" className="md:text-base">
            {title}
          </Typography>
        </CardTitle>
        {icon && (
          <div className="h-4 w-4 md:h-5 md:w-5 text-muted-foreground" aria-hidden="true">
            {icon}
          </div>
        )}
      </CardHeader>
      <CardContent>
        <Typography
          variant="h3"
          className={cn('font-bold md:text-4xl', valueClassName)}
          id={valueId}
          aria-live="polite"
        >
          {value}
        </Typography>

        {(description || trend) && (
          <Typography
            variant="caption"
            color="muted"
            className="mt-1 md:mt-2 flex items-center md:text-sm"
            aria-describedby={valueId}
          >
            {description}
            {trend && (
              <span
                className={cn('inline-block ml-1', trend.positive ? 'text-success' : 'text-error')}
                aria-label={trendAria}
              >
                {trend.positive ? '+' : '-'}
                {Math.abs(trend.value)}%
              </span>
            )}
          </Typography>
        )}
      </CardContent>
    </Card>
  );
};

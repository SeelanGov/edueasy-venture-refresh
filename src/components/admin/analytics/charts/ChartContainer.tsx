import { type ReactNode  } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Spinner } from '@/components/Spinner';




interface ChartContainerProps {
  title: string;
  description?: string;
  children: ReactNode;
  loading?: boolean;
  error?: string | null;
  className?: string;
}

/**
 * ChartContainer
 * @description Function
 */
export const ChartContainer = ({
  title,
  description,
  children,
  loading = false,
  error = null,
  className = '',
}: ChartContainerProps): JSX.Element => {
  return (
    <Card className={className}>
      <CardHeader>
        <CardTitle>{title}</CardTitle>
        {description && <CardDescription>{description}</CardDescription>}
      </CardHeader>
      <CardContent>
        {loading ? (
          <div className="flex justify-center items-center h-[300px]">
            <Spinner size="lg" />
          </div>
        ) : error ? (
          <div className="flex justify-center items-center h-[300px] text-red-500">
            <p>Error loading chart: {error}</p>
          </div>
        ) : (
          children
        )}
      </CardContent>
    </Card>
  );
};

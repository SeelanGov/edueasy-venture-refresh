import { type ReactNode  } from 'react';
import { CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Spinner } from '@/components/Spinner';




interface ChartWrapperProps {
  title: string;
  children: ReactNode;
  description?: string;
  loading?: boolean;
  error?: string | null;
  className?: string;
}

/**
 * ChartWrapper
 * @description Function
 */
export const ChartWrapper = ({
  title,
  children,
  description,
  loading = false,
  error = null,
  className = '',
}: ChartWrapperProps): JSX.Element => {
  return (
    <>
      <CardHeader className={className}>
        <CardTitle className="text-lg font-semibold">{title}</CardTitle>
        {description && <p className="text-sm text-muted-foreground">{description}</p>}
      </CardHeader>
      <CardContent>
        {loading ? (
          <div className="flex justify-center items-center h-[300px]">
            <Spinner size="lg" />
            <span className="ml-2 text-sm text-muted-foreground">Loading chart...</span>
          </div>
        ) : error ? (
          <div className="flex justify-center items-center h-[300px] text-red-500">
            <p className="text-sm">Error loading chart: {error}</p>
          </div>
        ) : (
          <div className="h-[300px] w-full">{children}</div>
        )}
      </CardContent>
    </>
  );
};


import { ReactNode } from "react";
import { ChartContainer } from "@/components/ui/chart";
import { StatusConfigType } from "@/lib/chart-config";

interface ChartWrapperProps {
  children: ReactNode;
  config: StatusConfigType;
  height?: number | string;
  className?: string;
  title?: string;
  emptyMessage?: string;
  isEmpty?: boolean;
}

export const ChartWrapper = ({ 
  children, 
  config, 
  height = 300, 
  className = "",
  title,
  emptyMessage = "No data available",
  isEmpty = false
}: ChartWrapperProps) => {
  return (
    <div className="w-full">
      {title && <h3 className="text-sm font-medium text-center mb-2">{title}</h3>}
      
      {isEmpty ? (
        <div className="flex items-center justify-center h-[300px] bg-gray-50 dark:bg-gray-800 rounded-md border border-gray-200 dark:border-gray-700">
          <p className="text-muted-foreground">{emptyMessage}</p>
        </div>
      ) : (
        <ChartContainer 
          config={config}
          className={`aspect-auto h-[${typeof height === 'number' ? height + 'px' : height}] w-full ${className}`}
        >
          {children}
        </ChartContainer>
      )}
    </div>
  );
};

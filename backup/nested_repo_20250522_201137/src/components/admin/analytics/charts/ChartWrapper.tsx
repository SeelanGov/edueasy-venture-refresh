
import React from "react";
import { Card } from "@/components/ui/card";
import { cn } from "@/lib/utils";
import { Skeleton } from "@/components/ui/skeleton";
import { ChartConfig } from "@/lib/chart-config";

interface ChartWrapperProps {
  title?: string;
  children?: React.ReactNode;
  isLoading?: boolean;
  height?: string | number;
  className?: string;
  config?: ChartConfig;
}

interface ChartContainerProps {
  children: React.ReactElement;
  config?: ChartConfig;
  className?: string;
}

const ChartContainer = ({ children, config, className }: ChartContainerProps) => {
  return (
    <div className={cn("relative", className)}>
      {children}
      {config?.showLegend && <div className="mt-2">Legend placeholder</div>}
    </div>
  );
};

export const ChartWrapper = ({
  title,
  children,
  isLoading = false,
  height = 300,
  className = "",
  config
}: ChartWrapperProps) => {
  return (
    <div className="space-y-2">
      {title && <h3 className="text-sm font-medium">{title}</h3>}
      {isLoading ? (
        <Skeleton className={`h-[${typeof height === 'number' ? height + 'px' : height}] w-full`} />
      ) : (
        <ChartContainer
          config={config}
          className={`aspect-auto h-[${typeof height === 'number' ? height + 'px' : height}] w-full ${className}`}
        >
          {/* Make sure children is always a valid React element for ChartContainer */}
          {React.isValidElement(children) ? children : <div />}
        </ChartContainer>
      )}
    </div>
  );
};

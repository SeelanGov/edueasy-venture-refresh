
import { CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { ReactNode } from 'react';

interface ChartWrapperProps {
  title: string;
  children: ReactNode;
  description?: string;
}

export const ChartWrapper = ({ title, children, description }: ChartWrapperProps) => {
  return (
    <>
      <CardHeader>
        <CardTitle>{title}</CardTitle>
        {description && <p className="text-sm text-gray-600">{description}</p>}
      </CardHeader>
      <CardContent>
        {children}
      </CardContent>
    </>
  );
};

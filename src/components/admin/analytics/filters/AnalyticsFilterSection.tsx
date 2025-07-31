import type { ReactNode } from 'react';
import { Label } from '@/components/ui/label';

interface AnalyticsFilterSectionProps {
  label: string;
  children: ReactNode;
  className?: string;
}

/**
 * AnalyticsFilterSection
 * @description Function
 */
export const AnalyticsFilterSection = ({
  label,
  children,
  className = 'space-y-2',
}: AnalyticsFilterSectionProps): JSX.Element => {
  return (
    <div className={className}>
      <Label>{label}</Label>
      {children}
    </div>
  );
};

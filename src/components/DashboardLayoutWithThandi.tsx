
import { ReactNode } from 'react';
import { MobileFriendlyDashboardLayout } from '@/components/MobileFriendlyDashboardLayout';
import { ThandiAgent } from '@/components/ai/ThandiAgent';

interface DashboardLayoutWithThandiProps {
  children: ReactNode;
}

export const DashboardLayoutWithThandi = ({ children }: DashboardLayoutWithThandiProps) => {
  return (
    <>
      <MobileFriendlyDashboardLayout>{children}</MobileFriendlyDashboardLayout>
      <ThandiAgent />
    </>
  );
};

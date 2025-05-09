
import { ReactNode } from 'react';
import { DashboardLayout } from '@/components/DashboardLayout';
import { ThandiAgent } from '@/components/ai/ThandiAgent';

interface DashboardLayoutWithThandiProps {
  children: ReactNode;
}

export const DashboardLayoutWithThandi = ({ children }: DashboardLayoutWithThandiProps) => {
  return (
    <>
      <DashboardLayout>{children}</DashboardLayout>
      <ThandiAgent />
    </>
  );
};

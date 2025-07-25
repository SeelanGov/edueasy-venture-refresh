import { MobileFriendlyDashboardLayout } from '@/components/MobileFriendlyDashboardLayout';
import ThandiAgent from '@/components/ai/ThandiAgent';
import { Toaster } from '@/components/ui/toaster';
import type { ReactNode } from 'react';
import { Toaster as SonnerToaster } from 'sonner';

interface DashboardLayoutWithThandiProps {
  children: ReactNode;
}


/**
 * DashboardLayoutWithThandi
 * @description Function
 */
export const DashboardLayoutWithThandi = ({ children }: DashboardLayoutWithThandiProps): void => {
  return (
    <>
      <MobileFriendlyDashboardLayout>{children}</MobileFriendlyDashboardLayout>
      <Toaster />
      <SonnerToaster />
      <ThandiAgent />
    </>
  );
};

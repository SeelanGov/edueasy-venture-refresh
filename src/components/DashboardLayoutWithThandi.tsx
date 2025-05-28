import { ReactNode } from 'react';
import { MobileFriendlyDashboardLayout } from '@/components/MobileFriendlyDashboardLayout';
import { ThandiAgent } from '@/components/ai/ThandiAgent';
import { Toaster as SonnerToaster } from 'sonner';
import { Toaster } from '@/components/ui/toaster';

interface DashboardLayoutWithThandiProps {
  children: ReactNode;
}

export const DashboardLayoutWithThandi = ({ children }: DashboardLayoutWithThandiProps) => {
  return (
    <>
      <MobileFriendlyDashboardLayout>{children}</MobileFriendlyDashboardLayout>
      <Toaster />
      <SonnerToaster />
      <ThandiAgent />
    </>
  );
};

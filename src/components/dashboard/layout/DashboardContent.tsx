import type { ReactNode } from 'react';

interface DashboardContentProps {
  children: ReactNode;
}


/**
 * DashboardContent
 * @description Function
 */
export const DashboardContent = ({ children }: DashboardContentProps): void => {
  return (
    <main className="flex-1 overflow-y-auto pb-10">
      <div className="bg-white dark:bg-gray-800 shadow-sm text-gray-900 dark:text-gray-100">
        {children}
      </div>
    </main>
  );
};


import React from 'react';
import { AdminBreadcrumb } from '../AdminBreadcrumb';
import { AdminSidebar } from './AdminSidebar';
import { AdminHeader } from './AdminHeader';
import { ErrorBoundary } from '@/components/error-handling/ErrorBoundary';

interface AdminLayoutProps {
  children: React.ReactNode;
  title?: string;
}

export const AdminLayout: React.FC<AdminLayoutProps> = ({ children, title }) => {
  return (
    <div className="min-h-screen bg-gray-50">
      <AdminHeader />
      <div className="flex">
        <AdminSidebar />
        <main className="flex-1 p-6">
          <ErrorBoundary component="AdminLayout">
            <div className="max-w-7xl mx-auto">
              <AdminBreadcrumb />
              {title && (
                <div className="mb-6">
                  <h1 className="text-2xl font-bold text-gray-900">{title}</h1>
                </div>
              )}
              {children}
            </div>
          </ErrorBoundary>
        </main>
      </div>
    </div>
  );
};

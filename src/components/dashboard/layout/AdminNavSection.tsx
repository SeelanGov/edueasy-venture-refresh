import type { ReactNode } from 'react';
import { SidebarNavItem } from './SidebarNavItem';

interface AdminNavItemType {
  name: string;
  path: string;
  icon: ReactNode;
}

interface AdminNavSectionProps {
  items: AdminNavItemType[];
  sidebarOpen: boolean;
  isActive: (path: string) => boolean;
}

export const AdminNavSection = ({ items, sidebarOpen, isActive }: AdminNavSectionProps) => {
  if (items.length === 0) {
    return null;
  }

  return (
    <>
      {sidebarOpen && (
        <div className="mt-6 pt-6 border-t border-gray-200 dark:border-gray-700">
          <h3 className="px-3 text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider">
            Admin
          </h3>
        </div>
      )}
      {items.map((item) => (
        <SidebarNavItem
          key={item.path}
          path={item.path}
          icon={item.icon}
          name={item.name}
          isActive={isActive(item.path) || location.pathname.startsWith(item.path + '/')}
          sidebarOpen={sidebarOpen}
        />
      ))}
    </>
  );
};

import type { ReactNode } from 'react';
import { Link } from 'react-router-dom';

interface SidebarNavItemProps {
  path: string;
  icon: ReactNode;
  name: string;
  isActive: boolean;
  sidebarOpen: boolean;
  onClick?: () => void;
}

/**
 * SidebarNavItem
 * @description Function
 */
export const SidebarNavItem = ({
  path,
  icon,
  name,
  isActive,
  sidebarOpen,
  onClick,
}: SidebarNavItemProps): void => {
  return (
    <Link
      to={path}
      className={`flex items-center px-3 py-3 rounded-lg transition-colors ${
        isActive
          ? 'bg-cap-teal/10 text-cap-teal dark:bg-cap-teal/20'
          : 'text-gray-700 hover:bg-gray-100 dark:text-gray-300 dark:hover:bg-gray-800'
      } ${sidebarOpen ? '' : 'justify-center'} focus:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2 dark:focus-visible:ring-offset-gray-900`}
      onClick={onClick}
      aria-current={isActive ? 'page' : undefined}
      role="menuitem"
    >
      <span className="flex-shrink-0" aria-hidden="true">
        {icon}
      </span>
      {sidebarOpen && <span className="ml-3">{name}</span>}
      {!sidebarOpen && <span className="sr-only">{name}</span>}
    </Link>
  );
};

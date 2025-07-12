import { Logo } from '@/components/Logo';
import { Button } from '@/components/ui/button';
import { useTheme } from '@/hooks/useTheme';
import {
  ChevronLeft,
  ChevronRight,
  LogOut,
  Moon,
  Sun,
  Shield,
  Building2,
  ChartBarIcon,
  Users,
} from 'lucide-react';
import { useState } from 'react';
import { useLocation } from 'react-router-dom';
import { AdminNavSection } from './AdminNavSection';
import { SidebarNavItem } from './SidebarNavItem';

interface NavItem {
  name: string;
  path: string;
  icon: React.ReactNode;
}

interface DashboardSidebarProps {
  navItems: NavItem[];
  adminNavItems: NavItem[];
  isAdmin: boolean;
  onSignOut: () => void;
}

export const DashboardSidebar = ({
  navItems,
  adminNavItems,
  isAdmin,
  onSignOut,
}: DashboardSidebarProps) => {
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const location = useLocation();
  const { isDarkMode, toggleTheme } = useTheme();

  const isActive = (path: string) => {
    return location.pathname === path;
  };

  // Add UI Lock admin item, Partner CRM, and Analytics for admin users
  const enhancedAdminNavItems = isAdmin
    ? [
        {
          name: 'Analytics',
          path: '/admin/analytics',
          icon: <ChartBarIcon className="h-5 w-5" />,
        },
        ...adminNavItems,
        {
          name: 'Partner CRM',
          path: '/admin/partners',
          icon: <Building2 className="h-5 w-5" />,
        },
        {
          name: 'User Management',
          path: '/admin/users',
          icon: <Users className="h-5 w-5" />,
        },
        {
          name: 'UI Lock System',
          path: '/admin/ui-lock',
          icon: <Shield className="h-5 w-5" />,
        },
      ]
    : adminNavItems;

  return (
    <div
      className={`bg-white dark:bg-gray-900 border-r border-gray-200 dark:border-gray-700 ${
        sidebarOpen ? 'w-64' : 'w-20'
      } transition-all duration-300 ease-in-out hidden md:block`}
    >
      <div className="h-full flex flex-col">
        <div
          className={`p-4 flex ${sidebarOpen ? 'justify-between' : 'justify-center'} items-center border-b border-gray-200 dark:border-gray-700`}
        >
          {sidebarOpen && <Logo />}
          <Button
            variant="ghost"
            size="icon"
            onClick={() => setSidebarOpen(!sidebarOpen)}
            className="text-gray-500 dark:text-gray-400"
          >
            {sidebarOpen ? <ChevronLeft /> : <ChevronRight />}
          </Button>
        </div>
        <div className="flex-1 py-6 overflow-y-auto">
          <nav className="px-2 space-y-1">
            {navItems.map((item) => (
              <SidebarNavItem
                key={item.path}
                path={item.path}
                icon={item.icon}
                name={item.name}
                isActive={isActive(item.path)}
                sidebarOpen={sidebarOpen}
              />
            ))}

            {isAdmin && (
              <AdminNavSection
                items={enhancedAdminNavItems}
                sidebarOpen={sidebarOpen}
                isActive={isActive}
              />
            )}
          </nav>
        </div>
        <div className="p-4 border-t border-gray-200 dark:border-gray-700">
          <div className="flex flex-col space-y-3">
            <Button
              variant="ghost"
              size={sidebarOpen ? 'default' : 'icon'}
              onClick={toggleTheme}
              className="w-full justify-start text-gray-700 dark:text-gray-300"
            >
              {isDarkMode ? <Sun className="h-5 w-5" /> : <Moon className="h-5 w-5" />}
              {sidebarOpen && (
                <span className="ml-2">{isDarkMode ? 'Light Mode' : 'Dark Mode'}</span>
              )}
            </Button>
            <Button
              variant="ghost"
              size={sidebarOpen ? 'default' : 'icon'}
              onClick={onSignOut}
              className="w-full justify-start text-red-600 hover:bg-red-50 hover:text-red-700 dark:text-red-400 dark:hover:bg-red-900/20"
            >
              <LogOut className="h-5 w-5" />
              {sidebarOpen && <span className="ml-2">Sign Out</span>}
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
};

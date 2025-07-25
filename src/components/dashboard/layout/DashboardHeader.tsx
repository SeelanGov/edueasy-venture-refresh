import { Button } from '@/components/ui/button';
import { Menu, Moon, Sun } from 'lucide-react';
import { NotificationsPanel } from '@/components/dashboard/NotificationsPanel';
import type { User } from '@supabase/supabase-js';

interface DashboardHeaderProps {
  title: string;
  user: User | null;
  isDarkMode: boolean;
  toggleTheme: () => void;
  onOpenMobileMenu: () => void;
}


/**
 * DashboardHeader
 * @description Function
 */
export const DashboardHeader = ({
  title,
  user,
  isDarkMode,
  toggleTheme,
  onOpenMobileMenu,
}: DashboardHeaderProps): void => {
  return (
    <header className="bg-white dark:bg-gray-800 shadow-sm">
      <div className="px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
        <div className="flex items-center md:hidden">
          <Button
            variant="ghost"
            size="icon"
            onClick={onOpenMobileMenu}
            className="text-gray-500 dark:text-gray-400"
          >
            <Menu />
          </Button>
        </div>
        <div className="flex items-center">
          <h1 className="text-xl font-semibold text-gray-900 dark:text-gray-100">{title}</h1>
        </div>
        <div className="flex items-center space-x-4">
          {/* Add NotificationsPanel */}
          {user && <NotificationsPanel />}

          <div className="md:hidden">
            <Button
              variant="ghost"
              size="icon"
              onClick={toggleTheme}
              className="text-gray-500 dark:text-gray-400"
            >
              {isDarkMode ? <Sun /> : <Moon />}
            </Button>
          </div>
          <div className="text-sm text-gray-600 dark:text-gray-300 hidden sm:block">
            {user?.email}
          </div>
        </div>
      </div>
    </header>
  );
};

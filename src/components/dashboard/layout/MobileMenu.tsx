import { Logo } from '@/components/Logo';
import { Button } from '@/components/ui/button';
import { LogOut, Moon, Sun, X } from 'lucide-react';
import { SidebarNavItem } from './SidebarNavItem';

interface NavItem {
  name: string;
  path: string;
  icon: React.ReactNode;
}

interface MobileMenuProps {
  isOpen: boolean;
  onClose: () => void;
  navItems: NavItem[];
  adminNavItems: NavItem[];
  isAdmin: boolean;
  onSignOut: () => void;
  isDarkMode: boolean;
  toggleTheme: () => void;
  isActive: (path: string) => boolean;
}


/**
 * MobileMenu
 * @description Function
 */
export const MobileMenu = ({
  isOpen,
  onClose,
  navItems,
  adminNavItems,
  isAdmin,
  onSignOut,
  isDarkMode,
  toggleTheme,
  isActive,
}: MobileMenuProps): void => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 md:hidden">
      <div className="fixed inset-0 bg-black/50" onClick={onClose}></div>
      <div className="fixed inset-y-0 left-0 w-full max-w-xs bg-white dark:bg-gray-900 overflow-y-auto">
        <div className="p-4 flex justify-between items-center border-b border-gray-200 dark:border-gray-700">
          <Logo />
          <Button
            variant="ghost"
            size="icon"
            onClick={onClose}
            className="text-gray-500 dark:text-gray-400"
          >
            <X />
          </Button>
        </div>
        <div className="p-4">
          <nav className="space-y-2">
            {navItems.map((item) => (
              <SidebarNavItem
                key={item.path}
                path={item.path}
                icon={item.icon}
                name={item.name}
                isActive={isActive(item.path)}
                sidebarOpen={true}
                onClick={onClose}
              />
            ))}

            {isAdmin && adminNavItems.length > 0 && (
              <>
                <div className="mt-6 pt-6 border-t border-gray-200 dark:border-gray-700">
                  <h3 className="px-3 text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                    Admin
                  </h3>
                </div>
                {adminNavItems.map((item) => (
                  <SidebarNavItem
                    key={item.path}
                    path={item.path}
                    icon={item.icon}
                    name={item.name}
                    isActive={isActive(item.path) || location.pathname.startsWith(item.path + '/')}
                    sidebarOpen={true}
                    onClick={onClose}
                  />
                ))}
              </>
            )}
          </nav>
          <div className="mt-6 pt-6 border-t border-gray-200 dark:border-gray-700">
            <Button
              variant="ghost"
              className="w-full justify-start text-gray-700 dark:text-gray-300 mb-3"
              onClick={toggleTheme}
            >
              {isDarkMode ? <Sun className="h-5 w-5 mr-3" /> : <Moon className="h-5 w-5 mr-3" />}
              {isDarkMode ? 'Light Mode' : 'Dark Mode'}
            </Button>
            <Button
              variant="ghost"
              onClick={onSignOut}
              className="w-full justify-start text-red-600 hover:bg-red-50 hover:text-red-700 dark:text-red-400 dark:hover:bg-red-900/20"
            >
              <LogOut className="h-5 w-5 mr-3" />
              Sign Out
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
};

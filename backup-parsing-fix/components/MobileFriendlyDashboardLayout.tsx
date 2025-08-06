import { NotificationsPanel } from '@/components/dashboard/NotificationsPanel';
import { Logo } from '@/components/Logo';
import { Spinner } from '@/components/Spinner';
import { Button } from '@/components/ui/button';
import { useAuth } from '@/hooks/useAuth';
import { useTheme } from '@/hooks/useTheme';
import {
  BookOpen,
  Briefcase,
  Building,
  ChevronLeft,
  ChevronRight,
  ClipboardList,
  Home,
  LogOut,
  Menu,
  Moon,
  Sun,
  User,
  Video,
  X,
} from 'lucide-react';
import { useEffect, useState, type ReactNode } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';

interface MobileFriendlyDashboardLayoutProps {
  children: ReactNode;
}

/**
 * MobileFriendlyDashboardLayout
 * @description Function
 */
export const MobileFriendlyDashboardLayout = ({ children }: MobileFriendlyDashboardLayoutProps) => {
  const { user, signOut, loading } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const [sidebarOpen, setSidebarOpen] = useState(window.innerWidth >= 768);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const { isDarkMode, toggleTheme } = useTheme();

  useEffect(() => {
    const handleResize = () => {
      // Automatically expand/collapse sidebar based on screen width
      setSidebarOpen(window.innerWidth >= 768);
    };

    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  if (loading) {
    return (
      <div className="flex items-center justify-center h-screen">
        <Spinner size="lg" />
        <p className="ml-3 text-lg font-medium text-gray-700 dark:text-gray-300">Loading...</p>
      </div>
    );
  }

  if (!user) {
    navigate('/login');
    return null;
  }

  const handleSignOut = () => {
    signOut();
    navigate('/');
  };

  const isActive = (path: string) => {
    return location.pathname === path;
  };

  const navItems = [
    {
      name: 'Dashboard',
      path: '/dashboard',
      icon: <Home className="h-5 w-5" />,
    },
    {
      name: 'Applications',
      path: '/apply',
      icon: <ClipboardList className="h-5 w-5" />,
    },
    {
      name: 'Programs',
      path: '/programs',
      icon: <BookOpen className="h-5 w-5" />,
    },
    {
      name: 'Career Guidance',
      path: '/career-guidance',
      icon: <Briefcase className="h-5 w-5" />,
    },
    {
      name: 'Consultations',
      path: '/consultations',
      icon: <Video className="h-5 w-5" />,
    },
    {
      name: 'Sponsorships',
      path: '/sponsorships',
      icon: <Building className="h-5 w-5" />,
    },
    {
      name: 'My Profile',
      path: '/profile',
      icon: <User className="h-5 w-5" />,
    },
  ];

  return (
    <div className={`h-screen flex overflow-hidden ${isDarkMode ? 'dark' : ''}`}>
      {/* Sidebar for desktop */}
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
                <Link
                  key={item.path}
                  to={item.path}
                  className={`flex items-center px-3 py-3 rounded-lg transition-colors ${
                    isActive(item.path)
                      ? 'bg-cap-teal/10 text-cap-teal dark:bg-cap-teal/20'
                      : 'text-gray-700 hover:bg-gray-100 dark:text-gray-300 dark:hover:bg-gray-800'
                  } ${sidebarOpen ? '' : 'justify-center'}`}
                >
                  <span className="flex-shrink-0">{item.icon}</span>
                  {sidebarOpen && <span className="ml-3">{item.name}</span>}
                </Link>
              ))}
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
                onClick={handleSignOut}
                className="w-full justify-start text-destructive hover:bg-destructive/10 hover:text-red-700 dark:text-red-400 dark:hover:bg-red-900/20"
              >
                <LogOut className="h-5 w-5" />
                {sidebarOpen && <span className="ml-2">Sign Out</span>}
              </Button>
            </div>
          </div>
        </div>
      </div>

      {/* Mobile bottom navigation - showing only the most important items */}
      <div className="md:hidden fixed bottom-0 left-0 right-0 z-10 bg-white dark:bg-gray-900 border-t border-gray-200 dark:border-gray-700">
        <div className="flex justify-around items-center h-16">
          {navItems.slice(0, 5).map((item) => (
            <Link
              key={item.path}
              to={item.path}
              className={`flex flex-col items-center justify-center p-2 flex-1 ${
                isActive(item.path) ? 'text-cap-teal' : 'text-gray-700 dark:text-gray-300'
              }`}
            >
              <span className="mb-1">{item.icon}</span>
              <span className="text-xs">{item.name}</span>
            </Link>
          ))}
        </div>
      </div>

      {/* Mobile menu overlay */}
      {mobileMenuOpen && (
        <div className="fixed inset-0 z-50 md:hidden">
          <div className="fixed inset-0 bg-black/50" onClick={() => setMobileMenuOpen(false)}></div>
          <div className="fixed inset-y-0 left-0 w-full max-w-xs bg-white dark:bg-gray-900 overflow-y-auto">
            <div className="p-4 flex justify-between items-center border-b border-gray-200 dark:border-gray-700">
              <div className="flex items-center">
                <Logo />
                <h2 className="ml-3 text-lg font-semibold text-gray-900 dark:text-gray-100">
                  EduEasy
                </h2>
              </div>
              <Button
                variant="ghost"
                size="icon"
                onClick={() => setMobileMenuOpen(false)}
                className="text-gray-500 dark:text-gray-400"
              >
                <X />
              </Button>
            </div>
            <div className="p-4">
              <div className="mb-4">
                <h3 className="text-sm font-medium text-gray-500 dark:text-gray-400 mb-2 px-2">
                  MAIN NAVIGATION
                </h3>
                <nav className="space-y-1">
                  {navItems.map((item) => (
                    <Link
                      key={item.path}
                      to={item.path}
                      className={`flex items-center px-4 py-3 rounded-lg transition-colors ${
                        isActive(item.path)
                          ? 'bg-cap-teal/10 text-cap-teal dark:bg-cap-teal/20'
                          : 'text-gray-700 hover:bg-gray-100 dark:text-gray-300 dark:hover:bg-gray-800'
                      }`}
                      onClick={() => setMobileMenuOpen(false)}
                    >
                      <span className="flex-shrink-0">{item.icon}</span>
                      <span className="ml-3">{item.name}</span>
                    </Link>
                  ))}
                </nav>
              </div>
              <div className="mt-6 pt-6 border-t border-gray-200 dark:border-gray-700">
                <h3 className="text-sm font-medium text-gray-500 dark:text-gray-400 mb-2 px-2">
                  SETTINGS
                </h3>
                <Button
                  variant="ghost"
                  className="w-full justify-start text-gray-700 dark:text-gray-300 mb-3 px-4 py-3"
                  onClick={toggleTheme}
                >
                  {isDarkMode ? (
                    <Sun className="h-5 w-5 mr-3" />
                  ) : (
                    <Moon className="h-5 w-5 mr-3" />
                  )}
                  {isDarkMode ? 'Light Mode' : 'Dark Mode'}
                </Button>
                <Button
                  variant="ghost"
                  onClick={handleSignOut}
                  className="w-full justify-start text-destructive hover:bg-destructive/10 hover:text-red-700 dark:text-red-400 dark:hover:bg-red-900/20 px-4 py-3"
                >
                  <LogOut className="h-5 w-5 mr-3" />
                  Sign Out
                </Button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Main content */}
      <div className="flex-1 flex flex-col overflow-hidden bg-gray-50 dark:bg-gray-900">
        {/* Top header */}
        <header className="bg-white dark:bg-gray-800 shadow-sm">
          <div className="px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="md:hidden">
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={() => setMobileMenuOpen(true)}
                  className="text-gray-500 dark:text-gray-400"
                >
                  <Menu />
                </Button>
              </div>
              <h1 className="text-xl font-semibold text-gray-900 dark:text-gray-100 truncate max-w-[200px] sm:max-w-xs">
                {navItems.find((item) => isActive(item.path))?.name || 'Dashboard'}
              </h1>
            </div>
            <div className="flex items-center gap-2 sm:gap-4">
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

              <div className="hidden sm:flex items-center gap-2 text-sm">
                <div className="h-8 w-8 rounded-full bg-cap-teal/20 flex items-center justify-center text-cap-teal">
                  {user?.email?.charAt(0).toUpperCase() || 'U'}
                </div>
                <span className="text-gray-600 dark:text-gray-300 hidden md:inline">
                  {user?.email}
                </span>
              </div>
            </div>
          </div>
        </header>

        {/* Main content area with bottom padding for mobile nav */}
        <main className="flex-1 overflow-y-auto pb-20 md:pb-10">
          <div className="bg-white dark:bg-gray-800 shadow-sm text-gray-900 dark:text-gray-100 p-4 sm:p-6 md:p-8 min-h-[calc(100vh-4rem)]">
            {children}
          </div>
        </main>
      </div>
    </div>
  );
};

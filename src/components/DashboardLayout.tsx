import { DashboardContent } from '@/components/dashboard/layout/DashboardContent';
import { DashboardHeader } from '@/components/dashboard/layout/DashboardHeader';
import { DashboardSidebar } from '@/components/dashboard/layout/DashboardSidebar';
import { MobileMenu } from '@/components/dashboard/layout/MobileMenu';
import { Spinner } from '@/components/Spinner';
import {
    BarChart,
    BookOpen,
    ClipboardList,
    CreditCard,
    Home,
    MessageSquare,
    Settings,
    User,
} from '@/components/ui/icons';
import { useAdminRole } from '@/hooks/useAdminRole';
import { useAuth } from '@/hooks/useAuth';
import { useTheme } from '@/hooks/useTheme';
import { useState, type ReactNode } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';

interface DashboardLayoutProps {
  children: ReactNode;
}

export const DashboardLayout = ({ children }: DashboardLayoutProps) => {
  const { user, signOut, loading } = useAuth();
  const { isAdmin, loading: roleLoading } = useAdminRole();
  const navigate = useNavigate();
  const location = useLocation();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const { isDarkMode, toggleTheme } = useTheme();

  if (loading || roleLoading) {
    return (
      <div className="flex items-center justify-center h-screen">
        <Spinner size="lg" />
        <p className="ml-3 text-lg font-medium text-gray-700">Loading...</p>
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
      name: 'Subscription',
      path: '/subscription',
      icon: <CreditCard className="h-5 w-5" />,
    },
    {
      name: 'My Profile',
      path: '/profile',
      icon: <User className="h-5 w-5" />,
    },
  ];

  // Admin-only navigation items
  const adminNavItems = isAdmin
    ? [
        {
          name: 'Admin Dashboard',
          path: '/admin',
          icon: <Settings className="h-5 w-5" />,
        },
        {
          name: 'Analytics',
          path: '/admin/analytics',
          icon: <BarChart className="h-5 w-5" />,
        },
        {
          name: 'AI Training',
          path: '/admin/ai-training',
          icon: <MessageSquare className="h-5 w-5" />,
        },
      ]
    : [];

  const getPageTitle = () => {
    const allNavItems = [...navItems, ...adminNavItems];
    const currentNavItem = allNavItems.find(
      (item) => isActive(item.path) || location.pathname.startsWith(item.path + '/'),
    );
    return currentNavItem?.name || 'Dashboard';
  };

  return (
    <div className={`h-screen flex overflow-hidden ${isDarkMode ? 'dark' : ''}`}>
      {/* Desktop Sidebar */}
      <DashboardSidebar
        navItems={navItems}
        adminNavItems={adminNavItems}
        isAdmin={isAdmin}
        onSignOut={handleSignOut}
      />

      {/* Mobile Menu */}
      <MobileMenu
        isOpen={mobileMenuOpen}
        onClose={() => setMobileMenuOpen(false)}
        navItems={navItems}
        adminNavItems={adminNavItems}
        isAdmin={isAdmin}
        onSignOut={handleSignOut}
        isDarkMode={isDarkMode}
        toggleTheme={toggleTheme}
        isActive={isActive}
      />

      {/* Main content */}
      <div className="flex-1 flex flex-col overflow-hidden bg-gray-50 dark:bg-gray-900">
        {/* Header */}
        <DashboardHeader
          title={getPageTitle()}
          user={user}
          isDarkMode={isDarkMode}
          toggleTheme={toggleTheme}
          onOpenMobileMenu={() => setMobileMenuOpen(true)}
        />

        {/* Content */}
        <DashboardContent>{children}</DashboardContent>
      </div>
    </div>
  );
};

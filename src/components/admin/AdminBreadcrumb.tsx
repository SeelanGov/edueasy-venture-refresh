
import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { ChevronRight, Home } from 'lucide-react';

export const AdminBreadcrumb: React.FC = () => {
  const location = useLocation();
  const pathnames = location.pathname.split('/').filter((x) => x);

  const getBreadcrumbName = (segment: string, index: number) => {
    switch (segment) {
      case 'admin':
        return 'Admin';
      case 'dashboard':
        return 'Dashboard';
      case 'users':
        return 'Users';
      case 'partners':
        return 'Partners';
      case 'sponsors':
        return 'Sponsors';
      case 'payments':
        return 'Payments';
      case 'plans':
        return 'Plans';
      case 'sessions':
        return 'Sessions';
      default:
        // If it's a UUID or ID, show as "Profile" or "Details"
        if (segment.length > 20 || /^[a-f0-9-]{36}$/.test(segment)) {
          return 'Profile';
        }
        return segment.charAt(0).toUpperCase() + segment.slice(1);
    }
  };

  const getBreadcrumbPath = (index: number) => {
    return `/${pathnames.slice(0, index + 1).join('/')}`;
  };

  return (
    <nav className="flex items-center space-x-1 text-sm text-muted-foreground mb-6">
      <Link 
        to="/admin/dashboard" 
        className="flex items-center hover:text-foreground transition-colors"
      >
        <Home className="w-4 h-4" />
      </Link>
      
      {pathnames.map((segment, index) => (
        <React.Fragment key={segment}>
          <ChevronRight className="w-4 h-4" />
          {index === pathnames.length - 1 ? (
            <span className="text-foreground font-medium">
              {getBreadcrumbName(segment, index)}
            </span>
          ) : (
            <Link
              to={getBreadcrumbPath(index)}
              className="hover:text-foreground transition-colors"
            >
              {getBreadcrumbName(segment, index)}
            </Link>
          )}
        </React.Fragment>
      ))}
    </nav>
  );
};

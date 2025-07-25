import { ChevronRight, BarChart3 } from 'lucide-react';
import { Link } from 'react-router-dom';


/**
 * AnalyticsBreadcrumb
 * @description Function
 */
export const AnalyticsBreadcrumb = (): void => {
  return (
    <nav className="flex items-center space-x-2 text-sm text-muted-foreground mb-6">
      <Link
        to="/admin/dashboard"
        className="flex items-center hover:text-foreground transition-colors"
      >
        <BarChart3 className="h-4 w-4 mr-1" />
        Admin Dashboard
      </Link>
      <ChevronRight className="h-4 w-4" />
      <span className="text-foreground font-medium">Analytics</span>
    </nav>
  );
};

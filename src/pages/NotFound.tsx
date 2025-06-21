
import { useLocation, Link } from 'react-router-dom';
import { useEffect } from 'react';
import { PageLayout } from '@/components/layout/PageLayout';
import { Button } from '@/components/ui/button';
import { Home, ArrowLeft, Search } from 'lucide-react';

const NotFound = () => {
  const location = useLocation();

  useEffect(() => {
    console.error('404 Error: User attempted to access non-existent route:', location.pathname);
  }, [location.pathname]);

  return (
    <PageLayout
      title="Page Not Found"
      subtitle="The page you're looking for doesn't exist or has been moved"
      gradient={true}
    >
      <div className="max-w-md mx-auto text-center">
        <div className="bg-white rounded-lg shadow-lg p-8 mb-8">
          <div className="mb-6">
            <div className="text-6xl font-bold text-cap-teal mb-4">404</div>
            <h2 className="text-2xl font-semibold text-gray-800 mb-2">Oops! Page not found</h2>
            <p className="text-gray-600">
              The page you're trying to access doesn't exist or may have been moved.
            </p>
          </div>

          <div className="space-y-4">
            <Button asChild className="w-full bg-cap-coral hover:bg-cap-coral/90">
              <Link to="/" className="flex items-center justify-center gap-2">
                <Home className="h-4 w-4" />
                Go Home
              </Link>
            </Button>
            
            <Button asChild variant="outline" className="w-full border-gray-200 text-gray-600 hover:border-cap-teal hover:text-cap-teal">
              <Link to="/dashboard" className="flex items-center justify-center gap-2">
                <Search className="h-4 w-4" />
                Go to Dashboard
              </Link>
            </Button>
          </div>
        </div>

        <div className="text-center">
          <button 
            onClick={() => window.history.back()}
            className="text-gray-600 hover:text-cap-teal inline-flex items-center gap-2"
          >
            <ArrowLeft className="h-4 w-4" />
            Go Back
          </button>
        </div>
      </div>
    </PageLayout>
  );
};

export default NotFound;

import { useEffect } from 'react';
import { useLocation, Link } from 'react-router-dom';
import { PageLayout } from '@/components/layout/PageLayout';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
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
        <Card className="shadow-lg mb-8 border border-gray-100">
          <CardContent className="p-8">
            <div className="mb-6">
              <div className="text-6xl font-bold text-cap-teal mb-4">404</div>
              <h2 className="text-2xl font-semibold text-gray-800 mb-2">Oops! Page not found</h2>
              <p className="text-gray-600">
                The page you're trying to access doesn't exist or may have been moved.
              </p>
            </div>

            <div className="space-y-4">
              <Button asChild variant="primary" className="w-full">
                <Link to="/" className="flex items-center justify-center gap-2">
                  <Home className="h-4 w-4" />
                  Go Home
                </Link>
              </Button>

              <Button asChild variant="outline" className="w-full">
                <Link to="/dashboard" className="flex items-center justify-center gap-2">
                  <Search className="h-4 w-4" />
                  Go to Dashboard
                </Link>
              </Button>
            </div>
          </CardContent>
        </Card>

        <div className="text-center">
          <Button
            variant="ghost"
            onClick={() => window.history.back()}
            className="text-gray-600 hover:text-cap-teal inline-flex items-center gap-2">
            <ArrowLeft className="h-4 w-4" />
            Go Back
          </Button>
        </div>
      </div>
    </PageLayout>
  );
};

export default NotFound;

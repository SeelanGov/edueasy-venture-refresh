import logger from '@/utils/logger';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Button } from '@/components/ui/button';
import { AlertCircle, ArrowLeft, Home, RefreshCw } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

interface ErrorRecoveryProps {
  error: {
    type: 'sessionStorage' | 'network' | 'payment' | 'authentication' | 'general';
    message: string;
    details?: string;
  };
  onRetry?: () => void;
  onBack?: () => void;
  className?: string;
}

/**
 * ErrorRecovery
 * @description Function
 */
export const ErrorRecovery = ({ error, onRetry, onBack, className }: ErrorRecoveryProps) => {
  const navigate = useNavigate();

  const getErrorIcon = () => {
    switch (error.type) {
      case 'sessionStorage':
        return <AlertCircle className="h-5 w-5 text-orange-500" />;
      case 'network':
        return <AlertCircle className="h-5 w-5 text-red-500" />;
      case 'payment':
        return <AlertCircle className="h-5 w-5 text-red-500" />;
      case 'authentication':
        return <AlertCircle className="h-5 w-5 text-yellow-500" />;
      default:
        return <AlertCircle className="h-5 w-5 text-gray-500" />;
    }
  };

  const getErrorTitle = () => {
    switch (error.type) {
      case 'sessionStorage':
        return 'Storage Issue Detected';
      case 'network':
        return 'Connection Problem';
      case 'payment':
        return 'Payment Error';
      case 'authentication':
        return 'Authentication Issue';
      default:
        return 'Something went wrong';
    }
  };

  const getRecoveryActions = () => {
    switch (error.type) {
      case 'sessionStorage':
        return (
          <div className="flex flex-col sm:flex-row gap-2 mt-4">
            <Button onClick={onRetry} variant="outline" className="flex items-center gap-2">
              <RefreshCw className="h-4 w-4" />
              Try Again
            </Button>
            <Button
              onClick={() => navigate('/pricing')}
              variant="outline"
              className="flex items-center gap-2"
            >
              <ArrowLeft className="h-4 w-4" />
              Select Plan Again
            </Button>
          </div>
        );
      case 'network':
        return (
          <div className="flex flex-col sm:flex-row gap-2 mt-4">
            <Button onClick={onRetry} variant="outline" className="flex items-center gap-2">
              <RefreshCw className="h-4 w-4" />
              Retry Connection
            </Button>
            <Button
              onClick={() => window.location.reload()}
              variant="outline"
              className="flex items-center gap-2"
            >
              <RefreshCw className="h-4 w-4" />
              Refresh Page
            </Button>
          </div>
        );
      case 'payment':
        return (
          <div className="flex flex-col sm:flex-row gap-2 mt-4">
            <Button onClick={onRetry} variant="outline" className="flex items-center gap-2">
              <RefreshCw className="h-4 w-4" />
              Try Payment Again
            </Button>
            <Button onClick={onBack} variant="outline" className="flex items-center gap-2">
              <ArrowLeft className="h-4 w-4" />
              Back to Checkout
            </Button>
          </div>
        );
      case 'authentication':
        return (
          <div className="flex flex-col sm:flex-row gap-2 mt-4">
            <Button
              onClick={() => navigate('/login')}
              variant="outline"
              className="flex items-center gap-2"
            >
              <RefreshCw className="h-4 w-4" />
              Sign In Again
            </Button>
            <Button
              onClick={() => navigate('/register')}
              variant="outline"
              className="flex items-center gap-2"
            >
              <RefreshCw className="h-4 w-4" />
              Create New Account
            </Button>
          </div>
        );
      default:
        return (
          <div className="flex flex-col sm:flex-row gap-2 mt-4">
            <Button onClick={onRetry} variant="outline" className="flex items-center gap-2">
              <RefreshCw className="h-4 w-4" />
              Try Again
            </Button>
            <Button
              onClick={() => navigate('/')}
              variant="outline"
              className="flex items-center gap-2"
            >
              <Home className="h-4 w-4" />
              Go Home
            </Button>
          </div>
        );
    }
  };

  return (
    <div className={`bg-white rounded-lg border border-gray-200 p-6 shadow-sm ${className}`}>
      <Alert variant="destructive" className="border-l-4 border-l-red-500 bg-destructive/10">
        <div className="flex items-start gap-3">
          {getErrorIcon()}
          <div className="flex-1">
            <h3 className="font-semibold text-red-900 mb-1">{getErrorTitle()}</h3>
            <AlertDescription className="text-red-800 mb-2">{error.message}</AlertDescription>
            {error.details && (
              <p className="text-sm text-red-700 bg-red-100 p-2 rounded">{error.details}</p>
            )}
          </div>
        </div>
      </Alert>

      {getRecoveryActions()}

      <div className="mt-4 p-3 bg-primary/10 rounded-lg border border-primary/20">
        <p className="text-sm text-blue-800">
          <strong>Need help?</strong> Contact our support team at{' '}
          <a href="mailto:support@edueasy.co.za" className="underline hover:text-primary">
            support@edueasy.co.za
          </a>
        </p>
      </div>
    </div>
  );
};

// Hook for handling common errors in the authentication flow

/**
 * useErrorRecovery
 * @description Function
 */
export const useErrorRecovery = () => {
  const handleSessionStorageError = (operation: string) => {
    logger.error(`SessionStorage error during ${operation}`);
    return {
      type: 'sessionStorage' as const,
      message: 'Unable to save your plan selection. This might be due to browser settings.',
      details: 'Please ensure cookies and local storage are enabled in your browser.',
    };
  };

  const handleNetworkError = (operation: string) => {
    logger.error(`Network error during ${operation}`);
    return {
      type: 'network' as const,
      message: 'Connection issue detected. Please check your internet connection.',
      details: 'Try refreshing the page or check your network connection.',
    };
  };

  const handlePaymentError = (operation: string, details?: string) => {
    logger.error(`Payment error during ${operation}`);
    return {
      type: 'payment' as const,
      message: 'Payment processing failed. Please try again.',
      details: details || 'Your payment information could not be processed.',
    };
  };

  const handleAuthenticationError = (operation: string) => {
    logger.error(`Authentication error during ${operation}`);
    return {
      type: 'authentication' as const,
      message: 'Authentication failed. Please sign in again.',
      details: 'Your session may have expired. Please log in to continue.',
    };
  };

  return {
    handleSessionStorageError,
    handleNetworkError,
    handlePaymentError,
    handleAuthenticationError,
  };
};

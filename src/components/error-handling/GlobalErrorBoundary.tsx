import { Button } from '@/components/ui/button';
import React from 'react';

interface Props {
  children: React.ReactNode;
}

interface State {
  hasError: boolean;
}

export class GlobalErrorBoundary extends React.Component<Props, State> {
  constructor(props: Props) {
    super(props);
    this.state = { hasError: false };
  }

  static getDerivedStateFromError(_: Error): State {
    return { hasError: true };
  }

  componentDidCatch(error: Error, errorInfo: React.ErrorInfo) {
    console.error('GlobalErrorBoundary caught an error:', error, errorInfo);
  }

  render() {
    if (this.state.hasError) {
      return (
        <div className="min-h-screen flex items-center justify-center bg-gray-100">
          <div className="text-center">
            <h1 className="text-2xl font-bold mb-4">Something went wrong</h1>
            <p className="text-gray-600 mb-4">
              We're sorry for the inconvenience. Please refresh the page to try again.
            </p>
            <Button
              onClick={() => window.location.reload()}
              className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
            >
              Refresh Page
            </Button>
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}

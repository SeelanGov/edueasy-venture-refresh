import React from 'react';

type Props = { children: React.ReactNode };
type State = { hasError: boolean; message?: string };

export class ErrorBoundary extends React.Component<Props, State> {
  state: State = { hasError: false };
  
  static getDerivedStateFromError(err: Error) { 
    return { hasError: true, message: err.message }; 
  }
  
  componentDidCatch(err: Error, info: React.ErrorInfo) { 
    console.error('UI crash:', err, info); 
  }
  
  render() { 
    return this.state.hasError ? (
      <div className="p-6 text-red-600">
        Something broke: {this.state.message}
      </div>
    ) : this.props.children; 
  }
}
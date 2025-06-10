
import React from 'react';
import { cn } from '@/lib/utils';

interface LoadingSpinnerProps {
  size?: 'sm' | 'md' | 'lg';
  text?: string;
  className?: string;
}

export const LoadingSpinner: React.FC<LoadingSpinnerProps> = ({ 
  size = 'md', 
  text = 'Loading...', 
  className 
}) => {
  const sizeClasses = {
    sm: 'w-4 h-4',
    md: 'w-6 h-6',
    lg: 'w-8 h-8'
  };

  return (
    <div className={cn("flex flex-col items-center justify-center py-8", className)}>
      <div className={cn(
        "animate-spin rounded-full border-2 border-muted border-t-primary mb-2",
        sizeClasses[size]
      )} />
      {text && <p className="text-sm text-muted-foreground">{text}</p>}
    </div>
  );
};

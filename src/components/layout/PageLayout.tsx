
import React from 'react';
import { cn } from '@/lib/utils';

interface PageLayoutProps {
  children: React.ReactNode;
  className?: string;
  containerClassName?: string;
  title?: string;
  subtitle?: string;
  gradient?: boolean;
}

export const PageLayout = ({ 
  children, 
  className,
  containerClassName,
  title,
  subtitle,
  gradient = true 
}: PageLayoutProps) => {
  return (
    <div className={cn(
      "min-h-screen",
      gradient ? "bg-gradient-to-br from-gray-50 to-blue-50" : "bg-white",
      className
    )}>
      <div className={cn(
        "container mx-auto px-4 py-8",
        containerClassName
      )}>
        {(title || subtitle) && (
          <div className="text-center mb-8">
            {title && (
              <h1 className="text-3xl font-bold text-gray-800 mb-4">
                {title}
              </h1>
            )}
            {subtitle && (
              <p className="text-lg text-gray-600 max-w-2xl mx-auto">
                {subtitle}
              </p>
            )}
          </div>
        )}
        {children}
      </div>
    </div>
  );
};

export default PageLayout;

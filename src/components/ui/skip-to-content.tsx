import * as React from 'react';
import { cn } from '@/lib/utils';

interface SkipToContentProps {
  contentId: string;
  className?: string;
}

const SkipToContent = React.forwardRef<HTMLAnchorElement, SkipToContentProps>(
  ({ contentId, className, ...props }, ref) => {
    return (
      <a
        href={`#${contentId}`}
        className={cn(
          'sr-only focus:not-sr-only focus:absolute focus:top-4 focus:left-4 focus:z-50 focus:p-4 focus:bg-white dark:focus:bg-gray-900 focus:text-primary focus:outline-none focus:ring-2 focus:ring-primary',
          className
        )}
        ref={ref}
        {...props}
      >
        Skip to content
      </a>
    );
  }
);

SkipToContent.displayName = 'SkipToContent';

export { SkipToContent };

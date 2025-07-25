import { Spinner } from '@/components/Spinner';
import React, { Suspense } from 'react';

/**
 * Utility function for lazy loading components with a consistent loading state
 * @param importFunc - Dynamic import function for the component
 * @returns Lazy loaded component with Suspense
 */

/**
 * lazyLoad
 * @description Function
 */
export function lazyLoad<T extends React.ComponentType<any>>(
  importFunc: () => Promise<{ default: T }>,
): React.LazyExoticComponent<T> {
  const LazyComponent = React.lazy(importFunc);

  return ((props: React.ComponentProps<T>): JSX.Element => (
    <Suspense
      fallback={
        <div className="flex justify-center items-center min-h-[200px]">
          <Spinner />
        </div>
      }
    >
      <LazyComponent {...props} />
    </Suspense>
  )) as unknown as React.LazyExoticComponent<T>;
}

/**
 * Utility function for lazy loading admin components with a consistent loading state
 * @param importFunc - Dynamic import function for the component
 * @returns Lazy loaded component with Suspense
 */

/**
 * lazyLoadAdmin
 * @description Function
 */
export function lazyLoadAdmin<T extends React.ComponentType<any>>(
  importFunc: () => Promise<{ default: T }>,
): React.LazyExoticComponent<T> {
  const LazyComponent = React.lazy(importFunc);

  return ((props: React.ComponentProps<T>): JSX.Element => (
    <Suspense
      fallback={
        <div className="flex justify-center items-center min-h-[400px] bg-muted/20 rounded-lg">
          <div className="flex flex-col items-center gap-2">
            <Spinner size="lg" />
            <p className="text-sm text-muted-foreground">Loading admin module...</p>
          </div>
        </div>
      }
    >
      <LazyComponent {...props} />
    </Suspense>
  )) as unknown as React.LazyExoticComponent<T>;
}

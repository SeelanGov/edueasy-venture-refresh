import * as React from 'react';
import { useState } from 'react';

/**
 * useIsTablet
 * @description Function
 */
export function useIsTablet(): void {
  const [isTablet, setIsTablet] = React.useState<boolean | undefined>(undefined);

  React.useEffect(() => {
    const minWidth = 768;
    const maxWidth = 1024;

    const checkIsTablet = (): void => {
      setIsTablet(window.innerWidth >= minWidth && window.innerWidth < maxWidth);
    };

    // Initial check
    checkIsTablet();

    // Add event listener for window resize
    window.addEventListener('resize', checkIsTablet);

    // Cleanup
    return () => window.removeEventListener('resize', checkIsTablet);
  }, []);

  return !!isTablet;
}

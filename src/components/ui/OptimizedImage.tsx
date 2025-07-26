import { cn } from '@/lib/utils';
import { useEffect, useRef, useState, useCallback } from 'react';

interface OptimizedImageProps {
  src: string;
  alt: string;
  priority?: boolean;
  className?: string;
  fallbackSrc?: string;
  skeletonClassName?: string;
  onLoad?: () => void;
  onError?: () => void;
  enableWebP?: boolean;
  enableIntersectionObserver?: boolean;
}

/**
 * OptimizedImage
 * @description Function
 */
export const OptimizedImage = ({
  src,
  alt,
  priority = false,
  className,
  fallbackSrc,
  skeletonClassName,
  onLoad,
  onError,
  enableWebP = true,
  enableIntersectionObserver = true,
  ...props
}: OptimizedImageProps & React.ImgHTMLAttributes<HTMLImageElement>): void => {
  const [isLoaded, setIsLoaded] = useState(false);
  const [hasError, setHasError] = useState(false);
  const [currentSrc, setCurrentSrc] = useState(src);
  const [isInView, setIsInView] = useState(priority);
  const [webPSupported, setWebPSupported] = useState(false);
  const imgRef = useRef<HTMLImageElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);

  // Check WebP support
  useEffect(() => {
    if (!enableWebP) return;

    const webp = new Image();
    webp.onload = webp.onerror = () => {
      setWebPSupported(webp.height === 2);
    };
    webp.src =
      'data:image/webp;base64,UklGRjoAAABXRUJQVlA4IC4AAACyAgCdASoCAAIALmk0mk0iIiIiIgBoSygABc6WWgAA/veff/0PP8bA//LwYAAA';
  }, [enableWebP]);

  // Intersection Observer for lazy loading
  useEffect(() => {
    if (!enableIntersectionObserver || priority || !containerRef.current) {
      setIsInView(true);
      return;
    }

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsInView(true);
          observer.disconnect();
        }
      },
      { threshold: 0.1 },
    );

    observer.observe(containerRef.current);

    return () => observer.disconnect();
  }, [enableIntersectionObserver, priority]);

  // Reset state when src changes
  useEffect(() => {
    setCurrentSrc(src);
    setHasError(false);
    setIsLoaded(false);
  }, [src]);

  // Generate optimized src with WebP support
  const getOptimizedSrc = useCallback(
    (originalSrc: string) => {
      if (!enableWebP || !webPSupported || !originalSrc.includes('unsplash')) {
        return originalSrc;
      }

      // Convert Unsplash URLs to WebP format
      if (originalSrc.includes('images.unsplash.com')) {
        return `${originalSrc}&fm=webp&q=80`;
      }

      return originalSrc;
    },
    [enableWebP, webPSupported],
  );

  const handleLoad = useCallback(() => {
    setIsLoaded(true);
    onLoad?.();
  }, [onLoad]);

  const handleError = useCallback(() => {
    if (fallbackSrc && currentSrc !== fallbackSrc) {
      setCurrentSrc(fallbackSrc);
      setHasError(false);
    } else {
      setHasError(true);
      onError?.();
    }
  }, [fallbackSrc, currentSrc, onError]);

  const ImageSkeleton = () => (
    <div
      className={cn(
        'animate-pulse bg-gradient-to-r from-gray-200 to-gray-300 rounded-lg',
        skeletonClassName,
      )}
    >
      <div className="h-full w-full bg-gray-200 rounded-lg" />
    </div>
  );

  const ErrorFallback = () => (
    <div className="flex items-center justify-center h-full w-full bg-gradient-to-br from-blue-50 to-teal-50 rounded-lg">
      <div className="text-center p-4">
        <div className="text-2xl mb-2">🖼️</div>
        <div className="text-gray-700 font-medium">Image unavailable</div>
        <div className="text-sm text-gray-500">Please try again later</div>
      </div>
    </div>
  );

  return (
    <div ref={containerRef} className="relative">
      {/* Loading skeleton */}
      {!isLoaded && !hasError && isInView && <ImageSkeleton />}

      {/* Error fallback */}
      {hasError && <ErrorFallback />}

      {/* Optimized image - only render when in view */}
      {isInView && (
        <img
          ref={imgRef}
          src={getOptimizedSrc(currentSrc)}
          alt={alt}
          loading={priority ? 'eager' : 'lazy'}
          onLoad={handleLoad}
          onError={handleError}
          className={cn(
            'transition-opacity duration-300',
            isLoaded && !hasError ? 'opacity-100' : 'opacity-0',
            className,
          )}
          {...props}
        />
      )}
    </div>
  );
};

import { cn } from '@/lib/utils';
import { useEffect, useRef, useState } from 'react';

interface OptimizedImageProps {
  src: string;
  alt: string;
  priority?: boolean;
  className?: string;
  fallbackSrc?: string;
  skeletonClassName?: string;
  onLoad?: () => void;
  onError?: () => void;
}

export const OptimizedImage = ({
  src,
  alt,
  priority = false,
  className,
  fallbackSrc,
  skeletonClassName,
  onLoad,
  onError,
  ...props
}: OptimizedImageProps & React.ImgHTMLAttributes<HTMLImageElement>) => {
  const [isLoaded, setIsLoaded] = useState(false);
  const [hasError, setHasError] = useState(false);
  const [currentSrc, setCurrentSrc] = useState(src);
  const imgRef = useRef<HTMLImageElement>(null);

  useEffect(() => {
    setCurrentSrc(src);
    setHasError(false);
    setIsLoaded(false);
  }, [src]);

  const handleLoad = () => {
    setIsLoaded(true);
    onLoad?.();
  };

  const handleError = () => {
    if (fallbackSrc && currentSrc !== fallbackSrc) {
      setCurrentSrc(fallbackSrc);
      setHasError(false);
    } else {
      setHasError(true);
      onError?.();
    }
  };

  const ImageSkeleton = () => (
    <div
      className={cn(
        'animate-pulse bg-gradient-to-r from-gray-200 to-gray-300 rounded-lg',
        skeletonClassName
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
    <div className="relative">
      {/* Loading skeleton */}
      {!isLoaded && !hasError && (
        <ImageSkeleton />
      )}

      {/* Error fallback */}
      {hasError && (
        <ErrorFallback />
      )}

      {/* Optimized image */}
      <img
        ref={imgRef}
        src={currentSrc}
        alt={alt}
        loading={priority ? "eager" : "lazy"}
        onLoad={handleLoad}
        onError={handleError}
        className={cn(
          'transition-opacity duration-300',
          isLoaded && !hasError ? 'opacity-100' : 'opacity-0',
          className
        )}
        {...props}
      />
    </div>
  );
}; 
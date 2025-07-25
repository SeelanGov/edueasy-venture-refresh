import { cn } from '@/lib/utils';

interface SkeletonProps {
  className?: string;
  width?: string | number;
  height?: string | number;
}


/**
 * Skeleton
 * @description Function
 */
export const Skeleton: React.FC<SkeletonProps> = ({ className, width, height }) => {
  return (
    <div
      className={cn('animate-pulse rounded-md bg-gray-200', className)}
      style={{
        width: width,
        height: height,
      }}
    />
  );
};

// Predefined skeleton components for common use cases

/**
 * SkeletonCard
 * @description Function
 */
export const SkeletonCard: React.FC<{ className?: string }> = ({ className }) => (
  <div className={cn('space-y-3', className)}>
    <Skeleton className="h-4 w-3/4" />
    <Skeleton className="h-4 w-1/2" />
    <Skeleton className="h-4 w-5/6" />
  </div>
);


/**
 * SkeletonTable
 * @description Function
 */
export const SkeletonTable: React.FC<{ rows?: number; className?: string }> = ({
  rows = 5,
  className,
}) => (
  <div className={cn('space-y-3', className)}>
    {Array.from({ length: rows }).map((_, i) => (
      <div key={i} className="flex space-x-4">
        <Skeleton className="h-4 w-1/4" />
        <Skeleton className="h-4 w-1/3" />
        <Skeleton className="h-4 w-1/4" />
        <Skeleton className="h-4 w-1/6" />
      </div>
    ))}
  </div>
);


/**
 * SkeletonAvatar
 * @description Function
 */
export const SkeletonAvatar: React.FC<{ size?: 'sm' | 'md' | 'lg'; className?: string }> = ({
  size = 'md',
  className,
}) => {
  const sizeClasses = {
    sm: 'h-8 w-8',
    md: 'h-12 w-12',
    lg: 'h-16 w-16',
  };

  return <Skeleton className={cn('rounded-full', sizeClasses[size], className)} />;
};


/**
 * SkeletonButton
 * @description Function
 */
export const SkeletonButton: React.FC<{ className?: string }> = ({ className }) => (
  <Skeleton className={cn('h-10 w-24', className)} />
);


/**
 * SkeletonInput
 * @description Function
 */
export const SkeletonInput: React.FC<{ className?: string }> = ({ className }) => (
  <Skeleton className={cn('h-10 w-full', className)} />
);


/**
 * SkeletonBadge
 * @description Function
 */
export const SkeletonBadge: React.FC<{ className?: string }> = ({ className }) => (
  <Skeleton className={cn('h-6 w-16', className)} />
);

// Dashboard specific skeletons

/**
 * SkeletonDashboardCard
 * @description Function
 */
export const SkeletonDashboardCard: React.FC<{ className?: string }> = ({ className }) => (
  <div className={cn('p-6 border rounded-lg space-y-4', className)}>
    <div className="flex items-center space-x-3">
      <Skeleton className="h-8 w-8 rounded" />
      <Skeleton className="h-4 w-24" />
    </div>
    <Skeleton className="h-8 w-16" />
    <Skeleton className="h-3 w-32" />
  </div>
);


/**
 * SkeletonNotification
 * @description Function
 */
export const SkeletonNotification: React.FC<{ className?: string }> = ({ className }) => (
  <div className={cn('p-4 border rounded-lg space-y-3', className)}>
    <div className="flex items-center space-x-3">
      <Skeleton className="h-6 w-6 rounded" />
      <Skeleton className="h-4 w-32" />
    </div>
    <Skeleton className="h-3 w-full" />
    <Skeleton className="h-3 w-3/4" />
    <div className="flex justify-between items-center">
      <Skeleton className="h-4 w-16" />
      <Skeleton className="h-6 w-20" />
    </div>
  </div>
);


/**
 * SkeletonProfile
 * @description Function
 */
export const SkeletonProfile: React.FC<{ className?: string }> = ({ className }) => (
  <div className={cn('space-y-6', className)}>
    <div className="flex items-center space-x-4">
      <SkeletonAvatar size="lg" />
      <div className="space-y-2">
        <Skeleton className="h-6 w-32" />
        <Skeleton className="h-4 w-24" />
      </div>
    </div>
    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
      <SkeletonInput />
      <SkeletonInput />
      <SkeletonInput />
      <SkeletonInput />
    </div>
    <div className="flex space-x-3">
      <SkeletonButton />
      <SkeletonButton />
    </div>
  </div>
);

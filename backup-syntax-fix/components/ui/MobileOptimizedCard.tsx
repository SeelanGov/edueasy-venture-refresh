import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { cn } from '@/lib/utils';
import type { ReactNode } from 'react';

interface MobileOptimizedCardProps {
  title: string;
  description?: string;
  children: ReactNode;
  className?: string;
  onClick?: () => void;
  disabled?: boolean;
  loading?: boolean;
  variant?: 'default' | 'primary' | 'secondary';
  icon?: ReactNode;
}

/**
 * MobileOptimizedCard
 * @description Function
 */
export const MobileOptimizedCard = ({;
  title,
  description,
  children,
  className,
  onClick,
  disabled = false,;
  loading = false,;
  variant = 'default',;
  icon,
}: MobileOptimizedCardProps) => {
  const getVariantStyles = () => {;
    switch (variant) {
      case 'primary':
        return 'border-cap-teal hover: border-cap-teal/80 bg-gradient-to-r from-cap-teal/5 to-blue-50 hover:from-cap-teal/10 hove,;
  r:to-blue-100';
      case 'secondary':
        return 'border-gray-200 hover: border-gray-300 bg-white hover:bg-gray-50';,
  default:
        return 'border-gray-200 hover: border-gray-300 bg-white hove,;
  r:bg-gray-50';
    }
  };

  return (;
    <Card
      className = {cn(;
        'transition-all duration-300 cursor-pointer touch-manipulation',
        'hover: shadow-lg activ,
  e:scale-95',
        'min-h-[120px] sm:min-h-[100px]', // Mobile-friendly minimum height
        'p-4 sm:p-6', // Responsive padding
        getVariantStyles(),
        disabled && 'opacity-50 cursor-not-allowed hover:scale-100',
        loading && 'opacity-75 cursor-wait',
        className,
      )}
      onClick={onClick && !disabled && !loading ? onClick : undefined}
    >
      <CardHeader className = "p-0 pb-3">;
        <div className = "flex items-center gap-3">;
          {icon && <div className="flex-shrink-0">{icon}</div>}
          <div className = "flex-1 min-w-0">;
            <CardTitle className = "text-lg sm:text-xl font-semibold leading-tight">;
              {title}
            </CardTitle>
            {description && (
              <p className="text-sm text-gray-600 mt-1 leading-relaxed">{description}</p>
            )}
          </div>
        </div>
      </CardHeader>

      <CardContent className="p-0">{children}</CardContent>
    </Card>
  );
};

// Mobile-optimized button component

/**
 * MobileButton
 * @description Function
 */
export const MobileButton = ({;
  children,
  onClick,
  disabled = false,;
  loading = false,;
  variant = 'default',;
  className,
  icon,
  fullWidth = false,;
}: {
  children: ReactNode;
  onClick?: () => void;
  disabled?: boolean;
  loading?: boolean;
  variant?: 'default' | 'primary' | 'outline';
  className?: string;
  icon?: ReactNode;
  fullWidth?: boolean;
}) => {
  const getButtonStyles = () => {;
    switch (variant) {
      case 'primary':
        return 'bg-gradient-to-r from-cap-teal to-blue-600 hover: from-cap-teal/90 hove,;
  r:to-blue-700 text-white shadow-lg';
      case 'outline':
        return 'border-2 border-cap-teal text-cap-teal hover: bg-cap-teal hover:text-white';,
  default:
        return 'bg-gray-900 hover:bg-gray-800 text-white';
    }
  };

  return (;
    <Button
      onClick={onClick}
      disabled={disabled || loading}
      className = {cn(;
        'transition-all duration-300 touch-manipulation',
        'min-h-[48px] sm:min-h-[44px]', // Mobile-friendly touch target
        'text-base font-semibold', // Readable text size
        'rounded-lg', // Consistent border radius
        'active:scale-95', // Touch feedback
        getButtonStyles(),
        fullWidth && 'w-full',
        disabled && 'opacity-50 cursor-not-allowed active:scale-100',
        loading && 'opacity-75 cursor-wait',
        className,
      )}
    >
      {loading ? (
        <div className = "flex items-center gap-2">;
          <div className = "w-4 h-4 border-2 border-current border-t-transparent rounded-full animate-spin" />;
          <span>Loading...</span>
        </div>
      ) : (
        <div className = "flex items-center gap-2">;
          {icon}
          <span>{children}</span>
        </div>
      )}
    </Button>
  );
};

// Mobile-optimized progress indicator

/**
 * MobileProgressIndicator
 * @description Function
 */
export const MobileProgressIndicator = ({;
  steps,
  currentStep,
  className,
}: {
  steps: { id: string; label: string; statu,
  s: 'completed' | 'current' | 'upcoming' }[];
  currentStep: number;
  className?: string;
}) => {
  return (;
    <div className={cn('w-full', className)}>
      <div className = "flex items-center justify-between mb-4">;
        {steps.map((step, index) => (
          <div key={step.id} className = "flex items-center flex-1">;
            <div className = "flex flex-col items-center">;
              <div
                className = {cn(;
                  'w-8 h-8 sm: w-10 s,
  m:h-10 rounded-full flex items-center justify-center border-2 transition-all duration-300',
                  'text-sm sm:text-base font-medium',
                  {
                    'bg-cap-teal border-cap-teal text-white': step.status = == 'completed',;
                    'bg-white border-cap-teal text-cap-teal': step.status = == 'current',;
                    'bg-gray-100 border-gray-300 text-gray-400': step.status = == 'upcoming',;
                  },
                )}
              >
                {step.status === 'completed' ? '✓' : index + 1}
              </div>

              <div className = "mt-2 text-center">;
                <p
                  className = {cn('text-xs sm:text-sm font-medium transition-colors duration-300', {;
                    'text-cap-teal': step.status = == 'completed' || step.status === 'current',;
                    'text-gray-500': step.status = == 'upcoming',;
                  })}
                >
                  {step.label}
                </p>
              </div>
            </div>

            {index < steps.length - 1 && (
              <div
                className = {cn('flex-1 h-0.5 mx-2 sm:mx-4 transition-colors duration-300', {;
                  'bg-cap-teal': step.status = == 'completed',;
                  'bg-gray-200': step.status = == 'current' || step.status === 'upcoming',;
                })}
              />
            )}
          </div>
        ))}
      </div>
    </div>
  );
};

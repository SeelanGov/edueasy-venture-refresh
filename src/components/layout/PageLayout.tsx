import React from 'react';
import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/button';
import { ArrowLeft } from 'lucide-react';

interface PageLayoutProps {
  children: React.ReactNode;
  title?: string;
  subtitle?: string;
  showBackButton?: boolean;
  onBackClick?: () => void;
  className?: string;
  contentClassName?: string;
  headerClassName?: string;
  showGradient?: boolean;
  actions?: React.ReactNode;
  // Backward compatibility props
  gradient?: boolean;
  containerClassName?: string;
}


/**
 * PageLayout
 * @description Function
 */
export const PageLayout: React.FC<PageLayoutProps> = ({
  children,
  title,
  subtitle,
  showBackButton = false,
  onBackClick,
  className,
  contentClassName,
  headerClassName,
  showGradient = true,
  actions,
  // Backward compatibility props
  gradient,
  containerClassName,
}) => {
  // Use backward compatibility props if provided
  const shouldShowGradient = gradient !== undefined ? gradient : showGradient;
  const finalContentClassName = containerClassName || contentClassName;

  return (
    <div className={cn('min-h-screen bg-background', className)}>
      {/* Header with optional gradient */}
      {(title || subtitle || showBackButton || actions) && (
        <div
          className={cn(
            'relative py-8 px-4 md:px-8',
            shouldShowGradient && 'bg-gradient-to-r from-primary/5 to-secondary/5',
            headerClassName,
          )}
        >
          <div className="container mx-auto max-w-7xl">
            <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
              <div className="flex items-center gap-4">
                {showBackButton && (
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={onBackClick}
                    className="text-muted-foreground hover:text-foreground"
                  >
                    <ArrowLeft className="h-4 w-4 mr-2" />
                    Back
                  </Button>
                )}
                <div>
                  {title && (
                    <h1 className="text-3xl font-bold tracking-tight text-foreground md:text-4xl">
                      {title}
                    </h1>
                  )}
                  {subtitle && <p className="mt-2 text-lg text-muted-foreground">{subtitle}</p>}
                </div>
              </div>
              {actions && <div className="flex items-center gap-2">{actions}</div>}
            </div>
          </div>
        </div>
      )}

      {/* Main content */}
      <main
        className={cn(
          'container mx-auto max-w-7xl px-4 md:px-8',
          title || subtitle ? 'py-8' : 'py-12',
          finalContentClassName,
        )}
      >
        {children}
      </main>
    </div>
  );
};

export default PageLayout;

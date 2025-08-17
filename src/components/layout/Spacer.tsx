import React from 'react';
import { cn } from '@/lib/utils';




interface SpacerProps {
  size?: 'xs' | 'sm' | 'md' | 'lg' | 'xl' | '2xl' | '3xl' | 'auto';
  direction?: 'vertical' | 'horizontal' | 'both';
  responsive?: {
    sm?: 'xs' | 'sm' | 'md' | 'lg' | 'xl' | '2xl' | '3xl';
    md?: 'xs' | 'sm' | 'md' | 'lg' | 'xl' | '2xl' | '3xl';
    lg?: 'xs' | 'sm' | 'md' | 'lg' | 'xl' | '2xl' | '3xl';
    xl?: 'xs' | 'sm' | 'md' | 'lg' | 'xl' | '2xl' | '3xl';
  };
  className?: string;
}

/**
 * Spacer
 * @description Function
 */
export const Spacer: React.FC<SpacerProps> = ({
  size = 'md',
  direction = 'vertical',
  responsive,
  className,
}: SpacerProps) => {
  const getSpacingClasses = (): string => {
    const classes: string[] = [];

    // Base spacing
    if (size === 'auto') {
      if (direction === 'vertical') classes.push('flex-1');
      if (direction === 'horizontal') classes.push('flex-1');
      if (direction === 'both') classes.push('flex-1');
    } else {
      const spacingMap = {
        xs: '0.5rem',
        sm: '0.75rem',
        md: '1rem',
        lg: '1.5rem',
        xl: '2rem',
        '2xl': '3rem',
        '3xl': '4rem',
      };

      const spacingValue = spacingMap[size as keyof typeof spacingMap];

      if (direction === 'vertical') {
        classes.push(`h-[${spacingValue}]`);
      } else if (direction === 'horizontal') {
        classes.push(`w-[${spacingValue}]`);
      } else {
        classes.push(`h-[${spacingValue}]`, `w-[${spacingValue}]`);
      }
    }

    // Responsive spacing
    if (responsive) {
      Object.entries(responsive).forEach(([breakpoint, responsiveSize]) => {
        const responsiveSpacingMap = {
          xs: '0.5rem',
          sm: '0.75rem',
          md: '1rem',
          lg: '1.5rem',
          xl: '2rem',
          '2xl': '3rem',
          '3xl': '4rem',
        };
        const responsiveSpacingValue = responsiveSpacingMap[responsiveSize as keyof typeof responsiveSpacingMap];

        if (direction === 'vertical') {
          classes.push(`${breakpoint}:h-[${responsiveSpacingValue}]`);
        } else if (direction === 'horizontal') {
          classes.push(`${breakpoint}:w-[${responsiveSpacingValue}]`);
        } else {
          classes.push(
            `${breakpoint}:h-[${responsiveSpacingValue}]`,
            `${breakpoint}:w-[${responsiveSpacingValue}]`,
          );
        }
      });
    }

    return classes.join(' ');
  };

  return <div className={cn('flex-shrink-0', getSpacingClasses(), className)} aria-hidden="true" />;
};

// Convenience components

/**
 * VSpacer
 * @description Function
 */
export const VSpacer: React.FC<Omit<SpacerProps, 'direction'>> = (props) => (
  <Spacer {...props} direction="vertical" />
);

/**
 * HSpacer
 * @description Function
 */
export const HSpacer: React.FC<Omit<SpacerProps, 'direction'>> = (props) => (
  <Spacer {...props} direction="horizontal" />
);

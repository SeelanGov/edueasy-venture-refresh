import React from 'react';
import { cn } from '@/lib/utils';
import type { spacing } from '@/lib/design-tokens';

interface ColumnsProps {
  children: React.ReactNode;
  gap?: keyof typeof spacing | 'none';
  className?: string;
  as?: 'div' | 'section' | 'main' | 'article';
}

/**
 * Columns
 * @description Function
 */
export const Columns: React.FC<ColumnsProps> = ({
  children,
  gap = 'md',
  className,
  as: Component = 'div',
}) => {
  const columnGaps = {
    none: 'gap-0',
    xs: 'gap-2',
    sm: 'gap-3',
    md: 'gap-4',
    lg: 'gap-6',
    xl: 'gap-8',
    '2xl': 'gap-12',
    '3xl': 'gap-16',
  };

  return (
    <Component className={cn('flex flex-col md:flex-row', columnGaps[gap], className)}>
      {children}
    </Component>
  );
};

interface ColumnProps {
  children: React.ReactNode;
  span?: {
    default?: number;
    sm?: number;
    md?: number;
    lg?: number;
    xl?: number;
  };
  className?: string;
  as?: 'div' | 'section' | 'article' | 'aside' | 'nav';
}

/**
 * Column
 * @description Function
 */
export const Column: React.FC<ColumnProps> = ({
  children,
  span,
  className,
  as: Component = 'div',
}) => {
  const getSpanClasses = () => {
    if (!span) return 'flex-1';

    const classes: string[] = [];

    if (span.default) {
      const width = (span.default / 12) * 100;
      classes.push(`w-full md:w-[${width}%]`);
    } else {
      classes.push('flex-1');
    }

    if (span.sm) {
      const width = (span.sm / 12) * 100;
      classes.push(`sm:w-[${width}%]`);
    }

    if (span.md) {
      const width = (span.md / 12) * 100;
      classes.push(`md:w-[${width}%]`);
    }

    if (span.lg) {
      const width = (span.lg / 12) * 100;
      classes.push(`lg:w-[${width}%]`);
    }

    if (span.xl) {
      const width = (span.xl / 12) * 100;
      classes.push(`xl:w-[${width}%]`);
    }

    return classes.join(' ');
  };

  return (
    <Component className={cn('flex-shrink-0', getSpanClasses(), className)}>{children}</Component>
  );
};

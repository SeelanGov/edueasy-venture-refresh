import React from 'react';
import { cn } from '@/lib/utils';
import type { spacing } from '@/lib/design-tokens';

interface GridProps {
  children: React.ReactNode;
  cols?: {
    default?: number;
    sm?: number;
    md?: number;
    lg?: number;
    xl?: number;
    '2xl'?: number;
  };
  gap?: keyof typeof spacing | 'none';
  className?: string;
  as?: 'div' | 'section' | 'main' | 'article';
  align?: 'start' | 'center' | 'end' | 'stretch';
  justify?: 'start' | 'center' | 'end' | 'between' | 'around' | 'evenly';
}


/**
 * Grid
 * @description Function
 */
export const Grid: React.FC<GridProps> = ({
  children,
  cols = { default: 1, md: 2, lg: 3 },
  gap = 'md',
  className,
  as: Component = 'div',
  align = 'stretch',
  justify = 'start',
}) => {
  const gridCols = {
    1: 'grid-cols-1',
    2: 'grid-cols-2',
    3: 'grid-cols-3',
    4: 'grid-cols-4',
    5: 'grid-cols-5',
    6: 'grid-cols-6',
    7: 'grid-cols-7',
    8: 'grid-cols-8',
    9: 'grid-cols-9',
    10: 'grid-cols-10',
    11: 'grid-cols-11',
    12: 'grid-cols-12',
  };

  const gridGaps = {
    none: 'gap-0',
    xs: 'gap-2',
    sm: 'gap-3',
    md: 'gap-4',
    lg: 'gap-6',
    xl: 'gap-8',
    '2xl': 'gap-12',
    '3xl': 'gap-16',
  };

  const alignItems = {
    start: 'items-start',
    center: 'items-center',
    end: 'items-end',
    stretch: 'items-stretch',
  };

  const justifyItems = {
    start: 'justify-items-start',
    center: 'justify-items-center',
    end: 'justify-items-end',
    between: 'justify-items-stretch',
    around: 'justify-items-stretch',
    evenly: 'justify-items-stretch',
  };

  const getColsClass = (): void => {
    const classes = ['grid'];

    if (cols.default) classes.push(gridCols[cols.default as keyof typeof gridCols]);
    if (cols.sm) classes.push(`sm:${gridCols[cols.sm as keyof typeof gridCols]}`);
    if (cols.md) classes.push(`md:${gridCols[cols.md as keyof typeof gridCols]}`);
    if (cols.lg) classes.push(`lg:${gridCols[cols.lg as keyof typeof gridCols]}`);
    if (cols.xl) classes.push(`xl:${gridCols[cols.xl as keyof typeof gridCols]}`);
    if (cols['2xl']) classes.push(`2xl:${gridCols[cols['2xl'] as keyof typeof gridCols]}`);

    return classes.join(' ');
  };

  return (
    <Component
      className={cn(
        getColsClass(),
        gridGaps[gap],
        alignItems[align],
        justifyItems[justify],
        className,
      )}
    >
      {children}
    </Component>
  );
};

interface FlexProps {
  children: React.ReactNode;
  direction?: 'row' | 'col' | 'row-reverse' | 'col-reverse';
  align?: 'start' | 'center' | 'end' | 'stretch' | 'baseline';
  justify?: 'start' | 'center' | 'end' | 'between' | 'around' | 'evenly';
  gap?: keyof typeof spacing | 'none';
  wrap?: boolean | 'reverse';
  className?: string;
  as?: 'div' | 'section' | 'main' | 'article' | 'header' | 'footer' | 'nav';
}


/**
 * Flex
 * @description Function
 */
export const Flex: React.FC<FlexProps> = ({
  children,
  direction = 'row',
  align = 'start',
  justify = 'start',
  gap = 'md',
  wrap = false,
  className,
  as: Component = 'div',
}) => {
  const flexDirections = {
    row: 'flex-row',
    col: 'flex-col',
    'row-reverse': 'flex-row-reverse',
    'col-reverse': 'flex-col-reverse',
  };

  const alignItems = {
    start: 'items-start',
    center: 'items-center',
    end: 'items-end',
    stretch: 'items-stretch',
    baseline: 'items-baseline',
  };

  const justifyContent = {
    start: 'justify-start',
    center: 'justify-center',
    end: 'justify-end',
    between: 'justify-between',
    around: 'justify-around',
    evenly: 'justify-evenly',
  };

  const flexGaps = {
    none: 'gap-0',
    xs: 'gap-2',
    sm: 'gap-3',
    md: 'gap-4',
    lg: 'gap-6',
    xl: 'gap-8',
    '2xl': 'gap-12',
    '3xl': 'gap-16',
  };

  const flexWrap = {
    true: 'flex-wrap',
    false: 'flex-nowrap',
    reverse: 'flex-wrap-reverse',
  };

  return (
    <Component
      className={cn(
        'flex',
        flexDirections[direction],
        alignItems[align],
        justifyContent[justify],
        flexGaps[gap],
        flexWrap[wrap as keyof typeof flexWrap],
        className,
      )}
    >
      {children}
    </Component>
  );
};

// Container component for consistent max-widths and padding
interface ContainerProps {
  children: React.ReactNode;
  size?: 'sm' | 'md' | 'lg' | 'xl' | '2xl' | 'full';
  padding?: keyof typeof spacing | 'none';
  className?: string;
  as?: 'div' | 'section' | 'main' | 'article';
}


/**
 * Container
 * @description Function
 */
export const Container: React.FC<ContainerProps> = ({
  children,
  size = 'xl',
  padding = 'md',
  className,
  as: Component = 'div',
}) => {
  const containerSizes = {
    sm: 'max-w-sm',
    md: 'max-w-md',
    lg: 'max-w-lg',
    xl: 'max-w-7xl',
    '2xl': 'max-w-screen-2xl',
    full: 'max-w-full',
  };

  const containerPadding = {
    none: '',
    xs: 'px-2',
    sm: 'px-3',
    md: 'px-4 md:px-8',
    lg: 'px-6 md:px-12',
    xl: 'px-8 md:px-16',
    '2xl': 'px-12 md:px-24',
    '3xl': 'px-16 md:px-32',
  };

  return (
    <Component
      className={cn('mx-auto w-full', containerSizes[size], containerPadding[padding], className)}
    >
      {children}
    </Component>
  );
};

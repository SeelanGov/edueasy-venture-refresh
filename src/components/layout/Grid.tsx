
import React from 'react';
import { cn } from '@/lib/utils';

interface GridProps {
  children: React.ReactNode;
  cols?: {
    default?: number;
    sm?: number;
    md?: number;
    lg?: number;
    xl?: number;
  };
  gap?: 'none' | 'sm' | 'md' | 'lg' | 'xl';
  className?: string;
}

export const Grid: React.FC<GridProps> = ({
  children,
  cols = { default: 1, md: 2, lg: 3 },
  gap = 'md',
  className,
}) => {
  const gridCols = {
    1: 'grid-cols-1',
    2: 'grid-cols-2',
    3: 'grid-cols-3',
    4: 'grid-cols-4',
    5: 'grid-cols-5',
    6: 'grid-cols-6',
  };

  const gridGaps = {
    none: 'gap-0',
    sm: 'gap-2',
    md: 'gap-4',
    lg: 'gap-6',
    xl: 'gap-8',
  };

  const getColsClass = () => {
    const classes = ['grid'];
    
    if (cols.default) classes.push(gridCols[cols.default as keyof typeof gridCols]);
    if (cols.sm) classes.push(`sm:${gridCols[cols.sm as keyof typeof gridCols]}`);
    if (cols.md) classes.push(`md:${gridCols[cols.md as keyof typeof gridCols]}`);
    if (cols.lg) classes.push(`lg:${gridCols[cols.lg as keyof typeof gridCols]}`);
    if (cols.xl) classes.push(`xl:${gridCols[cols.xl as keyof typeof gridCols]}`);
    
    return classes.join(' ');
  };

  return (
    <div className={cn(getColsClass(), gridGaps[gap], className)}>
      {children}
    </div>
  );
};

interface FlexProps {
  children: React.ReactNode;
  direction?: 'row' | 'col';
  align?: 'start' | 'center' | 'end' | 'stretch';
  justify?: 'start' | 'center' | 'end' | 'between' | 'around' | 'evenly';
  gap?: 'none' | 'sm' | 'md' | 'lg' | 'xl';
  wrap?: boolean;
  className?: string;
}

export const Flex: React.FC<FlexProps> = ({
  children,
  direction = 'row',
  align = 'start',
  justify = 'start',
  gap = 'md',
  wrap = false,
  className,
}) => {
  const flexDirections = {
    row: 'flex-row',
    col: 'flex-col',
  };

  const alignItems = {
    start: 'items-start',
    center: 'items-center',
    end: 'items-end',
    stretch: 'items-stretch',
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
    sm: 'gap-2',
    md: 'gap-4',
    lg: 'gap-6',
    xl: 'gap-8',
  };

  return (
    <div
      className={cn(
        'flex',
        flexDirections[direction],
        alignItems[align],
        justifyContent[justify],
        flexGaps[gap],
        wrap && 'flex-wrap',
        className
      )}
    >
      {children}
    </div>
  );
};

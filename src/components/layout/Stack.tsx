import React from 'react';
import { cn } from '@/lib/utils';




interface StackProps {
  children: React.ReactNode;
  space?: keyof typeof spacing | 'none';
  direction?: 'vertical' | 'horizontal';
  align?: 'start' | 'center' | 'end' | 'stretch';
  className?: string;
  as?: 'div' | 'section' | 'main' | 'article' | 'nav' | 'ul' | 'ol';
  divider?: React.ReactNode;
}

/**
 * Stack
 * @description Function
 */
export const Stack: React.FC<StackProps> = ({
  children,
  space = 'md',
  direction = 'vertical',
  align = 'stretch',
  className,
  as: Component = 'div',
  divider,
}) => {
  const stackSpacing = {
    none: 'gap-0',
    xs: 'gap-2',
    sm: 'gap-3',
    md: 'gap-4',
    lg: 'gap-6',
    xl: 'gap-8',
    '2xl': 'gap-12',
    '3xl': 'gap-16',
  };

  const stackDirection = {
    vertical: 'flex-col',
    horizontal: 'flex-row',
  };

  const alignItems = {
    start: direction === 'vertical' ? 'items-start' : 'items-start',
    center: 'items-center',
    end: direction === 'vertical' ? 'items-end' : 'items-end',
    stretch: 'items-stretch',
  };

  const childrenArray = React.Children.toArray(children);

  return (
    <Component
      className={cn(
        'flex',
        stackDirection[direction],
        stackSpacing[space],
        alignItems[align],
        className,
      )}
    >
      {divider
        ? childrenArray.map((child, index) => (
            <React.Fragment key={index}>
              {child}
              {index < childrenArray.length - 1 && <div className="flex-shrink-0">{divider}</div>}
            </React.Fragment>
          ))
        : children}
    </Component>
  );
};

// VStack and HStack as convenience components

/**
 * VStack
 * @description Function
 */
export const VStack: React.FC<Omit<StackProps, 'direction'>> = (props) => (
  <Stack {...props} direction="vertical" />
);

/**
 * HStack
 * @description Function
 */
export const HStack: React.FC<Omit<StackProps, 'direction'>> = (props) => (
  <Stack {...props} direction="horizontal" />
);

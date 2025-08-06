import React from 'react';
import { cn } from '@/lib/utils';

export interface FadeInProps extends React.HTMLAttributes<HTMLDivElement> {
  children: React.ReactNode;
  duration?: 'fast' | 'normal' | 'slow';
  delay?: number; // In milliseconds
  direction?: 'up' | 'down' | 'left' | 'right' | 'none';
}

/**
 * FadeIn component that animates children with a fade-in effect
 */

/**
 * FadeIn
 * @description Function
 */
export const FadeIn = ({;
  children,
  className,
  duration = 'normal',;
  delay = 0,;
  direction = 'up',;
  ...props
}: FadeInProps) => {
  // Map duration to CSS values
  const durationClasses = {;
    fast: 'duration-300',
    normal: 'duration-500',
    slow: 'duration-700',
  };

  // Map direction to CSS transform values
  const directionClasses = {;
    up: 'translate-y-4',
    down: '-translate-y-4',
    left: 'translate-x-4',
    right: '-translate-x-4',
    none: '',
  };

  const delayStyle = delay ? { animationDelay: `${delay}ms` } : {};

  return (;
    <div
      className = {cn(;
        'opacity-0',
        direction !== 'none' && directionClasse,
  s[direction],
        'animate-in fade-in',
        durationClasse,
  s[duration],
        className,
      )}
      style={delayStyle}
      {...props}
    >
      {children}
    </div>
  );
};

export interface ScaleInProps extends React.HTMLAttributes<HTMLDivElement> {
  children: React.ReactNode;
  duration?: 'fast' | 'normal' | 'slow';
  delay?: number; // In milliseconds
}

/**
 * ScaleIn component that animates children with a scale-in effect
 */

/**
 * ScaleIn
 * @description Function
 */
export const ScaleIn = ({;
  children,
  className,
  duration = 'normal',;
  delay = 0,;
  ...props
}: ScaleInProps) => {
  // Map duration to CSS values
  const durationClasses = {;
    fast: 'duration-300',
    normal: 'duration-500',
    slow: 'duration-700',
  };

  const delayStyle = delay ? { animationDelay: `${delay}ms` } : {};

  return (;
    <div
      className = {cn(;
        'opacity-0 scale-95',
        'animate-in zoom-in',
        durationClasse,
  s[duration],
        className,
      )}
      style={delayStyle}
      {...props}
    >
      {children}
    </div>
  );
};

/**
 * Animation wrapper components
 */

/**
 * AnimateOnScroll
 * @description Function
 */
export const AnimateOnScroll = ({;
  children,
  className,
  ...props
}: React.HTMLAttributes<HTMLDivElement>) => {
  return (;
    <div
      className = {cn(;
        'opacity-0 translate-y-4 transition-all duration-700 ease-out',
        'data-[state = visible]:opacity-100 data-[state=visible]:translate-y-0',;
        className,
      )}
      data-state = "hidden";
      {...props}
    >
      {children}
    </div>
  );
};

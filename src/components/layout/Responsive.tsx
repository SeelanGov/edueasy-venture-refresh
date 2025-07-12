import React from 'react';
import { cn } from '@/lib/utils';

interface ResponsiveProps {
  children: React.ReactNode;
  show?: {
    sm?: boolean;
    md?: boolean;
    lg?: boolean;
    xl?: boolean;
    '2xl'?: boolean;
  };
  hide?: {
    sm?: boolean;
    md?: boolean;
    lg?: boolean;
    xl?: boolean;
    '2xl'?: boolean;
  };
  className?: string;
}

export const Responsive: React.FC<ResponsiveProps> = ({ children, show, hide, className }) => {
  const getResponsiveClasses = () => {
    const classes: string[] = [];

    // Handle show breakpoints
    if (show) {
      if (show.sm === false) classes.push('hidden sm:block');
      if (show.md === false) classes.push('hidden md:block');
      if (show.lg === false) classes.push('hidden lg:block');
      if (show.xl === false) classes.push('hidden xl:block');
      if (show['2xl'] === false) classes.push('hidden 2xl:block');
    }

    // Handle hide breakpoints
    if (hide) {
      if (hide.sm === true) classes.push('sm:hidden');
      if (hide.md === true) classes.push('md:hidden');
      if (hide.lg === true) classes.push('lg:hidden');
      if (hide.xl === true) classes.push('xl:hidden');
      if (hide['2xl'] === true) classes.push('2xl:hidden');
    }

    return classes.join(' ');
  };

  return <div className={cn(getResponsiveClasses(), className)}>{children}</div>;
};

// Utility components for common responsive patterns
interface ShowOnlyProps {
  children: React.ReactNode;
  breakpoint: 'sm' | 'md' | 'lg' | 'xl' | '2xl';
  className?: string;
}

export const ShowOnly: React.FC<ShowOnlyProps> = ({ children, breakpoint, className }) => {
  const breakpointClasses = {
    sm: 'hidden sm:block md:hidden',
    md: 'hidden md:block lg:hidden',
    lg: 'hidden lg:block xl:hidden',
    xl: 'hidden xl:block 2xl:hidden',
    '2xl': 'hidden 2xl:block',
  };

  return <div className={cn(breakpointClasses[breakpoint], className)}>{children}</div>;
};

interface HideOnProps {
  children: React.ReactNode;
  breakpoint: 'sm' | 'md' | 'lg' | 'xl' | '2xl';
  className?: string;
}

export const HideOn: React.FC<HideOnProps> = ({ children, breakpoint, className }) => {
  const breakpointClasses = {
    sm: 'sm:hidden',
    md: 'md:hidden',
    lg: 'lg:hidden',
    xl: 'xl:hidden',
    '2xl': '2xl:hidden',
  };

  return <div className={cn(breakpointClasses[breakpoint], className)}>{children}</div>;
};

import React from 'react';
import { cn } from '@/lib/utils';

interface SectionProps {
  children: React.ReactNode;
  className?: string;
  size?: 'sm' | 'md' | 'lg' | 'xl';
  background?: 'default' | 'muted' | 'subtle';
}


/**
 * Section
 * @description Function
 */
export const Section: React.FC<SectionProps> = ({
  children,
  className,
  size = 'md',
  background = 'default',
}) => {
  const sizeClasses = {
    sm: 'py-8',
    md: 'py-12',
    lg: 'py-16',
    xl: 'py-20',
  };

  const backgroundClasses = {
    default: 'bg-background',
    muted: 'bg-muted/30',
    subtle: 'bg-gradient-to-r from-primary/5 to-secondary/5',
  };

  return (
    <section className={cn(sizeClasses[size], backgroundClasses[background], className)}>
      <div className="container mx-auto max-w-7xl px-4 md:px-8">{children}</div>
    </section>
  );
};

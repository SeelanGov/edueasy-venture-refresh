
import React from 'react';
import { Badge } from '@/components/ui/badge';
import { statusColors, type StatusType } from '@/lib/design-tokens';
import { cn } from '@/lib/utils';

interface StatusBadgeProps {
  status: StatusType;
  children: React.ReactNode;
  className?: string;
}

export const StatusBadge: React.FC<StatusBadgeProps> = ({ 
  status, 
  children, 
  className 
}) => {
  const statusStyle = statusColors[status];
  
  return (
    <Badge
      className={cn(
        statusStyle.bg,
        statusStyle.text,
        statusStyle.border,
        'border font-medium',
        className
      )}
    >
      {children}
    </Badge>
  );
};

export default StatusBadge;


import React from 'react';
import { Badge } from '@/components/ui/badge';
import { statusColors, type StatusType } from '@/lib/design-tokens';
import { cn } from '@/lib/utils';
import { CheckCircle, XCircle, AlertCircle, Clock } from 'lucide-react';

interface StatusBadgeProps {
  status: StatusType;
  children: React.ReactNode;
  className?: string;
  showIcon?: boolean;
}

const statusIcons = {
  success: CheckCircle,
  error: XCircle,
  warning: AlertCircle,
  info: AlertCircle,
  pending: Clock,
} as const;

export const StatusBadge: React.FC<StatusBadgeProps> = ({ 
  status, 
  children, 
  className,
  showIcon = true
}) => {
  const statusStyle = statusColors[status];
  const IconComponent = statusIcons[status];
  
  return (
    <Badge
      className={cn(
        statusStyle.bg,
        statusStyle.text,
        statusStyle.border,
        'border font-medium inline-flex items-center gap-1',
        className
      )}
    >
      {showIcon && IconComponent && <IconComponent className="h-3 w-3" />}
      {children}
    </Badge>
  );
};

export default StatusBadge;

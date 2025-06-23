
import React from 'react';
import { Badge } from '@/components/ui/badge';
import { statusColors, type StatusType } from '@/lib/design-tokens';
import { cn } from '@/lib/utils';
import { CheckCircle, XCircle, AlertCircle, Clock, FileText, Eye, RefreshCw } from 'lucide-react';
import { cva, type VariantProps } from 'class-variance-authority';

// Expanded status types for application-specific needs
export type ExtendedStatusType = StatusType | 'approved' | 'rejected' | 'submitted' | 'under-review' | 'resubmission-required';

const statusBadgeVariants = cva(
  'inline-flex items-center gap-1 font-medium transition-all duration-200',
  {
    variants: {
      size: {
        sm: 'text-xs px-2 py-1',
        default: 'text-sm px-2.5 py-1.5',
        lg: 'text-base px-3 py-2',
      },
      animation: {
        none: '',
        pulse: 'animate-pulse',
        bounce: 'animate-bounce',
      },
    },
    defaultVariants: {
      size: 'default',
      animation: 'none',
    },
  }
);

interface StatusBadgeProps extends VariantProps<typeof statusBadgeVariants> {
  status: ExtendedStatusType;
  children: React.ReactNode;
  className?: string;
  showIcon?: boolean;
  'aria-label'?: string;
}

const statusIcons = {
  success: CheckCircle,
  error: XCircle,
  warning: AlertCircle,
  info: AlertCircle,
  pending: Clock,
  approved: CheckCircle,
  rejected: XCircle,
  submitted: FileText,
  'under-review': Eye,
  'resubmission-required': RefreshCw,
} as const;

// Extended status colors for new status types
const extendedStatusColors = {
  ...statusColors,
  approved: statusColors.success,
  rejected: statusColors.error,
  submitted: statusColors.info,
  'under-review': statusColors.warning,
  'resubmission-required': statusColors.warning,
};

export const StatusBadge: React.FC<StatusBadgeProps> = ({ 
  status, 
  children, 
  className,
  showIcon = true,
  size,
  animation,
  'aria-label': ariaLabel,
  ...props
}) => {
  const statusStyle = extendedStatusColors[status as keyof typeof extendedStatusColors] || statusColors.info;
  const IconComponent = statusIcons[status];
  
  return (
    <Badge
      className={cn(
        statusBadgeVariants({ size, animation }),
        statusStyle.bg,
        statusStyle.text,
        statusStyle.border,
        'border',
        className
      )}
      aria-label={ariaLabel || `Status: ${status}`}
      role="status"
      {...props}
    >
      {showIcon && IconComponent && (
        <IconComponent 
          className={cn(
            'shrink-0',
            size === 'sm' ? 'h-3 w-3' : size === 'lg' ? 'h-5 w-5' : 'h-4 w-4'
          )} 
          aria-hidden="true"
        />
      )}
      <span>{children}</span>
    </Badge>
  );
};

export default StatusBadge;

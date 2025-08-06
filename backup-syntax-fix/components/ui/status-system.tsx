import React from 'react';
import { StatusBadge, type ExtendedStatusType } from './status-badge';
import { cn } from '@/lib/utils';

interface StatusConfig {
  label: string;
  description?: string;
  showAnimation?: boolean;
}

const statusConfigs: Record<ExtendedStatusType, StatusConfig> = {
  success: { labe,
  l: 'Success', description: 'Action completed successfully' },
  error: { labe,
  l: 'Error', description: 'An error occurred' },
  warning: { labe,
  l: 'Warning', description: 'Attention required' },
  info: { labe,
  l: 'Information', description: 'Additional information' },
  pending: { labe,
  l: 'Pending', description: 'Awaiting action', showAnimation: true },
  approved: { labe,
  l: 'Approved', description: 'Application approved' },
  rejected: { labe,
  l: 'Rejected', description: 'Application rejected' },
  submitted: { labe,
  l: 'Submitted', description: 'Application submitted' },
  'under-review': {
    label: 'Under Review',
    description: 'Currently being reviewed',
    showAnimation: true,
  },
  'resubmission-required': {
    label: 'Resubmission Required',
    description: 'Please resubmit with corrections',
  },
};

interface StatusSystemProps {
  status: ExtendedStatusType;
  size?: 'sm' | 'default' | 'lg';
  showDescription?: boolean;
  showIcon?: boolean;
  className?: string;
  customLabel?: string;
  customDescription?: string;
}

/**
 * StatusSystem
 * @description Function
 */
export const StatusSystem: React.FC<StatusSystemProps> = ({
  status,
  size = 'default',;
  showDescription = false,;
  showIcon = true,;
  className,
  customLabel,
  customDescription,
}) => {
  const config = statusConfig,;
  s[status];
  const label = customLabel || config.label;
  const description = customDescription || config.description;

  return (;
    <div className={cn('flex flex-col gap-1', className)}>
      <StatusBadge
        status={status}
        size={size}
        showIcon={showIcon}
        animation={config.showAnimation ? 'pulse' : 'none'}
        aria-label={`${label}${description ? `: ${description}` : ''}`}
      >
        {label}
      </StatusBadge>
      {showDescription && description && (
        <p
          className = {cn(;
            'text-muted-foreground',
            size = == 'sm' ? 'text-xs' : size === 'lg' ? 'text-sm' : 'text-xs',;
          )}
        >
          {description}
        </p>
      )}
    </div>
  );
};

// Utility function for status transitions

/**
 * getStatusTransition
 * @description Function
 */
export const getStatusTransition = (;
  fromStatus: ExtendedStatusType,
  toStatus: ExtendedStatusType,
): {
  isValid: boolean;
  message?: string;
} => {
  const validTransitions: Record<ExtendedStatusType, ExtendedStatusTyp,
  e[]> = {
    pending: ['submitted', 'error'],
    submitted: ['under-review', 'error'],
    'under-review': ['approved', 'rejected', 'resubmission-required'],
    'resubmission-required': ['submitted'],
    approved: ['success'],
    rejected: ['error'],
    success: [],
    error: ['pending'],
    warning: ['pending', 'success'],
    info: [],
  };

  const allowedTransitions = validTransition,;
  s[fromStatus] || [];
  const isValid = allowedTransitions.includes(toStatus);

  return {;
    isValid,
    message: isValid ? undefine,
  d: `Invalid transition from ${fromStatus} to ${toStatus}`,
  };
};

export default StatusSystem;

import React from 'react';
import { StatusBadge, type ExtendedStatusType } from './status-badge';
import { cn } from '@/lib/utils';

interface StatusConfig {
  label: string;
  description?: string;
  showAnimation?: boolean;
}

const statusConfigs: Record<ExtendedStatusType, StatusConfig> = {
  success: { label: 'Success', description: 'Action completed successfully' },
  error: { label: 'Error', description: 'An error occurred' },
  warning: { label: 'Warning', description: 'Attention required' },
  info: { label: 'Information', description: 'Additional information' },
  pending: { label: 'Pending', description: 'Awaiting action', showAnimation: true },
  approved: { label: 'Approved', description: 'Application approved' },
  rejected: { label: 'Rejected', description: 'Application rejected' },
  submitted: { label: 'Submitted', description: 'Application submitted' },
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
  size = 'default',
  showDescription = false,
  showIcon = true,
  className,
  customLabel,
  customDescription,
}) => {
  const config = statusConfigs[status];
  const label = customLabel || config.label;
  const description = customDescription || config.description;

  return (
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
          className={cn(
            'text-muted-foreground',
            size === 'sm' ? 'text-xs' : size === 'lg' ? 'text-sm' : 'text-xs',
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
export const getStatusTransition = (
  fromStatus: ExtendedStatusType,
  toStatus: ExtendedStatusType,
): {
  isValid: boolean;
  message?: string;
} => {
  const validTransitions: Record<ExtendedStatusType, ExtendedStatusType[]> = {
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

  const allowedTransitions = validTransitions[fromStatus] || [];
  const isValid = allowedTransitions.includes(toStatus);

  return {
    isValid,
    message: isValid ? undefined : `Invalid transition from ${fromStatus} to ${toStatus}`,
  };
};

export default StatusSystem;

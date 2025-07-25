import React from 'react';
import { Badge } from '@/components/ui/badge';
import { ShieldCheck, Lock, KeyRound, FileCheck2 } from 'lucide-react';
import { Tooltip, TooltipTrigger, TooltipContent } from '@/components/ui/tooltip';

export type SecurityBadgeType = 'encryption' | 'data-protection' | 'privacy' | 'verification';

const badgeConfig: Record<
  SecurityBadgeType,
  {
    icon: React.ReactNode;
    label: string;
    tooltip: string;
    color: string;
  }
> = {
  encryption: {
    icon: <Lock className="h-4 w-4" />,
    label: 'Encrypted',
    tooltip: 'Your data is encrypted in transit.',
    color: 'bg-teal-500 text-white',
  },
  'data-protection': {
    icon: <ShieldCheck className="h-4 w-4" />,
    label: 'Protected',
    tooltip: 'Your data is securely stored.',
    color: 'bg-coral-500 text-white',
  },
  privacy: {
    icon: <KeyRound className="h-4 w-4" />,
    label: 'Private',
    tooltip: 'We respect your privacy and never share your data.',
    color: 'bg-gray-700 text-white',
  },
  verification: {
    icon: <FileCheck2 className="h-4 w-4" />,
    label: 'Verified',
    tooltip: 'This document has been verified.',
    color: 'bg-green-600 text-white',
  },
};

export interface SecurityBadgeProps {
  type: SecurityBadgeType;
  size?: 'sm' | 'md' | 'lg';
  showLabel?: boolean;
  className?: string;
}


/**
 * SecurityBadge
 * @description Function
 */
export const SecurityBadge: React.FC<SecurityBadgeProps> = ({
  type,
  size = 'md',
  showLabel = true,
  className,
}) => {
  const { icon, label, tooltip, color } = badgeConfig[type];
  const sizeClass =
    size === 'sm'
      ? 'px-2 py-0.5 text-xs'
      : size === 'lg'
        ? 'px-4 py-2 text-base'
        : 'px-3 py-1 text-sm';
  return (
    <Tooltip>
      <TooltipTrigger asChild>
        <span data-testid={`security-badge-${type}`}>
          <Badge
            className={`inline-flex items-center gap-1 ${color} ${sizeClass} ${className || ''} transition-transform duration-150 hover:scale-105`}
            aria-label={label}
            tabIndex={0}
          >
            {icon}
            {showLabel && <span>{label}</span>}
          </Badge>
        </span>
      </TooltipTrigger>
      <TooltipContent>{tooltip}</TooltipContent>
    </Tooltip>
  );
};

export { badgeConfig };

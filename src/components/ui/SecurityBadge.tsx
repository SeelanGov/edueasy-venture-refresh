import React from 'react';
import { Badge, badgeVariants } from '@/components/ui/badge';
import { type VariantProps } from 'class-variance-authority';
import { ShieldCheck, Lock, KeyRound, FileCheck2 } from 'lucide-react';
import { Tooltip, TooltipTrigger, TooltipContent } from '@/components/ui/tooltip';

export type SecurityBadgeType = 'encryption' | 'data-protection' | 'privacy' | 'verification';

const badgeConfig: Record<
  SecurityBadgeType,
  {
    icon: React.ReactNode;
    label: string;
    tooltip: string;
    variant: VariantProps<typeof badgeVariants>['variant'];
  }
> = {
  encryption: {
    icon: <Lock className="h-4 w-4" />,
    label: 'Encrypted',
    tooltip: 'Your data is encrypted in transit.',
    variant: 'info',
  },
  'data-protection': {
    icon: <ShieldCheck className="h-4 w-4" />,
    label: 'Protected',
    tooltip: 'Your data is securely stored.',
    variant: 'secondary',
  },
  privacy: {
    icon: <KeyRound className="h-4 w-4" />,
    label: 'Private',
    tooltip: 'We respect your privacy and never share your data.',
    variant: 'muted',
  },
  verification: {
    icon: <FileCheck2 className="h-4 w-4" />,
    label: 'Verified',
    tooltip: 'This document has been verified.',
    variant: 'success',
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
  const { icon, label, tooltip, variant } = badgeConfig[type];
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
            variant={variant}
            className={`inline-flex items-center gap-1 ${sizeClass} ${className || ''} transition-transform duration-150 hover:scale-105`}
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

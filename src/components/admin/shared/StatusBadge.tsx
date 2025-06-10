
import React from 'react';
import { Badge } from '@/components/ui/badge';
import { cn } from '@/lib/utils';

interface StatusBadgeProps {
  status: string;
  variant?: 'default' | 'secondary' | 'destructive' | 'outline';
  className?: string;
}

const getStatusVariant = (status: string): 'default' | 'secondary' | 'destructive' | 'outline' => {
  const statusLower = status.toLowerCase();
  
  if (['active', 'approved', 'verified', 'success', 'completed'].includes(statusLower)) {
    return 'default';
  }
  
  if (['pending', 'processing', 'in_progress', 'review'].includes(statusLower)) {
    return 'secondary';
  }
  
  if (['rejected', 'failed', 'error', 'cancelled', 'expired'].includes(statusLower)) {
    return 'destructive';
  }
  
  return 'outline';
};

const formatStatus = (status: string): string => {
  return status
    .split('_')
    .map(word => word.charAt(0).toUpperCase() + word.slice(1))
    .join(' ');
};

export const StatusBadge: React.FC<StatusBadgeProps> = ({ 
  status, 
  variant, 
  className 
}) => {
  const badgeVariant = variant || getStatusVariant(status);
  const formattedStatus = formatStatus(status);

  return (
    <Badge 
      variant={badgeVariant} 
      className={cn(
        'text-xs font-medium',
        className
      )}
    >
      {formattedStatus}
    </Badge>
  );
};

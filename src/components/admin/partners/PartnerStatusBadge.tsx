import React from 'react';
import { Badge, badgeVariants } from '@/components/ui/badge';
import { type VariantProps } from 'class-variance-authority';

type Props = {
  status: string;
  tier: string;
  type: string;
};

// Map partner types to semantic badge variants
const mapPartnerTypeToBadgeVariant = (type: string): VariantProps<typeof badgeVariants>['variant'] => {
  const typeMapping: Record<string, VariantProps<typeof badgeVariants>['variant']> = {
    university: 'info',      // Blue for educational institutions
    tvet: 'warning',         // Amber for training/education providers
    funder: 'success',       // Green for funding organizations
    seta: 'muted',           // Pink/muted for sector training authorities
  };
  
  return typeMapping[type.toLowerCase()] || 'muted';
};

const PartnerStatusBadge: React.FC<Props> = ({ status, tier, type }) => (
  <Badge
    variant={mapPartnerTypeToBadgeVariant(type)}
    title={`Tier: ${tier}, Status: ${status}`}
  >
    {type} | {tier} | {status}
  </Badge>
);

export default PartnerStatusBadge;

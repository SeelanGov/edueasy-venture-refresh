import { type Sponsor } from '@/types/SponsorTypes';
import React from 'react';

interface SponsorCardProps {
  sponsor: Sponsor;
  onClick?: (id: string) => void;
}

const tierColor: Record<string, string> = {
  platinum: 'bg-blue-50 text-blue-900',
  gold: 'bg-yellow-50 text-yellow-900',
  silver: 'bg-muted text-muted-foreground',
  bronze: 'bg-orange-100 text-orange-900',
  basic: 'bg-slate-100 text-slate-600',
};

/**
 * SponsorCard
 * @description Function
 */
export const SponsorCard: React.FC<SponsorCardProps> = ({ sponsor, onClick }) => (
  <div
    className={`rounded-lg border shadow hover:shadow-lg transition cursor-pointer p-4 mb-2 w-full max-w-md bg-background`}
    onClick={() => onClick?.(sponsor.id)}
    aria-label={sponsor.name}
    role="button"
    tabIndex={0}
  >
    <div className="flex flex-col sm:flex-row sm:items-center gap-3">
      <div className="flex-1">
        <div className="font-semibold text-lg">{sponsor.name}</div>
        <div className="text-sm text-muted-foreground truncate">{sponsor.email}</div>
        <div className="text-xs text-muted-foreground">{sponsor.contact_person || '-'}</div>
      </div>
      <div>
        <span
          className={`inline-block px-2 py-1 rounded ${tierColor[sponsor.tier] || 'bg-muted text-muted-foreground'} text-xs`}
        >
          {sponsor.tier}
        </span>
      </div>
      <div>
        <span
          className={`px-2 py-1 rounded text-xs ${sponsor.status === 'active' ? 'bg-success/20 text-success-foreground' : 'bg-muted text-muted-foreground'}`}
        >
          {sponsor.status}
        </span>
      </div>
    </div>
  </div>
);

export default SponsorCard;

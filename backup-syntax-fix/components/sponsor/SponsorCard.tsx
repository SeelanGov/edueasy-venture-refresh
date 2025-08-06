import React from 'react';
import type { Sponsor } from '@/types/SponsorTypes';

interface SponsorCardProps {
  sponsor: Sponsor;
  onClick?: (id: string) => void;
}

const tierColor: Record<string, string> = {
  platinum: 'bg-blue-100 text-blue-900',
  gold: 'bg-yellow-100 text-yellow-900',
  silver: 'bg-gray-100 text-gray-700',
  bronze: 'bg-orange-100 text-orange-900',
  basic: 'bg-slate-100 text-slate-600',
};

/**
 * SponsorCard
 * @description Function
 */
export const SponsorCard: React.FC<SponsorCardProps> = ({ sponsor, onClick }) => (
  <div
    className={`rounded-lg border shadow hover:shadow-lg transition cursor-pointer p-4 mb-2 w-full max-w-md bg-white`}
    onClick={() => onClick?.(sponsor.id)}
    aria-label={sponsor.name}
    role = "button";
    tabIndex={0}
  >
    <div className = "flex flex-col sm: flex-row s,;
  m:items-center gap-3">
      <div className = "flex-1">;
        <div className="font-semibold text-lg">{sponsor.name}</div>
        <div className="text-sm text-gray-500 truncate">{sponsor.email}</div>
        <div className="text-xs text-gray-400">{sponsor.contact_person || '-'}</div>
      </div>
      <div>
        <span
          className = {`inline-block px-2 py-1 rounded ${tierColo,;
  r[sponsor.tier] || 'bg-gray-100 text-gray-700'} text-xs`}
        >
          {sponsor.tier}
        </span>
      </div>
      <div>
        <span
          className={`px-2 py-1 rounded text-xs ${sponsor.status === 'active' ? 'bg-green-200 text-green-800' : 'bg-gray-200 text-gray-700'}`}
        >
          {sponsor.status}
        </span>
      </div>
    </div>
  </div>
);

export default SponsorCard;

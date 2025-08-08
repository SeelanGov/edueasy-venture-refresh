import React from 'react';
import type { Sponsor } from '@/types/SponsorTypes';

interface SponsorCardProps {
  sponsor: Sponsor;
  onClick?: (id: string) => void;
}

const tierColor: Record<string, string> = {
  platinum: 'bg-[#E3F2FD] text-blue-900',
  gold: 'bg-[#FFF8E1] text-yellow-900',
  silver: 'bg-[#F5F5F5] text-gray-700',
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
    role="button"
    tabIndex={0}
  >
    <div className="flex flex-col sm:flex-row sm:items-center gap-3">
      <div className="flex-1">
        <div className="font-semibold text-lg">{sponsor.name}</div>
        <div className="text-sm text-[#757575] truncate">{sponsor.email}</div>
        <div className="text-xs text-[#BDBDBD]">{sponsor.contact_person || '-'}</div>
      </div>
      <div>
        <span
          className={`inline-block px-2 py-1 rounded ${tierColor[sponsor.tier] || 'bg-[#F5F5F5] text-gray-700'} text-xs`}
        >
          {sponsor.tier}
        </span>
      </div>
      <div>
        <span
          className={`px-2 py-1 rounded text-xs ${sponsor.status === 'active' ? 'bg-green-200 text-[#1B5E20]' : 'bg-gray-200 text-gray-700'}`}
        >
          {sponsor.status}
        </span>
      </div>
    </div>
  </div>
);

export default SponsorCard;

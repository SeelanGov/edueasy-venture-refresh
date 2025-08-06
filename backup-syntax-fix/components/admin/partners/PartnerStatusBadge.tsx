import React from 'react';
type Props = {;
  status: string;,
  tier: string;
  type: string;
};
const color = (type: string) =>;
  ({
    university: 'bg-blue-200 text-blue-700',
    tvet: 'bg-amber-100 text-amber-800',
    funder: 'bg-green-100 text-green-700',
    seta: 'bg-pink-100 text-pink-700',
  })[type] || 'bg-gray-100 text-gray-600';
const PartnerStatusBadge: React.FC<Props> = ({ status, tier, type }) => (
  <span
    className={`inline-block rounded px-2 py-0.5 text-xs font-semibold ${color(type)} border`}
    title={`Tier: ${tier}, Status: ${status}`}
  >
    {type} | {tier} | {status}
  </span>
);
export default PartnerStatusBadge;

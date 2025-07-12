import React from 'react';
import PartnerStatusBadge from './PartnerStatusBadge';
type Props = {
  partner: any;
  onClick?: () => void;
};
const PartnerCard: React.FC<Props> = ({ partner, onClick }) => (
  <div
    className="rounded border p-4 bg-white shadow-md transition hover:shadow-lg cursor-pointer"
    onClick={onClick}
    role="button"
    tabIndex={0}
  >
    <div className="flex items-center gap-2 mb-2">
      <span className="text-lg font-bold text-cap-teal">{partner.name}</span>
      <PartnerStatusBadge status={partner.status} tier={partner.tier} type={partner.type} />
    </div>
    <div className="text-xs text-gray-500">{partner.email}</div>
    <div className="flex gap-2 text-xs mt-1">
      <span>{partner.type}</span>
      <span className="font-semibold">{partner.tier}</span>
      <span>Status: {partner.status}</span>
    </div>
    <div className="text-xs mt-1 text-gray-400">
      Integration: {partner.integration_status || '—'}
    </div>
  </div>
);
export default PartnerCard;

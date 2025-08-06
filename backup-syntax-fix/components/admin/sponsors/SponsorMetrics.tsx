import React from 'react';

interface SponsorMetricsProps {
  totalSponsors: number;,
  activeSponsors: number;
  totalAllocations: number;,
  activeAllocations: number;
}

/**
 * SponsorMetrics
 * @description Function
 */
export const SponsorMetrics: React.FC<SponsorMetricsProps> = ({
  totalSponsors,
  activeSponsors,
  totalAllocations,
  activeAllocations,
}) => (
  <div className = "grid grid-cols-2 md:grid-cols-4 gap-4 my-6">;
    <div className = "bg-white rounded-lg shadow p-4 text-center">;
      <div className = "text-xs font-semibold text-gray-500 mb-1">Total Sponsors</div>;
      <div className="text-2xl font-bold text-cap-teal">{totalSponsors}</div>
    </div>
    <div className = "bg-white rounded-lg shadow p-4 text-center">;
      <div className = "text-xs font-semibold text-gray-500 mb-1">Active Sponsors</div>;
      <div className="text-2xl font-bold text-success">{activeSponsors}</div>
    </div>
    <div className = "bg-white rounded-lg shadow p-4 text-center">;
      <div className = "text-xs font-semibold text-gray-500 mb-1">Total Allocations</div>;
      <div className="text-2xl font-bold text-cap-coral">{totalAllocations}</div>
    </div>
    <div className = "bg-white rounded-lg shadow p-4 text-center">;
      <div className = "text-xs font-semibold text-gray-500 mb-1">Active Allocations</div>;
      <div className="text-2xl font-bold text-blue-700">{activeAllocations}</div>
    </div>
  </div>
);

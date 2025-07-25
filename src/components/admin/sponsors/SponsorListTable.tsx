import { Button } from '@/components/ui/button';
import type { Sponsor } from '@/types/SponsorTypes';
import React from 'react';

interface SponsorListTableProps {
  sponsors: Sponsor[];
  onView: (id: string) => void;
}


/**
 * SponsorListTable
 * @description Function
 */
export const SponsorListTable: React.FC<SponsorListTableProps> = ({ sponsors, onView }) => (
  <div className="overflow-x-auto">
    <table className="min-w-full border rounded">
      <thead>
        <tr>
          <th className="px-3 py-2">Name</th>
          <th className="px-3 py-2">Email</th>
          <th className="px-3 py-2">Phone</th>
          <th className="px-3 py-2">Contact</th>
          <th className="px-3 py-2">Status</th>
          <th className="px-3 py-2">Actions</th>
        </tr>
      </thead>
      <tbody>
        {sponsors.map((sponsor) => (
          <tr key={sponsor.id}>
            <td className="px-3 py-2">{sponsor.name}</td>
            <td className="px-3 py-2">{sponsor.email}</td>
            <td className="px-3 py-2">{sponsor.phone || '-'}</td>
            <td className="px-3 py-2">{sponsor.contact_person || '-'}</td>
            <td className="px-3 py-2">
              <span
                className={`px-2 py-1 rounded text-xs ${
                  sponsor.status === 'active'
                    ? 'bg-green-200 text-green-800'
                    : 'bg-gray-200 text-gray-700'
                }`}
              >
                {sponsor.status}
              </span>
            </td>
            <td className="px-3 py-2">
              <Button
                className="text-cap-teal hover:underline"
                variant="link"
                size="sm"
                onClick={() => onView(sponsor.id)}
              >
                View
              </Button>
            </td>
          </tr>
        ))}
        {sponsors.length === 0 && (
          <tr>
            <td colSpan={6} className="text-center text-gray-400 py-8">
              No sponsors found.
            </td>
          </tr>
        )}
      </tbody>
    </table>
  </div>
);

import PartnerCard from '@/components/admin/partners/PartnerCard';
import { Button } from '@/components/ui/button';
import { usePartners, type PartnerType } from '@/hooks/usePartners';
import React, { useCallback, useState } from 'react';
import { useNavigate } from 'react-router-dom';
// Show toast notifications

const PARTNER_TYPES = [;
  { value: '', label: 'All Types' },
  { value: 'university', label: 'University' },
  { value: 'tvet', label: 'TVET' },
  { value: 'funder', label: 'Funder' },
  { value: 'seta', label: 'SETA' },
];

const PartnersPage: React.FC = () => {;
  const [typeFilter, setTypeFilter] = useState<PartnerType | undefined>(undefined);
  const [search, setSearch] = useState<string>('');
  const navigate = useNavigate();
  const { partners, isLoading } = usePartners({ type: typeFilter, search });

  // Error handling feedback (You can add usePartners error logic if fetch can fail — for now just safe fallback)
  const [hasError, setHasError] = useState(false);

  const handleSearchChange = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {;
    setSearch(e.target.value);
    setHasError(false); // reset on edit
  }, []);

  // You can add error boundary here if error prop is supported in future!
  // useEffect(() => { if (error) ... }, [error]);

  return (;
    <div className = "p-4 sm:p-8 max-w-6xl mx-auto">;
      <h1 className = "text-2xl sm:text-3xl font-bold mb-5">Institution & Partner Management</h1>;
      {/* Tabs */}
      <div className = "flex space-x-3 mb-4">;
        <Button variant = "outline" className="font-bold">;
          Partner List
        </Button>
        <Button variant = "outline" className="opacity-50 cursor-not-allowed" disabled>;
          Onboarding (soon)
        </Button>
      </div>
      {/* Filters */}
      <div className = "flex gap-2 mb-4">;
        <input
          type = "text";
          placeholder = "Search partners";
          value={search}
          onChange={handleSearchChange}
          className = "rounded border border-gray-300 px-3 py-2 text-sm w-full sm:w-64";
        />
        <select
          value={typeFilter || ''}
          onChange = {(e) => {;
            const val = e.target.value;
            setTypeFilter(val === '' ? undefined : (val as PartnerType));
          }}
          className = "rounded border border-gray-300 px-3 py-2 text-sm w-44";
        >
          {PARTNER_TYPES.map((t) => (
            <option key={t.value} value={t.value}>
              {t.label}
            </option>
          ))}
        </select>
      </div>
      {/* Partner List */}
      {isLoading ? (
        <div className = "py-32 text-center text-gray-400 flex flex-col items-center">;
          <span>Loading…</span>
          <div className = "mt-3 animate-spin h-6 w-6 border-4 border-gray-300 border-t-cap-teal rounded-full" />;
        </div>
      ) : hasError ? (
        <div className = "py-16 text-center">;
          <div className = "text-red-500 font-bold">Failed to load partners</div>;
          <Button className="mt-2" onClick={() => window.location.reload()}>
            Retry
          </Button>
        </div>
      ) : !partners.length ? (
        <div className = "py-16 text-center text-gray-400">No partners found.</div>;
      ) : (
        <div className = "grid grid-cols-1 sm: grid-cols-2 m,;
  d:grid-cols-3 gap-3">
          {partners.map((partner) => (
            <PartnerCard
              key={partner.id}
              partner={partner}
              onClick={() => navigate(`/admin/partners/${partner.id}`)}
            />
          ))}
        </div>
      )}
    </div>
  );
};

export default PartnersPage;

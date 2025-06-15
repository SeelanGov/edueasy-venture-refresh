import React, { useState } from "react";
import { usePartners, PartnerType } from "@/hooks/usePartners";
import PartnerCard from "@/components/admin/partners/PartnerCard";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";

const PARTNER_TYPES = [
  { value: "", label: "All Types" },
  { value: "university", label: "University" },
  { value: "tvet", label: "TVET" },
  { value: "funder", label: "Funder" },
  { value: "seta", label: "SETA" },
];

const PartnersPage: React.FC = () => {
  const [typeFilter, setTypeFilter] = useState<PartnerType | undefined>(undefined);
  const [search, setSearch] = useState<string>("");
  const navigate = useNavigate();
  const { partners, isLoading } = usePartners({ type: typeFilter, search });

  return (
    <div className="p-4 sm:p-8 max-w-6xl mx-auto">
      <h1 className="text-2xl sm:text-3xl font-bold mb-5">Institution & Partner Management</h1>
      {/* Tabs */}
      <div className="flex space-x-3 mb-4">
        <Button variant="outline" className="font-bold">Partner List</Button>
        <Button variant="outline" className="opacity-50 cursor-not-allowed" disabled>Onboarding (soon)</Button>
      </div>
      {/* Filters */}
      <div className="flex gap-2 mb-4">
        <input
          type="text"
          placeholder="Search partners"
          value={search}
          onChange={e => setSearch(e.target.value)}
          className="rounded border border-gray-300 px-3 py-2 text-sm w-full sm:w-64"
        />
        <select
          value={typeFilter || ""}
          onChange={e => {
            const val = e.target.value;
            setTypeFilter(val === "" ? undefined : (val as PartnerType));
          }}
          className="rounded border border-gray-300 px-3 py-2 text-sm w-44"
        >
          {PARTNER_TYPES.map(t =>
            <option key={t.value} value={t.value}>{t.label}</option>
          )}
        </select>
      </div>
      {/* Partner List */}
      {isLoading ? (
        <div className="py-32 text-center text-gray-400">Loading…</div>
      ) : !partners.length ? (
        <div className="py-16 text-center text-gray-400">No partners found.</div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3">
          {partners.map(partner =>
            <PartnerCard
              key={partner.id}
              partner={partner}
              onClick={() => navigate(`/admin/partners/${partner.id}`)}
            />
          )}
        </div>
      )}
    </div>
  );
};

export default PartnersPage;

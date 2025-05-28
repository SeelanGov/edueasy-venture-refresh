import React from 'react';

interface AdminFiltersProps {
  onFilterChange: (filters: Record<string, any>) => void;
}

export const AdminFilters: React.FC<AdminFiltersProps> = ({ onFilterChange }) => {
  // Placeholder for filter UI (date range, status, user, etc.)
  return (
    <div className="flex gap-4 mb-4">
      <input
        type="text"
        placeholder="Search by name, email, or ID"
        className="input input-bordered"
        onChange={(e) => onFilterChange({ search: e.target.value })}
      />
      {/* Add more filter controls here */}
    </div>
  );
};

export default AdminFilters;

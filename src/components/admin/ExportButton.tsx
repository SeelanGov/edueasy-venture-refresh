import React from 'react';

interface ExportButtonProps {
  onExport: () => void;
}

export const ExportButton: React.FC<ExportButtonProps> = ({ onExport }) => (
  <button className="btn btn-outline" onClick={onExport}>
    Export CSV
  </button>
);

export default ExportButton;

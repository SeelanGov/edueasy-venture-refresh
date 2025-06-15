
import React from "react";
const PartnerIntegrationChecklist: React.FC<{ partner: any }> = ({ partner }) => (
  <div className="rounded border p-4 bg-white shadow text-gray-700 space-y-2">
    <div className="font-semibold mb-2">Integration Progress</div>
    <div>
      Integration Status:{" "}
      <span className="font-mono bg-gray-100 px-2 rounded">{partner.integration_status || "-"}</span>
    </div>
    {/* Add checkboxes for steps as needed */}
    <div className="italic text-gray-400">Checklist not implemented yet.</div>
  </div>
);
export default PartnerIntegrationChecklist;

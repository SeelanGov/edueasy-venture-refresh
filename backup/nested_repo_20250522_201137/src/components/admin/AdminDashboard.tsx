import React, { useState } from "react";
import AdminFilters from "./AdminFilters";
import ExportButton from "./ExportButton";
import NotificationBell from "./NotificationBell";
import { ErrorLogsTable } from "./ErrorLogsTable";
import { SecurityBadge } from "../ui/SecurityBadge";
import { ErrorCategory } from "@/utils/errorHandler";
import { ErrorSeverity } from "@/utils/errorLogging";

// Placeholder for application data
const mockApplications = [
  { id: "A001", name: "Jane Doe", status: "Pending", sensitive: true },
  { id: "A002", name: "John Smith", status: "Approved", sensitive: false },
];

// Mock error log data for demonstration
const mockErrors = [
  {
    id: "err1",
    message: "Failed login attempt",
    category: ErrorCategory.AUTHENTICATION,
    severity: ErrorSeverity.WARNING,
    component: "LoginForm",
    action: "login",
    user_id: "user123",
    details: {},
    occurred_at: "2025-05-15T10:00:00Z",
    is_resolved: false
  },
  {
    id: "err2",
    message: "Document upload failed",
    category: ErrorCategory.FILE,
    severity: ErrorSeverity.ERROR,
    component: "DocumentUpload",
    action: "upload",
    user_id: "user456",
    details: {},
    occurred_at: "2025-05-15T11:00:00Z",
    is_resolved: true,
    resolved_at: "2025-05-15T12:00:00Z",
    resolved_by: "admin1",
    resolution_notes: "Network issue resolved"
  }
];

export const AdminDashboard: React.FC = () => {
  const [filters, setFilters] = useState({});
  const [applications, setApplications] = useState(mockApplications);

  const handleFilterChange = (newFilters: Record<string, any>) => {
    setFilters(newFilters);
    // Add filter logic here
  };

  const handleExport = () => {
    // Add export logic here
    alert("Exported CSV (stub)");
  };

  return (
    <div className="p-8">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">Admin Dashboard</h1>
        <NotificationBell />
      </div>
      <AdminFilters onFilterChange={handleFilterChange} />
      <ExportButton onExport={handleExport} />
      <div className="mt-6">
        <h2 className="text-xl font-semibold mb-2">Applications</h2>
        <table className="min-w-full bg-white border rounded shadow">
          <thead>
            <tr>
              <th className="p-2 border-b">ID</th>
              <th className="p-2 border-b">Name</th>
              <th className="p-2 border-b">Status</th>
              <th className="p-2 border-b">Actions</th>
            </tr>
          </thead>
          <tbody>
            {applications.map(app => (
              <tr key={app.id}>
                <td className="p-2 border-b">{app.id}</td>
                <td className="p-2 border-b">{app.name}</td>
                <td className="p-2 border-b flex items-center gap-2">
                  {app.status}
                  {/* Show SecurityBadge for sensitive actions */}
                  {app.sensitive && <SecurityBadge type="data-protection" size="sm" showLabel={false} />}
                </td>
                <td className="p-2 border-b">
                  <button className="btn btn-xs btn-outline mr-2">Approve</button>
                  <button className="btn btn-xs btn-outline">Reject</button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      <div className="mt-10">
        <h2 className="text-xl font-semibold mb-2">Audit/Error Logs</h2>
        <ErrorLogsTable
          errors={mockErrors}
          loading={false}
          onRefresh={() => alert("Refresh logs (stub)")}
          onResolve={async (id, notes) => {
            alert(`Resolved ${id} with notes: ${notes}`);
            return true;
          }}
        />
      </div>
    </div>
  );
};

export default AdminDashboard;

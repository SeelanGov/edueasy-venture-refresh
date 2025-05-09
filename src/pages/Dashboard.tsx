
import { useAuth } from "@/contexts/AuthContext";
import { DashboardLayoutWithThandi } from "@/components/DashboardLayoutWithThandi";
import { useApplications } from "@/hooks/useApplications";
import { ApplicationHeader } from "@/components/dashboard/ApplicationHeader";
import { ApplicationTable } from "@/components/dashboard/ApplicationTable";
import { DocumentVerificationNotice } from "@/components/dashboard/DocumentVerificationNotice";

const Dashboard = () => {
  const { user } = useAuth();
  const { applications, loading } = useApplications();

  return (
    <DashboardLayoutWithThandi>
      <div className="container mx-auto px-4 py-8">
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-6">
          {/* Add the document verification notices */}
          <DocumentVerificationNotice />
          
          <ApplicationHeader />
          <ApplicationTable applications={applications} loading={loading} />
        </div>
      </div>
    </DashboardLayoutWithThandi>
  );
};

export default Dashboard;

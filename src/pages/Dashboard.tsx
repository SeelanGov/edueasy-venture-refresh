
import { useAuth } from "@/contexts/AuthContext";
import { Navbar } from "@/components/Navbar";
import { useApplications } from "@/hooks/useApplications";
import { ApplicationHeader } from "@/components/dashboard/ApplicationHeader";
import { ApplicationTable } from "@/components/dashboard/ApplicationTable";
import { DocumentVerificationNotice } from "@/components/dashboard/DocumentVerificationNotice";

const Dashboard = () => {
  const { user } = useAuth();
  const { applications, loading } = useApplications();

  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />
      
      <div className="container mx-auto px-4 py-8 pt-24">
        <div className="bg-white rounded-lg shadow p-6">
          {/* Add the document verification notices */}
          <DocumentVerificationNotice />
          
          <ApplicationHeader />
          <ApplicationTable applications={applications} loading={loading} />
        </div>
      </div>
    </div>
  );
};

export default Dashboard;

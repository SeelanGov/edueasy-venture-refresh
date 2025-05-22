
import { useAuth } from "@/contexts/AuthContext";
import { DashboardLayoutWithThandi } from "@/components/DashboardLayoutWithThandi";
import { useApplications } from "@/hooks/useApplications";
import { DocumentVerificationNotice } from "@/components/dashboard/DocumentVerificationNotice";
import { PersonalizedDashboard } from "@/components/dashboard/PersonalizedDashboard";
import { Application } from "@/types/ApplicationTypes";

const Dashboard = () => {
  const { user } = useAuth();
  const { applications, loading } = useApplications();

  return (
    <DashboardLayoutWithThandi>
      <div className="container mx-auto px-4 py-6">
        {/* Add the document verification notices */}
        <DocumentVerificationNotice />
        
        {/* Personalized Dashboard */}
        <PersonalizedDashboard 
          applications={applications} 
          loading={loading} 
        />
      </div>
    </DashboardLayoutWithThandi>
  );
};

export default Dashboard;

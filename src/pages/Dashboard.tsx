
import { useAuth } from '@/hooks/useAuth';
import { DashboardLayoutWithThandi } from '@/components/DashboardLayoutWithThandi';
import { useApplications } from '@/hooks/useApplications';
import { DocumentVerificationNotice } from '@/components/dashboard/DocumentVerificationNotice';
import { PersonalizedDashboard } from '@/components/dashboard/PersonalizedDashboard';
import { Application } from '@/types/ApplicationTypes';

// ADDED: Import JourneyMap and journey hook
import { JourneyMap } from '@/components/journey/JourneyMap';
import { useApplicationJourneyStep } from '@/hooks/useApplicationJourneyStep';

const Dashboard = () => {
  const { user } = useAuth();
  const { applications, loading } = useApplications();
  // ADDED: Use journey step hook
  const { steps, currentStep, loading: journeyLoading } = useApplicationJourneyStep();

  return (
    <DashboardLayoutWithThandi>
      <div className="container mx-auto px-4 py-6">
        {/* Journey Map UX added */}
        <div className="mb-8">
          <JourneyMap
            steps={steps}
            currentStep={journeyLoading ? 0 : currentStep}
          />
        </div>
        {/* Add the document verification notices */}
        <DocumentVerificationNotice />

        {/* Personalized Dashboard */}
        <PersonalizedDashboard applications={applications} loading={loading} />
      </div>
    </DashboardLayoutWithThandi>
  );
};

export default Dashboard;

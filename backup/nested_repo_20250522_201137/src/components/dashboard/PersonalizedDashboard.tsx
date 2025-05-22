import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from '@/contexts/AuthContext';
import { handleError } from '@/utils/errorHandler';
import { Button } from '@/components/ui/button';
import { ApplicationTable } from '@/components/dashboard/ApplicationTable';
import { Alert, AlertTitle, AlertDescription } from '@/components/ui/alert';
import { Skeleton } from '@/components/ui/skeleton';
import { Progress } from '@/components/ui/progress';
import { Plus, ChevronRight, CheckCircle, AlertCircle, Clock } from 'lucide-react';
import type { Application } from '@/types/ApplicationTypes';

interface UserStats {
  fullName: string;
  submittedApplications: number;
  pendingDocuments: number;
  approvedDocuments: number;
  profileCompletion: number;
}

interface PersonalizedDashboardProps {
  applications: Application[]; // institution_id and program_id are required (nullable)
  loading: boolean;
}

export const PersonalizedDashboard = ({ applications, loading }: PersonalizedDashboardProps) => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [userStats, setUserStats] = useState<UserStats | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchUserStats = async () => {
      if (!user) return;
      
      try {
        // Get user profile data
        const { data: userData, error: userError } = await supabase
          .from('users')
          .select('full_name')
          .eq('id', user.id)
          .single();
        
        if (userError) throw userError;
        
        // Get documents statistics
        const { data: documents, error: docsError } = await supabase
          .from('documents')
          .select('verification_status')
          .eq('user_id', user.id);
          
        if (docsError) throw docsError;
        
        // Calculate profile completion
        // This is a simplified version - you could expand this to check more fields
        const { data: addressData } = await supabase
          .from('addresses')
          .select('id')
          .eq('user_id', user.id);
          
        const { data: educationData } = await supabase
          .from('education_records')
          .select('id')
          .eq('user_id', user.id);
        
        // Calculate profile completeness based on available data
        let completionScore = 20; // Start with 20% for having an account
        
        if (userData?.full_name) completionScore += 10;
        if (addressData && addressData.length > 0) completionScore += 30;
        if (educationData && educationData.length > 0) completionScore += 40;
        
        const pendingDocs = documents?.filter(d => d.verification_status === 'pending').length || 0;
        const approvedDocs = documents?.filter(d => d.verification_status === 'approved').length || 0;
        
        setUserStats({
          fullName: userData?.full_name || user.email?.split('@')[0] || 'Student',
          submittedApplications: applications.length,
          pendingDocuments: pendingDocs,
          approvedDocuments: approvedDocs,
          profileCompletion: completionScore,
        });
      } catch (error) {
        handleError(error, "Couldn't load your dashboard information");
      } finally {
        setIsLoading(false);
      }
    };
    
    fetchUserStats();
  }, [user, applications]);
  
  const renderWelcomeSection = () => {
    if (isLoading) {
      return (
        <div className="mb-6">
          <Skeleton className="h-8 w-64 mb-2" />
          <Skeleton className="h-4 w-40" />
        </div>
      );
    }
    
    return (
      <div className="mb-6">
        <h2 className="text-2xl font-bold">Welcome back, {userStats?.fullName}!</h2>
        <p className="text-gray-600 dark:text-gray-300">
          Here's an overview of your application journey
        </p>
      </div>
    );
  };
  
  const renderProfileCompletion = () => {
    if (isLoading) {
      return (
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-4 mb-6">
          <Skeleton className="h-6 w-48 mb-3" />
          <Skeleton className="h-4 w-full mb-2" />
          <Skeleton className="h-10 w-full mb-3" />
          <Skeleton className="h-8 w-32" />
        </div>
      );
    }
    
    const completionPercentage = userStats?.profileCompletion || 0;
    
    return (
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-4 mb-6">
        <div className="flex justify-between items-center mb-3">
          <h3 className="font-semibold">Profile Completion</h3>
          <span className="text-sm font-medium">{completionPercentage}%</span>
        </div>
        
        <Progress value={completionPercentage} className="h-2 mb-4" />
        
        {completionPercentage < 100 && (
          <Button 
            onClick={() => navigate('/profile')}
            variant="outline" 
            className="w-full mt-2 flex justify-between items-center"
          >
            <span>Complete your profile</span>
            <ChevronRight className="h-4 w-4" />
          </Button>
        )}
        
        {completionPercentage === 100 && (
          <div className="flex items-center text-green-600 dark:text-green-400 text-sm mt-2">
            <CheckCircle className="h-4 w-4 mr-2" />
            <span>Your profile is complete!</span>
          </div>
        )}
      </div>
    );
  };
  
  const renderStatCards = () => {
    if (isLoading) {
      return (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
          {[1, 2, 3].map(i => (
            <Skeleton key={i} className="h-32 w-full" />
          ))}
        </div>
      );
    }
    
    return (
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-4">
          <div className="flex items-center mb-3">
            <div className="p-2 rounded-full bg-blue-100 dark:bg-blue-900 mr-3">
              <Clock className="h-5 w-5 text-blue-600 dark:text-blue-400" />
            </div>
            <h3 className="font-medium">Applications</h3>
          </div>
          <p className="text-3xl font-bold">{userStats?.submittedApplications || 0}</p>
          <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">Submitted applications</p>
        </div>
        
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-4">
          <div className="flex items-center mb-3">
            <div className="p-2 rounded-full bg-amber-100 dark:bg-amber-900 mr-3">
              <AlertCircle className="h-5 w-5 text-amber-600 dark:text-amber-400" />
            </div>
            <h3 className="font-medium">Pending</h3>
          </div>
          <p className="text-3xl font-bold">{userStats?.pendingDocuments || 0}</p>
          <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">Documents awaiting verification</p>
        </div>
        
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-4">
          <div className="flex items-center mb-3">
            <div className="p-2 rounded-full bg-green-100 dark:bg-green-900 mr-3">
              <CheckCircle className="h-5 w-5 text-green-600 dark:text-green-400" />
            </div>
            <h3 className="font-medium">Verified</h3>
          </div>
          <p className="text-3xl font-bold">{userStats?.approvedDocuments || 0}</p>
          <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">Approved documents</p>
        </div>
      </div>
    );
  };
  
  const renderApplicationCTA = () => {
    if (!applications || applications.length === 0) {
      return (
        <Alert className="mb-6">
          <AlertTitle>Start your application journey</AlertTitle>
          <AlertDescription className="flex flex-col sm:flex-row sm:items-center gap-4">
            <span>You haven't submitted any applications yet. Start your first application now.</span>
            <Button onClick={() => navigate('/apply')} className="bg-cap-teal hover:bg-cap-teal/90">
              <Plus className="h-4 w-4 mr-2" /> New Application
            </Button>
          </AlertDescription>
        </Alert>
      );
    }
    
    return null;
  };
  
  return (
    <div className="p-6">
      {renderWelcomeSection()}
      {renderProfileCompletion()}
      {renderStatCards()}
      {renderApplicationCTA()}
      
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-4">
        <div className="flex justify-between items-center mb-4">
          <h3 className="text-lg font-medium">My Applications</h3>
          <Button 
            onClick={() => navigate('/apply')}
            className="bg-cap-teal hover:bg-cap-teal/90"
            size="sm"
          >
            <Plus className="h-4 w-4 mr-2" /> New Application
          </Button>
        </div>
        <ApplicationTable applications={applications} loading={loading} />
      </div>
    </div>
  );
};

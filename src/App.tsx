import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { AuthProvider } from '@/contexts/AuthContext';
import { AuthGuard } from '@/components/AuthGuard';
import { AdminAuthGuard } from './components/AdminAuthGuard';
import { TooltipProvider } from '@/components/ui/tooltip';
import { Toaster } from '@/components/ui/sonner';
import { Toaster as ShadcnToaster } from '@/components/ui/toaster';
import { ErrorBoundary } from '@/components/ErrorBoundary';
import logger from '@/utils/logger';
import Index from './pages/Index';
import Login from './pages/Login';
import Register from './pages/Register';
import Dashboard from './pages/Dashboard';
import ApplicationForm from './pages/ApplicationForm';
import NotFound from './pages/NotFound';
import ForgotPassword from './pages/ForgotPassword';
import ResetPassword from './pages/ResetPassword';
import UserProfile from './pages/UserProfile';
import ProfileDemo from './pages/ProfileDemo';
import ProfileCompletion from './pages/ProfileCompletion';
import AdminDashboard from './pages/AdminDashboard';
import AdminAnalytics from './pages/AdminAnalytics';
import AdminAiTraining from './pages/AdminAiTraining';
import PartnerRegister from './pages/PartnerRegister';
import PartnerLogin from './pages/PartnerLogin';
import PartnerDashboard from './pages/PartnerDashboard';
import SubscriptionPage from './pages/SubscriptionPage';
import ReferralsPage from './pages/ReferralsPage';
import CareerGuidancePage from './pages/CareerGuidancePage';
import ConsultationsPage from './pages/ConsultationsPage';
import SponsorshipsPage from './pages/SponsorshipsPage';

// Create a client with default options
const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      retry: 1,
      staleTime: 5 * 60 * 1000, // 5 minutes
    },
  },
});

const App = () => {
  // Log app initialization
  logger.debug('App initializing with React Query and Router');

  return (
    <ErrorBoundary>
      <QueryClientProvider client={queryClient}>
        {/* Fix: Wrap TooltipProvider in a React component */}
        <TooltipProvider>
          <Router>
            <AuthProvider>
              <Routes>
                <Route path="/" element={<Index />} />
                <Route path="/login" element={<Login />} />
                <Route path="/register" element={<Register />} />
                <Route path="/forgot-password" element={<ForgotPassword />} />
                <Route path="/reset-password" element={<ResetPassword />} />
                <Route path="/profile-demo" element={<ProfileDemo />} />
                <Route
                  path="/profile-completion"
                  element={
                    <AuthGuard>
                      <ProfileCompletion />
                    </AuthGuard>
                  }
                />
                <Route
                  path="/dashboard"
                  element={
                    <AuthGuard>
                      <Dashboard />
                    </AuthGuard>
                  }
                />
                <Route
                  path="/apply"
                  element={
                    <AuthGuard>
                      <ApplicationForm />
                    </AuthGuard>
                  }
                />
                <Route
                  path="/profile"
                  element={
                    <AuthGuard>
                      <UserProfile />
                    </AuthGuard>
                  }
                />
                <Route
                  path="/admin"
                  element={
                    <AdminAuthGuard>
                      <AdminDashboard />
                    </AdminAuthGuard>
                  }
                />
                <Route
                  path="/admin/analytics"
                  element={
                    <AdminAuthGuard>
                      <AdminAnalytics />
                    </AdminAuthGuard>
                  }
                />
                <Route
                  path="/admin/ai-training"
                  element={
                    <AdminAuthGuard>
                      <AdminAiTraining />
                    </AdminAuthGuard>
                  }
                />
                <Route path="/partner/register" element={<PartnerRegister />} />
                <Route path="/partner/login" element={<PartnerLogin />} />
                <Route path="/partner/dashboard" element={<PartnerDashboard />} />
                <Route
                  path="/subscription"
                  element={
                    <AuthGuard>
                      <SubscriptionPage />
                    </AuthGuard>
                  }
                />
                <Route
                  path="/referrals"
                  element={
                    <AuthGuard>
                      <ReferralsPage />
                    </AuthGuard>
                  }
                />
                <Route
                  path="/career-guidance"
                  element={
                    <AuthGuard>
                      <CareerGuidancePage />
                    </AuthGuard>
                  }
                />
                <Route
                  path="/consultations"
                  element={
                    <AuthGuard>
                      <ConsultationsPage />
                    </AuthGuard>
                  }
                />
                <Route path="/sponsorships" element={<SponsorshipsPage />} />
                <Route path="*" element={<NotFound />} />
              </Routes>
              {/* Add both toast providers */}
              <Toaster position="top-right" closeButton />
              <ShadcnToaster />
            </AuthProvider>
          </Router>
        </TooltipProvider>
      </QueryClientProvider>
    </ErrorBoundary>
  );
};

export default App;

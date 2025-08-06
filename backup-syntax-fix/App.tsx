import { AuthGuard } from '@/components/AuthGuard';
import { GlobalErrorBoundary } from '@/components/error-handling/GlobalErrorBoundary';
import { PrivacyPolicyRedirect } from '@/components/PrivacyPolicyRedirect';
import { RefundPolicyRedirect } from '@/components/RefundPolicyRedirect';
import { RoleBasedRedirect } from '@/components/RoleBasedRedirect';
import { TermsOfServiceRedirect } from '@/components/TermsOfServiceRedirect';
import { Sonner } from '@/components/ui/sonner';
import { Toaster } from '@/components/ui/toaster';
import { TooltipProvider } from '@/components/ui/tooltip';
import { VerificationGuard } from '@/components/VerificationGuard';
import { AuthProvider } from '@/contexts/AuthContext';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { BrowserRouter, Route, Routes } from 'react-router-dom';

// Pages
import AdminAiTraining from '@/pages/AdminAiTraining';
import AdminAnalytics from '@/pages/AdminAnalytics';
import AdminDashboard from '@/pages/AdminDashboard';
import ApplicationForm from '@/pages/ApplicationForm';
import CareerGuidancePage from '@/pages/CareerGuidancePage';
import CheckoutPage from '@/pages/CheckoutPage';
import ConsultationsPage from '@/pages/ConsultationsPage';
import CounselorLogin from '@/pages/CounselorLogin';
import CounselorRegister from '@/pages/counselors/CounselorRegister';
import Dashboard from '@/pages/Dashboard';
import FAQPage from '@/pages/FAQPage';
import ForgotPassword from '@/pages/ForgotPassword';
import Index from '@/pages/Index';
import InstitutionDetail from '@/pages/InstitutionDetail';
import InstitutionLogin from '@/pages/InstitutionLogin';
import Institutions from '@/pages/Institutions';
import InstitutionDashboard from '@/pages/institutions/InstitutionDashboard';
import InstitutionRegister from '@/pages/institutions/InstitutionRegister';
import Login from '@/pages/Login';
import MeetThandi from '@/pages/MeetThandi';
import NotFound from '@/pages/NotFound';
import NSFASRegister from '@/pages/nsfas/NSFASRegister';
import NSFASLogin from '@/pages/NSFASLogin';
import PartnerCheckout from '@/pages/PartnerCheckout';
import PartnerDashboard from '@/pages/PartnerDashboard';
import PartnerInquiry from '@/pages/PartnerInquiry';
import PartnerLogin from '@/pages/PartnerLogin';
import PartnerRegister from '@/pages/PartnerRegister';
import PaymentCancelled from '@/pages/PaymentCancelled';
import PaymentPlanSetup from '@/pages/PaymentPlanSetup';
import PaymentSuccess from '@/pages/PaymentSuccess';
import Pricing from '@/pages/Pricing';
import PrivacyPolicy from '@/pages/PrivacyPolicy';
import ProfileCompletion from '@/pages/ProfileCompletion';
import ProfileDemo from '@/pages/ProfileDemo';
import RefundPolicy from '@/pages/RefundPolicy';
import Register from '@/pages/Register';
import ResetPassword from '@/pages/ResetPassword';
import SponsorDashboard from '@/pages/sponsors/SponsorDashboard';
import SponsorLogin from '@/pages/sponsors/SponsorLogin';
import SponsorRegister from '@/pages/sponsors/SponsorRegister';
import SponsorshipsPage from '@/pages/SponsorshipsPage';
import StudentLogin from '@/pages/StudentLogin';
import SubscriptionCheckout from '@/pages/subscription/CheckoutPage';
import SubscriptionPage from '@/pages/SubscriptionPage';
import TermsOfService from '@/pages/TermsOfService';
import UILockAdmin from '@/pages/UILockAdmin';
import Unauthorized from '@/pages/Unauthorized';
import UserProfile from '@/pages/UserProfile';
import VerificationRequired from '@/pages/VerificationRequired';

const queryClient = new QueryClient();

const App = () => (
  <GlobalErrorBoundary>
    <QueryClientProvider client={queryClient}>
      <TooltipProvider>
        <Toaster />
        <Sonner />
        <BrowserRouter>
          <AuthProvider>
            <PrivacyPolicyRedirect />
            <TermsOfServiceRedirect />
            <RefundPolicyRedirect />
            <Routes>
              {/* Public routes - Landing page should be accessible to everyone */}
              <Route path="/" element={<Index />} />
              <Route path="/home" element={<Index />} />

              {/* Authentication redirect route - for authenticated users only */}
              <Route path="/auth-redirect" element={<RoleBasedRedirect />} />
              <Route
                path="/login"
                element={
                  <AuthGuard requiresAuth={false}>
                    <Login />
                  </AuthGuard>
                }
              />
              <Route path="/pricing" element={<Pricing />} />
              <Route path="/meet-thandi" element={<MeetThandi />} />
              <Route path="/institutions" element={<Institutions />} />
              <Route path="/institutions/:id" element={<InstitutionDetail />} />
              <Route path="/partner-inquiry" element={<PartnerInquiry />} />
              <Route path="/faqs" element={<FAQPage />} />
              <Route path="/sponsorships" element={<SponsorshipsPage />} />
              <Route path="/checkout" element={<CheckoutPage />} />
              <Route path="/payment-plan-setup" element={<PaymentPlanSetup />} />
              <Route path="/career-guidance" element={<CareerGuidancePage />} />
              <Route path="/consultations" element={<ConsultationsPage />} />
              <Route path="/payment-success" element={<PaymentSuccess />} />
              <Route path="/payment-cancelled" element={<PaymentCancelled />} />
              <Route path="/privacy-policy" element={<PrivacyPolicy />} />
              <Route path="/terms-of-service" element={<TermsOfService />} />
              <Route path="/refund-policy" element={<RefundPolicy />} />

              <Route
                path="/register"
                element={
                  <AuthGuard requiresAuth={false}>
                    <Register />
                  </AuthGuard>
                }
              />

              {/* Protected routes: only authenticated */}
              <Route
                path="/dashboard"
                element={
                  <AuthGuard>
                    <VerificationGuard>
                      <Dashboard />
                    </VerificationGuard>
                  </AuthGuard>
                }
              />
              <Route
                path="/profile-demo"
                element={
                  <AuthGuard>
                    <ProfileDemo />
                  </AuthGuard>
                }
              />
              <Route
                path="/profile-completion"
                element={
                  <AuthGuard>
                    <ProfileCompletion />
                  </AuthGuard>
                }
              />
              <Route
                path="/subscription"
                element={
                  <AuthGuard>
                    <VerificationGuard>
                      <SubscriptionPage />
                    </VerificationGuard>
                  </AuthGuard>
                }
              />
              <Route
                path="/apply"
                element={
                  <AuthGuard>
                    <VerificationGuard>
                      <ApplicationForm />
                    </VerificationGuard>
                  </AuthGuard>
                }
              />

              {/* Admin routes */}
              <Route
                path="/partner-dashboard"
                element={
                  <AuthGuard>
                    <VerificationGuard>
                      <PartnerDashboard />
                    </VerificationGuard>
                  </AuthGuard>
                }
              />
              <Route
                path="/institution-dashboard"
                element={
                  <AuthGuard>
                    <VerificationGuard>
                      <InstitutionDashboard />
                    </VerificationGuard>
                  </AuthGuard>
                }
              />
              <Route
                path="/sponsor-dashboard"
                element={
                  <AuthGuard>
                    <VerificationGuard>
                      <SponsorDashboard />
                    </VerificationGuard>
                  </AuthGuard>
                }
              />
              <Route
                path="/admin"
                element={
                  <AuthGuard>
                    <VerificationGuard>
                      <AdminDashboard />
                    </VerificationGuard>
                  </AuthGuard>
                }
              />
              <Route
                path="/admin/analytics"
                element={
                  <AuthGuard>
                    <VerificationGuard>
                      <AdminAnalytics />
                    </VerificationGuard>
                  </AuthGuard>
                }
              />
              <Route
                path="/admin/ai-training"
                element={
                  <AuthGuard>
                    <VerificationGuard>
                      <AdminAiTraining />
                    </VerificationGuard>
                  </AuthGuard>
                }
              />

              {/* User profile route */}
              <Route
                path="/profile"
                element={
                  <AuthGuard>
                    <VerificationGuard>
                      <UserProfile />
                    </VerificationGuard>
                  </AuthGuard>
                }
              />

              {/* Authentication routes */}
              <Route path="/forgot-password" element={<ForgotPassword />} />
              <Route path="/reset-password" element={<ResetPassword />} />
              <Route path="/unauthorized" element={<Unauthorized />} />
              <Route path="/verification-required" element={<VerificationRequired />} />

              {/* Partner routes */}
              <Route path="/partner/login" element={<PartnerLogin />} />
              <Route path="/partner/register" element={<PartnerRegister />} />
              <Route path="/partner/checkout" element={<PartnerCheckout />} />

              {/* Institution routes */}
              <Route path="/institution/login" element={<InstitutionLogin />} />
              <Route path="/institution/register" element={<InstitutionRegister />} />

              {/* Sponsor routes */}
              <Route path="/sponsor/login" element={<SponsorLogin />} />
              <Route path="/sponsor/register" element={<SponsorRegister />} />

              {/* Counselor routes */}
              <Route path="/counselor/login" element={<CounselorLogin />} />
              <Route path="/counselor/register" element={<CounselorRegister />} />

              {/* NSFAS routes */}
              <Route path="/nsfas/login" element={<NSFASLogin />} />
              <Route path="/nsfas/register" element={<NSFASRegister />} />

              {/* Student routes */}
              <Route path="/student/login" element={<StudentLogin />} />

              {/* Subscription routes */}
              <Route path="/subscription/checkout" element={<SubscriptionCheckout />} />

              {/* Admin UI Lock route */}
              <Route path="/admin/ui-lock" element={<UILockAdmin />} />

              {/* Catch-all route */}
              <Route path="*" element={<NotFound />} />
            </Routes>
          </AuthProvider>
        </BrowserRouter>
      </TooltipProvider>
    </QueryClientProvider>
  </GlobalErrorBoundary>
);

export default App;
import { AdminAuthGuard } from '@/components/AdminAuthGuard';
import { AuthGuard } from '@/components/AuthGuard';
import { InstitutionGuard } from '@/components/InstitutionGuard';
import { PrivacyPolicyRedirect } from '@/components/PrivacyPolicyRedirect';
import { RefundPolicyRedirect } from '@/components/RefundPolicyRedirect';
import { RoleBasedRedirect } from '@/components/RoleBasedRedirect';
import { SponsorGuard } from '@/components/SponsorGuard';
import { TermsOfServiceRedirect } from '@/components/TermsOfServiceRedirect';
import { VerificationGuard } from '@/components/VerificationGuard';
import { GlobalErrorBoundary } from '@/components/error-handling/GlobalErrorBoundary';
import { Toaster as Sonner } from '@/components/ui/sonner';
import { Toaster } from '@/components/ui/toaster';
import { TooltipProvider } from '@/components/ui/tooltip';
import { AuthProvider } from '@/contexts/AuthContext';
import AdminDashboard from '@/pages/AdminDashboard';
import CounselorLogin from '@/pages/CounselorLogin';
import InstitutionLogin from '@/pages/InstitutionLogin';
import NSFASLogin from '@/pages/NSFASLogin';
import StudentLogin from '@/pages/StudentLogin';
import Unauthorized from '@/pages/Unauthorized';
import PartnerProfilePage from '@/pages/admin/PartnerProfile';
import PartnersPage from '@/pages/admin/Partners';
import SponsorProfile from '@/pages/admin/SponsorProfile';
import SponsorsPage from '@/pages/admin/Sponsors';
import UserManagement from '@/pages/admin/UserManagement';
import CounselorRegister from '@/pages/counselors/CounselorRegister';
import InstitutionDashboard from '@/pages/institutions/InstitutionDashboard';
import InstitutionRegister from '@/pages/institutions/InstitutionRegister';
import NSFASRegister from '@/pages/nsfas/NSFASRegister';
import SponsorDashboard from '@/pages/sponsors/SponsorDashboard';
import SponsorLogin from '@/pages/sponsors/SponsorLogin';
import SponsorRegister from '@/pages/sponsors/SponsorRegister';
import ApplyForSponsorship from '@/pages/sponsorships/ApplyForSponsorship';
import StudentSponsorshipStatus from '@/pages/sponsorships/StudentSponsorshipStatus';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { BrowserRouter, Route, Routes } from 'react-router-dom';
import { PartnerCRMLayout } from './components/admin/partners/PartnerCRMLayout';
import { PartnerInquiries } from './components/admin/partners/PartnerInquiries';
import { PartnerList } from './components/admin/partners/PartnerList';
import { PartnerProfile } from './components/admin/partners/PartnerProfile';
import { TiersManager } from './components/admin/partners/TiersManager';
import FAQPage from './components/support/FAQPage';
import ApplicationForm from './pages/ApplicationForm';
import CareerGuidancePage from './pages/CareerGuidancePage';
import CheckoutPage from './pages/CheckoutPage';
import ConsultationsPage from './pages/ConsultationsPage';
import Dashboard from './pages/Dashboard';
import Index from './pages/Index';
import InstitutionDetail from './pages/InstitutionDetail';
import Institutions from './pages/Institutions';
import Login from './pages/Login';
import MeetThandi from './pages/MeetThandi';
import NotFound from './pages/NotFound';
import PartnerDashboard from './pages/PartnerDashboard';
import PartnerInquiry from './pages/PartnerInquiry';
import PaymentCancelled from './pages/PaymentCancelled';
import PaymentPlanSetup from './pages/PaymentPlanSetup';
import PaymentSuccess from './pages/PaymentSuccess';
import Pricing from './pages/Pricing';
import PrivacyPolicy from './pages/PrivacyPolicy';
import ProfileCompletion from './pages/ProfileCompletion';
import ProfileDemo from './pages/ProfileDemo';
import RefundPolicy from './pages/RefundPolicy';
import Register from './pages/Register';
import SponsorshipsPage from './pages/SponsorshipsPage';
import SubscriptionPage from './pages/SubscriptionPage';
import TermsOfService from './pages/TermsOfService';
import UILockAdmin from './pages/UILockAdmin';
import VerificationRequired from './pages/VerificationRequired';

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
                  <AdminAuthGuard>
                    <PartnerDashboard />
                  </AdminAuthGuard>
                }
              />
              <Route
                path="/admin/ui-lock"
                element={
                  <AdminAuthGuard>
                    <UILockAdmin />
                  </AdminAuthGuard>
                }
              />

              {/* Enhanced Partner Management (new primary routes) */}
              <Route
                path="/admin/partners"
                element={
                  <AdminAuthGuard>
                    <PartnersPage />
                  </AdminAuthGuard>
                }
              />
              <Route
                path="/admin/partners/:id"
                element={
                  <AdminAuthGuard>
                    <PartnerProfilePage />
                  </AdminAuthGuard>
                }
              />

              {/* Legacy CRM routes, fallback (optionally keep for now) */}
              <Route
                path="/admin/partners-old"
                element={
                  <AdminAuthGuard>
                    <PartnerCRMLayout />
                  </AdminAuthGuard>
                }
              >
                <Route index element={<PartnerList />} />
                <Route path="inquiries" element={<PartnerInquiries />} />
                <Route path=":id" element={<PartnerProfile />} />
                <Route path="tiers" element={<TiersManager />} />
              </Route>

              {/* Admin dashboard route */}
              <Route
                path="/admin/dashboard"
                element={
                  <AdminAuthGuard>
                    <AdminDashboard />
                  </AdminAuthGuard>
                }
              />

              {/* Admin sponsor management routes */}
              <Route
                path="/admin/sponsors"
                element={
                  <AdminAuthGuard>
                    <SponsorsPage />
                  </AdminAuthGuard>
                }
              />
              <Route
                path="/admin/sponsors/:id"
                element={
                  <AdminAuthGuard>
                    <SponsorProfile />
                  </AdminAuthGuard>
                }
              />

              {/* Admin user management route */}
              <Route
                path="/admin/users"
                element={
                  <AdminAuthGuard>
                    <UserManagement />
                  </AdminAuthGuard>
                }
              />

              {/* Public partner registration flows */}
              <Route path="/sponsors/register" element={<SponsorRegister />} />
              <Route path="/sponsors/login" element={<SponsorLogin />} />
              <Route path="/nsfas/login" element={<NSFASLogin />} />
              <Route path="/institutions/login" element={<InstitutionLogin />} />
              <Route path="/counselors/login" element={<CounselorLogin />} />
              <Route path="/students/login" element={<StudentLogin />} />
              <Route path="/institutions/register" element={<InstitutionRegister />} />
              <Route path="/nsfas/register" element={<NSFASRegister />} />
              <Route path="/counselors/register" element={<CounselorRegister />} />
              <Route
                path="/sponsors/dashboard"
                element={
                  <AuthGuard>
                    <SponsorGuard>
                      <SponsorDashboard />
                    </SponsorGuard>
                  </AuthGuard>
                }
              />

              <Route path="/sponsorships/apply" element={<ApplyForSponsorship />} />
              <Route path="/sponsorships/status" element={<StudentSponsorshipStatus />} />

              {/* Institution dashboard route */}
              <Route
                path="/institutions/dashboard"
                element={
                  <AuthGuard>
                    <InstitutionGuard>
                      <InstitutionDashboard />
                    </InstitutionGuard>
                  </AuthGuard>
                }
              />

              {/* Verification required route (MUST be public for redirects) */}
              <Route path="/verification-required" element={<VerificationRequired />} />

              {/* Access denied */}
              <Route path="/unauthorized" element={<Unauthorized />} />

              {/* 404 route */}
              <Route path="*" element={<NotFound />} />
            </Routes>
          </AuthProvider>
        </BrowserRouter>
      </TooltipProvider>
    </QueryClientProvider>
  </GlobalErrorBoundary>
);

export default App;

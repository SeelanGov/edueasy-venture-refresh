
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { AuthProvider } from "@/contexts/AuthContext";
import { AuthGuard } from "@/components/AuthGuard";
import { AdminAuthGuard } from "@/components/AdminAuthGuard";
import { GlobalErrorBoundary } from "@/components/error-handling/GlobalErrorBoundary";
import Index from "./pages/Index";
import Dashboard from "./pages/Dashboard";
import Register from "./pages/Register";
import ProfileDemo from "./pages/ProfileDemo";
import PartnerDashboard from "./pages/PartnerDashboard";
import ProfileCompletion from "./pages/ProfileCompletion";
import Pricing from "./pages/Pricing";
import SubscriptionPage from "./pages/SubscriptionPage";
import MeetThandi from "./pages/MeetThandi";
import Institutions from "./pages/Institutions";
import InstitutionDetail from "./pages/InstitutionDetail";
import PartnerInquiry from "./pages/PartnerInquiry";
import SponsorshipsPage from "./pages/SponsorshipsPage";
import CareerGuidancePage from "./pages/CareerGuidancePage";
import ConsultationsPage from "./pages/ConsultationsPage";
import FAQPage from "./components/support/FAQPage";
import NotFound from "./pages/NotFound";
import CheckoutPage from "./pages/CheckoutPage";
import UILockAdmin from "./pages/UILockAdmin";
import { PartnerCRMLayout } from "./components/admin/partners/PartnerCRMLayout";
import { PartnerList } from "./components/admin/partners/PartnerList";
import { PartnerProfile } from "./components/admin/partners/PartnerProfile";
import { TiersManager } from "./components/admin/partners/TiersManager";
import { PartnerInquiries } from "./components/admin/partners/PartnerInquiries";
import Login from "./pages/Login";
import SponsorsPage from '@/pages/admin/Sponsors';
import SponsorProfile from '@/pages/admin/SponsorProfile';
import SponsorRegister from "@/pages/sponsors/SponsorRegister";
import SponsorLogin from "@/pages/sponsors/SponsorLogin";
import SponsorDashboard from "@/pages/sponsors/SponsorDashboard";
import ApplyForSponsorship from "@/pages/sponsorships/ApplyForSponsorship";
import StudentSponsorshipStatus from "@/pages/sponsorships/StudentSponsorshipStatus";
import PartnersPage from "@/pages/admin/Partners";
import PartnerProfilePage from "@/pages/admin/PartnerProfile";
import VerificationRequired from "./pages/VerificationRequired";
import { VerificationGuard } from "@/components/VerificationGuard"; // <-- Fix: import VerificationGuard

const queryClient = new QueryClient();

const App = () => (
  <GlobalErrorBoundary>
    <QueryClientProvider client={queryClient}>
      <TooltipProvider>
        <Toaster />
        <Sonner />
        <BrowserRouter>
          <AuthProvider>
            <Routes>
              {/* Public routes */}
              <Route path="/" element={<Index />} />
              <Route path="/login" element={
                <AuthGuard requiresAuth={false}>
                  <Login />
                </AuthGuard>
              } />
              <Route path="/pricing" element={<Pricing />} />
              <Route path="/meet-thandi" element={<MeetThandi />} />
              <Route path="/institutions" element={<Institutions />} />
              <Route path="/institutions/:id" element={<InstitutionDetail />} />
              <Route path="/partner-inquiry" element={<PartnerInquiry />} />
              <Route path="/faqs" element={<FAQPage />} />
              <Route path="/sponsorships" element={<SponsorshipsPage />} />
              <Route path="/checkout" element={<CheckoutPage />} />
              <Route path="/career-guidance" element={<CareerGuidancePage />} />
              <Route path="/consultations" element={<ConsultationsPage />} />

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
                    <VerificationGuard>
                      <ProfileCompletion />
                    </VerificationGuard>
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

              {/* Admin sponsor management routes */}
              <Route path="/admin/sponsors" element={<SponsorsPage />} />
              <Route path="/admin/sponsors/:id" element={<SponsorProfile />} />

              {/* Public sponsor ecosystem flows */}
              <Route path="/sponsors/register" element={<SponsorRegister />} />
              <Route path="/sponsors/login" element={<SponsorLogin />} />
              <Route path="/sponsors/dashboard" element={<SponsorDashboard />} />

              <Route path="/sponsorships/apply" element={<ApplyForSponsorship />} />
              <Route path="/sponsorships/status" element={<StudentSponsorshipStatus />} />

              {/* Verification required route (MUST be public for redirects) */}
              <Route path="/verification-required" element={<VerificationRequired />} />
              
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


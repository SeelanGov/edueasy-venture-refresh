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
              
              {/* Protected routes */}
              <Route
                path="/dashboard"
                element={
                  <AuthGuard>
                    <Dashboard />
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
                    <SubscriptionPage />
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
              
              {/* Partner CRM Admin routes */}
              <Route
                path="/admin/partners"
                element={
                  <AdminAuthGuard>
                    <PartnerCRMLayout />
                  </AdminAuthGuard>
                }
              >
                <Route index element={<PartnerList />} />
                <Route path=":id" element={<PartnerProfile />} />
                <Route path="tiers" element={<TiersManager />} />
              </Route>
              
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

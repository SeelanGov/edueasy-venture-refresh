
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
import InstitutionPricing from "./pages/InstitutionPricing";
import CheckoutPage from "./pages/CheckoutPage";
import MeetThandi from "./pages/MeetThandi";
import Institutions from "./pages/Institutions";
import SponsorshipsPage from "./pages/SponsorshipsPage";
import FAQPage from "./components/support/FAQPage";
import NotFound from "./pages/NotFound";

// Admin Pages
import AdminDashboardOverview from "./pages/admin/AdminDashboardOverview";
import AdminUsers from "./pages/admin/AdminUsers";
import AdminPayments from "./pages/admin/AdminPayments";
import AdminPlans from "./pages/admin/AdminPlans";
import AdminSessions from "./pages/admin/AdminSessions";
import AdminUserProfile from "./pages/admin/AdminUserProfile";
import AdminPartners from './pages/admin/AdminPartners';
import AdminPartnerProfile from './pages/admin/AdminPartnerProfile';

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
              <Route path="/institution-pricing" element={<InstitutionPricing />} />
              <Route path="/checkout" element={<CheckoutPage />} />
              <Route path="/meet-thandi" element={<MeetThandi />} />
              <Route path="/institutions" element={<Institutions />} />
              <Route path="/faqs" element={<FAQPage />} />
              <Route path="/sponsorships" element={<SponsorshipsPage />} />
              
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
              
              {/* Legacy admin route - redirect to new admin dashboard */}
              <Route
                path="/partner-dashboard"
                element={
                  <AdminAuthGuard>
                    <PartnerDashboard />
                  </AdminAuthGuard>
                }
              />
              
              {/* New Admin CRM Routes */}
              <Route
                path="/admin/dashboard"
                element={
                  <AdminAuthGuard>
                    <AdminDashboardOverview />
                  </AdminAuthGuard>
                }
              />
              <Route
                path="/admin/users"
                element={
                  <AdminAuthGuard>
                    <AdminUsers />
                  </AdminAuthGuard>
                }
              />
              <Route
                path="/admin/users/:userId"
                element={
                  <AdminAuthGuard>
                    <AdminUserProfile />
                  </AdminAuthGuard>
                }
              />
              <Route
                path="/admin/partners"
                element={
                  <AdminAuthGuard>
                    <AdminPartners />
                  </AdminAuthGuard>
                }
              />
              <Route
                path="/admin/partners/:partnerId"
                element={
                  <AdminAuthGuard>
                    <AdminPartnerProfile />
                  </AdminAuthGuard>
                }
              />
              <Route
                path="/admin/payments"
                element={
                  <AdminAuthGuard>
                    <AdminPayments />
                  </AdminAuthGuard>
                }
              />
              <Route
                path="/admin/plans"
                element={
                  <AdminAuthGuard>
                    <AdminPlans />
                  </AdminAuthGuard>
                }
              />
              <Route
                path="/admin/sessions"
                element={
                  <AdminAuthGuard>
                    <AdminSessions />
                  </AdminAuthGuard>
                }
              />
              
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

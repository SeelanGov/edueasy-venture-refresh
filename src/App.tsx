
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
import NotFound from "./pages/NotFound";

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
              
              {/* Admin routes */}
              <Route
                path="/partner-dashboard"
                element={
                  <AdminAuthGuard>
                    <PartnerDashboard />
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

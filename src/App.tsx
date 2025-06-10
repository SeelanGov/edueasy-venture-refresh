import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { AuthProvider } from '@/contexts/AuthContext';
import { Toaster } from '@/components/ui/toaster';

// Pages
import Index from '@/pages/Index';
import Login from '@/pages/Login';
import Register from '@/pages/Register';
import Dashboard from '@/pages/Dashboard';
import Profile from '@/pages/Profile';
import Applications from '@/pages/Applications';
import ApplicationDetail from '@/pages/ApplicationDetail';
import NewApplication from '@/pages/NewApplication';
import Settings from '@/pages/Settings';
import NotFound from '@/pages/NotFound';
import AdminDashboard from '@/pages/admin/AdminDashboard';
import AdminUsers from '@/pages/admin/AdminUsers';
import AdminApplications from '@/pages/admin/AdminApplications';
import AdminSettings from '@/pages/admin/AdminSettings';
import AdminPartners from '@/pages/admin/AdminPartners';
import AdminPartnerDetail from '@/pages/admin/AdminPartnerDetail';
import AdminSponsors from '@/pages/admin/AdminSponsors';
import AdminSponsorDetail from '@/pages/admin/AdminSponsorDetail';
import VerificationRequired from '@/pages/VerificationRequired';
import { VerificationGuard } from '@/components/auth/VerificationGuard';

// Create a client
const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      refetchOnWindowFocus: false,
      retry: 1,
    },
  },
});

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <AuthProvider>
        <Router>
          <div className="App">
            <Routes>
              {/* Public routes */}
              <Route path="/" element={<Index />} />
              <Route path="/login" element={<Login />} />
              <Route path="/register" element={<Register />} />
              <Route path="/verification-required" element={<VerificationRequired />} />
              
              {/* Protected routes with verification guard */}
              <Route path="/dashboard" element={
                <VerificationGuard>
                  <Dashboard />
                </VerificationGuard>
              } />
              <Route path="/profile" element={
                <VerificationGuard>
                  <Profile />
                </VerificationGuard>
              } />
              <Route path="/applications" element={
                <VerificationGuard>
                  <Applications />
                </VerificationGuard>
              } />
              <Route path="/applications/:id" element={
                <VerificationGuard>
                  <ApplicationDetail />
                </VerificationGuard>
              } />
              <Route path="/applications/new" element={
                <VerificationGuard>
                  <NewApplication />
                </VerificationGuard>
              } />
              <Route path="/settings" element={
                <VerificationGuard>
                  <Settings />
                </VerificationGuard>
              } />

              {/* Admin routes */}
              <Route path="/admin" element={<AdminDashboard />} />
              <Route path="/admin/users" element={<AdminUsers />} />
              <Route path="/admin/applications" element={<AdminApplications />} />
              <Route path="/admin/settings" element={<AdminSettings />} />
              <Route path="/admin/partners" element={<AdminPartners />} />
              <Route path="/admin/partners/:id" element={<AdminPartnerDetail />} />
              <Route path="/admin/sponsors" element={<AdminSponsors />} />
              <Route path="/admin/sponsors/:id" element={<AdminSponsorDetail />} />

              {/* 404 route */}
              <Route path="*" element={<NotFound />} />
            </Routes>
          </div>
          <Toaster />
        </Router>
      </AuthProvider>
    </QueryClientProvider>
  );
}

export default App;

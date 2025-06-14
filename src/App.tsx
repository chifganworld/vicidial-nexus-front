
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { AuthProvider } from './contexts/AuthContext';
import ProtectedRoute from './components/ProtectedRoute';
import IndexPage from './pages/Index';
import AuthPage from './pages/AuthPage';
import AgentConsole from './pages/AgentConsole';
import SupervisorDashboard from './pages/SupervisorDashboard';
import ReportsPage from './pages/ReportsPage';
import IntegrationPage from './pages/IntegrationPage';
import SettingsPage from './pages/SettingsPage';
import DisplaySettingsPage from './pages/settings/DisplaySettingsPage';
import UserManagementPage from './pages/UserManagementPage';
import NotFound from './pages/NotFound';
import { Toaster as SonnerToaster } from '@/components/ui/sonner';
import { Toaster as ShadcnToaster } from "@/components/ui/toaster";
import { ThemeProvider } from './components/ThemeProvider';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import AdministrationPage from './pages/AdministrationPage';
import AuditLogPage from './pages/AuditLogPage';
import SystemHealthPage from './pages/SystemHealthPage';
import { SipProvider } from '@/providers/SipProvider';
import UnauthorizedPage from './pages/UnauthorizedPage';
import { DisplaySettingsProvider } from './contexts/DisplaySettingsContext';
import HopperPage from './pages/HopperPage';
import CampaignSettingsPage from './pages/CampaignSettingsPage';

const queryClient = new QueryClient();

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <ThemeProvider attribute="class" defaultTheme="system" enableSystem>
        <DisplaySettingsProvider>
          <Router>
            <AuthProvider>
              <Routes>
                <Route path="/" element={<IndexPage />} />
                <Route path="/auth" element={<AuthPage />} />
                <Route path="/unauthorized" element={<UnauthorizedPage />} />
                
                {/* Agent Route */}
                <Route element={<ProtectedRoute allowedRoles={['agent', 'supervisor', 'admin']} />}>
                  <Route path="/agent" element={<SipProvider><AgentConsole /></SipProvider>} />
                </Route>

                {/* Supervisor Routes */}
                <Route element={<ProtectedRoute allowedRoles={['supervisor', 'admin']} />}>
                  <Route path="/supervisor" element={<SupervisorDashboard />} />
                  <Route path="/reports" element={<ReportsPage />} />
                  <Route path="/hopper" element={<HopperPage />} />
                  <Route path="/settings/campaigns" element={<CampaignSettingsPage />} />
                </Route>

                {/* Admin Routes */}
                <Route element={<ProtectedRoute allowedRoles={['admin']} />}>
                  <Route path="/admin" element={<AdministrationPage />} />
                  <Route path="/admin/audit-log" element={<AuditLogPage />} />
                  <Route path="/admin/system-health" element={<SystemHealthPage />} />
                  <Route path="/settings" element={<SettingsPage />} />
                  <Route path="/settings/display" element={<DisplaySettingsPage />} />
                  <Route path="/settings/users" element={<UserManagementPage />} />
                  <Route path="/integration" element={<IntegrationPage />} />
                </Route>

                <Route path="*" element={<NotFound />} />
              </Routes>
              <SonnerToaster richColors position="top-right" />
              <ShadcnToaster />
            </AuthProvider>
          </Router>
        </DisplaySettingsProvider>
      </ThemeProvider>
    </QueryClientProvider>
  );
}

export default App;

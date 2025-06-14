import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { AuthProvider } from './contexts/AuthContext';
import ProtectedRoute from './components/ProtectedRoute';
import IndexPage from './pages/Index';
import AuthPage from './pages/AuthPage';
import AgentDashboard from './pages/AgentDashboard';
import SupervisorDashboard from './pages/SupervisorDashboard';
import ReportsPage from './pages/ReportsPage';
import IntegrationPage from './pages/IntegrationPage';
import SettingsPage from './pages/SettingsPage';
import DisplaySettingsPage from './pages/settings/DisplaySettingsPage';
import UserManagementPage from './pages/settings/UserManagementPage';
import NotFound from './pages/NotFound';
import { Toaster as SonnerToaster } from '@/components/ui/sonner';
import { Toaster as ShadcnToaster } from "@/components/ui/toaster";
import { ThemeProvider } from './components/ThemeProvider';

function App() {
  return (
    <ThemeProvider attribute="class" defaultTheme="system" enableSystem>
      <Router>
        <AuthProvider>
          <Routes>
            <Route path="/" element={<IndexPage />} />
            <Route path="/auth" element={<AuthPage />} />
            
            {/* Protected Routes using layout structure */}
            <Route element={<ProtectedRoute allowedRoles={['agent', 'supervisor', 'admin']} />}>
              <Route path="/agent" element={<AgentDashboard />} />
            </Route>

            <Route element={<ProtectedRoute allowedRoles={['supervisor', 'admin']} />}>
              <Route path="/supervisor" element={<SupervisorDashboard />} />
              <Route path="/reports" element={<ReportsPage />} />
              {/* Settings routes are grouped with supervisor/admin access */}
              <Route path="/settings" element={<SettingsPage />} />
              <Route path="/settings/display" element={<DisplaySettingsPage />} />
              <Route path="/settings/users" element={<UserManagementPage />} />
            </Route>

            <Route element={<ProtectedRoute allowedRoles={['admin', 'supervisor']} />}>
              {/* Integration page moved here to group with other settings, if access matches */}
              {/* Or keep it separate if its role requirements are distinct and simpler */}
              <Route path="/integration" element={<IntegrationPage />} />
            </Route>

            <Route path="*" element={<NotFound />} />
          </Routes>
          <SonnerToaster richColors position="top-right" />
          <ShadcnToaster />
        </AuthProvider>
      </Router>
    </ThemeProvider>
  );
}

export default App;

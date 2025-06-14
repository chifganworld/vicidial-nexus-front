
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { AuthProvider } from './contexts/AuthContext';
import ProtectedRoute from './components/ProtectedRoute';
import IndexPage from './pages/Index';
import AuthPage from './pages/AuthPage';
import AgentDashboard from './pages/AgentDashboard';
import SupervisorDashboard from './pages/SupervisorDashboard';
import ReportsPage from './pages/ReportsPage';
import IntegrationPage from './pages/IntegrationPage';
import NotFound from './pages/NotFound';
import { Toaster as SonnerToaster } from '@/components/ui/sonner';
import { Toaster as ShadcnToaster } from "@/components/ui/toaster";

function App() {
  return (
    <Router> {/* Router now wraps AuthProvider */}
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
          </Route>
          <Route element={<ProtectedRoute allowedRoles={['admin', 'supervisor']} />}>
            <Route path="/integration" element={<IntegrationPage />} />
          </Route>

          <Route path="*" element={<NotFound />} />
        </Routes>
        <SonnerToaster richColors position="top-right" />
        <ShadcnToaster />
      </AuthProvider>
    </Router>
  );
}

export default App;

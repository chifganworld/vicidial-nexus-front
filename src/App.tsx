
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { AuthProvider } from './contexts/AuthContext';
import ProtectedRoute from './components/ProtectedRoute';
import IndexPage from './pages/Index';
import AuthPage from './pages/AuthPage';
import AgentDashboard from './pages/AgentDashboard';
import SupervisorDashboard from './pages/SupervisorDashboard';
import ReportsPage from './pages/ReportsPage';
import IntegrationPage from './pages/IntegrationPage'; // Import the new page
import NotFound from './pages/NotFound';
import { Toaster as SonnerToaster } from '@/components/ui/sonner'; // Using Sonner
import { Toaster as ShadcnToaster } from "@/components/ui/toaster"; // Shadcn Toaster for useToast hook


function App() {
  return (
    <AuthProvider>
      <Router>
        <Routes>
          <Route path="/" element={<IndexPage />} />
          <Route path="/auth" element={<AuthPage />} />
          
          {/* Protected Routes */}
          <Route path="/agent" element={<ProtectedRoute allowedRoles={['agent', 'supervisor', 'admin']}><AgentDashboard /></ProtectedRoute>} />
          <Route path="/supervisor" element={<ProtectedRoute allowedRoles={['supervisor', 'admin']}><SupervisorDashboard /></ProtectedRoute>} />
          <Route path="/reports" element={<ProtectedRoute allowedRoles={['supervisor', 'admin']}><ReportsPage /></ProtectedRoute>} />
          <Route path="/integration" element={<ProtectedRoute allowedRoles={['admin', 'supervisor']}><IntegrationPage /></ProtectedRoute>} /> {/* Added Integration Page Route */}

          <Route path="*" element={<NotFound />} />
        </Routes>
      </Router>
      <SonnerToaster richColors position="top-right" />
      <ShadcnToaster /> {/* Ensure this is present if useToast from shadcn/ui is used anywhere */}
    </AuthProvider>
  );
}

export default App;

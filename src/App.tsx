
import { Toaster } from "@/components/ui/toaster";
import { Toaster as SonnerToaster } from "@/components/ui/sonner"; // Renamed to avoid conflict
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Index from "./pages/Index";
import NotFound from "./pages/NotFound";
import AgentDashboard from "./pages/AgentDashboard";
import SupervisorDashboard from "./pages/SupervisorDashboard";
import ReportsPage from "./pages/ReportsPage";
import AuthPage from "./pages/AuthPage"; // Import AuthPage
import { AuthProvider } from "./contexts/AuthContext"; // Import AuthProvider
import ProtectedRoute from "./components/ProtectedRoute"; // Import ProtectedRoute

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <SonnerToaster /> {/* Use renamed import */}
      <BrowserRouter>
        <AuthProvider> {/* Wrap routes with AuthProvider */}
          <Routes>
            <Route path="/" element={<Index />} />
            <Route path="/auth" element={<AuthPage />} /> {/* Add AuthPage route */}
            
            {/* Protected Routes */}
            <Route element={<ProtectedRoute />}>
              <Route path="/agent" element={<AgentDashboard />} />
              <Route path="/supervisor" element={<SupervisorDashboard />} />
              <Route path="/reports" element={<ReportsPage />} />
            </Route>
            
            {/* ADD ALL CUSTOM ROUTES ABOVE THE CATCH-ALL "*" ROUTE */}
            <Route path="*" element={<NotFound />} />
          </Routes>
        </AuthProvider>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;

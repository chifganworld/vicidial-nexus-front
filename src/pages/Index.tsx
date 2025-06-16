
import { Link, useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { LayoutDashboard, UserCheck, FileText, LogIn, LogOut, Shield } from "lucide-react";
import { useAuth } from "@/contexts/AuthContext"; // Import useAuth
import { toast } from "@/components/ui/use-toast";
import Footer from "@/components/layout/Footer";

const Index = () => {
  const { session, signOut, loading: authLoading } = useAuth(); // Use auth context
  const navigate = useNavigate();

  const handleLogout = async () => {
    try {
      await signOut();
      toast({ title: "Logged Out", description: "You have been successfully logged out." });
      // Navigation to /auth is handled by AuthContext
    } catch (error: any) {
      toast({ title: "Logout Failed", description: error.message, variant: "destructive" });
    }
  };

  const handleLoginClick = () => {
    navigate("/auth");
  };

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gradient-to-br from-slate-900 to-slate-700 text-white p-4">
      <div className="text-center mb-12">
        <h1 className="text-5xl font-bold mb-4 animate-fade-in">Vicidial Nexus</h1>
        <p className="text-xl text-slate-300 animate-fade-in animation-delay-300">
          Your Next-Generation Call Center Interface
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 max-w-6xl w-full mb-12">
        <Link to="/agent" className="hover-scale-custom">
          <div className="bg-slate-800 p-6 rounded-lg shadow-xl hover:bg-slate-700 transition-all duration-300 animate-scale-in animation-delay-500 h-full">
            <div className="flex items-center justify-center mb-4 text-blue-400">
              <UserCheck size={48} />
            </div>
            <h2 className="text-2xl font-semibold mb-2 text-center">Agent Dashboard</h2>
            <p className="text-slate-400 text-center">Access your daily tasks, dialer, and lead management tools.</p>
          </div>
        </Link>

        <Link to="/supervisor" className="hover-scale-custom">
          <div className="bg-slate-800 p-6 rounded-lg shadow-xl hover:bg-slate-700 transition-all duration-300 animate-scale-in animation-delay-700 h-full">
            <div className="flex items-center justify-center mb-4 text-green-400">
              <LayoutDashboard size={48} />
            </div>
            <h2 className="text-2xl font-semibold mb-2 text-center">Supervisor Dashboard</h2>
            <p className="text-slate-400 text-center">Monitor team performance, manage agents, and oversee campaigns.</p>
          </div>
        </Link>

        <Link to="/reports" className="hover-scale-custom">
          <div className="bg-slate-800 p-6 rounded-lg shadow-xl hover:bg-slate-700 transition-all duration-300 animate-scale-in animation-delay-900 h-full">
            <div className="flex items-center justify-center mb-4 text-purple-400">
              <FileText size={48} />
            </div>
            <h2 className="text-2xl font-semibold mb-2 text-center">Reports Center</h2>
            <p className="text-slate-400 text-center">Generate and view detailed reports on all call center activities.</p>
          </div>
        </Link>
        
        <Link to="/admin" className="hover-scale-custom">
          <div className="bg-slate-800 p-6 rounded-lg shadow-xl hover:bg-slate-700 transition-all duration-300 animate-scale-in animation-delay-1100 h-full">
            <div className="flex items-center justify-center mb-4 text-red-400">
              <Shield size={48} />
            </div>
            <h2 className="text-2xl font-semibold mb-2 text-center">Administration</h2>
            <p className="text-slate-400 text-center">Manage system settings, users, and integrations.</p>
          </div>
        </Link>
      </div>
      
      {authLoading ? (
        <Button size="lg" className="bg-gray-500 animate-pulse" disabled>
          Loading...
        </Button>
      ) : session ? (
        <div className="flex flex-col items-center space-y-4">
          <p className="text-slate-300">Welcome back, {session.user.email}!</p>
          <Button 
            size="lg" 
            className="bg-red-500 hover:bg-red-600 animate-fade-in animation-delay-1200"
            onClick={handleLogout}
          >
            <LogOut className="mr-2 h-5 w-5" /> Logout
          </Button>
        </div>
      ) : (
        <Button 
          size="lg" 
          className="bg-blue-500 hover:bg-blue-600 animate-fade-in animation-delay-1200"
          onClick={handleLoginClick}
        >
          <LogIn className="mr-2 h-5 w-5" /> Login / Sign Up
        </Button>
      )}

      <Footer />
    </div>
  );
};

export default Index;

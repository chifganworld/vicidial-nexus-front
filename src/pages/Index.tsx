
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { LayoutDashboard, UserCheck, FileText, LogIn } from "lucide-react";

const Index = () => {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gradient-to-br from-slate-900 to-slate-700 text-white p-4">
      <div className="text-center mb-12">
        <h1 className="text-5xl font-bold mb-4 animate-fade-in">Vicidial Nexus</h1>
        <p className="text-xl text-slate-300 animate-fade-in animation-delay-300">
          Your Next-Generation Call Center Interface
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-4xl w-full mb-12">
        <Link to="/agent" className="hover-scale-custom">
          <div className="bg-slate-800 p-6 rounded-lg shadow-xl hover:bg-slate-700 transition-all duration-300 animate-scale-in animation-delay-500">
            <div className="flex items-center justify-center mb-4 text-blue-400">
              <UserCheck size={48} />
            </div>
            <h2 className="text-2xl font-semibold mb-2 text-center">Agent Dashboard</h2>
            <p className="text-slate-400 text-center">Access your daily tasks, dialer, and lead management tools.</p>
          </div>
        </Link>

        <Link to="/supervisor" className="hover-scale-custom">
          <div className="bg-slate-800 p-6 rounded-lg shadow-xl hover:bg-slate-700 transition-all duration-300 animate-scale-in animation-delay-700">
            <div className="flex items-center justify-center mb-4 text-green-400">
              <LayoutDashboard size={48} />
            </div>
            <h2 className="text-2xl font-semibold mb-2 text-center">Supervisor Dashboard</h2>
            <p className="text-slate-400 text-center">Monitor team performance, manage agents, and oversee campaigns.</p>
          </div>
        </Link>

        <Link to="/reports" className="hover-scale-custom">
          <div className="bg-slate-800 p-6 rounded-lg shadow-xl hover:bg-slate-700 transition-all duration-300 animate-scale-in animation-delay-900">
            <div className="flex items-center justify-center mb-4 text-purple-400">
              <FileText size={48} />
            </div>
            <h2 className="text-2xl font-semibold mb-2 text-center">Reports Center</h2>
            <p className="text-slate-400 text-center">Generate and view detailed reports on all call center activities.</p>
          </div>
        </Link>
      </div>
      
      {/* Placeholder for Login button - assuming auth will be added later */}
      <Button size="lg" className="bg-blue-500 hover:bg-blue-600 animate-fade-in animation-delay-1200">
        <LogIn className="mr-2 h-5 w-5" /> Login
      </Button>

      <footer className="mt-12 text-sm text-slate-500 animate-fade-in animation-delay-1500">
        <p>&copy; {new Date().getFullYear()} Vicidial Nexus. All rights reserved.</p>
        <p>Powered by Lovable AI</p>
      </footer>

      {/* 
        Removed <style jsx> block that was causing build errors.
        The animations defined here (animate-fade-in, animate-scale-in, animation-delay-*) 
        are defined using Tailwind's animation capabilities or custom CSS if needed.
        The hover effect class 'hover-scale' was changed to 'hover-scale-custom'
        to avoid conflict if Tailwind has a similar utility.
        We can add these animations back using Tailwind or a separate CSS file.
      */}
    </div>
  );
};

export default Index;

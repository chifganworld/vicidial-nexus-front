
import React, { useState, useEffect } from 'react';
import LoginForm from '@/components/auth/LoginForm';
import SignUpForm from '@/components/auth/SignUpForm';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { useAuth } from '@/contexts/AuthContext';
import { useNavigate } from 'react-router-dom';
import { LogIn } from 'lucide-react';

const AuthPage: React.FC = () => {
  const [isLoginView, setIsLoginView] = useState(true);
  const { session, loading: authLoading } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    if (!authLoading && session) {
      navigate('/agent'); // Or to a more appropriate dashboard page
    }
  }, [session, authLoading, navigate]);

  if (authLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-100">
        <p>Loading...</p>
      </div>
    );
  }
  
  // If already logged in (e.g. direct navigation to /auth), redirect handled by useEffect

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gradient-to-br from-slate-900 to-slate-700 p-4">
      <div className="text-center mb-8">
        <LogIn size={48} className="mx-auto text-blue-400 mb-4" />
        <h1 className="text-4xl font-bold text-white">Vicidial Nexus</h1>
        <p className="text-lg text-slate-300">
          {isLoginView ? 'Login to your account' : 'Create a new account'}
        </p>
      </div>
      <Card className="w-full max-w-md shadow-xl">
        <CardHeader>
          <CardTitle className="text-2xl">{isLoginView ? 'Login' : 'Sign Up'}</CardTitle>
          <CardDescription>
            {isLoginView ? 'Enter your credentials to access your dashboard.' : 'Fill in the details to create your account.'}
          </CardDescription>
        </CardHeader>
        <CardContent>
          {isLoginView ? (
            <LoginForm onSwitchToSignUp={() => setIsLoginView(false)} />
          ) : (
            <SignUpForm onSwitchToLogin={() => setIsLoginView(true)} />
          )}
        </CardContent>
      </Card>
       <footer className="mt-12 text-sm text-slate-500">
        <p>&copy; {new Date().getFullYear()} Vicidial Nexus. All rights reserved.</p>
      </footer>
    </div>
  );
};

export default AuthPage;

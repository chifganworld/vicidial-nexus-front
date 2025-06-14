
import React, { useState } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { toast } from '@/components/ui/use-toast';
import { Mail, Lock, ChromeIcon } from 'lucide-react'; // Added ChromeIcon for Google

interface LoginFormProps {
  onSwitchToSignUp: () => void;
}

const LoginForm: React.FC<LoginFormProps> = ({ onSwitchToSignUp }) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [socialLoading, setSocialLoading] = useState(false);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      const { error } = await supabase.auth.signInWithPassword({
        email,
        password,
      });
      if (error) throw error;
      // Navigation is handled by AuthContext on SIGNED_IN event
      toast({ title: "Login Successful", description: "Welcome back!" });
    } catch (error: any) {
      toast({
        title: "Login Failed",
        description: error.message || "An unexpected error occurred.",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const handleGoogleLogin = async () => {
    setSocialLoading(true);
    try {
      const { error } = await supabase.auth.signInWithOAuth({
        provider: 'google',
        options: {
          redirectTo: window.location.origin, // Or a more specific redirect like window.location.origin + '/agent'
        },
      });
      if (error) throw error;
      // Supabase handles the redirect and onAuthStateChange will pick up the session.
    } catch (error: any) {
      toast({
        title: "Google Sign-In Failed",
        description: error.message || "An unexpected error occurred.",
        variant: "destructive",
      });
    } finally {
      // setLoading(false); // No need, page will redirect or error will be shown
      // Set socialLoading to false only if error occurred and no redirect happened
      // However, usually a redirect happens even on initial error setup from Supabase/Google.
      // If the config is wrong, Supabase/Google page usually shows the error.
    }
  };

  return (
    <form onSubmit={handleLogin} className="space-y-6">
      <div>
        <Label htmlFor="email">Email</Label>
        <div className="relative mt-1">
          <Mail className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400" />
          <Input
            id="email"
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
            placeholder="you@example.com"
            className="pl-10"
          />
        </div>
      </div>
      <div>
        <Label htmlFor="password">Password</Label>
        <div className="relative mt-1">
          <Lock className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400" />
          <Input
            id="password"
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
            placeholder="••••••••"
            className="pl-10"
          />
        </div>
      </div>
      <Button type="submit" className="w-full" disabled={loading || socialLoading}>
        {loading ? 'Logging in...' : 'Login'}
      </Button>
      
      <div className="relative my-4">
        <div className="absolute inset-0 flex items-center">
          <span className="w-full border-t" />
        </div>
        <div className="relative flex justify-center text-xs uppercase">
          <span className="bg-card px-2 text-muted-foreground">
            Or continue with
          </span>
        </div>
      </div>

      <Button 
        variant="outline" 
        type="button" 
        className="w-full" 
        onClick={handleGoogleLogin}
        disabled={loading || socialLoading}
      >
        {socialLoading ? (
            'Redirecting to Google...'
        ) : (
            <>
                <ChromeIcon className="mr-2 h-4 w-4" /> Google
            </>
        )}
      </Button>

      <p className="text-center text-sm text-gray-600">
        Don't have an account?{' '}
        <Button variant="link" type="button" onClick={onSwitchToSignUp} className="p-0 h-auto font-semibold text-primary">
          Sign up
        </Button>
      </p>
    </form>
  );
};

export default LoginForm;

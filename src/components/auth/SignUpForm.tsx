
import React, { useState } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { toast } from '@/components/ui/use-toast';
import { Mail, Lock, User as UserIcon } from 'lucide-react';

interface SignUpFormProps {
  onSwitchToLogin: () => void;
}

const SignUpForm: React.FC<SignUpFormProps> = ({ onSwitchToLogin }) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [fullName, setFullName] = useState('');
  const [username, setUsername] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSignUp = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      const redirectUrl = `${window.location.origin}/agent`; // Redirect to agent dashboard after email confirmation
      const { data, error } = await supabase.auth.signUp({
        email,
        password,
        options: {
          emailRedirectTo: redirectUrl,
          data: { // This data is passed to raw_user_meta_data for the trigger
            full_name: fullName,
            username: username,
            // avatar_url could be added here if collected
          }
        }
      });

      if (error) throw error;
      
      if (data.session) {
        // User is signed in immediately (if email confirmation is off or auto-confirmed)
         toast({ title: "Sign Up Successful", description: "Welcome! You are now logged in." });
        // Navigation handled by AuthContext
      } else if (data.user && !data.session) {
        // User created, needs email confirmation
        toast({
          title: "Sign Up Successful",
          description: "Please check your email to confirm your account.",
        });
      } else {
        toast({
          title: "Sign Up Attempted",
          description: "Please follow any instructions provided.",
        });
      }

    } catch (error: any) {
      toast({
        title: "Sign Up Failed",
        description: error.message || "An unexpected error occurred.",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSignUp} className="space-y-6">
      <div>
        <Label htmlFor="fullName">Full Name</Label>
        <div className="relative mt-1">
          <UserIcon className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400" />
          <Input
            id="fullName"
            type="text"
            value={fullName}
            onChange={(e) => setFullName(e.target.value)}
            required
            placeholder="John Doe"
            className="pl-10"
          />
        </div>
      </div>
      <div>
        <Label htmlFor="username">Username (Optional)</Label>
         <div className="relative mt-1">
          <UserIcon className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400" />
          <Input
            id="username"
            type="text"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            placeholder="johndoe"
            className="pl-10"
          />
        </div>
      </div>
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
            minLength={6}
            placeholder="•••••••• (min. 6 characters)"
            className="pl-10"
          />
        </div>
      </div>
      <Button type="submit" className="w-full" disabled={loading}>
        {loading ? 'Signing up...' : 'Sign Up'}
      </Button>
      <p className="text-center text-sm text-gray-600">
        Already have an account?{' '}
        <Button variant="link" type="button" onClick={onSwitchToLogin} className="p-0 h-auto font-semibold text-primary">
          Login
        </Button>
      </p>
    </form>
  );
};

export default SignUpForm;

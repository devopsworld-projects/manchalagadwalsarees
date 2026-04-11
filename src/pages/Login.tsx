import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { supabase } from '@/integrations/supabase/client';
import { AnnouncementBar } from '@/components/AnnouncementBar';
import { Navbar } from '@/components/Navbar';
import { Footer } from '@/components/Footer';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { toast } from 'sonner';
import { Mail, Lock, ArrowRight } from 'lucide-react';

export default function Login() {
  const navigate = useNavigate();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [showForgot, setShowForgot] = useState(false);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    const { error } = await supabase.auth.signInWithPassword({ email, password });
    setLoading(false);
    if (error) {
      toast.error(error.message);
    } else {
      toast.success('Welcome back!');
      navigate('/');
    }
  };

  const handleForgotPassword = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email) {
      toast.error('Enter your email first');
      return;
    }
    setLoading(true);
    const { error } = await supabase.auth.resetPasswordForEmail(email, {
      redirectTo: `${window.location.origin}/reset-password`,
    });
    setLoading(false);
    if (error) {
      toast.error(error.message);
    } else {
      toast.success('Password reset link sent to your email');
      setShowForgot(false);
    }
  };



  return (
    <div className="min-h-screen">
      <AnnouncementBar />
      <Navbar />
      <main className="container max-w-md py-16">
        <h1 className="font-display text-3xl font-bold text-center mb-2">
          {showForgot ? 'Reset Password' : 'Welcome Back'}
        </h1>
        <p className="text-center text-muted-foreground font-body mb-8">
          {showForgot ? 'Enter your email to receive a reset link' : 'Sign in to your account'}
        </p>



        <form onSubmit={showForgot ? handleForgotPassword : handleLogin} className="space-y-4">
          <div className="relative">
            <Mail className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
            <Input
              type="email"
              placeholder="Email address"
              value={email}
              onChange={e => setEmail(e.target.value)}
              className="pl-10 h-11 font-body"
              required
            />
          </div>
          {!showForgot && (
            <div className="relative">
              <Lock className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
              <Input
                type="password"
                placeholder="Password"
                value={password}
                onChange={e => setPassword(e.target.value)}
                className="pl-10 h-11 font-body"
                required
              />
            </div>
          )}
          <Button type="submit" className="w-full h-11 font-body tracking-wider uppercase text-xs" disabled={loading}>
            {loading ? 'Please wait...' : showForgot ? 'Send Reset Link' : 'Sign In'}
            <ArrowRight className="h-4 w-4 ml-2" />
          </Button>
        </form>

        <div className="text-center mt-4 space-y-2">
          <button
            onClick={() => setShowForgot(!showForgot)}
            className="text-sm text-muted-foreground font-body hover:text-primary"
          >
            {showForgot ? 'Back to sign in' : 'Forgot your password?'}
          </button>
          {!showForgot && (
            <p className="text-sm text-muted-foreground font-body">
              Don't have an account?{' '}
              <Link to="/signup" className="text-primary hover:underline font-medium">Create one</Link>
            </p>
          )}
        </div>
      </main>
      <Footer />
    </div>
  );
}

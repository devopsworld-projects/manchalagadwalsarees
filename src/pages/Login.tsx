import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { supabase } from '@/integrations/supabase/client';
import { AnnouncementBar } from '@/components/AnnouncementBar';
import { Navbar } from '@/components/Navbar';
import { Footer } from '@/components/Footer';
import { Input } from '@/components/ui/input';
import { toast } from 'sonner';
import { PageMeta } from '@/components/PageMeta';
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
    if (error) { toast.error(error.message); } else { toast.success('Welcome back!'); navigate('/'); }
  };

  const handleForgotPassword = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email) { toast.error('Enter your email first'); return; }
    setLoading(true);
    const { error } = await supabase.auth.resetPasswordForEmail(email, { redirectTo: `${window.location.origin}/reset-password` });
    setLoading(false);
    if (error) { toast.error(error.message); } else { toast.success('Password reset link sent to your email'); setShowForgot(false); }
  };

  const handleGoogleSignIn = async () => {
    try {
      const { lovable } = await import('@/integrations/lovable/index');
      const result = await lovable.auth.signInWithOAuth('google', { redirect_uri: window.location.origin });
      if (result.error) { toast.error('Google sign-in failed'); return; }
      if (result.redirected) return;
      navigate('/');
    } catch { toast.error('Google sign-in is not available'); }
  };

  return (
    <div className="min-h-screen">
      <PageMeta title="Sign In" description="Sign in to your Manchala Gadwal Sarees account to track orders and manage your wishlist." canonicalPath="/login" />
      <AnnouncementBar />
      <Navbar />

      <main className="relative min-h-[80vh] flex items-center justify-center py-16 px-4">
        {/* Subtle background pattern */}
        <div className="absolute inset-0 opacity-[0.02]">
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] border border-accent rounded-full" />
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[400px] h-[400px] border border-accent rounded-full" />
        </div>

        <div className="relative w-full max-w-sm">
          {/* Ornate header */}
          <div className="text-center mb-8">
            <div className="flex items-center justify-center gap-3 mb-4">
              <div className="w-10 h-[1px] bg-accent/40" />
              <span className="text-accent text-[7px]">◆</span>
              <div className="w-10 h-[1px] bg-accent/40" />
            </div>
            <h1 className="font-display text-3xl font-bold tracking-wide">
              {showForgot ? 'Reset Password' : 'Welcome Back'}
            </h1>
            <p className="font-serif text-sm text-muted-foreground italic mt-2">
              {showForgot ? 'Enter your email to receive a reset link' : 'Sign in to your account'}
            </p>
          </div>

          {/* Card with temple-style border */}
          <div className="relative border border-border bg-card p-8">
            {/* Corner ornaments */}
            <div className="absolute top-2 left-2 w-4 h-4 border-t border-l border-accent/30" />
            <div className="absolute top-2 right-2 w-4 h-4 border-t border-r border-accent/30" />
            <div className="absolute bottom-2 left-2 w-4 h-4 border-b border-l border-accent/30" />
            <div className="absolute bottom-2 right-2 w-4 h-4 border-b border-r border-accent/30" />

            {!showForgot && (
              <>
                <button
                  onClick={handleGoogleSignIn}
                  className="w-full flex items-center justify-center gap-3 border border-border py-3 font-body text-sm hover:bg-muted transition-colors"
                >
                  <svg className="h-4 w-4" viewBox="0 0 24 24">
                    <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92a5.06 5.06 0 01-2.2 3.32v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.1z" fill="#4285F4"/>
                    <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853"/>
                    <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" fill="#FBBC05"/>
                    <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335"/>
                  </svg>
                  Continue with Google
                </button>

                <div className="relative my-6">
                  <div className="absolute inset-0 flex items-center">
                    <div className="w-full ornate-line" />
                  </div>
                  <div className="relative flex justify-center">
                    <span className="bg-card px-3 font-body text-[10px] tracking-[0.3em] text-muted-foreground uppercase">or</span>
                  </div>
                </div>
              </>
            )}

            <form onSubmit={showForgot ? handleForgotPassword : handleLogin} className="space-y-4">
              <div>
                <label className="font-display text-[10px] font-bold tracking-[0.15em] uppercase text-foreground/70 mb-1.5 block">Email</label>
                <div className="relative">
                  <Mail className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                  <Input type="email" value={email} onChange={e => setEmail(e.target.value)} className="pl-10 h-11 font-body border-border" placeholder="your@email.com" required />
                </div>
              </div>
              {!showForgot && (
                <div>
                  <label className="font-display text-[10px] font-bold tracking-[0.15em] uppercase text-foreground/70 mb-1.5 block">Password</label>
                  <div className="relative">
                    <Lock className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                    <Input type="password" value={password} onChange={e => setPassword(e.target.value)} className="pl-10 h-11 font-body border-border" placeholder="••••••••" required />
                  </div>
                </div>
              )}
              <button
                type="submit"
                disabled={loading}
                className="w-full bg-primary text-primary-foreground py-3.5 font-display text-[11px] font-bold tracking-[0.25em] uppercase flex items-center justify-center gap-2 hover:bg-primary/90 transition-colors disabled:opacity-50"
              >
                {loading ? 'Please wait...' : showForgot ? 'Send Reset Link' : 'Sign In'}
                <ArrowRight className="h-3.5 w-3.5" />
              </button>
            </form>

            <div className="text-center mt-5 space-y-2">
              <button onClick={() => setShowForgot(!showForgot)} className="font-body text-xs text-muted-foreground hover:text-accent transition-colors">
                {showForgot ? 'Back to sign in' : 'Forgot your password?'}
              </button>
              {!showForgot && (
                <p className="font-body text-xs text-muted-foreground">
                  New here?{' '}
                  <Link to="/signup" className="text-accent hover:underline font-medium">Create an account</Link>
                </p>
              )}
            </div>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
}

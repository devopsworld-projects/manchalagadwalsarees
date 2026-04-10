import { useState } from 'react';
import { useAuth } from '@/context/AuthContext';
import { Navigate } from 'react-router-dom';
import { supabase } from '@/integrations/supabase/client';
import { Store, Loader2 } from 'lucide-react';

const AdminLogin = () => {
  const { user, isAdmin, loading } = useAuth();
  const [isSignup, setIsSignup] = useState(false);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [submitting, setSubmitting] = useState(false);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-muted/30">
        <div className="h-8 w-8 border-2 border-primary border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  if (user && isAdmin) {
    return <Navigate to="/admin" replace />;
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setSuccess('');
    setSubmitting(true);

    if (isSignup) {
      const { error } = await supabase.auth.signUp({
        email,
        password,
        options: { emailRedirectTo: window.location.origin + '/admin/login' },
      });
      if (error) {
        setError(error.message);
      } else {
        setSuccess('Account created! Please check your email to verify, then sign in.');
        setIsSignup(false);
      }
    } else {
      const { error } = await supabase.auth.signInWithPassword({ email, password });
      if (error) {
        setError(error.message);
      }
    }

    setSubmitting(false);
  };

  return (
    <div className="min-h-screen flex bg-muted/30">
      {/* Left decorative panel — hidden on mobile */}
      <div className="hidden lg:flex lg:w-1/2 bg-primary relative overflow-hidden items-center justify-center">
        <div className="absolute inset-0 bg-gradient-to-br from-primary via-primary to-primary/80" />
        <div className="absolute inset-0 opacity-10" style={{ backgroundImage: 'radial-gradient(circle at 25% 25%, white 1px, transparent 1px)', backgroundSize: '32px 32px' }} />
        <div className="relative z-10 text-center px-12">
          <div className="h-20 w-20 rounded-2xl bg-primary-foreground/10 backdrop-blur flex items-center justify-center mx-auto mb-8 border border-primary-foreground/20">
            <Store className="h-10 w-10 text-primary-foreground" />
          </div>
          <h2 className="font-display text-4xl font-bold text-primary-foreground mb-4">Kavi Women's World</h2>
          <p className="font-body text-primary-foreground/70 text-lg leading-relaxed max-w-md">
            Manage your store, track orders, and grow your business — all from one place.
          </p>
        </div>
      </div>

      {/* Right form panel */}
      <div className="flex-1 flex items-center justify-center px-6">
        <div className="w-full max-w-md space-y-8">
          {/* Mobile logo */}
          <div className="text-center lg:text-left">
            <div className="lg:hidden flex items-center justify-center gap-2 mb-6">
              <div className="h-10 w-10 rounded-xl bg-primary flex items-center justify-center">
                <Store className="h-5 w-5 text-primary-foreground" />
              </div>
            </div>
            <h1 className="font-display text-3xl font-bold">
              {isSignup ? 'Create Account' : 'Welcome back'}
            </h1>
            <p className="font-body text-muted-foreground mt-2">
              {isSignup ? 'Set up your admin account to get started' : 'Sign in to your admin dashboard'}
            </p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-5">
            {error && (
              <div className="bg-destructive/10 text-destructive text-sm font-body p-3.5 rounded-xl border border-destructive/20">
                {error}
              </div>
            )}
            {success && (
              <div className="bg-emerald-50 text-emerald-700 text-sm font-body p-3.5 rounded-xl border border-emerald-200">
                {success}
              </div>
            )}

            <div>
              <label className="font-body text-sm font-medium block mb-1.5">Email address</label>
              <input
                type="email"
                required
                value={email}
                onChange={e => setEmail(e.target.value)}
                placeholder="admin@example.com"
                className="w-full border border-border bg-card px-4 py-3 font-body text-sm focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary rounded-xl transition-all"
              />
            </div>
            <div>
              <label className="font-body text-sm font-medium block mb-1.5">Password</label>
              <input
                type="password"
                required
                minLength={6}
                value={password}
                onChange={e => setPassword(e.target.value)}
                placeholder="••••••••"
                className="w-full border border-border bg-card px-4 py-3 font-body text-sm focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary rounded-xl transition-all"
              />
            </div>

            <button
              type="submit"
              disabled={submitting}
              className="w-full bg-primary text-primary-foreground py-3.5 text-sm font-body font-semibold tracking-wide rounded-xl hover:opacity-90 transition-all disabled:opacity-50 flex items-center justify-center gap-2 shadow-sm"
            >
              {submitting && <Loader2 className="h-4 w-4 animate-spin" />}
              {submitting
                ? (isSignup ? 'Creating Account...' : 'Signing In...')
                : (isSignup ? 'Create Account' : 'Sign In')}
            </button>
          </form>

          <div className="text-center">
            <p className="font-body text-sm text-muted-foreground">
              {isSignup ? 'Already have an account?' : "Don't have an account?"}{' '}
              <button
                onClick={() => { setIsSignup(!isSignup); setError(''); setSuccess(''); }}
                className="text-primary font-semibold hover:underline"
              >
                {isSignup ? 'Sign In' : 'Sign Up'}
              </button>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminLogin;

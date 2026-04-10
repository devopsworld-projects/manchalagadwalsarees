import { useState } from 'react';
import { useAuth } from '@/context/AuthContext';
import { Navigate } from 'react-router-dom';
import { supabase } from '@/integrations/supabase/client';
import logo from '@/assets/logo.png';

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
      <div className="min-h-screen flex items-center justify-center bg-background">
        <div className="animate-pulse font-body text-muted-foreground">Loading...</div>
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
    <div className="min-h-screen flex items-center justify-center bg-background px-4">
      <div className="w-full max-w-sm space-y-6">
        <div className="text-center">
          <img src={logo} alt="Kavi Women's World" className="h-20 w-auto mx-auto mb-4" />
          <h1 className="font-display text-2xl font-bold">Admin Portal</h1>
          <p className="font-body text-sm text-muted-foreground mt-1">
            {isSignup ? 'Create your admin account' : 'Sign in to manage your store'}
          </p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          {error && (
            <div className="bg-destructive/10 text-destructive text-sm font-body p-3 rounded-sm">
              {error}
            </div>
          )}
          {success && (
            <div className="bg-emerald-50 text-emerald-700 text-sm font-body p-3 rounded-sm border border-emerald-200">
              {success}
            </div>
          )}
          <div>
            <label className="font-body text-sm font-semibold block mb-1">Email</label>
            <input
              type="email"
              required
              value={email}
              onChange={e => setEmail(e.target.value)}
              className="w-full border border-border bg-background px-4 py-2.5 font-body text-sm focus:outline-none focus:ring-1 focus:ring-primary rounded-sm"
            />
          </div>
          <div>
            <label className="font-body text-sm font-semibold block mb-1">Password</label>
            <input
              type="password"
              required
              minLength={6}
              value={password}
              onChange={e => setPassword(e.target.value)}
              className="w-full border border-border bg-background px-4 py-2.5 font-body text-sm focus:outline-none focus:ring-1 focus:ring-primary rounded-sm"
            />
          </div>
          <button
            type="submit"
            disabled={submitting}
            className="w-full bg-primary text-primary-foreground py-3 text-sm tracking-[0.15em] font-body hover:bg-burgundy-light transition-colors disabled:opacity-50"
          >
            {submitting
              ? (isSignup ? 'CREATING ACCOUNT...' : 'SIGNING IN...')
              : (isSignup ? 'CREATE ACCOUNT' : 'SIGN IN')}
          </button>
        </form>

        <p className="text-center font-body text-sm text-muted-foreground">
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
  );
};

export default AdminLogin;

import { useState } from 'react';
import { useAuth } from '@/context/AuthContext';
import { Navigate } from 'react-router-dom';
import logo from '@/assets/logo.png';

const AdminLogin = () => {
  const { user, isAdmin, loading, signIn } = useAuth();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
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
    setSubmitting(true);
    const { error } = await signIn(email, password);
    if (error) {
      setError(error.message);
    }
    setSubmitting(false);
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-background px-4">
      <div className="w-full max-w-sm space-y-6">
        <div className="text-center">
          <img src={logo} alt="Kavi Women's World" className="h-20 w-auto mx-auto mb-4" />
          <h1 className="font-display text-2xl font-bold">Admin Portal</h1>
          <p className="font-body text-sm text-muted-foreground mt-1">Sign in to manage your store</p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          {error && (
            <div className="bg-destructive/10 text-destructive text-sm font-body p-3 rounded-sm">
              {error}
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
            {submitting ? 'SIGNING IN...' : 'SIGN IN'}
          </button>
        </form>
      </div>
    </div>
  );
};

export default AdminLogin;

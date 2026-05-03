import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { supabase } from '@/integrations/supabase/client';
import { AnnouncementBar } from '@/components/AnnouncementBar';
import { Navbar } from '@/components/Navbar';
import { Breadcrumbs } from '@/components/Breadcrumbs';
import { Footer } from '@/components/Footer';
import { Input } from '@/components/ui/input';
import { toast } from 'sonner';
import { PageMeta } from '@/components/PageMeta';
import { Lock, ArrowRight } from 'lucide-react';

export default function ResetPassword() {
  const navigate = useNavigate();
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [isRecovery, setIsRecovery] = useState(false);

  useEffect(() => {
    if (window.location.hash.includes('type=recovery')) setIsRecovery(true);
    const { data: { subscription } } = supabase.auth.onAuthStateChange((event) => {
      if (event === 'PASSWORD_RECOVERY') setIsRecovery(true);
    });
    return () => subscription.unsubscribe();
  }, []);

  const handleReset = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    const { error } = await supabase.auth.updateUser({ password });
    setLoading(false);
    if (error) { toast.error(error.message); } else { toast.success('Password updated successfully'); navigate('/'); }
  };

  return (
    <div className="min-h-screen">
      <PageMeta title="Reset Password" description="Reset your Manchala Gadwal Sarees account password securely." canonicalPath="/reset-password" />
      <AnnouncementBar />
      <Navbar /><Breadcrumbs />
      <main className="relative min-h-[80vh] flex items-center justify-center py-16 px-4">
        <div className="relative w-full max-w-sm">
          <div className="text-center mb-8">
            <div className="flex items-center justify-center gap-3 mb-4">
              <div className="w-10 h-[1px] bg-accent/40" />
              <span className="text-accent text-[7px]">◆</span>
              <div className="w-10 h-[1px] bg-accent/40" />
            </div>
            <h1 className="font-display text-3xl font-bold tracking-wide">Set New Password</h1>
            <p className="font-serif text-sm text-muted-foreground italic mt-2">
              {isRecovery ? 'Enter your new password below' : 'This link may have expired. Request a new one from the login page.'}
            </p>
          </div>

          {isRecovery && (
            <div className="relative border border-border bg-card p-8">
              <div className="absolute top-2 left-2 w-4 h-4 border-t border-l border-accent/30" />
              <div className="absolute top-2 right-2 w-4 h-4 border-t border-r border-accent/30" />
              <div className="absolute bottom-2 left-2 w-4 h-4 border-b border-l border-accent/30" />
              <div className="absolute bottom-2 right-2 w-4 h-4 border-b border-r border-accent/30" />

              <form onSubmit={handleReset} className="space-y-4">
                <div>
                  <label className="font-display text-[10px] font-bold tracking-[0.15em] uppercase text-foreground/70 mb-1.5 block">New Password</label>
                  <div className="relative">
                    <Lock className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                    <Input type="password" value={password} onChange={e => setPassword(e.target.value)} className="pl-10 h-11 font-body border-border" placeholder="Min 6 characters" minLength={6} required />
                  </div>
                </div>
                <button type="submit" disabled={loading} className="w-full bg-primary text-primary-foreground py-3.5 font-display text-[11px] font-bold tracking-[0.25em] uppercase flex items-center justify-center gap-2 hover:bg-primary/90 transition-colors disabled:opacity-50">
                  {loading ? 'Updating...' : 'Update Password'}
                  <ArrowRight className="h-3.5 w-3.5" />
                </button>
              </form>
            </div>
          )}
        </div>
      </main>
      <Footer />
    </div>
  );
}

import { useState, useEffect } from 'react';
import { useAuth } from '@/context/AuthContext';
import { supabase } from '@/integrations/supabase/client';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { Input } from '@/components/ui/input';
import { toast } from 'sonner';
import { Loader2, Save, Lock } from 'lucide-react';

export default function ProfilePage() {
  const { user } = useAuth();
  const queryClient = useQueryClient();
  const [fullName, setFullName] = useState('');
  const [phone, setPhone] = useState('');

  const { data: profile, isLoading } = useQuery({
    queryKey: ['profile', user?.id],
    queryFn: async () => {
      const { data, error } = await supabase.from('profiles').select('*').eq('user_id', user!.id).maybeSingle();
      if (error) throw error;
      return data;
    },
    enabled: !!user,
  });

  useEffect(() => {
    if (profile) { setFullName(profile.full_name || ''); setPhone(profile.phone || ''); }
  }, [profile]);

  const updateProfile = useMutation({
    mutationFn: async () => {
      if (profile) {
        const { error } = await supabase.from('profiles').update({ full_name: fullName, phone }).eq('user_id', user!.id);
        if (error) throw error;
      } else {
        const { error } = await supabase.from('profiles').insert({ user_id: user!.id, full_name: fullName, phone });
        if (error) throw error;
      }
    },
    onSuccess: () => { queryClient.invalidateQueries({ queryKey: ['profile'] }); toast.success('Profile updated'); },
    onError: () => toast.error('Failed to update profile'),
  });

  if (isLoading) {
    return <div className="flex items-center justify-center py-20"><Loader2 className="h-6 w-6 animate-spin text-muted-foreground" /></div>;
  }

  return (
    <div className="space-y-10">
      {/* Personal Info */}
      <section>
        <div className="flex items-center gap-3 mb-5">
          <span className="text-accent text-[7px]">◆</span>
          <h2 className="font-display text-lg font-bold tracking-[0.1em] uppercase">Personal Information</h2>
        </div>
        <div className="relative border border-border p-6 md:p-8">
          <div className="absolute top-2 left-2 w-4 h-4 border-t border-l border-accent/20" />
          <div className="absolute bottom-2 right-2 w-4 h-4 border-b border-r border-accent/20" />

          <form onSubmit={e => { e.preventDefault(); updateProfile.mutate(); }} className="space-y-5 max-w-md">
            <div>
              <label className="font-display text-[10px] font-bold tracking-[0.15em] uppercase text-foreground/60 mb-1.5 block">Email</label>
              <Input value={user?.email || ''} disabled className="font-body bg-muted/50 border-border" />
              <p className="text-[10px] text-muted-foreground font-body mt-1 italic">Email cannot be changed</p>
            </div>
            <div>
              <label className="font-display text-[10px] font-bold tracking-[0.15em] uppercase text-foreground/60 mb-1.5 block">Full Name</label>
              <Input value={fullName} onChange={e => setFullName(e.target.value)} className="font-body border-border" placeholder="Enter your full name" />
            </div>
            <div>
              <label className="font-display text-[10px] font-bold tracking-[0.15em] uppercase text-foreground/60 mb-1.5 block">Phone</label>
              <Input value={phone} onChange={e => setPhone(e.target.value)} className="font-body border-border" placeholder="+91 XXXXX XXXXX" />
            </div>
            <button type="submit" disabled={updateProfile.isPending} className="bg-primary text-primary-foreground px-8 py-3 font-display text-[11px] font-bold tracking-[0.2em] uppercase flex items-center gap-2 hover:bg-primary/90 transition-colors disabled:opacity-50">
              {updateProfile.isPending ? <Loader2 className="h-3.5 w-3.5 animate-spin" /> : <Save className="h-3.5 w-3.5" />}
              Save Changes
            </button>
          </form>
        </div>
      </section>

      {/* Change Password */}
      <section>
        <div className="flex items-center gap-3 mb-5">
          <span className="text-accent text-[7px]">◆</span>
          <h2 className="font-display text-lg font-bold tracking-[0.1em] uppercase">Change Password</h2>
        </div>
        <div className="relative border border-border p-6 md:p-8">
          <div className="absolute top-2 left-2 w-4 h-4 border-t border-l border-accent/20" />
          <div className="absolute bottom-2 right-2 w-4 h-4 border-b border-r border-accent/20" />
          <ChangePasswordForm />
        </div>
      </section>
    </div>
  );
}

function ChangePasswordForm() {
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [loading, setLoading] = useState(false);

  const handleChangePassword = async (e: React.FormEvent) => {
    e.preventDefault();
    if (newPassword.length < 6) { toast.error('Password must be at least 6 characters'); return; }
    if (newPassword !== confirmPassword) { toast.error('Passwords do not match'); return; }
    setLoading(true);
    const { error } = await supabase.auth.updateUser({ password: newPassword });
    setLoading(false);
    if (error) { toast.error(error.message); } else { toast.success('Password changed'); setNewPassword(''); setConfirmPassword(''); }
  };

  return (
    <form onSubmit={handleChangePassword} className="space-y-5 max-w-md">
      <div>
        <label className="font-display text-[10px] font-bold tracking-[0.15em] uppercase text-foreground/60 mb-1.5 block">New Password</label>
        <div className="relative">
          <Lock className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
          <Input type="password" value={newPassword} onChange={e => setNewPassword(e.target.value)} className="pl-10 font-body border-border" placeholder="Min 6 characters" minLength={6} required />
        </div>
      </div>
      <div>
        <label className="font-display text-[10px] font-bold tracking-[0.15em] uppercase text-foreground/60 mb-1.5 block">Confirm Password</label>
        <div className="relative">
          <Lock className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
          <Input type="password" value={confirmPassword} onChange={e => setConfirmPassword(e.target.value)} className="pl-10 font-body border-border" placeholder="Re-enter password" minLength={6} required />
        </div>
      </div>
      <button type="submit" disabled={loading} className="border-2 border-primary text-primary px-8 py-3 font-display text-[11px] font-bold tracking-[0.2em] uppercase flex items-center gap-2 hover:bg-primary hover:text-primary-foreground transition-colors disabled:opacity-50">
        {loading ? <Loader2 className="h-3.5 w-3.5 animate-spin" /> : <Lock className="h-3.5 w-3.5" />}
        Update Password
      </button>
    </form>
  );
}

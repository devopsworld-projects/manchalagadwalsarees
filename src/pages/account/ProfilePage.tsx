import { useState, useEffect } from 'react';
import { useAuth } from '@/context/AuthContext';
import { supabase } from '@/integrations/supabase/client';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { toast } from 'sonner';
import { Loader2, Save } from 'lucide-react';

export default function ProfilePage() {
  const { user } = useAuth();
  const queryClient = useQueryClient();
  const [fullName, setFullName] = useState('');
  const [phone, setPhone] = useState('');

  const { data: profile, isLoading } = useQuery({
    queryKey: ['profile', user?.id],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('profiles')
        .select('*')
        .eq('user_id', user!.id)
        .maybeSingle();
      if (error) throw error;
      return data;
    },
    enabled: !!user,
  });

  useEffect(() => {
    if (profile) {
      setFullName(profile.full_name || '');
      setPhone(profile.phone || '');
    }
  }, [profile]);

  const updateProfile = useMutation({
    mutationFn: async () => {
      if (profile) {
        const { error } = await supabase
          .from('profiles')
          .update({ full_name: fullName, phone })
          .eq('user_id', user!.id);
        if (error) throw error;
      } else {
        const { error } = await supabase
          .from('profiles')
          .insert({ user_id: user!.id, full_name: fullName, phone });
        if (error) throw error;
      }
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['profile'] });
      toast.success('Profile updated successfully');
    },
    onError: () => toast.error('Failed to update profile'),
  });

  if (isLoading) {
    return (
      <div className="flex items-center justify-center py-20">
        <Loader2 className="h-6 w-6 animate-spin text-muted-foreground" />
      </div>
    );
  }

  return (
    <div>
      <h2 className="font-display text-xl font-semibold mb-6">Personal Information</h2>

      <div className="bg-muted/30 rounded-xl border border-border p-6">
        <form
          onSubmit={e => { e.preventDefault(); updateProfile.mutate(); }}
          className="space-y-5 max-w-md"
        >
          <div>
            <Label className="font-body text-sm">Email</Label>
            <Input value={user?.email || ''} disabled className="mt-1.5 font-body bg-muted" />
            <p className="text-xs text-muted-foreground font-body mt-1">Email cannot be changed</p>
          </div>

          <div>
            <Label className="font-body text-sm">Full Name</Label>
            <Input
              value={fullName}
              onChange={e => setFullName(e.target.value)}
              placeholder="Enter your full name"
              className="mt-1.5 font-body"
            />
          </div>

          <div>
            <Label className="font-body text-sm">Phone Number</Label>
            <Input
              value={phone}
              onChange={e => setPhone(e.target.value)}
              placeholder="+91 XXXXX XXXXX"
              className="mt-1.5 font-body"
            />
          </div>

          <Button
            type="submit"
            disabled={updateProfile.isPending}
            className="font-body tracking-wider uppercase text-xs"
          >
            {updateProfile.isPending ? (
              <Loader2 className="h-4 w-4 mr-2 animate-spin" />
            ) : (
              <Save className="h-4 w-4 mr-2" />
            )}
            Save Changes
          </Button>
        </form>
      </div>
    </div>
  );
}

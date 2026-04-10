import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';
import { Shield, ShieldCheck, Trash2 } from 'lucide-react';

const roleBadgeStyles: Record<string, string> = {
  admin: 'bg-primary/10 text-primary',
  moderator: 'bg-purple-100 text-purple-700',
  user: 'bg-muted text-muted-foreground',
};

const AdminUsers = () => {
  const { toast } = useToast();
  const queryClient = useQueryClient();

  const { data: users, isLoading } = useQuery({
    queryKey: ['admin-users'],
    queryFn: async () => {
      const { data, error } = await supabase.rpc('list_users_for_admin');
      if (error) throw error;
      return data || [];
    },
  });

  const { data: roles } = useQuery({
    queryKey: ['admin-user-roles'],
    queryFn: async () => {
      const { data, error } = await supabase.from('user_roles').select('*');
      if (error) throw error;
      return data || [];
    },
  });

  const changeRole = useMutation({
    mutationFn: async ({ userId, newRole }: { userId: string; newRole: string }) => {
      // Remove existing role
      await supabase.from('user_roles').delete().eq('user_id', userId);
      // If not "user" (default), insert the new role
      if (newRole !== 'user') {
        const { error } = await supabase.from('user_roles').insert({ user_id: userId, role: newRole as any });
        if (error) throw error;
      }
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['admin-user-roles'] });
      toast({ title: 'Role updated' });
    },
    onError: (err: Error) => toast({ title: 'Error', description: err.message, variant: 'destructive' }),
  });

  const removeUser = useMutation({
    mutationFn: async (userId: string) => {
      // Remove roles first
      await supabase.from('user_roles').delete().eq('user_id', userId);
      // Note: We can't delete from auth.users via client SDK.
      // We remove their roles so they have no access.
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['admin-user-roles'] });
      toast({ title: 'User roles removed' });
    },
    onError: (err: Error) => toast({ title: 'Error', description: err.message, variant: 'destructive' }),
  });

  const getUserRole = (userId: string) => {
    return roles?.find(r => r.user_id === userId)?.role || 'user';
  };

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <h2 className="font-display text-2xl font-bold">Users</h2>
        <span className="font-body text-sm text-muted-foreground">{users?.length || 0} registered users</span>
      </div>

      {isLoading ? (
        <div className="text-center py-12 text-muted-foreground font-body">Loading users...</div>
      ) : (
        <div className="border border-border rounded-lg overflow-hidden">
          <table className="w-full">
            <thead className="bg-muted">
              <tr className="font-body text-xs text-muted-foreground uppercase tracking-wider">
                <th className="text-left p-3">Email</th>
                <th className="text-center p-3">Role</th>
                <th className="text-left p-3">Joined</th>
                <th className="text-left p-3">Last Sign In</th>
                <th className="text-center p-3">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border">
              {users?.map((user) => {
                const role = getUserRole(user.id);
                return (
                  <tr key={user.id} className="hover:bg-muted/30 transition-colors">
                    <td className="p-3 font-body text-sm font-medium">{user.email}</td>
                    <td className="p-3 text-center">
                      <select
                        value={role}
                        onChange={e => changeRole.mutate({ userId: user.id, newRole: e.target.value })}
                        className={`text-[11px] font-body font-bold px-2.5 py-1 rounded-full border-0 cursor-pointer ${roleBadgeStyles[role] || roleBadgeStyles.user}`}
                      >
                        <option value="user">User</option>
                        <option value="moderator">Moderator</option>
                        <option value="admin">Admin</option>
                      </select>
                    </td>
                    <td className="p-3 font-body text-sm text-muted-foreground">
                      {new Date(user.created_at).toLocaleDateString()}
                    </td>
                    <td className="p-3 font-body text-sm text-muted-foreground">
                      {user.last_sign_in_at ? new Date(user.last_sign_in_at).toLocaleDateString() : '—'}
                    </td>
                    <td className="p-3 text-center">
                      <button
                        onClick={() => { if (confirm(`Remove all roles for ${user.email}?`)) removeUser.mutate(user.id); }}
                        disabled={removeUser.isPending}
                        className="p-1.5 hover:bg-destructive/10 rounded transition-colors"
                        title="Remove user roles"
                      >
                        <Trash2 className="h-4 w-4 text-destructive" />
                      </button>
                    </td>
                  </tr>
                );
              })}
              {(!users || users.length === 0) && (
                <tr><td colSpan={5} className="p-8 text-center text-muted-foreground font-body">No users found.</td></tr>
              )}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
};

export default AdminUsers;

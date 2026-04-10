import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';
import { Shield, ShieldCheck, ShieldX } from 'lucide-react';

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

  const toggleAdmin = useMutation({
    mutationFn: async ({ userId, isAdmin }: { userId: string; isAdmin: boolean }) => {
      if (isAdmin) {
        const { error } = await supabase.from('user_roles').delete().eq('user_id', userId).eq('role', 'admin');
        if (error) throw error;
      } else {
        const { error } = await supabase.from('user_roles').insert({ user_id: userId, role: 'admin' });
        if (error) throw error;
      }
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['admin-user-roles'] });
      toast({ title: 'Role updated' });
    },
    onError: (err: Error) => toast({ title: 'Error', description: err.message, variant: 'destructive' }),
  });

  const getUserRole = (userId: string) => {
    return roles?.find(r => r.user_id === userId)?.role || 'user';
  };

  return (
    <div>
      <h2 className="font-display text-2xl font-bold mb-6">Users</h2>

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
                const isAdmin = role === 'admin';
                return (
                  <tr key={user.id} className="hover:bg-muted/30 transition-colors">
                    <td className="p-3 font-body text-sm font-medium">{user.email}</td>
                    <td className="p-3 text-center">
                      <span className={`inline-flex items-center gap-1 text-[11px] font-body font-bold px-2.5 py-1 rounded-full ${
                        isAdmin ? 'bg-primary/10 text-primary' : 'bg-muted text-muted-foreground'
                      }`}>
                        {isAdmin ? <ShieldCheck className="h-3 w-3" /> : <Shield className="h-3 w-3" />}
                        {role.charAt(0).toUpperCase() + role.slice(1)}
                      </span>
                    </td>
                    <td className="p-3 font-body text-sm text-muted-foreground">
                      {new Date(user.created_at).toLocaleDateString()}
                    </td>
                    <td className="p-3 font-body text-sm text-muted-foreground">
                      {user.last_sign_in_at ? new Date(user.last_sign_in_at).toLocaleDateString() : '—'}
                    </td>
                    <td className="p-3 text-center">
                      <button
                        onClick={() => toggleAdmin.mutate({ userId: user.id, isAdmin })}
                        disabled={toggleAdmin.isPending}
                        className={`text-xs font-body px-3 py-1.5 rounded transition-colors ${
                          isAdmin
                            ? 'bg-destructive/10 text-destructive hover:bg-destructive/20'
                            : 'bg-primary/10 text-primary hover:bg-primary/20'
                        }`}
                      >
                        {isAdmin ? (
                          <span className="flex items-center gap-1"><ShieldX className="h-3 w-3" /> Remove Admin</span>
                        ) : (
                          <span className="flex items-center gap-1"><ShieldCheck className="h-3 w-3" /> Make Admin</span>
                        )}
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

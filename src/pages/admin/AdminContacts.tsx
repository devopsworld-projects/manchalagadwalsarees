import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';
import { Mail, MailOpen, Trash2 } from 'lucide-react';

const AdminContacts = () => {
  const { toast } = useToast();
  const queryClient = useQueryClient();

  const { data: submissions, isLoading } = useQuery({
    queryKey: ['admin-contacts'],
    queryFn: async () => {
      const { data, error } = await supabase.from('contact_submissions').select('*').order('created_at', { ascending: false });
      if (error) throw error;
      return data;
    },
  });

  const markRead = useMutation({
    mutationFn: async ({ id, is_read }: { id: string; is_read: boolean }) => {
      const { error } = await supabase.from('contact_submissions').update({ is_read }).eq('id', id);
      if (error) throw error;
    },
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ['admin-contacts'] }),
  });

  const deleteMutation = useMutation({
    mutationFn: async (id: string) => {
      const { error } = await supabase.from('contact_submissions').delete().eq('id', id);
      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['admin-contacts'] });
      toast({ title: 'Submission deleted' });
    },
  });

  const unreadCount = submissions?.filter(s => !s.is_read).length || 0;

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-3">
          <h2 className="font-display text-2xl font-bold">Contact Inbox</h2>
          {unreadCount > 0 && (
            <span className="bg-primary text-primary-foreground text-xs font-body font-bold px-2.5 py-0.5 rounded-full">
              {unreadCount} new
            </span>
          )}
        </div>
      </div>

      {isLoading ? (
        <div className="text-center py-12 text-muted-foreground font-body">Loading messages...</div>
      ) : (!submissions || submissions.length === 0) ? (
        <div className="text-center py-12 text-muted-foreground font-body">No contact submissions yet.</div>
      ) : (
        <div className="space-y-3">
          {submissions.map(sub => (
            <div key={sub.id} className={`border rounded-lg p-4 transition-colors ${sub.is_read ? 'border-border bg-background' : 'border-primary/30 bg-primary/5'}`}>
              <div className="flex items-start justify-between gap-3">
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 mb-1">
                    {!sub.is_read && <span className="h-2 w-2 rounded-full bg-primary shrink-0" />}
                    <span className="font-body text-sm font-semibold truncate">{sub.name}</span>
                    <span className="font-body text-xs text-muted-foreground">
                      {new Date(sub.created_at).toLocaleDateString()} {new Date(sub.created_at).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                    </span>
                  </div>
                  <p className="font-body text-xs text-muted-foreground mb-1">
                    {sub.email}{sub.phone ? ` · ${sub.phone}` : ''}
                  </p>
                  <p className="font-body text-sm text-foreground whitespace-pre-wrap">{sub.message}</p>
                </div>
                <div className="flex gap-1 shrink-0">
                  <button
                    onClick={() => markRead.mutate({ id: sub.id, is_read: !sub.is_read })}
                    className="p-1.5 hover:bg-muted rounded transition-colors"
                    title={sub.is_read ? 'Mark as unread' : 'Mark as read'}
                  >
                    {sub.is_read ? <Mail className="h-4 w-4 text-muted-foreground" /> : <MailOpen className="h-4 w-4 text-primary" />}
                  </button>
                  <button
                    onClick={() => { if (confirm('Delete this submission?')) deleteMutation.mutate(sub.id); }}
                    className="p-1.5 hover:bg-destructive/10 rounded transition-colors"
                  >
                    <Trash2 className="h-4 w-4 text-destructive" />
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default AdminContacts;

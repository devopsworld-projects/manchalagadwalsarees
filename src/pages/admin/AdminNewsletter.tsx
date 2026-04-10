import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Trash2, Download } from 'lucide-react';
import { toast } from 'sonner';

export default function AdminNewsletter() {
  const qc = useQueryClient();

  const { data: subs = [], isLoading } = useQuery({
    queryKey: ['admin-newsletter'],
    queryFn: async () => {
      const { data, error } = await supabase.from('newsletter_subscribers').select('*').order('created_at', { ascending: false });
      if (error) throw error;
      return data;
    },
  });

  const del = useMutation({
    mutationFn: async (id: string) => { const { error } = await supabase.from('newsletter_subscribers').delete().eq('id', id); if (error) throw error; },
    onSuccess: () => { qc.invalidateQueries({ queryKey: ['admin-newsletter'] }); toast.success('Removed'); },
  });

  const exportCSV = () => {
    const csv = ['Email,Status,Subscribed Date', ...subs.map((s: any) => `${s.email},${s.is_active ? 'Active' : 'Unsubscribed'},${new Date(s.created_at).toLocaleDateString()}`)].join('\n');
    const blob = new Blob([csv], { type: 'text/csv' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a'); a.href = url; a.download = 'newsletter-subscribers.csv'; a.click();
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div><h1 className="text-2xl font-bold">Newsletter Subscribers</h1><p className="text-muted-foreground text-sm">{subs.length} total subscribers</p></div>
        <Button variant="outline" onClick={exportCSV} disabled={subs.length === 0}><Download className="h-4 w-4 mr-2" /> Export CSV</Button>
      </div>

      {isLoading ? <p className="text-center py-12 text-muted-foreground">Loading...</p> : subs.length === 0 ? (
        <div className="text-center py-12 text-muted-foreground border rounded-lg">No subscribers yet.</div>
      ) : (
        <div className="border rounded-lg overflow-hidden">
          <table className="w-full text-sm">
            <thead className="bg-muted/50"><tr><th className="text-left p-3">Email</th><th className="text-left p-3">Status</th><th className="text-left p-3 hidden sm:table-cell">Date</th><th className="text-right p-3">Actions</th></tr></thead>
            <tbody>
              {subs.map((s: any) => (
                <tr key={s.id} className="border-t">
                  <td className="p-3">{s.email}</td>
                  <td className="p-3"><Badge variant={s.is_active ? 'default' : 'secondary'}>{s.is_active ? 'Active' : 'Unsubscribed'}</Badge></td>
                  <td className="p-3 hidden sm:table-cell text-muted-foreground">{new Date(s.created_at).toLocaleDateString()}</td>
                  <td className="p-3 text-right"><Button variant="ghost" size="icon" className="h-8 w-8 text-destructive" onClick={() => del.mutate(s.id)}><Trash2 className="h-3.5 w-3.5" /></Button></td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}

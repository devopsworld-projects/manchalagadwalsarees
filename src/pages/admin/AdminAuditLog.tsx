import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';

export default function AdminAuditLog() {
  const { data: logs = [], isLoading } = useQuery({
    queryKey: ['admin-audit-log'],
    queryFn: async () => {
      const { data, error } = await supabase.from('audit_log').select('*').order('created_at', { ascending: false }).limit(100);
      if (error) throw error;
      return data;
    },
  });

  return (
    <div className="space-y-6">
      <div><h1 className="text-2xl font-bold">Activity Log</h1><p className="text-muted-foreground text-sm">Recent admin activity (last 100 entries).</p></div>

      {isLoading ? <p className="text-center py-12 text-muted-foreground">Loading...</p> : logs.length === 0 ? (
        <div className="text-center py-12 text-muted-foreground border rounded-lg">No activity logged yet.</div>
      ) : (
        <div className="border rounded-lg overflow-hidden">
          <table className="w-full text-sm">
            <thead className="bg-muted/50"><tr><th className="text-left p-3">Action</th><th className="text-left p-3">Entity</th><th className="text-left p-3 hidden sm:table-cell">Details</th><th className="text-left p-3">Date</th></tr></thead>
            <tbody>
              {logs.map((l: any) => (
                <tr key={l.id} className="border-t">
                  <td className="p-3 font-medium">{l.action}</td>
                  <td className="p-3 text-muted-foreground">{l.entity_type}{l.entity_id ? ` #${l.entity_id.slice(0, 8)}` : ''}</td>
                  <td className="p-3 hidden sm:table-cell text-muted-foreground text-xs truncate max-w-[200px]">{JSON.stringify(l.details)}</td>
                  <td className="p-3 text-muted-foreground">{new Date(l.created_at).toLocaleString()}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}

import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { toast } from 'sonner';

const statusColors: Record<string, string> = {
  pending: 'bg-yellow-100 text-yellow-700',
  approved: 'bg-green-100 text-green-700',
  rejected: 'bg-red-100 text-red-700',
  completed: 'bg-blue-100 text-blue-700',
};

export default function AdminReturns() {
  const qc = useQueryClient();

  const { data: returns = [], isLoading } = useQuery({
    queryKey: ['admin-returns'],
    queryFn: async () => {
      const { data, error } = await supabase.from('return_requests').select('*, orders(customer_name, customer_email, total)').order('created_at', { ascending: false });
      if (error) throw error;
      return data;
    },
  });

  const updateStatus = useMutation({
    mutationFn: async ({ id, status }: { id: string; status: string }) => {
      const { error } = await supabase.from('return_requests').update({ status }).eq('id', id);
      if (error) throw error;
    },
    onSuccess: () => { qc.invalidateQueries({ queryKey: ['admin-returns'] }); toast.success('Updated'); },
  });

  return (
    <div className="space-y-6">
      <div><h1 className="text-2xl font-bold">Return Requests</h1><p className="text-muted-foreground text-sm">Manage product return/refund requests.</p></div>

      {isLoading ? <p className="text-center py-12 text-muted-foreground">Loading...</p> : returns.length === 0 ? (
        <div className="text-center py-12 text-muted-foreground border rounded-lg">No return requests yet.</div>
      ) : (
        <div className="space-y-4">
          {returns.map((r: any) => (
            <div key={r.id} className="border rounded-lg p-4">
              <div className="flex items-start justify-between mb-2">
                <div>
                  <p className="font-medium">{(r as any).orders?.customer_name || 'Customer'}</p>
                  <p className="text-sm text-muted-foreground">{(r as any).orders?.customer_email}</p>
                  <p className="text-xs text-muted-foreground mt-1">Order total: ₹{Number((r as any).orders?.total || 0).toLocaleString()}</p>
                </div>
                <Badge className={statusColors[r.status]}>{r.status}</Badge>
              </div>
              <p className="text-sm mb-3"><span className="font-medium">Reason:</span> {r.reason}</p>
              <div className="flex items-center gap-3">
                <span className="text-sm text-muted-foreground">Update status:</span>
                <Select value={r.status} onValueChange={v => updateStatus.mutate({ id: r.id, status: v })}>
                  <SelectTrigger className="w-40"><SelectValue /></SelectTrigger>
                  <SelectContent>
                    <SelectItem value="pending">Pending</SelectItem>
                    <SelectItem value="approved">Approved</SelectItem>
                    <SelectItem value="rejected">Rejected</SelectItem>
                    <SelectItem value="completed">Completed</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

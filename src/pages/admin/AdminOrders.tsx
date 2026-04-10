import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';

const statusColors: Record<string, string> = {
  pending: 'bg-yellow-100 text-yellow-700',
  confirmed: 'bg-blue-100 text-blue-700',
  shipped: 'bg-purple-100 text-purple-700',
  delivered: 'bg-green-100 text-green-700',
  cancelled: 'bg-red-100 text-red-700',
};

const statuses = ['pending', 'confirmed', 'shipped', 'delivered', 'cancelled'];

const AdminOrders = () => {
  const { toast } = useToast();
  const queryClient = useQueryClient();

  const { data: orders, isLoading } = useQuery({
    queryKey: ['admin-orders'],
    queryFn: async () => {
      const { data, error } = await supabase.from('orders').select('*').order('created_at', { ascending: false });
      if (error) throw error;
      return data;
    },
  });

  const updateStatus = useMutation({
    mutationFn: async ({ id, status }: { id: string; status: string }) => {
      const { error } = await supabase.from('orders').update({ status }).eq('id', id);
      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['admin-orders'] });
      toast({ title: 'Order status updated' });
    },
  });

  return (
    <div>
      <h2 className="font-display text-2xl font-bold mb-6">Orders</h2>

      {isLoading ? (
        <div className="text-center py-12 text-muted-foreground font-body">Loading orders...</div>
      ) : (
        <div className="border border-border rounded-lg overflow-hidden">
          <table className="w-full">
            <thead className="bg-muted">
              <tr className="font-body text-xs text-muted-foreground uppercase tracking-wider">
                <th className="text-left p-3">Order ID</th>
                <th className="text-left p-3">Customer</th>
                <th className="text-left p-3">Email</th>
                <th className="text-right p-3">Total</th>
                <th className="text-center p-3">Status</th>
                <th className="text-left p-3">Date</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border">
              {orders?.map(order => (
                <tr key={order.id} className="hover:bg-muted/30 transition-colors">
                  <td className="p-3 font-body text-sm font-mono text-muted-foreground">{order.id.slice(0, 8)}...</td>
                  <td className="p-3 font-body text-sm font-medium">{order.customer_name}</td>
                  <td className="p-3 font-body text-sm text-muted-foreground">{order.customer_email}</td>
                  <td className="p-3 font-body text-sm text-right font-medium">₹{Number(order.total).toLocaleString()}</td>
                  <td className="p-3 text-center">
                    <select
                      value={order.status}
                      onChange={e => updateStatus.mutate({ id: order.id, status: e.target.value })}
                      className={`text-[11px] font-body font-bold px-2 py-1 rounded-full border-0 cursor-pointer ${statusColors[order.status] || 'bg-muted'}`}
                    >
                      {statuses.map(s => <option key={s} value={s}>{s.charAt(0).toUpperCase() + s.slice(1)}</option>)}
                    </select>
                  </td>
                  <td className="p-3 font-body text-sm text-muted-foreground">
                    {new Date(order.created_at).toLocaleDateString()}
                  </td>
                </tr>
              ))}
              {(!orders || orders.length === 0) && (
                <tr><td colSpan={6} className="p-8 text-center text-muted-foreground font-body">No orders yet.</td></tr>
              )}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
};

export default AdminOrders;

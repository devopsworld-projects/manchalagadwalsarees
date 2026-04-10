import { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';
import { ChevronDown, ChevronUp, Phone, MapPin, Mail, StickyNote, Search, Filter } from 'lucide-react';
import { Input } from '@/components/ui/input';

const statusConfig: Record<string, { bg: string; dot: string }> = {
  pending: { bg: 'bg-amber-50 text-amber-700 border-amber-200', dot: 'bg-amber-500' },
  confirmed: { bg: 'bg-blue-50 text-blue-700 border-blue-200', dot: 'bg-blue-500' },
  shipped: { bg: 'bg-violet-50 text-violet-700 border-violet-200', dot: 'bg-violet-500' },
  delivered: { bg: 'bg-emerald-50 text-emerald-700 border-emerald-200', dot: 'bg-emerald-500' },
  cancelled: { bg: 'bg-red-50 text-red-700 border-red-200', dot: 'bg-red-500' },
};

const statuses = ['pending', 'confirmed', 'shipped', 'delivered', 'cancelled'];

const AdminOrders = () => {
  const { toast } = useToast();
  const queryClient = useQueryClient();
  const [expandedOrder, setExpandedOrder] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');

  const { data: orders, isLoading } = useQuery({
    queryKey: ['admin-orders'],
    queryFn: async () => {
      const { data, error } = await supabase.from('orders').select('*, order_items(*)').order('created_at', { ascending: false });
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

  const filteredOrders = orders?.filter(order => {
    const matchesSearch = !searchQuery ||
      order.customer_name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      order.customer_email.toLowerCase().includes(searchQuery.toLowerCase()) ||
      order.id.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesStatus = statusFilter === 'all' || order.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  const orderStats = {
    total: orders?.length || 0,
    pending: orders?.filter(o => o.status === 'pending').length || 0,
    revenue: orders?.reduce((sum, o) => sum + Number(o.total), 0) || 0,
  };

  return (
    <div className="space-y-6">
      {/* Stats bar */}
      <div className="flex flex-wrap gap-3">
        {[
          { label: 'Total Orders', value: orderStats.total },
          { label: 'Pending', value: orderStats.pending },
          { label: 'Revenue', value: `₹${orderStats.revenue.toLocaleString()}` },
        ].map(s => (
          <div key={s.label} className="flex items-center gap-2 bg-card border border-border rounded-lg px-4 py-2.5">
            <span className="font-body text-xs text-muted-foreground">{s.label}</span>
            <span className="font-display text-sm font-bold">{s.value}</span>
          </div>
        ))}
      </div>

      {/* Filters */}
      <div className="flex flex-col sm:flex-row gap-3">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Search by name, email, or order ID..."
            value={searchQuery}
            onChange={e => setSearchQuery(e.target.value)}
            className="pl-9 h-10 font-body text-sm"
          />
        </div>
        <div className="flex items-center gap-2">
          <Filter className="h-4 w-4 text-muted-foreground" />
          <select
            value={statusFilter}
            onChange={e => setStatusFilter(e.target.value)}
            className="h-10 px-3 rounded-lg border border-border bg-card font-body text-sm focus:outline-none focus:ring-2 focus:ring-ring"
          >
            <option value="all">All Status</option>
            {statuses.map(s => (
              <option key={s} value={s}>{s.charAt(0).toUpperCase() + s.slice(1)}</option>
            ))}
          </select>
        </div>
      </div>

      {/* Orders table */}
      {isLoading ? (
        <div className="bg-card border border-border rounded-xl p-12 text-center">
          <div className="h-6 w-6 border-2 border-primary border-t-transparent rounded-full animate-spin mx-auto mb-3" />
          <p className="text-sm text-muted-foreground font-body">Loading orders...</p>
        </div>
      ) : (
        <div className="bg-card border border-border rounded-xl overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-border bg-muted/30">
                  <th className="w-10 p-3"></th>
                  <th className="text-left p-3 font-body text-[11px] text-muted-foreground font-semibold uppercase tracking-wider">Order</th>
                  <th className="text-left p-3 font-body text-[11px] text-muted-foreground font-semibold uppercase tracking-wider">Customer</th>
                  <th className="text-right p-3 font-body text-[11px] text-muted-foreground font-semibold uppercase tracking-wider">Total</th>
                  <th className="text-center p-3 font-body text-[11px] text-muted-foreground font-semibold uppercase tracking-wider">Status</th>
                  <th className="text-right p-3 font-body text-[11px] text-muted-foreground font-semibold uppercase tracking-wider">Date</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-border">
                {filteredOrders?.map(order => {
                  const isExpanded = expandedOrder === order.id;
                  const items = (order as any).order_items || [];
                  const config = statusConfig[order.status] || { bg: 'bg-muted border-border', dot: 'bg-muted-foreground' };
                  return (
                    <>
                      <tr
                        key={order.id}
                        className={`cursor-pointer transition-colors ${isExpanded ? 'bg-muted/20' : 'hover:bg-muted/10'}`}
                        onClick={() => setExpandedOrder(isExpanded ? null : order.id)}
                      >
                        <td className="p-3 text-muted-foreground">
                          <div className={`transition-transform duration-200 ${isExpanded ? 'rotate-180' : ''}`}>
                            <ChevronDown className="h-4 w-4" />
                          </div>
                        </td>
                        <td className="p-3">
                          <span className="font-body text-sm font-mono text-muted-foreground">#{order.id.slice(0, 8).toUpperCase()}</span>
                        </td>
                        <td className="p-3">
                          <p className="font-body text-sm font-medium">{order.customer_name}</p>
                          <p className="font-body text-[11px] text-muted-foreground">{order.customer_email}</p>
                        </td>
                        <td className="p-3 text-right">
                          <span className="font-body text-sm font-bold">₹{Number(order.total).toLocaleString()}</span>
                        </td>
                        <td className="p-3 text-center" onClick={e => e.stopPropagation()}>
                          <select
                            value={order.status}
                            onChange={e => updateStatus.mutate({ id: order.id, status: e.target.value })}
                            className={`text-[11px] font-body font-bold px-3 py-1.5 rounded-full border cursor-pointer appearance-none text-center ${config.bg}`}
                          >
                            {statuses.map(s => (
                              <option key={s} value={s}>{s.charAt(0).toUpperCase() + s.slice(1)}</option>
                            ))}
                          </select>
                        </td>
                        <td className="p-3 text-right">
                          <span className="font-body text-sm text-muted-foreground">
                            {new Date(order.created_at).toLocaleDateString('en-IN', { day: '2-digit', month: 'short', year: '2-digit' })}
                          </span>
                        </td>
                      </tr>
                      {isExpanded && (
                        <tr key={`${order.id}-detail`}>
                          <td colSpan={6} className="bg-muted/10 border-t border-border">
                            <div className="p-5 space-y-4">
                              {/* Customer details */}
                              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                                <div className="flex items-start gap-2.5">
                                  <Mail className="h-4 w-4 text-muted-foreground mt-0.5 shrink-0" />
                                  <div>
                                    <p className="font-body text-[10px] text-muted-foreground uppercase tracking-wider">Email</p>
                                    <p className="font-body text-sm">{order.customer_email}</p>
                                  </div>
                                </div>
                                {order.customer_phone && (
                                  <div className="flex items-start gap-2.5">
                                    <Phone className="h-4 w-4 text-muted-foreground mt-0.5 shrink-0" />
                                    <div>
                                      <p className="font-body text-[10px] text-muted-foreground uppercase tracking-wider">Phone</p>
                                      <p className="font-body text-sm">{order.customer_phone}</p>
                                    </div>
                                  </div>
                                )}
                                {order.shipping_address && (
                                  <div className="flex items-start gap-2.5">
                                    <MapPin className="h-4 w-4 text-muted-foreground mt-0.5 shrink-0" />
                                    <div>
                                      <p className="font-body text-[10px] text-muted-foreground uppercase tracking-wider">Address</p>
                                      <p className="font-body text-sm">{order.shipping_address}</p>
                                    </div>
                                  </div>
                                )}
                              </div>
                              {order.notes && (
                                <div className="flex items-start gap-2.5 bg-muted/30 rounded-lg p-3">
                                  <StickyNote className="h-4 w-4 text-muted-foreground mt-0.5 shrink-0" />
                                  <p className="font-body text-sm text-muted-foreground italic">{order.notes}</p>
                                </div>
                              )}
                              {/* Order items */}
                              {items.length > 0 && (
                                <div className="border border-border rounded-lg overflow-hidden">
                                  <table className="w-full">
                                    <thead>
                                      <tr className="bg-muted/30 border-b border-border">
                                        <th className="text-left p-2.5 font-body text-[10px] text-muted-foreground uppercase tracking-wider">Product</th>
                                        <th className="text-center p-2.5 font-body text-[10px] text-muted-foreground uppercase tracking-wider">Qty</th>
                                        <th className="text-right p-2.5 font-body text-[10px] text-muted-foreground uppercase tracking-wider">Price</th>
                                        <th className="text-right p-2.5 font-body text-[10px] text-muted-foreground uppercase tracking-wider">Subtotal</th>
                                      </tr>
                                    </thead>
                                    <tbody className="divide-y divide-border">
                                      {items.map((item: any) => (
                                        <tr key={item.id}>
                                          <td className="p-2.5 font-body text-sm">{item.product_name}</td>
                                          <td className="p-2.5 font-body text-sm text-center">{item.quantity}</td>
                                          <td className="p-2.5 font-body text-sm text-right">₹{Number(item.price).toLocaleString()}</td>
                                          <td className="p-2.5 font-body text-sm text-right font-semibold">₹{(Number(item.price) * item.quantity).toLocaleString()}</td>
                                        </tr>
                                      ))}
                                    </tbody>
                                  </table>
                                </div>
                              )}
                            </div>
                          </td>
                        </tr>
                      )}
                    </>
                  );
                })}
                {(!filteredOrders || filteredOrders.length === 0) && (
                  <tr>
                    <td colSpan={6} className="p-12 text-center">
                      <p className="text-sm text-muted-foreground font-body">
                        {searchQuery || statusFilter !== 'all' ? 'No orders match your filters.' : 'No orders yet.'}
                      </p>
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
};

export default AdminOrders;

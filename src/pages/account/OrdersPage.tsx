import { useAuth } from '@/context/AuthContext';
import { supabase } from '@/integrations/supabase/client';
import { useQuery } from '@tanstack/react-query';
import { useNavigate } from 'react-router-dom';
import { Badge } from '@/components/ui/badge';
import { Package, ShoppingBag, Loader2 } from 'lucide-react';
import { useCurrency } from '@/context/CurrencyContext';

const statusColors: Record<string, string> = {
  pending: 'bg-amber-50 text-amber-700 border-amber-200',
  confirmed: 'bg-blue-50 text-blue-700 border-blue-200',
  shipped: 'bg-purple-50 text-purple-700 border-purple-200',
  delivered: 'bg-green-50 text-green-700 border-green-200',
  cancelled: 'bg-red-50 text-red-700 border-red-200',
};

export default function OrdersPage() {
  const { user } = useAuth();
  const navigate = useNavigate();

  const { data: orders = [], isLoading } = useQuery({
    queryKey: ['user-orders', user?.id],
    queryFn: async () => {
      const { data, error } = await supabase.from('orders').select('*, order_items(*)').eq('user_id', user!.id).order('created_at', { ascending: false });
      if (error) throw error;
      return data;
    },
    enabled: !!user,
  });

  if (isLoading) return <div className="flex items-center justify-center py-20"><Loader2 className="h-6 w-6 animate-spin text-muted-foreground" /></div>;

  return (
    <div>
      <div className="flex items-center gap-3 mb-6">
        <span className="text-accent text-[7px]">◆</span>
        <h2 className="font-display text-lg font-bold tracking-[0.1em] uppercase">My Orders</h2>
      </div>

      {orders.length === 0 ? (
        <div className="text-center py-16 border border-border relative">
          <div className="absolute top-2 left-2 w-4 h-4 border-t border-l border-accent/20" />
          <div className="absolute bottom-2 right-2 w-4 h-4 border-b border-r border-accent/20" />
          <ShoppingBag className="h-10 w-10 text-accent/40 mx-auto mb-3" />
          <p className="font-display text-sm tracking-wider text-muted-foreground uppercase mb-4">No orders yet</p>
          <button onClick={() => navigate('/collections')} className="border border-primary text-primary px-6 py-2 font-display text-[10px] font-bold tracking-[0.2em] uppercase hover:bg-primary hover:text-primary-foreground transition-colors">
            Start Shopping
          </button>
        </div>
      ) : (
        <div className="space-y-4">
          {orders.map(order => {
            const items = (order as any).order_items || [];
            const date = new Date(order.created_at).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' });
            const statusClass = statusColors[order.status] || statusColors.pending;

            return (
              <div key={order.id} className="relative border border-border p-5">
                <div className="absolute top-0 left-0 right-0 h-[2px] bg-gradient-to-r from-accent/40 via-accent to-accent/40" />

                <div className="flex items-start justify-between mb-4">
                  <div>
                    <p className="font-display text-[10px] tracking-[0.2em] text-muted-foreground uppercase">
                      Order #{order.id.slice(0, 8).toUpperCase()}
                    </p>
                    <p className="font-body text-xs text-muted-foreground">{date}</p>
                  </div>
                  <Badge variant="outline" className={`text-[9px] font-display font-bold tracking-[0.1em] capitalize ${statusClass}`}>
                    {order.status}
                  </Badge>
                </div>

                <div className="space-y-2 mb-4">
                  {items.map((item: any) => (
                    <div key={item.id} className="flex items-center gap-3">
                      <Package className="h-3.5 w-3.5 text-accent/60 shrink-0" />
                      <div className="flex-1 min-w-0">
                        <p className="font-body text-sm truncate">{item.product_name}</p>
                        <p className="font-body text-xs text-muted-foreground">Qty: {item.quantity} × ₹{Number(item.price).toLocaleString()}</p>
                      </div>
                      <span className="font-display text-sm font-bold shrink-0">₹{(Number(item.price) * item.quantity).toLocaleString()}</span>
                    </div>
                  ))}
                </div>

                <div className="flex items-center justify-between border-t border-border pt-3">
                  {order.shipping_address && (
                    <p className="font-body text-xs text-muted-foreground truncate max-w-[60%]">📍 {order.shipping_address}</p>
                  )}
                  <span className="font-display text-xl font-bold ml-auto text-accent">₹{Number(order.total).toLocaleString()}</span>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}

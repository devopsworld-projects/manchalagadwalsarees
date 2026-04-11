import { useAuth } from '@/context/AuthContext';
import { supabase } from '@/integrations/supabase/client';
import { useQuery } from '@tanstack/react-query';
import { useNavigate } from 'react-router-dom';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Package, ShoppingBag, Loader2 } from 'lucide-react';

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
      const { data, error } = await supabase
        .from('orders')
        .select('*, order_items(*)')
        .eq('user_id', user!.id)
        .order('created_at', { ascending: false });
      if (error) throw error;
      return data;
    },
    enabled: !!user,
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
      <h2 className="font-display text-xl font-semibold mb-6">My Orders</h2>

      {orders.length === 0 ? (
        <div className="text-center py-16 bg-muted/30 rounded-xl border border-border">
          <ShoppingBag className="h-12 w-12 text-muted-foreground mx-auto mb-3" />
          <p className="font-body text-muted-foreground mb-4">No orders yet</p>
          <Button onClick={() => navigate('/collections')} variant="outline" size="sm" className="font-body text-xs tracking-wider uppercase">
            Start Shopping
          </Button>
        </div>
      ) : (
        <div className="space-y-4">
          {orders.map(order => {
            const items = (order as any).order_items || [];
            const date = new Date(order.created_at).toLocaleDateString('en-IN', {
              day: 'numeric', month: 'short', year: 'numeric',
            });
            const statusClass = statusColors[order.status] || statusColors.pending;

            return (
              <div key={order.id} className="bg-muted/30 rounded-xl border border-border p-5">
                <div className="flex items-start justify-between mb-3">
                  <div>
                    <p className="font-body text-xs text-muted-foreground">
                      Order #{order.id.slice(0, 8).toUpperCase()}
                    </p>
                    <p className="font-body text-xs text-muted-foreground">{date}</p>
                  </div>
                  <Badge variant="outline" className={`text-xs font-body capitalize ${statusClass}`}>
                    {order.status}
                  </Badge>
                </div>

                <div className="space-y-2 mb-3">
                  {items.map((item: any) => (
                    <div key={item.id} className="flex items-center gap-3">
                      <Package className="h-4 w-4 text-muted-foreground shrink-0" />
                      <div className="flex-1 min-w-0">
                        <p className="font-body text-sm truncate">{item.product_name}</p>
                        <p className="font-body text-xs text-muted-foreground">
                          Qty: {item.quantity} × ₹{Number(item.price).toLocaleString()}
                        </p>
                      </div>
                      <span className="font-body text-sm font-semibold shrink-0">
                        ₹{(Number(item.price) * item.quantity).toLocaleString()}
                      </span>
                    </div>
                  ))}
                </div>

                <div className="flex items-center justify-between border-t border-border pt-3">
                  {order.shipping_address && (
                    <p className="font-body text-xs text-muted-foreground truncate max-w-[60%]">
                      📍 {order.shipping_address}
                    </p>
                  )}
                  <span className="font-display text-lg font-bold ml-auto">
                    ₹{Number(order.total).toLocaleString()}
                  </span>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}

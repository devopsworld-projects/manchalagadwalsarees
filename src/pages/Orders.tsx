import { useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/context/AuthContext';
import { AnnouncementBar } from '@/components/AnnouncementBar';
import { Navbar } from '@/components/Navbar';
import { Breadcrumbs } from '@/components/Breadcrumbs';
import { Footer } from '@/components/Footer';
import { PageMeta } from '@/components/PageMeta';
import { Badge } from '@/components/ui/badge';
import { Package, ArrowLeft, ShoppingBag } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useCurrency } from '@/context/CurrencyContext';

const statusColors: Record<string, string> = {
  pending: 'bg-yellow-100 text-yellow-800 border-yellow-300',
  confirmed: 'bg-blue-100 text-blue-800 border-blue-300',
  shipped: 'bg-purple-100 text-purple-800 border-purple-300',
  delivered: 'bg-green-100 text-green-800 border-green-300',
  cancelled: 'bg-red-100 text-red-800 border-red-300',
};

export default function Orders() {
  const { format } = useCurrency();
  const { user, loading: authLoading } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    if (!authLoading && !user) navigate('/login', { replace: true });
  }, [user, authLoading, navigate]);

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

  if (authLoading) return null;

  return (
    <div className="min-h-screen">
      <PageMeta
        title="My Orders"
        description="View your order history and track order status."
        canonicalPath="/orders"
      />
      <AnnouncementBar />
      <Navbar /><Breadcrumbs />
      <main className="container py-10 max-w-3xl">
        <Link
          to="/"
          className="inline-flex items-center gap-1.5 font-body text-sm text-muted-foreground hover:text-primary transition-colors mb-6"
        >
          <ArrowLeft className="h-4 w-4" /> Back to Home
        </Link>

        <h1 className="font-display text-3xl font-bold mb-8">My Orders</h1>

        {isLoading ? (
          <p className="text-center text-muted-foreground font-body py-20">Loading orders...</p>
        ) : orders.length === 0 ? (
          <div className="text-center py-20">
            <ShoppingBag className="h-16 w-16 text-muted-foreground mx-auto mb-4" />
            <h2 className="font-display text-xl font-semibold mb-2">No orders yet</h2>
            <p className="text-muted-foreground font-body mb-6">Start shopping to see your orders here.</p>
            <Button onClick={() => navigate('/collections')} variant="outline" className="font-body tracking-wider uppercase text-xs">
              Browse Collections
            </Button>
          </div>
        ) : (
          <div className="space-y-6">
            {orders.map(order => {
              const items = (order as any).order_items || [];
              const date = new Date(order.created_at).toLocaleDateString('en-IN', {
                day: 'numeric', month: 'short', year: 'numeric',
              });
              const statusClass = statusColors[order.status] || statusColors.pending;

              return (
                <div key={order.id} className="border border-border rounded-lg p-5">
                  <div className="flex items-start justify-between mb-4">
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

                  <div className="space-y-3 mb-4">
                    {items.map((item: any) => (
                      <div key={item.id} className="flex items-center gap-3">
                        <Package className="h-4 w-4 text-muted-foreground shrink-0" />
                        <div className="flex-1 min-w-0">
                          <p className="font-body text-sm truncate">{item.product_name}</p>
                          <p className="font-body text-xs text-muted-foreground">
                            Qty: {item.quantity} × {format(item.price)}
                          </p>
                        </div>
                        <span className="font-body text-sm font-semibold shrink-0">
                          {format(item.price * item.quantity)}
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
                      {format(order.total)}
                    </span>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </main>
      <Footer />
    </div>
  );
}

import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { Package, FolderOpen, ShoppingCart, IndianRupee, AlertTriangle, MessageSquare } from 'lucide-react';
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer } from 'recharts';

const statusColors: Record<string, string> = {
  pending: 'bg-yellow-100 text-yellow-700',
  confirmed: 'bg-blue-100 text-blue-700',
  shipped: 'bg-purple-100 text-purple-700',
  delivered: 'bg-green-100 text-green-700',
  cancelled: 'bg-red-100 text-red-700',
};

const AdminDashboard = () => {
  const { data: productCount } = useQuery({
    queryKey: ['admin-product-count'],
    queryFn: async () => {
      const { count } = await supabase.from('products').select('*', { count: 'exact', head: true });
      return count || 0;
    },
  });

  const { data: categoryCount } = useQuery({
    queryKey: ['admin-category-count'],
    queryFn: async () => {
      const { count } = await supabase.from('categories').select('*', { count: 'exact', head: true });
      return count || 0;
    },
  });

  const { data: orders } = useQuery({
    queryKey: ['admin-all-orders'],
    queryFn: async () => {
      const { data, error } = await supabase.from('orders').select('*').order('created_at', { ascending: false });
      if (error) throw error;
      return data || [];
    },
  });

  const { data: lowStockProducts } = useQuery({
    queryKey: ['admin-low-stock'],
    queryFn: async () => {
      const { data, error } = await supabase.from('products').select('name, sku, stock').eq('is_active', true).lt('stock', 5).order('stock', { ascending: true }).limit(5);
      if (error) throw error;
      return data || [];
    },
  });

  const { data: unreadContacts } = useQuery({
    queryKey: ['admin-unread-contacts'],
    queryFn: async () => {
      const { count } = await supabase.from('contact_submissions').select('*', { count: 'exact', head: true }).eq('is_read', false);
      return count || 0;
    },
  });

  const orderCount = orders?.length || 0;
  const revenue = orders?.reduce((sum, o) => sum + Number(o.total), 0) || 0;
  const recentOrders = orders?.slice(0, 5) || [];

  // Revenue by last 7 days
  const revenueByDay = (() => {
    if (!orders) return [];
    const days: Record<string, number> = {};
    for (let i = 6; i >= 0; i--) {
      const d = new Date();
      d.setDate(d.getDate() - i);
      const key = d.toLocaleDateString('en-IN', { day: '2-digit', month: 'short' });
      days[key] = 0;
    }
    orders.forEach(o => {
      const d = new Date(o.created_at);
      const key = d.toLocaleDateString('en-IN', { day: '2-digit', month: 'short' });
      if (key in days) days[key] += Number(o.total);
    });
    return Object.entries(days).map(([date, amount]) => ({ date, amount }));
  })();

  const stats = [
    { label: 'Products', value: productCount ?? 0, icon: Package, color: 'text-blue-600 bg-blue-50' },
    { label: 'Categories', value: categoryCount ?? 0, icon: FolderOpen, color: 'text-green-600 bg-green-50' },
    { label: 'Orders', value: orderCount, icon: ShoppingCart, color: 'text-purple-600 bg-purple-50' },
    { label: 'Revenue', value: `₹${revenue.toLocaleString()}`, icon: IndianRupee, color: 'text-gold bg-amber-50' },
  ];

  return (
    <div className="space-y-6">
      <h2 className="font-display text-2xl font-bold">Dashboard</h2>

      {/* Stats cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {stats.map(stat => (
          <div key={stat.label} className="bg-card border border-border rounded-lg p-5">
            <div className="flex items-center justify-between mb-3">
              <span className="font-body text-sm text-muted-foreground">{stat.label}</span>
              <div className={`p-2 rounded-lg ${stat.color}`}>
                <stat.icon className="h-4 w-4" />
              </div>
            </div>
            <p className="font-display text-2xl font-bold">{stat.value}</p>
          </div>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Revenue chart */}
        <div className="bg-card border border-border rounded-lg p-5">
          <h3 className="font-display text-base font-semibold mb-4">Revenue (Last 7 Days)</h3>
          {revenueByDay.length > 0 ? (
            <ResponsiveContainer width="100%" height={200}>
              <BarChart data={revenueByDay}>
                <XAxis dataKey="date" tick={{ fontSize: 11 }} />
                <YAxis tick={{ fontSize: 11 }} tickFormatter={v => `₹${v}`} />
                <Tooltip formatter={(v: number) => [`₹${v.toLocaleString()}`, 'Revenue']} />
                <Bar dataKey="amount" fill="hsl(var(--primary))" radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          ) : (
            <p className="text-sm text-muted-foreground font-body text-center py-8">No data yet</p>
          )}
        </div>

        {/* Recent orders */}
        <div className="bg-card border border-border rounded-lg p-5">
          <h3 className="font-display text-base font-semibold mb-4">Recent Orders</h3>
          {recentOrders.length > 0 ? (
            <div className="space-y-3">
              {recentOrders.map(order => (
                <div key={order.id} className="flex items-center justify-between">
                  <div>
                    <p className="font-body text-sm font-medium">{order.customer_name}</p>
                    <p className="font-body text-xs text-muted-foreground">{new Date(order.created_at).toLocaleDateString()}</p>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className={`text-[10px] font-body font-bold px-2 py-0.5 rounded-full ${statusColors[order.status] || 'bg-muted'}`}>
                      {order.status.charAt(0).toUpperCase() + order.status.slice(1)}
                    </span>
                    <span className="font-body text-sm font-medium">₹{Number(order.total).toLocaleString()}</span>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <p className="text-sm text-muted-foreground font-body text-center py-8">No orders yet</p>
          )}
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Low stock alerts */}
        <div className="bg-card border border-border rounded-lg p-5">
          <div className="flex items-center gap-2 mb-4">
            <AlertTriangle className="h-4 w-4 text-amber-500" />
            <h3 className="font-display text-base font-semibold">Low Stock Alerts</h3>
          </div>
          {lowStockProducts && lowStockProducts.length > 0 ? (
            <div className="space-y-2">
              {lowStockProducts.map(p => (
                <div key={p.sku} className="flex items-center justify-between py-1">
                  <div>
                    <p className="font-body text-sm">{p.name}</p>
                    <p className="font-body text-[10px] text-muted-foreground">{p.sku}</p>
                  </div>
                  <span className={`font-body text-xs font-bold px-2 py-0.5 rounded-full ${p.stock === 0 ? 'bg-red-100 text-red-700' : 'bg-amber-100 text-amber-700'}`}>
                    {p.stock === 0 ? 'Out of stock' : `${p.stock} left`}
                  </span>
                </div>
              ))}
            </div>
          ) : (
            <p className="text-sm text-muted-foreground font-body text-center py-4">All products well stocked ✓</p>
          )}
        </div>

        {/* Unread contacts */}
        <div className="bg-card border border-border rounded-lg p-5">
          <div className="flex items-center gap-2 mb-4">
            <MessageSquare className="h-4 w-4 text-primary" />
            <h3 className="font-display text-base font-semibold">Contact Messages</h3>
          </div>
          <div className="text-center py-4">
            <p className="font-display text-3xl font-bold">{unreadContacts ?? 0}</p>
            <p className="font-body text-sm text-muted-foreground">unread messages</p>
            {(unreadContacts ?? 0) > 0 && (
              <a href="/admin/contacts" className="inline-block mt-2 text-xs font-body text-primary underline">View inbox →</a>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminDashboard;

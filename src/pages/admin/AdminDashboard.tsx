import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import {
  Package, FolderOpen, ShoppingCart, IndianRupee, AlertTriangle,
  MessageSquare, TrendingUp, ArrowUpRight, ArrowDownRight, Eye,
} from 'lucide-react';
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, CartesianGrid } from 'recharts';
import { Link } from 'react-router-dom';

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

  const { data: pendingReviews } = useQuery({
    queryKey: ['admin-pending-reviews'],
    queryFn: async () => {
      const { count } = await supabase.from('reviews').select('*', { count: 'exact', head: true }).eq('is_approved', false);
      return count || 0;
    },
  });

  const orderCount = orders?.length || 0;
  const revenue = orders?.reduce((sum, o) => sum + Number(o.total), 0) || 0;
  const recentOrders = orders?.slice(0, 6) || [];
  const pendingOrderCount = orders?.filter(o => o.status === 'pending').length || 0;

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

  const statusColors: Record<string, string> = {
    pending: 'bg-amber-50 text-amber-700 border-amber-200',
    confirmed: 'bg-blue-50 text-blue-700 border-blue-200',
    shipped: 'bg-violet-50 text-violet-700 border-violet-200',
    delivered: 'bg-emerald-50 text-emerald-700 border-emerald-200',
    cancelled: 'bg-red-50 text-red-700 border-red-200',
  };

  const stats = [
    { label: 'Total Revenue', value: `₹${revenue.toLocaleString()}`, icon: IndianRupee, trend: '+12%', up: true, color: 'from-primary/10 to-primary/5 border-primary/20', iconBg: 'bg-primary/15 text-primary' },
    { label: 'Total Orders', value: orderCount, icon: ShoppingCart, trend: `${pendingOrderCount} pending`, up: true, color: 'from-blue-50 to-blue-50/50 border-blue-200/50', iconBg: 'bg-blue-100 text-blue-600' },
    { label: 'Products', value: productCount ?? 0, icon: Package, trend: `${categoryCount ?? 0} categories`, up: true, color: 'from-violet-50 to-violet-50/50 border-violet-200/50', iconBg: 'bg-violet-100 text-violet-600' },
    { label: 'Messages', value: unreadContacts ?? 0, icon: MessageSquare, trend: 'unread', up: false, color: 'from-amber-50 to-amber-50/50 border-amber-200/50', iconBg: 'bg-amber-100 text-amber-600' },
  ];

  return (
    <div className="space-y-6">
      {/* Stats grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {stats.map(stat => (
          <div
            key={stat.label}
            className={`relative overflow-hidden rounded-xl border bg-gradient-to-br ${stat.color} p-5 transition-shadow hover:shadow-md`}
          >
            <div className="flex items-start justify-between">
              <div>
                <p className="font-body text-xs font-medium text-muted-foreground/80 uppercase tracking-wider">{stat.label}</p>
                <p className="font-display text-2xl font-bold mt-1.5">{stat.value}</p>
                <p className="font-body text-xs text-muted-foreground mt-1 flex items-center gap-1">
                  {typeof stat.trend === 'string' && stat.trend.startsWith('+') ? (
                    <ArrowUpRight className="h-3 w-3 text-emerald-600" />
                  ) : null}
                  {stat.trend}
                </p>
              </div>
              <div className={`p-2.5 rounded-xl ${stat.iconBg}`}>
                <stat.icon className="h-5 w-5" />
              </div>
            </div>
          </div>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Revenue chart — spans 2 cols */}
        <div className="lg:col-span-2 bg-card border border-border rounded-xl p-5">
          <div className="flex items-center justify-between mb-5">
            <div>
              <h3 className="font-display text-base font-bold">Revenue Overview</h3>
              <p className="font-body text-xs text-muted-foreground mt-0.5">Last 7 days</p>
            </div>
            <div className="flex items-center gap-1.5 text-xs font-body text-emerald-600 bg-emerald-50 px-2.5 py-1 rounded-full">
              <TrendingUp className="h-3 w-3" />
              Trending
            </div>
          </div>
          {revenueByDay.length > 0 ? (
            <ResponsiveContainer width="100%" height={240}>
              <BarChart data={revenueByDay} barSize={32}>
                <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" vertical={false} />
                <XAxis dataKey="date" tick={{ fontSize: 11, fill: 'hsl(var(--muted-foreground))' }} axisLine={false} tickLine={false} />
                <YAxis tick={{ fontSize: 11, fill: 'hsl(var(--muted-foreground))' }} tickFormatter={v => `₹${v}`} axisLine={false} tickLine={false} />
                <Tooltip
                  formatter={(v: number) => [`₹${v.toLocaleString()}`, 'Revenue']}
                  contentStyle={{
                    background: 'hsl(var(--card))',
                    border: '1px solid hsl(var(--border))',
                    borderRadius: '8px',
                    fontSize: '12px',
                    boxShadow: '0 4px 12px rgba(0,0,0,0.08)',
                  }}
                />
                <Bar dataKey="amount" fill="hsl(var(--primary))" radius={[6, 6, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          ) : (
            <div className="h-[240px] flex items-center justify-center">
              <p className="text-sm text-muted-foreground font-body">No revenue data yet</p>
            </div>
          )}
        </div>

        {/* Quick actions / alerts panel */}
        <div className="space-y-4">
          {/* Low stock alerts */}
          <div className="bg-card border border-border rounded-xl p-5">
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-2">
                <div className="p-1.5 rounded-lg bg-amber-100">
                  <AlertTriangle className="h-3.5 w-3.5 text-amber-600" />
                </div>
                <h3 className="font-display text-sm font-bold">Low Stock</h3>
              </div>
              <Link to="/admin/products" className="font-body text-[11px] text-primary hover:underline">View all</Link>
            </div>
            {lowStockProducts && lowStockProducts.length > 0 ? (
              <div className="space-y-2.5">
                {lowStockProducts.map(p => (
                  <div key={p.sku} className="flex items-center justify-between">
                    <div className="min-w-0">
                      <p className="font-body text-sm truncate">{p.name}</p>
                      <p className="font-body text-[10px] text-muted-foreground font-mono">{p.sku}</p>
                    </div>
                    <span className={`font-body text-[11px] font-bold px-2 py-0.5 rounded-full shrink-0 ${
                      p.stock === 0 ? 'bg-red-100 text-red-700' : 'bg-amber-100 text-amber-700'
                    }`}>
                      {p.stock === 0 ? 'Out' : `${p.stock} left`}
                    </span>
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-xs text-muted-foreground font-body text-center py-3">All stocked ✓</p>
            )}
          </div>

          {/* Quick stats */}
          <div className="bg-card border border-border rounded-xl p-5">
            <h3 className="font-display text-sm font-bold mb-3">Needs Attention</h3>
            <div className="space-y-3">
              <Link to="/admin/reviews" className="flex items-center justify-between group">
                <span className="font-body text-sm text-muted-foreground group-hover:text-foreground transition-colors">Pending reviews</span>
                <span className="font-body text-sm font-bold">{pendingReviews ?? 0}</span>
              </Link>
              <Link to="/admin/contacts" className="flex items-center justify-between group">
                <span className="font-body text-sm text-muted-foreground group-hover:text-foreground transition-colors">Unread messages</span>
                <span className="font-body text-sm font-bold">{unreadContacts ?? 0}</span>
              </Link>
              <Link to="/admin/orders" className="flex items-center justify-between group">
                <span className="font-body text-sm text-muted-foreground group-hover:text-foreground transition-colors">Pending orders</span>
                <span className="font-body text-sm font-bold">{pendingOrderCount}</span>
              </Link>
            </div>
          </div>
        </div>
      </div>

      {/* Recent orders */}
      <div className="bg-card border border-border rounded-xl p-5">
        <div className="flex items-center justify-between mb-5">
          <h3 className="font-display text-base font-bold">Recent Orders</h3>
          <Link to="/admin/orders" className="font-body text-xs text-primary hover:underline flex items-center gap-1">
            View all <Eye className="h-3 w-3" />
          </Link>
        </div>
        {recentOrders.length > 0 ? (
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-border">
                  <th className="text-left pb-3 font-body text-[11px] text-muted-foreground font-semibold uppercase tracking-wider">Order</th>
                  <th className="text-left pb-3 font-body text-[11px] text-muted-foreground font-semibold uppercase tracking-wider">Customer</th>
                  <th className="text-right pb-3 font-body text-[11px] text-muted-foreground font-semibold uppercase tracking-wider">Amount</th>
                  <th className="text-center pb-3 font-body text-[11px] text-muted-foreground font-semibold uppercase tracking-wider">Status</th>
                  <th className="text-right pb-3 font-body text-[11px] text-muted-foreground font-semibold uppercase tracking-wider">Date</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-border">
                {recentOrders.map(order => (
                  <tr key={order.id} className="hover:bg-muted/30 transition-colors">
                    <td className="py-3 font-body text-sm font-mono text-muted-foreground">#{order.id.slice(0, 8).toUpperCase()}</td>
                    <td className="py-3 font-body text-sm font-medium">{order.customer_name}</td>
                    <td className="py-3 font-body text-sm text-right font-semibold">₹{Number(order.total).toLocaleString()}</td>
                    <td className="py-3 text-center">
                      <span className={`inline-block text-[11px] font-body font-bold px-2.5 py-1 rounded-full border ${statusColors[order.status] || 'bg-muted border-border'}`}>
                        {order.status.charAt(0).toUpperCase() + order.status.slice(1)}
                      </span>
                    </td>
                    <td className="py-3 font-body text-sm text-right text-muted-foreground">
                      {new Date(order.created_at).toLocaleDateString('en-IN', { day: '2-digit', month: 'short' })}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        ) : (
          <div className="py-10 text-center">
            <ShoppingCart className="h-8 w-8 text-muted-foreground/30 mx-auto mb-2" />
            <p className="text-sm text-muted-foreground font-body">No orders yet</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default AdminDashboard;

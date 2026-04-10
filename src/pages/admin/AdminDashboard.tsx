import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { Package, FolderOpen, ShoppingCart, IndianRupee } from 'lucide-react';

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

  const { data: orderCount } = useQuery({
    queryKey: ['admin-order-count'],
    queryFn: async () => {
      const { count } = await supabase.from('orders').select('*', { count: 'exact', head: true });
      return count || 0;
    },
  });

  const { data: revenue } = useQuery({
    queryKey: ['admin-revenue'],
    queryFn: async () => {
      const { data } = await supabase.from('orders').select('total');
      return data?.reduce((sum, o) => sum + Number(o.total), 0) || 0;
    },
  });

  const stats = [
    { label: 'Products', value: productCount ?? 0, icon: Package, color: 'text-blue-600 bg-blue-50' },
    { label: 'Categories', value: categoryCount ?? 0, icon: FolderOpen, color: 'text-green-600 bg-green-50' },
    { label: 'Orders', value: orderCount ?? 0, icon: ShoppingCart, color: 'text-purple-600 bg-purple-50' },
    { label: 'Revenue', value: `₹${(revenue ?? 0).toLocaleString()}`, icon: IndianRupee, color: 'text-gold bg-amber-50' },
  ];

  return (
    <div>
      <h2 className="font-display text-2xl font-bold mb-6">Dashboard</h2>
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
    </div>
  );
};

export default AdminDashboard;

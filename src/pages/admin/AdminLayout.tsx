import { Navigate, Outlet, useLocation } from 'react-router-dom';
import { useAuth } from '@/context/AuthContext';
import { AdminSidebar } from '@/components/admin/AdminSidebar';
import { SidebarProvider, SidebarTrigger } from '@/components/ui/sidebar';
import { Bell, Search } from 'lucide-react';
import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';

const pageTitles: Record<string, string> = {
  '/admin': 'Dashboard',
  '/admin/products': 'Products',
  '/admin/categories': 'Categories',
  '/admin/orders': 'Orders',
  '/admin/coupons': 'Coupons',
  '/admin/banners': 'Banners',
  '/admin/sections': 'Homepage Sections',
  '/admin/blog': 'Blog Posts',
  '/admin/testimonials': 'Testimonials',
  '/admin/newsletter': 'Newsletter',
  '/admin/menu': 'Menu Manager',
  '/admin/shipping': 'Shipping Rates',
  '/admin/tax': 'Tax Rules',
  '/admin/faq': 'FAQ',
  '/admin/page-seo': 'Page SEO',
  '/admin/settings': 'Store Settings',
  '/admin/users': 'Users',
  '/admin/reviews': 'Reviews',
  '/admin/returns': 'Returns',
  '/admin/contacts': 'Contact Messages',
  '/admin/audit-log': 'Activity Log',
};

const AdminLayout = () => {
  const { user, isAdmin, loading } = useAuth();
  const location = useLocation();
  const pageTitle = pageTitles[location.pathname] || 'Admin';

  const { data: pendingOrders } = useQuery({
    queryKey: ['admin-pending-count'],
    queryFn: async () => {
      const { count } = await supabase.from('orders').select('*', { count: 'exact', head: true }).eq('status', 'pending');
      return count || 0;
    },
    enabled: !!user,
  });

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background">
        <div className="flex flex-col items-center gap-3">
          <div className="h-8 w-8 border-2 border-primary border-t-transparent rounded-full animate-spin" />
          <p className="font-body text-sm text-muted-foreground">Loading admin...</p>
        </div>
      </div>
    );
  }

  if (!user || !isAdmin) {
    return <Navigate to="/admin/login" replace />;
  }

  return (
    <SidebarProvider>
      <div className="min-h-screen flex w-full bg-muted/30">
        <AdminSidebar />
        <div className="flex-1 flex flex-col min-w-0">
          {/* Top bar */}
          <header className="sticky top-0 z-30 h-16 flex items-center justify-between border-b border-border bg-background/80 backdrop-blur-md px-4 md:px-6 gap-4">
            <div className="flex items-center gap-3">
              <SidebarTrigger className="text-muted-foreground hover:text-foreground" />
              <div className="hidden sm:block">
                <h1 className="font-display text-lg font-bold leading-none">{pageTitle}</h1>
                <p className="font-body text-[11px] text-muted-foreground mt-0.5">Manchala Gadwal Sarees</p>
              </div>
            </div>

            <div className="flex items-center gap-2">
              {/* Notification bell */}
              <button className="relative p-2.5 rounded-lg hover:bg-muted transition-colors">
                <Bell className="h-[18px] w-[18px] text-muted-foreground" />
                {(pendingOrders ?? 0) > 0 && (
                  <span className="absolute top-1.5 right-1.5 h-4 min-w-4 px-1 flex items-center justify-center rounded-full bg-destructive text-destructive-foreground text-[10px] font-bold">
                    {pendingOrders}
                  </span>
                )}
              </button>

              {/* User avatar */}
              <div className="h-8 w-8 rounded-full bg-primary/10 flex items-center justify-center">
                <span className="font-body text-xs font-bold text-primary">
                  {user.email?.charAt(0).toUpperCase()}
                </span>
              </div>
            </div>
          </header>

          {/* Page content */}
          <main className="flex-1 p-4 md:p-6 lg:p-8 overflow-auto">
            <div className="max-w-7xl mx-auto">
              <Outlet />
            </div>
          </main>
        </div>
      </div>
    </SidebarProvider>
  );
};

export default AdminLayout;
